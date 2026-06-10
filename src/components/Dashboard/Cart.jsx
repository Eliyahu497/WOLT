import React from 'react';
import './Cart.css';

// Cart component representing the side drawer for managing order items
// Props:
// - cartItems: Array of active order items in the cart
// - onUpdateQuantity: Callback function to change an item's quantity
// - onRemoveItem: Callback function to remove an item from the cart
// - onSubmitOrder: Callback function triggered when the user clicks 'Submit Order'
// - deliveryPrice: Delivery fee for the selected restaurant (default is 0)
export const Cart = ({ 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onSubmitOrder,
  deliveryPrice = 0 
}) => {
  
  // Calculate the sum of all product prices multiplied by their quantity
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Total price includes subtotal plus the delivery fee (only if there are items in the cart)
  const total = subtotal > 0 ? subtotal + deliveryPrice : 0;

  return (
    <div className="cart-drawer">
      {/* Header section of the cart */}
      <div className="cart-header">
        <h2 className="cart-title">Your Order 🛍️</h2>
        <span className="items-count-badge">{cartItems.length} items</span>
      </div>

      {/* Main content area */}
      <div className="cart-body">
        {cartItems.length === 0 ? (
          /* Empty state view when the shopping cart has no items */
          <div className="empty-cart-state">
            <span className="empty-cart-icon">🛒</span>
            <p className="empty-cart-title">Your cart is empty</p>
            <p className="empty-cart-subtitle">Add items from a restaurant to start your order!</p>
          </div>
        ) : (
          /* Scrollable list of items in the cart */
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                
                {/* Product details */}
                <div className="cart-item-details">
                  <h4 className="cart-item-name">{item.name}</h4>
                  <span className="cart-item-price">{item.price * item.quantity} ILS</span>
                </div>

                {/* Quantity adjustments and removal controls */}
                <div className="cart-item-actions">
                  <div className="cart-qty-controller">
                    <button 
                      className="cart-qty-btn" 
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="cart-qty-display">{item.quantity}</span>
                    <button 
                      className="cart-qty-btn" 
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  
                  {/* Delete button to remove product from cart completely */}
                  <button 
                    className="cart-remove-btn" 
                    onClick={() => onRemoveItem(item.id)}
                    aria-label="Remove item"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom checkout summary section */}
      {cartItems.length > 0 && (
        <div className="cart-footer">
          {/* Price breakdowns */}
          <div className="price-row">
            <span>Subtotal</span>
            <span>{subtotal} ILS</span>
          </div>
          <div className="price-row">
            <span>Delivery Fee</span>
            <span>{deliveryPrice} ILS</span>
          </div>
          
          <div className="price-row total-row">
            <span>Total</span>
            <span>{total} ILS</span>
          </div>

          {/* Checkout action button */}
          <button className="submit-order-btn" onClick={onSubmitOrder}>
            Submit Order • {total} ILS
          </button>
        </div>
      )}
    </div>
  );
};
