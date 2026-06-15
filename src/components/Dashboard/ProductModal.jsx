import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './ProductModal.css';

// ProductModal component for single product detail display, quantity selector, and checkout trigger.
// Props:
// - product: The product object containing name, price, description, and image.
// - onClose: Callback function to dismiss the modal view.
// - onAddToCart: Callback function to add the selected product and quantity to the cart.
export const ProductModal = ({ product, onClose, onAddToCart }) => {
  const { isLoggedIn } = useAuth();
  // Local state to track the user's desired quantity (default starts at 1)
  const [quantity, setQuantity] = useState(1);

  // Guard clause: Return null if no product is selected/active to prevent page crashes
  if (!product) return null;

  // Increments item quantity count by 1
  const handleIncrement = () => setQuantity((prev) => prev + 1);
  
  // Decrements item quantity count by 1 (limits quantity to a minimum value of 1)
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // Dispatches the add action with the selected quantity, then closes the modal view
  const handleAddClick = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  // Calculates the running subtotal for the current quantity select
  const totalPrice = product.price * quantity;

  return (
    /* 1. Modal Overlay Wrapper */
    /* Clicking the background overlay triggers onClose to dismiss the popup */
    <div className="modal-overlay" onClick={onClose}>
      
      {/* 2. Modal Body Content */}
      {/* stopPropagation prevents overlay onClick from firing when clicking inside the modal itself */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button: Absolute positioned in the top right corner */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        {/* Product cover preview photo */}
        {product.image && (
          <div className="modal-image-wrapper">
            <img src={product.image} alt={product.name} className="modal-image" />
          </div>
        )}

        {/* Text descriptions and base price tag */}
        <div className="modal-info-section">
          <h2 className="modal-title">{product.name}</h2>
          <p className="modal-description">{product.description}</p>
          <span className="modal-price">{product.price} ILS</span>
        </div>

        {/* Bottom controls panel for quantity select and addition trigger */}
        {isLoggedIn ? (
          <div className="modal-action-section">
            {/* Quantity controller buttons (+ and -) */}
            <div className="quantity-controller">
              <button className="qty-btn" onClick={handleDecrement}>−</button>
              <span className="qty-display">{quantity}</span>
              <button className="qty-btn" onClick={handleIncrement}>+</button>
            </div>

            {/* Submission button with live subtotal calculation */}
            <button className="add-to-cart-btn" onClick={handleAddClick}>
              Add to order • {totalPrice} ILS
            </button>
          </div>
        ) : (
          <div className="modal-action-section" style={{ justifyContent: 'center' }}>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: '600', textAlign: 'center', margin: '10px 0' }}>
              Please log in to add items to your order.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
