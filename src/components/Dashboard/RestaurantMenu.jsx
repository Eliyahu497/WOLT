import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './RestaurantMenu.css';

// RestaurantMenu component displaying the menu items and details of a selected restaurant.
// Props:
// - onProductSelect: Callback function triggered when a user clicks on a product card.
// - onLoadRestaurant: Callback to set the active restaurant in MainView.
export const RestaurantMenu = ({ onProductSelect, onLoadRestaurant, onRestaurantRate }) => {
  const { user, token } = useAuth();
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleRate = async (ratingVal) => {
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
        setRestaurant(updatedRest);
        setUserRating(ratingVal);
        if (onRestaurantRate) {
          onRestaurantRate(updatedRest);
        }
        alert("Thank you for your rating!");
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to submit rating");
      }
    } catch (err) {
      console.error("Error rating restaurant:", err);
      alert("An error occurred while rating the restaurant.");
    }
  };

  useEffect(() => {
    const loadRestaurantAndProducts = async () => {
      try {
        setLoading(true);
        // Fetch restaurant details
        const restRes = await fetch(`/api/restaurants/${restaurantId}`);
        if (!restRes.ok) {
          throw new Error("Restaurant not found");
        }
        const restData = await restRes.json();
        setRestaurant(restData);
        
        // Initialize user rating if user has already rated this restaurant
        if (user && restData.ratings && restData.ratings[user.id]) {
          setUserRating(restData.ratings[user.id]);
        } else {
          setUserRating(0);
        }
        
        if (onLoadRestaurant) {
          onLoadRestaurant(restData);
        }

        // Fetch products menu
        const prodRes = await fetch(`/api/restaurants/${restaurantId}/products`);
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          setProducts(prodData);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Failed to load restaurant menu:", err);
        setRestaurant(null);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadRestaurantAndProducts();

    return () => {
      if (onLoadRestaurant) {
        onLoadRestaurant(null);
      }
    };
  }, [restaurantId, onLoadRestaurant, user]);

  if (loading) {
    return <div className="owner-loading" style={{ padding: '40px', textAlign: 'center' }}>Loading restaurant menu...</div>;
  }

  if (!restaurant) {
    return (
      <div className="restaurant-menu-page" style={{ padding: '40px', textAlign: 'center' }}>
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back to restaurants
        </button>
        <p className="no-items-msg" style={{ marginTop: '20px' }}>Restaurant not found.</p>
      </div>
    );
  }

  return (
    <div className="restaurant-menu-page">
      
      {/* 1. Back Navigation Button */}
      <button className="back-btn" onClick={() => navigate('/')}>
        ← Back to restaurants
      </button>

      {/* 2. Restaurant Banner Section */}
      <div className="restaurant-banner">
        <img 
          src={restaurant.image} 
          alt={restaurant.name} 
          className="banner-image" 
        />
        <div className="banner-overlay">
          <div className="banner-details">
            <h1 className="restaurant-title">{restaurant.name}</h1>
            <p className="restaurant-description">{restaurant.description}</p>
            
            <div className="restaurant-meta">
              <span className="meta-item">⭐ {restaurant.rating !== undefined && restaurant.rating !== null ? restaurant.rating : "Not rated"}</span>
              <span className="meta-divider">•</span>
              <span className="meta-item">🕒 {restaurant.deliveryTime || "25-35 min"}</span>
              <span className="meta-divider">•</span>
              <span className="meta-item">🛵 Delivery: {restaurant.deliveryPrice || 0} ILS</span>
            </div>

            {user && user.role !== 'manager' && (
              <div className="rate-restaurant-section">
                <span className="rate-label">Rate this restaurant: </span>
                <div className="rate-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span 
                      key={star} 
                      className={`rate-star ${(hoverRating || userRating) >= star ? 'active' : ''}`}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => handleRate(star)}
                      style={{ cursor: 'pointer' }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Menu Grid Section */}
      <div className="menu-container">
        <h2 className="section-heading">Menu Items</h2>
        
        {products.length === 0 ? (
          <p className="no-items-msg">No products found for this restaurant.</p>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="product-card"
                onClick={() => onProductSelect(product)}
              >
                <div className="product-details">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-desc">{product.description}</p>
                  <span className="product-price">{product.price} ILS</span>
                </div>
                
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
