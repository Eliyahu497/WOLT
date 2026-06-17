import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Dashboard } from './Dashboard';
import { RestaurantMenu } from './RestaurantMenu';
import { ProductModal } from './ProductModal';
import { Cart } from './Cart';
import { OrderHistory } from './OrderHistory';
import { Login } from './Login';
import { Register } from './Register';
import { OwnerDashboard } from './OwnerDashboard';

// Import the custom hooks to consume global contexts
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

// Import mock categories (only categories, as they are not served by backend API)
import { mockCategories } from '../../mockData';
import './MainView.css';

export const MainView = () => {
  const { isDarkMode, setIsDarkMode } = useTheme();
  const { isLoggedIn, token, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');

  // Active product for ProductModal
  const [activeProduct, setActiveProduct] = useState(null);

  // Cart state
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // API states: Store dynamic fetched data
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRestaurant, setActiveRestaurant] = useState(null);

  // Track login state transition to reset views on logout
  const [prevIsLoggedIn, setPrevIsLoggedIn] = useState(isLoggedIn);

  useEffect(() => {
    if (prevIsLoggedIn && !isLoggedIn) {
      setSearchQuery('');
      setActiveProduct(null);
      setCartItems([]);
      setIsDarkMode(false); // Reset theme to light mode on logout
      navigate('/login');
    }
    setPrevIsLoggedIn(isLoggedIn);
  }, [isLoggedIn, prevIsLoggedIn, setIsDarkMode, navigate]);

  // Fetch all restaurants on mount or when auth state changes
  const loadInitialData = async () => {
    try {
      setLoading(true);
      const headers = {};
      if (isLoggedIn && token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const restRes = await fetch('/api/restaurants', { headers });
      if (restRes.ok) {
        const restData = await restRes.json();
        setRestaurants(restData);
      } else {
        setRestaurants([]);
      }
    } catch (err) {
      console.warn('API Offline - failed to fetch restaurants:', err);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [isLoggedIn, token]);

  // Handle search queries dynamically
  useEffect(() => {
    const fetchSearch = async () => {
      if (searchQuery.trim().length > 0) {
        try {
          const searchRes = await fetch(`/api/search/${encodeURIComponent(searchQuery)}`);
          if (searchRes.ok) {
            const searchData = await searchRes.json();
            if (searchData.restaurants) {
              setRestaurants(searchData.restaurants);
            }
          }
        } catch (err) {
          console.warn('Search API call failed:', err);
        }
      } else {
        loadInitialData();
      }
    };

    fetchSearch();
  }, [searchQuery]);

  // Click handler to open the details modal for a single product/dish.
  // Also reports the view to the C++ server via Express (if user is logged in).
  const handleProductSelect = async (product) => {
    setActiveProduct(product);

    if (isLoggedIn && user) {
      try {
        await fetch(`/api/restaurants/${product.restaurantId}/products/${product.id}`, {
          method: 'GET',
          headers: {
            'x-user-id': user.id, // Report user id for C++ TCP tracking
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (err) {
        console.warn('Failed to send product view interaction report:', err);
      }
    }
  };

  // Close handler to dismiss the product details modal
  const handleCloseModal = () => {
    setActiveProduct(null);
  };

  // Cart Management - Add item to cart
  const handleAddToCart = (product, quantity) => {
    const productRestId = product.restaurantId || activeRestaurant?.id;

    // Check if cart already has items from a different restaurant
    if (cartItems.length > 0) {
      const firstItem = cartItems[0];
      if (firstItem.restaurantId && productRestId && firstItem.restaurantId !== productRestId) {
        // Show confirmation dialog to clear the cart and start a new order
        const confirmClear = window.confirm(
          `You already have items from another restaurant in your cart. Would you like to clear your cart and start a new order?`
        );
        if (confirmClear) {
          setCartItems([{
            id: product.id,
            name: product.name,
            price: product.price,
            quantity,
            restaurantId: productRestId
          }]);
        }
        return;
      }
    }

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity,
          restaurantId: productRestId
        }];
      }
    });

    // Automatically open the cart drawer when an item is added
    setIsCartOpen(true);
  };

  // Cart Management - Update item quantity
  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Cart Management - Delete item completely
  const handleRemoveItem = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  // Checkout submission action handler
  const handleSubmitOrder = async () => {
    if (!isLoggedIn || !token) {
      alert("You must be logged in to submit an order!");
      return;
    }

    const targetRestaurantId = cartItems[0]?.restaurantId || activeRestaurant?.id;
    if (!targetRestaurantId) {
      alert("Could not determine the restaurant for this order.");
      return;
    }

    const orderPayload = {
      restaurantId: targetRestaurantId,
      items: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity
      }))
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-user-id': user?.id
        },
        body: JSON.stringify(orderPayload)
      });

      if (!response.ok) {
        throw new Error('Failed to submit order to the server');
      }

      alert(`Order submitted successfully! Thank you for ordering.`);
      setCartItems([]); // Reset the shopping cart
    } catch (err) {
      console.warn('API Order Submission failed:', err);
      alert(`Order submission failed: ${err.message}`);
    }
  };

  const isOwner = isLoggedIn && user && user.role === 'manager';

  // Calculate delivery price based on items in the cart
  const cartRestaurantId = cartItems[0]?.restaurantId;
  const cartRestaurant = cartRestaurantId
    ? (restaurants.find(r => r.id === cartRestaurantId) || (activeRestaurant && activeRestaurant.id === cartRestaurantId ? activeRestaurant : null))
    : null;
  const cartDeliveryPrice = cartRestaurant ? cartRestaurant.deliveryPrice : 0;

  // Header is hidden on login and register pages
  const hideHeader = location.pathname === '/login' || location.pathname === '/register';

  // Cart is shown to logged-in customers on non-orders / non-auth pages
  const showCart = isLoggedIn && !isOwner &&
    location.pathname !== '/orders' &&
    location.pathname !== '/login' &&
    location.pathname !== '/register';

  return (
    <div className={`main-view-layout ${isDarkMode ? 'dark' : 'light'}`}>

      {!hideHeader && (
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          cartItemCount={cartItems.length}
          onToggleCart={() => setIsCartOpen(!isCartOpen)}
          showCartButton={showCart}
        />
      )}

      <div className="main-content-split">
        <main className="content-viewport">
          {loading ? (
            <div className="owner-loading" style={{ padding: '40px', textAlign: 'center' }}>Loading application...</div>
          ) : (
            <Routes>
              {/* Home Dashboard */}
              <Route
                path="/"
                element={
                  isOwner ? (
                    <Navigate to="/owner" replace />
                  ) : (
                    <Dashboard
                      restaurants={restaurants}
                      categories={mockCategories}
                      searchQuery={searchQuery}
                    />
                  )
                }
              />

              {/* Authentication */}
              <Route
                path="/login"
                element={
                  isLoggedIn ? (
                    isOwner ? <Navigate to="/owner" replace /> : <Navigate to="/" replace />
                  ) : (
                    <Login />
                  )
                }
              />

              <Route
                path="/register"
                element={
                  isLoggedIn ? (
                    isOwner ? <Navigate to="/owner" replace /> : <Navigate to="/" replace />
                  ) : (
                    <Register />
                  )
                }
              />

              {/* Restaurant Menu details page */}
              <Route
                path="/restaurant/:restaurantId"
                element={
                  <RestaurantMenu
                    onProductSelect={handleProductSelect}
                    onLoadRestaurant={setActiveRestaurant}
                  />
                }
              />

              {/* Order History */}
              <Route
                path="/orders"
                element={
                  isLoggedIn ? (
                    <OrderHistory onBack={() => navigate('/')} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              {/* Manager Dashboard */}
              <Route
                path="/owner"
                element={
                  isOwner ? (
                    <OwnerDashboard />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/owner/restaurant/:restaurantId"
                element={
                  isOwner ? (
                    <OwnerDashboard />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              {/* Fallback to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
        </main>

        {showCart && (
          <Cart
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onSubmitOrder={handleSubmitOrder}
            deliveryPrice={cartDeliveryPrice}
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
          />
        )}
      </div>

      {activeProduct && !isOwner && (
        <ProductModal
          product={activeProduct}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
};
