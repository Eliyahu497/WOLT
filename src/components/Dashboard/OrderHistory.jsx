import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './OrderHistory.css';

// OrderHistory component displaying the user's past order list
// Props:
// - onBack: Callback function to navigate back to the main dashboard
export const OrderHistory = ({ onBack }) => {
  const { isLoggedIn, token, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders history on component mount (GET request)
  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    fetchOrders();
  }, [isLoggedIn]);

  // Fetch orders from the Express API (GET request)
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-user-id': user?.id
        }
      });

      if (!response.ok) {
        throw new Error('Failed to retrieve order history');
      }

      const data = await response.json();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cancel an order (DELETE request)
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-user-id': user?.id
        }
      });

      if (!response.ok) {
        throw new Error('Failed to cancel the order');
      }

      // Refresh the orders list
      fetchOrders();
      alert('Order cancelled successfully.');
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Update item quantity in an order (PATCH request)
  const handleUpdateItemQuantity = async (orderId, productId, newQuantity) => {
    // Find the targeted order
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    // Create the updated items list
    let updatedItems = targetOrder.items.map((item) => {
      if (item.productId === productId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    // Filter out items with 0 or negative quantities
    updatedItems = updatedItems.filter((item) => item.quantity > 0);

    // If no items are left, cancel the entire order instead
    if (updatedItems.length === 0) {
      handleCancelOrder(orderId);
      return;
    }

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-user-id': user?.id
        },
        body: JSON.stringify({ items: updatedItems })
      });

      if (!response.ok) {
        throw new Error('Failed to update order items');
      }

      // Refresh the orders list
      fetchOrders();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="order-history-page">
        <p className="error-text">Please log in to view your order history.</p>
      </div>
    );
  }

  return (
    <div className="order-history-page">
      {/* Back button */}
      <button className="back-btn" onClick={onBack}>
        ← Back to restaurants
      </button>

      <h1 className="section-heading">Order History</h1>

      {loading ? (
        <p className="loading-text">Loading your orders...</p>
      ) : error ? (
        <p className="error-text">Error: {error}</p>
      ) : orders.length === 0 ? (
        <div className="empty-orders">
          <span className="empty-icon">📦</span>
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        /* Orders list */
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <div>
                  <span className="order-id">Order ID: {order.id}</span>
                  <span className="order-date">
                    {new Date(order.date || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                {/* Cancel button */}
                <button
                  className="cancel-order-btn"
                  onClick={() => handleCancelOrder(order.id)}
                >
                  Cancel Order
                </button>
              </div>

              {/* Order items */}
              <div className="order-card-body">
                {order.items.map((item) => (
                  <div key={item.productId} className="order-item-row">
                    <span className="order-item-name">{item.name || 'Product'}</span>

                    {/* Item quantity controls */}
                    <div className="order-item-controls">
                      <div className="qty-controller compact">
                        <button
                          className="qty-btn"
                          onClick={() =>
                            handleUpdateItemQuantity(order.id, item.productId, item.quantity - 1)
                          }
                        >
                          −
                        </button>
                        <span className="qty-display">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() =>
                            handleUpdateItemQuantity(order.id, item.productId, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                      <span className="order-item-price">
                        {item.price * item.quantity} ILS
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order total */}
              <div className="order-card-footer">
                <span>Total Amount:</span>
                <span className="order-total-price">{order.total} ILS</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
