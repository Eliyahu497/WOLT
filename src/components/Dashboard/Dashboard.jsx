import React, { useState } from 'react';
import './Dashboard.css';

// Dashboard component displaying the main marketplace dashboard
// Props:
// - restaurants: Array of restaurant objects
// - categories: Array of category structures (Sushi, Burgers, etc.)
// - onRestaurantSelect: Callback trigger when clicking on a restaurant card
// - searchQuery: Current text filter typed by the user in the search input
export const Dashboard = ({
  restaurants,
  categories,
  onRestaurantSelect,
  searchQuery
}) => {
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

  // Toggles the category filter value. 
  // If the same category is clicked again, we clear the filter (set to null).
  const handleCategoryClick = (categoryId) => {
    setSelectedCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  return (
    <div className="dashboard-content">

      {/* 1. Category Filtering Section */}
      <section className="categories-section">
        <h2 className="section-heading">What are you craving?</h2>
        <div className="categories-list">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              // Apply active class if current category matches state selection
              className={`category-item-btn ${selectedCategory === cat.id ? 'active' : ''}`}
            >
              <span className="category-icon">{cat.icon}</span>
              <span className="category-label">{cat.name}</span>
            </button>
          ))}
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
                onClick={() => onRestaurantSelect(rest)}
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
