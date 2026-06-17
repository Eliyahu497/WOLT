import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

// Dashboard component displaying the main marketplace dashboard
// Props:
// - restaurants: Array of restaurant objects
// - categories: Array of category structures (Sushi, Burgers, etc.)
// - searchQuery: Current text filter typed by the user in the search input
export const Dashboard = ({
  restaurants,
  categories,
  searchQuery
}) => {
  const navigate = useNavigate();
  // Local state hook to hold the active category ID filter (null represents no filter)
  const [selectedCategory, setSelectedCategory] = useState(null);

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
        <div className="categories-carousel-container">
          <button className="carousel-arrow left-arrow" onClick={() => scrollCategories('left')}>
            &#8592;
          </button>
          
          <div className="categories-list" ref={categoriesListRef}>
            {categories.map((cat) => (
              <div 
                key={cat.id} 
                className="category-item-wrapper"
              >
                <button
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`category-item-box ${selectedCategory === cat.id ? 'active' : ''}`}
                  style={{ backgroundColor: cat.bgColor || '#f0f0f0' }}
                >
                  <span className="category-icon">{cat.icon}</span>
                </button>
                <span className="category-label">{cat.name}</span>
              </div>
            ))}
          </div>

          <button className="carousel-arrow right-arrow" onClick={() => scrollCategories('right')}>
            &#8594;
          </button>
        </div>
      </section>

      {/* 2. Restaurants Grid Section */}
      <section className="restaurants-section">
        <h2 className="section-heading">
          {/* Dynamic header label displaying current filter constraints */}
          {selectedCategory
            ? `${categories.find((c) => c.id === selectedCategory)?.name || 'Filtered'} Restaurants`
            : 'Popular Restaurants'}
        </h2>

        {filteredRestaurants.length === 0 ? (
          /* Empty state view when search/category filters yield no matches */
          <div className="empty-results">
            <span className="empty-icon">😢</span>
            <p className="empty-text">No restaurants match your search or criteria.</p>
          </div>
        ) : (
          /* Map through filtered items to construct the restaurant card grid */
          <div className="restaurants-grid">
            {filteredRestaurants.map((rest) => (
              <div
                key={rest.id}
                className="restaurant-card"
                // Trigger restaurant detail view callback on click
                onClick={() => navigate('/restaurant/' + rest.id)}
              >
                {/* Visual cover thumbnail */}
                <div className="card-image-wrapper">
                  <img src={rest.image} alt={rest.name} className="card-image" />
                </div>

                {/* Core description details */}
                <div className="card-content">
                  <h3 className="card-name">{rest.name}</h3>
                  <p className="card-description">{rest.description}</p>

                  {/* Footer details: rating, delivery time, and cost */}
                  <div className="card-footer">
                    <span className="card-rating">⭐ {rest.rating}</span>
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
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
