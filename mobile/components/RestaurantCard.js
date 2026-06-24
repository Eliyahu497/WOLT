import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const ACCENT = '#FF6B00';
const DARK = '#1A1A2E';
const GRAY = '#8E8E93';
const WHITE = '#FFFFFF';

/**
 * A stylish restaurant card with cover image, name, description,
 * rating, delivery info, and optional distance.
 * Tapping navigates to the restaurant's menu screen.
 *
 * @param {object}   restaurant - The restaurant data object.
 * @param {function} [onPress]  - Optional override callback when the card is tapped.
 */
export default function RestaurantCard({ restaurant, onPress }) {
  const router = useRouter();

  const {
    id,
    name,
    description,
    image,
    rating,
    deliveryTime,
    deliveryPrice,
    distanceKm,
    category,
  } = restaurant;

  function handlePress() {
    if (onPress) {
      onPress();
    } else {
      router.push(`/restaurant/${id}`);
    }
  }

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.92}>
      {/* Cover image */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: image }}
          style={styles.image}
          resizeMode="cover"
        />
        {/* Category badge */}
        {category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>
        )}
        {/* Delivery time pill */}
        {deliveryTime && (
          <View style={styles.timePill}>
            <Ionicons name="time-outline" size={12} color={WHITE} />
            <Text style={styles.timeText}>{deliveryTime}</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          {rating != null && (
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={13} color="#FFB800" />
              <Text style={styles.ratingText}>{Number(rating).toFixed(1)}</Text>
            </View>
          )}
        </View>

        {description ? (
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        ) : null}

        {/* Meta row */}
        <View style={styles.metaRow}>
          {deliveryPrice != null && (
            <View style={styles.metaItem}>
              <Ionicons name="bicycle-outline" size={14} color={GRAY} />
              <Text style={styles.metaText}>
                {deliveryPrice === 0 ? 'Free delivery' : `₪${deliveryPrice} delivery`}
              </Text>
            </View>
          )}

          {distanceKm != null && (
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={14} color={GRAY} />
              <Text style={styles.metaText}>
                {Number(distanceKm).toFixed(1)} km
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: WHITE,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  /* Image */
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: '#E8E8E8',
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    color: WHITE,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  timePill: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  timeText: {
    color: WHITE,
    fontSize: 12,
    fontWeight: '600',
  },

  /* Info */
  info: {
    padding: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: DARK,
    marginRight: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D4A600',
  },

  description: {
    fontSize: 13,
    color: GRAY,
    lineHeight: 18,
    marginBottom: 10,
  },

  /* Meta */
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: GRAY,
    fontWeight: '500',
  },
});
