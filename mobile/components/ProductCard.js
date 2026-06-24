import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ACCENT = '#FF6B00';
const DARK = '#1A1A2E';
const GRAY = '#8E8E93';
const WHITE = '#FFFFFF';

/**
 * A compact product card with image, name, description, and price.
 *
 * @param {object}   product  - The product data: { id, name, description, price, image }.
 * @param {function} onPress  - Called when the card is tapped.
 */
export default function ProductCard({ product, onPress }) {
  const { name, description, price, image } = product;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      {/* Text side */}
      <View style={styles.textSection}>
        <Text style={styles.name} numberOfLines={2}>
          {name}
        </Text>
        {description ? (
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        ) : null}
        <Text style={styles.price}>₪{Number(price).toLocaleString()}</Text>
      </View>

      {/* Image side */}
      {image && (
        <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: WHITE,
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  textSection: {
    flex: 1,
    padding: 14,
    justifyContent: 'center',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: DARK,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: GRAY,
    lineHeight: 17,
    marginBottom: 8,
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: ACCENT,
  },
  image: {
    width: 110,
    height: 110,
    backgroundColor: '#F0F0F0',
  },
});
