import React from 'react';
import './RestaurantMenu.css';

// RestaurantMenu component displaying the menu items and details of a selected restaurant.
// Props:
// - restaurant: The selected restaurant object containing name, image, description, rating, etc.
// - products: Array of product objects belonging to this restaurant.
// - onBack: Callback function to return to the main dashboard view.
// - onProductSelect: Callback function triggered when a user clicks on a product card.
export const RestaurantMenu = ({ restaurant, products, onBack, onProductSelect }) => {
  // Guard clause: Return null if no restaurant is loaded/selected to prevent errors.
  if (!restaurant) return null;

  return (
    <div className="restaurant-menu-page">
      
      {/* 1. Back Navigation Button */}
      {/* Triggers the onBack callback to return to the list of restaurants */}
      <button className="back-btn" onClick={onBack}>
        ← Back to restaurants
      </button>

      {/* 2. Restaurant Banner Section */}
      {/* Hero container displaying the restaurant image, name, and delivery details */}
      <div className="restaurant-banner">
        <img 
          src={restaurant.image} 
          alt={restaurant.name} 
          className="banner-image" 
        />
        {/* Dark overlay to make sure text is readable on top of any cover image */}
        <div className="banner-overlay">
          <div className="banner-details">
            <h1 className="restaurant-title">{restaurant.name}</h1>
            <p className="restaurant-description">{restaurant.description}</p>
            
            {/* Metadata information block */}
            <div className="restaurant-meta">
              <span className="meta-item">⭐ {restaurant.rating}</span>
              <span className="meta-divider">•</span>
              <span className="meta-item">🕒 {restaurant.deliveryTime}</span>
              <span className="meta-divider">•</span>
              <span className="meta-item">🛵 Delivery: {restaurant.deliveryPrice} ILS</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Menu Grid Section */}
      {/* Renders the list of dishes/products associated with this restaurant */}
      <div className="menu-container">
        <h2 className="section-heading">Menu Items</h2>
        
        {/* Check if the restaurant has any menu items registered */}
        {products.length === 0 ? (
          /* Fallback message displayed when the restaurant has no products */
          <p className="no-items-msg">No products found for this restaurant.</p>
        ) : (
          /* Grid list rendering each product available for ordering */
          <div className="products-grid">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="product-card"
                // Clicking the card triggers the onProductSelect callback to open the details modal
                onClick={() => onProductSelect(product)}
              >
                {/* Details layout: Title, description, and price */}
                <div className="product-details">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-desc">{product.description}</p>
                  <span className="product-price">{product.price} ILS</span>
                </div>
                
                {/* Product thumbnail image (renders only if an image URL is provided) */}
                {product.image && (
                  <div className="product-image-wrapper">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="product-thumbnail" 
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
