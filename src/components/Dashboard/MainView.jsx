import React, { useState } from 'react';
import { Header } from './Header';
import { Dashboard } from './Dashboard';
import { RestaurantMenu } from './RestaurantMenu';
import { ProductModal } from './ProductModal';
import { Cart } from './Cart';

// Import the mock data from the parent directory
import { mockRestaurants, mockCategories, mockProducts, mockUser } from '../../mockData';
import './MainView.css';

// MainView is the top-level page orchestrator for Developer 3's flow.
// It integrates all subcomponents and handles the global state for search, theme, selected restaurant,
// product modals, and cart actions.
export const MainView = () => {
  // Theme state: Toggle light/dark modes
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Search input state: Filter matching results in Header and Dashboard
  const [searchQuery, setSearchQuery] = useState('');

  // Selected restaurant state: If null, display Dashboard list. If set, render RestaurantMenu view.
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  // Active product details state: If set, opens the ProductModal popup
  const [activeProduct, setActiveProduct] = useState(null);

  // Cart state: List of added items in the shopping cart
  const [cartItems, setCartItems] = useState([]);

  // Toggles the theme state between light and dark modes
  const handleThemeToggle = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Click handler to open a restaurant menu and clear search queries
  const handleRestaurantSelect = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setSearchQuery(''); // Clear search on enter
  };

  // Close handler to exit a restaurant menu and return to dashboard
  const handleBackToDashboard = () => {
    setSelectedRestaurant(null);
  };

  // Click handler to open the details modal for a single product/dish
  const handleProductSelect = (product) => {
    setActiveProduct(product);
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

  // Cart Management - Update item quantity (+ / - triggers)
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

  // Checkout submission action handler
  const handleSubmitOrder = () => {
    alert(`Order submitted successfully! Thank you for ordering.`);
    setCartItems([]); // Reset/empty the shopping cart
  };

  // Filter products to only display those belonging to the currently selected restaurant
  const filteredProducts = selectedRestaurant
    ? mockProducts.filter((product) => product.restaurantId === selectedRestaurant.id)
    : [];

  return (
    <div className={`main-view-layout ${isDarkMode ? 'dark' : 'light'}`}>
      
      {/* Universal header navigation */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onThemeToggle={handleThemeToggle}
        isDarkMode={isDarkMode}
        user={mockUser}
      />

      {/* Main content viewport split between page content and the cart sidebar */}
      <div className="main-content-split">
        <main className="content-viewport">
          {selectedRestaurant ? (
            /* If a restaurant is selected, show its full menu */
            <RestaurantMenu
              restaurant={selectedRestaurant}
              products={filteredProducts}
              onBack={handleBackToDashboard}
              onProductSelect={handleProductSelect}
            />
          ) : (
            /* Otherwise, show the restaurant listing dashboard */
            <Dashboard
              restaurants={mockRestaurants}
              categories={mockCategories}
              onRestaurantSelect={handleRestaurantSelect}
              searchQuery={searchQuery}
            />
          )}
        </main>

        {/* Sidebar Cart panel */}
        <Cart
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onSubmitOrder={handleSubmitOrder}
          deliveryPrice={selectedRestaurant ? selectedRestaurant.deliveryPrice : 0}
        />
      </div>

      {/* Modal popup details view, rendered on top when a product is clicked */}
      {activeProduct && (
        <ProductModal
          product={activeProduct}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
};
