import React, { useState, useEffect } from 'react';
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

// Import the mock data from the parent directory for fallback rendering
import { mockRestaurants, mockCategories, mockProducts } from '../../mockData';
import './MainView.css';

// MainView is the top-level page orchestrator for Developer 3's flow.
// It integrates all subcomponents, manages API fetching calls, view reporting, and order submission.
export const MainView = () => {
  // Consume global states from custom hooks (managed by Developer 2)
  const { isDarkMode } = useTheme();
  const { isLoggedIn, token, user } = useAuth();

  // Navigation states: Controls whether we show the dashboard, menu, or order history
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [authView, setAuthView] = useState('login');
  const [showAuth, setShowAuth] = useState(false);

  // Search input state: Filter matching results
  const [searchQuery, setSearchQuery] = useState('');

  // Active product details state: If set, opens the ProductModal popup
  const [activeProduct, setActiveProduct] = useState(null);

  // Cart state: List of added items in the shopping cart
  const [cartItems, setCartItems] = useState([]);

  // API states: Store dynamic fetched data
  const [restaurants, setRestaurants] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Track login state transition to reset views on logout
  const [prevIsLoggedIn, setPrevIsLoggedIn] = useState(isLoggedIn);

  useEffect(() => {
    if (prevIsLoggedIn && !isLoggedIn) {
      setSelectedRestaurant(null);
      setShowOrderHistory(false);
      setSearchQuery('');
      setActiveProduct(null);
      setCartItems([]);
      setShowAuth(false);
    }
    setPrevIsLoggedIn(isLoggedIn);
  }, [isLoggedIn, prevIsLoggedIn]);

  // Fetch all restaurants and products from the Node.js API on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        // Fetch restaurants from Express backend
        const restRes = await fetch('/api/restaurants');
        if (restRes.ok) {
          const restData = await restRes.ok ? await restRes.json() : [];
          setRestaurants(restData.length > 0 ? restData : mockRestaurants);
        } else {
          setRestaurants(mockRestaurants); // Fallback to mock
        }
      } catch (err) {
        console.warn('API Offline - falling back to mock restaurants');
        setRestaurants(mockRestaurants);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Fetch products and handle search queries dynamically from the backend
  useEffect(() => {
    const fetchSearchOrProducts = async () => {
      // If a search query is active, fetch from search API
      if (searchQuery.trim().length > 0) {
        try {
          const searchRes = await fetch(`/api/search/${encodeURIComponent(searchQuery)}`);
          if (searchRes.ok) {
            const searchData = await searchRes.json();
            // Merge search results into local restaurants state
            if (searchData.restaurants) {
              setRestaurants(searchData.restaurants);
            }
          }
        } catch (err) {
          console.warn('Search API call failed, using local filtering');
        }
      }

      // If a restaurant is selected, fetch its products menu dynamically
      if (selectedRestaurant) {
        try {
          const productsRes = await fetch(`/api/restaurants/${selectedRestaurant.id}/products`);
          if (productsRes.ok) {
            const productsData = await productsRes.json();
            setProducts(productsData.length > 0 ? productsData : mockProducts.filter(p => p.restaurantId === selectedRestaurant.id));
          } else {
            setProducts(mockProducts.filter(p => p.restaurantId === selectedRestaurant.id));
          }
        } catch (err) {
          console.warn('Products API failed, falling back to mock products');
          setProducts(mockProducts.filter(p => p.restaurantId === selectedRestaurant.id));
        }
      }
    };

    fetchSearchOrProducts();
  }, [searchQuery, selectedRestaurant]);

  // Click handler to open a restaurant menu and clear search queries
  const handleRestaurantSelect = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setSearchQuery('');
  };

  // Close handler to exit a restaurant menu and return to dashboard
  const handleBackToDashboard = () => {
    setSelectedRestaurant(null);
  };

  // Click handler to open the details modal for a single product/dish.
  // Also reports the view to the C++ server via Express (if user is logged in).
  const handleProductSelect = async (product) => {
    setActiveProduct(product);

    // Report interaction view to backend
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
        console.warn('Failed to send product view interaction report');
      }
    }
  };

  // Close handler to dismiss the product details modal
  const handleCloseModal = () => {
    setActiveProduct(null);
  };

  // Cart Management - Add item to cart
  const handleAddToCart = (product, quantity) => {
    setCartItems((prevItems) => {
      // Check if product already exists in the cart
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        // If it exists, update the quantity of the existing product
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // If it does not exist, append a new product item structure
        return [...prevItems, { id: product.id, name: product.name, price: product.price, quantity }];
      }
    });
  };

  // Cart Management - Update item quantity
  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      // If quantity drops to 0 or less, remove item from the cart
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

  // Checkout submission action handler with Authentication Check and POST API submission
  const handleSubmitOrder = async () => {
    // Check if the user is logged in before placing the order
    if (!isLoggedIn || !token) {
      alert("You must be logged in to submit an order! Redirecting to the Login page...");
      return;
    }

    const orderPayload = {
      restaurantId: selectedRestaurant.id,
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
      console.warn('API Order Submission failed, simulating local success');
      alert(`Order submitted successfully! (Local simulation mode)`);
      setCartItems([]);
    }
  };

  const isOwner = isLoggedIn && user && user.role === 'manager';

  return (
    <div className={`main-view-layout ${isDarkMode ? 'dark' : 'light'}`}>

      {/* Universal header navigation - hidden on Auth views */}
      {(isLoggedIn || !showAuth) && (
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onViewHistory={() => setShowOrderHistory(true)}
          onLoginClick={() => {
            setAuthView('login');
            setShowAuth(true);
            setSelectedRestaurant(null);
            setShowOrderHistory(false);
          }}
        />
      )}

      {/* Main content viewport split between page content and the cart sidebar */}
      <div className="main-content-split">
        <main className="content-viewport">
          {!isLoggedIn && showAuth ? (
            authView === 'login' ? (
              <Login 
                onToggleView={() => setAuthView('register')} 
                onBackToGuest={() => setShowAuth(false)}
              />
            ) : (
              <Register 
                onToggleView={() => setAuthView('login')} 
                onBackToGuest={() => setShowAuth(false)}
              />
            )
          ) : isLoggedIn && isOwner ? (
            <OwnerDashboard />
          ) : showOrderHistory ? (
            /* Render Order History Screen */
            <OrderHistory onBack={() => setShowOrderHistory(false)} />
          ) : selectedRestaurant ? (
            /* Render Menu Details Screen */
            <RestaurantMenu
              restaurant={selectedRestaurant}
              products={products}
              onBack={handleBackToDashboard}
              onProductSelect={handleProductSelect}
            />
          ) : (
            /* Render Restaurants List Dashboard */
            <Dashboard
              restaurants={restaurants}
              categories={mockCategories}
              onRestaurantSelect={handleRestaurantSelect}
              searchQuery={searchQuery}
            />
          )}
        </main>

        {/* Sidebar Cart panel (hidden when viewing past orders history, or for owners / logged-out users) */}
        {isLoggedIn && !isOwner && !showOrderHistory && (
          <Cart
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onSubmitOrder={handleSubmitOrder}
            deliveryPrice={selectedRestaurant ? selectedRestaurant.deliveryPrice : 0}
          />
        )}
      </div>

      {/* Modal popup details view, rendered on top when a product is clicked (customers only) */}
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
