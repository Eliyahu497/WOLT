import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { post } from '../services/api';

const CartContext = createContext(null);

/**
 * CartProvider manages the global shopping cart state.
 * Enforces Wolt-style cross-restaurant logic: you can only order from one restaurant at a time.
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);
  const [restaurantInfo, setRestaurantInfo] = useState(null); // To store delivery price, name, etc.
  const [isCartSheetVisible, setCartSheetVisible] = useState(false);

  // ── Calculate Totals ────────────────────────────────────────────────────────
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [items]);

  const deliveryPrice = restaurantInfo?.deliveryPrice || 0;
  const total = subtotal > 0 ? subtotal + deliveryPrice : 0;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // ── Actions ─────────────────────────────────────────────────────────────────

  const addToCart = useCallback((product, quantity, restId, restInfo) => {
    setItems((prevItems) => {
      // Cross-restaurant check
      if (prevItems.length > 0 && restaurantId && restaurantId !== restId) {
        Alert.alert(
          'Start a new order?',
          'Your cart contains items from another restaurant. Would you like to clear your cart and start a new order?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Clear Cart',
              style: 'destructive',
              onPress: () => {
                setRestaurantId(restId);
                if (restInfo) setRestaurantInfo(restInfo);
                setItems([{ product, quantity }]);
              },
            },
          ]
        );
        return prevItems; // Do not modify yet
      }

      // If cart is empty, set the restaurant context
      if (prevItems.length === 0) {
        setRestaurantId(restId);
        if (restInfo) setRestaurantInfo(restInfo);
      }

      // Check if product already in cart
      const existingItemIndex = prevItems.findIndex((item) => item.product.id === product.id);
      if (existingItemIndex >= 0) {
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      }

      // Add new product
      return [...prevItems, { product, quantity }];
    });
  }, [restaurantId]);

  const updateQuantity = useCallback((productId, delta) => {
    setItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          if (newQty < 1) return item; // Handled by remove
          return { ...item, quantity: newQty };
        }
        return item;
      });
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setItems((prevItems) => {
      const newItems = prevItems.filter((item) => item.product.id !== productId);
      if (newItems.length === 0) {
        setRestaurantId(null);
        setRestaurantInfo(null);
      }
      return newItems;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setRestaurantId(null);
    setRestaurantInfo(null);
  }, []);

  const submitOrder = useCallback(async () => {
    if (items.length === 0 || !restaurantId) throw new Error('Cart is empty');

    const orderPayload = {
      restaurantId,
      items: items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    };

    const response = await post('/api/orders', orderPayload);
    clearCart();
    return response;
  }, [items, restaurantId, clearCart]);

  const value = {
    items,
    restaurantId,
    restaurantInfo,
    subtotal,
    deliveryPrice,
    total,
    itemCount,
    isCartSheetVisible,
    setCartSheetVisible,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    submitOrder,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
