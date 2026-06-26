import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useRouter } from 'expo-router';

import { useTheme } from '../context/ThemeContext';

/**
 * Bottom sheet modal displaying the cart contents, totals, and submit button.
 */
export default function CartSheet() {
  const {
    items,
    restaurantInfo,
    subtotal,
    deliveryPrice,
    total,
    isCartSheetVisible,
    setCartSheetVisible,
    updateQuantity,
    removeFromCart,
    submitOrder,
  } = useCart();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { colors } = useTheme();
  
  if (!isCartSheetVisible) return null;
  const styles = createStyles(colors);

  async function handleCheckout() {
    if (items.length === 0) return;
    setIsSubmitting(true);
    try {
      await submitOrder();
      setCartSheetVisible(false);
      Alert.alert('Order Placed! 🎉', 'Your order has been submitted successfully.', [
        { text: 'View Orders', onPress: () => router.push('/(tabs)/orders') },
        { text: 'OK' }
      ]);
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to submit order');
    } finally {
      setIsSubmitting(false);
    }
  }

  function renderItem(item) {
    const { product, quantity } = item;
    return (
      <View key={product.id} style={styles.itemRow}>
        {/* Quantity Controls */}
        <View style={styles.qtyControls}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => {
              if (quantity > 1) updateQuantity(product.id, -1);
              else removeFromCart(product.id);
            }}
          >
            <Ionicons name="remove" size={16} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{quantity}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(product.id, 1)}>
            <Ionicons name="add" size={16} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={1}>{product.name}</Text>
          <Text style={styles.itemPrice}>₪{(product.price * quantity).toLocaleString()}</Text>
        </View>
      </View>
    );
  }

  return (
    <Modal
      visible={isCartSheetVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setCartSheetVisible(false)}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={() => setCartSheetVisible(false)} />
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>Your Order</Text>
            {restaurantInfo?.name && (
              <Text style={styles.subtitle}>from {restaurantInfo.name}</Text>
            )}
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setCartSheetVisible(false)}
            >
              <Ionicons name="close-circle" size={28} color={colors.subtext} />
            </TouchableOpacity>
          </View>

          {items.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="cart-outline" size={48} color={colors.subtext} />
              <Text style={styles.emptyText}>Your cart is empty</Text>
            </View>
          ) : (
            <>
              <ScrollView style={styles.itemList} showsVerticalScrollIndicator={false}>
                {items.map(renderItem)}
              </ScrollView>

              <View style={styles.summarySection}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal</Text>
                  <Text style={styles.summaryValue}>₪{subtotal.toLocaleString()}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Delivery Fee</Text>
                  <Text style={styles.summaryValue}>
                    {deliveryPrice === 0 ? 'Free' : `₪${deliveryPrice.toLocaleString()}`}
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.summaryRow}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>₪{total.toLocaleString()}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.checkoutBtn, isSubmitting && styles.checkoutBtnDisabled]}
                onPress={handleCheckout}
                disabled={isSubmitting}
                activeOpacity={0.8}
              >
                {isSubmitting ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <>
                    <Text style={styles.checkoutBtnText}>Submit Order</Text>
                    <View style={styles.checkoutBtnPrice}>
                      <Text style={styles.checkoutBtnPriceText}>₪{total.toLocaleString()}</Text>
                    </View>
                  </>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (colors) => StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 24,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.subtext,
    marginTop: 2,
  },
  closeBtn: {
    position: 'absolute',
    right: 16,
    top: 0,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.subtext,
  },
  itemList: {
    paddingHorizontal: 20,
    maxHeight: 300,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 4,
    marginRight: 12,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  qtyText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    width: 24,
    textAlign: 'center',
  },
  itemInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    paddingRight: 10,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  summarySection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.subtext,
  },
  summaryValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.accent,
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.accent,
    height: 56,
    borderRadius: 16,
    marginHorizontal: 20,
    paddingHorizontal: 24,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  checkoutBtnDisabled: {
    opacity: 0.7,
  },
  checkoutBtnText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
  checkoutBtnPrice: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
  },
  checkoutBtnPriceText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
  },
});
