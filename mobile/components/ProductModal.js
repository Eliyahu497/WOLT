import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * A bottom-sheet style modal that shows full product details, a quantity
 * selector (+/−), and an "Add to Cart" button with total price.
 *
 * @param {object|null} product     - The product to display, or null to hide.
 * @param {boolean}     visible     - Whether the modal is visible.
 * @param {function}    onClose     - Called to close the modal.
 * @param {function}    onAddToCart - Called with ({ product, quantity }) when the user taps "Add to Cart".
 */
export default function ProductModal({ product, visible, onClose, onAddToCart }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [quantity, setQuantity] = useState(1);

  // Reset quantity when a new product opens
  if (!visible) {
    // Will reset on next open
  }

  function handleOpen() {
    setQuantity(1);
  }

  function increment() {
    setQuantity((q) => q + 1);
  }

  function decrement() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  function handleAdd() {
    if (product && onAddToCart) {
      onAddToCart({ product, quantity });
    }
    onClose();
  }

  if (!product) return null;

  const totalPrice = (product.price * quantity).toLocaleString();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      onShow={handleOpen}
    >
      <View style={styles.overlay}>
        {/* Tap outside to close */}
        <Pressable style={styles.backdrop} onPress={onClose} />

        {/* Bottom sheet */}
        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Product image */}
          {product.image && (
            <Image
              source={{ uri: product.image }}
              style={styles.image}
              resizeMode="cover"
            />
          )}

          {/* Close button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
            <Ionicons name="close" size={22} color={colors.text} />
          </TouchableOpacity>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.name}>{product.name}</Text>

            {product.description ? (
              <Text style={styles.description}>{product.description}</Text>
            ) : null}

            <Text style={styles.price}>₪{Number(product.price).toLocaleString()}</Text>

            {/* Quantity selector */}
            <View style={styles.quantitySection}>
              <Text style={styles.quantityLabel}>Quantity</Text>
              <View style={styles.quantityRow}>
                <TouchableOpacity
                  style={[styles.qtyBtn, quantity <= 1 && styles.qtyBtnDisabled]}
                  onPress={decrement}
                  disabled={quantity <= 1}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="remove"
                    size={22}
                    color={quantity <= 1 ? colors.subtext : colors.accent}
                  />
                </TouchableOpacity>

                <Text style={styles.qtyValue}>{quantity}</Text>

                <TouchableOpacity style={styles.qtyBtn} onPress={increment} activeOpacity={0.7}>
                  <Ionicons name="add" size={22} color={colors.accent} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Add to cart button */}
            <TouchableOpacity style={styles.addBtn} onPress={handleAdd} activeOpacity={0.85}>
              <Text style={styles.addBtnText}>Add to Cart</Text>
              <View style={styles.addBtnPrice}>
                <Text style={styles.addBtnPriceText}>₪{totalPrice}</Text>
              </View>
            </TouchableOpacity>
          </View>
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
    maxHeight: '85%',
    overflow: 'hidden',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
    zIndex: 10,
  },

  /* Close button */
  closeBtn: {
    position: 'absolute',
    top: 20,
    right: 16,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.card + 'E6', // slightly transparent card background
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  /* Image */
  image: {
    width: SCREEN_WIDTH,
    height: 220,
    backgroundColor: colors.border,
  },

  /* Content */
  content: {
    padding: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.subtext,
    lineHeight: 20,
    marginBottom: 12,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.accent,
    marginBottom: 20,
  },

  /* Quantity */
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  qtyBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnDisabled: {
    opacity: 0.5,
  },
  qtyValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    minWidth: 40,
    textAlign: 'center',
  },

  /* Add to cart */
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.accent,
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 24,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  addBtnText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
  addBtnPrice: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
  },
  addBtnPriceText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
  },
});
