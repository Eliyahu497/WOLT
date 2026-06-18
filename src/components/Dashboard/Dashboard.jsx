import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

// RestaurantCard component handling individual restaurant card hover and rating
const RestaurantCard = ({ rest, user, token, onRate, navigate }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const userRating = (rest.ratings && rest.ratings[user?.id]) || 0;

  const handleRateClick = (e, star) => {
    e.stopPropagation();
    onRate(e, rest.id, star);
  };

  return (
    <div
      className="restaurant-card"
      onClick={() => navigate('/restaurant/' + rest.id)}
    >
      <div className="card-image-wrapper">
        <img src={rest.image} alt={rest.name} className="card-image" />
      </div>
      <div className="card-content">
        <h3 className="card-name">{rest.name}</h3>
        <p className="card-description">{rest.description}</p>
        
        {user && user.role !== 'manager' && (
          <div className="card-rate-section" onClick={(e) => e.stopPropagation()}>
            <span className="card-rate-label">Rate:</span>
            <div className="card-rate-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`card-rate-star ${(hoverRating || userRating) >= star ? 'active' : ''}`}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={(e) => handleRateClick(e, star)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="card-footer">
          <span className="card-rating">⭐ {rest.rating !== undefined && rest.rating !== null ? rest.rating : "Not rated"}</span>
          <span className="card-divider">•</span>
          <span className="card-time">{rest.deliveryTime}</span>
          <span className="card-divider">•</span>
          <span className="card-price">{rest.deliveryPrice} ILS delivery</span>
          {rest.distanceKm !== undefined && (
            <>
              <span className="card-divider">•</span>
              <span className="card-distance">{rest.distanceKm.toFixed(1)} km away</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Dashboard component displaying the main marketplace dashboard
export const Dashboard = ({
  restaurants,
  categories,
  searchQuery,
  onRestaurantRate
}) => {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const handleRate = async (e, restaurantId, ratingVal) => {
    try {
      const res = await fetch(`/api/restaurants/${restaurantId}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating: ratingVal })
      });
      if (res.ok) {
        const updatedRest = await res.json();
        if (onRestaurantRate) {
          onRestaurantRate(updatedRest);
        }
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to submit rating");
      }
    } catch (err) {
      console.error("Error rating restaurant:", err);
    }
  };
  // Local state hooks to hold filter/sort states
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState('none');

  // Filters the input restaurants list dynamically based on active constraints
  const filteredRestaurants = restaurants.filter((restaurant) => {
    // 1. Search Query Constraint:
    // Performs case-insensitive matching against the restaurant name and description
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.description.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Category Filter Constraint:
    // If a category button is selected, verify the restaurant category aligns. 
    // Otherwise, return true to bypass category restriction.
    const matchesCategory = selectedCategory
      ? restaurant.category === selectedCategory
      : true;

    // Both criteria must be met for a restaurant to be displayed
    return matchesSearch && matchesCategory;
  });

  // Sorts the filtered restaurants based on active sorting criteria
  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    if (sortBy === 'none') {
      const countA = a.orderCount || 0;
      const countB = b.orderCount || 0;
      return countB - countA; // Descending (highest order count first)
    }
    if (sortBy === 'rating') {
      const ratingA = a.rating !== undefined && a.rating !== null ? a.rating : 0;
      const ratingB = b.rating !== undefined && b.rating !== null ? b.rating : 0;
      return ratingB - ratingA; // Descending (highest rating first)
    }
    if (sortBy === 'distance') {
      const distA = a.distanceKm !== undefined && a.distanceKm !== null ? a.distanceKm : Infinity;
      const distB = b.distanceKm !== undefined && b.distanceKm !== null ? b.distanceKm : Infinity;
      return distA - distB; // Ascending (closest first)
    }
    if (sortBy === 'alphabetical') {
      return a.name.localeCompare(b.name, 'he'); // Alphabetical sorting (A-Z) supporting Hebrew & English
    }
    return 0; // Default sorting (none/popularity)
  });

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  // Create a ref for the categories list to handle programmatic scrolling
  const categoriesListRef = React.useRef(null);

  // Scroll handler for the carousel arrows
  const scrollCategories = (direction) => {
    if (categoriesListRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      categoriesListRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="dashboard-content">

      {/* 1. Category Filtering Section */}
      <section className="categories-section">
        <h2 className="section-heading">What are you craving?</h2>
        <div className="categories-marquee-wrapper">
          <div className="categories-list marquee-active" ref={categoriesListRef}>
            {/* Duplicate categories three times to ensure a seamless looping marquee effect across different screen sizes */}
            {[...categories, ...categories, ...categories].map((cat, index) => (
              <div 
                key={`${cat.id}-${index}`} 
                className="category-item-wrapper"
              >
                <button
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`category-item-box ${selectedCategory === cat.id ? 'active' : ''}`}
                  style={{ backgroundColor: cat.bgColor || '#e0f2fe' }}
                >
                  <span className="category-icon">{cat.icon}</span>
                </button>
                <span className="category-label">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Restaurants Grid Section */}
      <section className="restaurants-section">
        <div className="section-header-row">
          <h2 className="section-heading">
            {/* Dynamic header label displaying current filter constraints */}
            {selectedCategory
              ? `${categories.find((c) => c.id === selectedCategory)?.name || 'Filtered'} Restaurants`
              : 'Popular Restaurants'}
          </h2>

          <div className="sorting-container">
            <label htmlFor="sorting-select" className="sorting-label">Sort by:</label>
            <select
              id="sorting-select"
              className="sorting-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="none">Popularity</option>
              <option value="rating">Rating ⭐</option>
              {user && <option value="distance">Distance 📍</option>}
              <option value="alphabetical">Alphabetical (A-Z) 🔤</option>
            </select>
          </div>
        </div>

        {sortedRestaurants.length === 0 ? (
          /* Empty state view when search/category filters yield no matches */
          <div className="empty-results">
            <span className="empty-icon">😢</span>
            <p className="empty-text">No restaurants match your search or criteria.</p>
          </div>
        ) : (
          /* Map through sorted items to construct the restaurant card grid */
          <div className="restaurants-grid">
            {sortedRestaurants.map((rest) => (
              <RestaurantCard
                key={rest.id}
                rest={rest}
                user={user}
                token={token}
                onRate={handleRate}
                navigate={navigate}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
