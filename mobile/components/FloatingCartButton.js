import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../context/ThemeContext';

/**
 * A floating sticky button that appears globally when the cart has items.
 */
export default function FloatingCartButton() {
  const { itemCount, total, setCartSheetVisible, restaurantInfo } = useCart();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  if (itemCount === 0) return null;

  return (
    <View style={[styles.container, { bottom: (insets.bottom || 0) + 80 }]}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setCartSheetVisible(true)}
        activeOpacity={0.9}
      >
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{itemCount}</Text>
        </View>

        <View style={styles.centerText}>
          <Text style={styles.viewCartText}>View Cart</Text>
          {restaurantInfo?.name && (
            <Text style={styles.restNameText} numberOfLines={1}>
              {restaurantInfo.name}
            </Text>
          )}
        </View>

        <Text style={styles.priceText}>₪{total.toLocaleString()}</Text>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    height: 60,
    borderRadius: 30,
    paddingHorizontal: 20,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  badge: {
    backgroundColor: colors.white,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: colors.accent,
    fontWeight: '800',
    fontSize: 14,
  },
  centerText: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  viewCartText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  restNameText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '500',
  },
  priceText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 16,
  },
});
