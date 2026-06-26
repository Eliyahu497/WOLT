import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { get, post } from '../../services/api';
import ProductCard from '../../components/ProductCard';
import ProductModal from '../../components/ProductModal';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_HEIGHT = 260;

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addToCart } = useCart();
  const { isLoggedIn, user } = useAuth();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  // Data state
  const [restaurant, setRestaurant] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRating, setIsRating] = useState(false);

  // Modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // ── Fetch data ──────────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    try {
      setError('');
      const [restData, prodData] = await Promise.all([
        get(`/api/restaurants/${id}`),
        get(`/api/restaurants/${id}/products`),
      ]);
      setRestaurant(restData);
      setProducts(prodData);
    } catch (err) {
      setError(err.message || 'Failed to load restaurant');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  function openProduct(product) {
    setSelectedProduct(product);
    setModalVisible(true);
  }

  function handleAddToCart({ product, quantity }) {
    if (!isLoggedIn) {
      router.push('/(auth)/login');
      return;
    }
    if (restaurant) {
      addToCart(product, quantity, restaurant.id, restaurant);
    }
  }

  async function handleRateRestaurant(rating) {
    if (!isLoggedIn) {
      router.push('/(auth)/login');
      return;
    }
    if (isRating) return;
    setIsRating(true);
    try {
      const updatedRest = await post(`/api/restaurants/${id}/rate`, { rating });
      setRestaurant(updatedRest); // Update with new rating
    } catch (err) {
      console.error('Failed to rate restaurant:', err.message);
    } finally {
      setIsRating(false);
    }
  }

  // ── Loading state ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (error || !restaurant) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.subtext} />
        <Text style={styles.errorTitle}>Couldn't load restaurant</Text>
        <Text style={styles.errorMsg}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={fetchData}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backLink} onPress={() => router.back()}>
          <Text style={styles.backLinkText}>← Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── List header (banner + info) ───────────────────────────────────────────
  function renderHeader() {
    const myRating = (restaurant && restaurant.ratings && user) ? restaurant.ratings[user.id] : 0;

    return (
      <View>
        {/* Banner image */}
        <View style={styles.bannerWrapper}>
          <Image
            source={{ uri: restaurant.image }}
            style={styles.bannerImage}
            resizeMode="cover"
          />

          {/* Gradient overlay */}
          <View style={styles.bannerOverlay} />

          {/* Back button */}
          <TouchableOpacity
            style={[styles.backBtn, { top: insets.top + 8 }]}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </TouchableOpacity>

          {/* Delivery time pill on banner */}
          {restaurant.deliveryTime && (
            <View style={styles.bannerTimePill}>
              <Ionicons name="time-outline" size={14} color={colors.white} />
              <Text style={styles.bannerTimeText}>{restaurant.deliveryTime}</Text>
            </View>
          )}
        </View>

        {/* Restaurant info */}
        <View style={styles.infoSection}>
          {/* Title row */}
          <View style={styles.titleRow}>
            <Text style={styles.restName} numberOfLines={2}>
              {restaurant.name}
            </Text>
            {restaurant.rating != null && (
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={15} color="#FFB800" />
                <Text style={styles.ratingText}>
                  {Number(restaurant.rating).toFixed(1)}
                </Text>
              </View>
            )}
          </View>

          {/* Interactive Rating */}
          <View style={styles.ratingStarsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleRateRestaurant(star)}
                disabled={isRating}
                style={styles.starBtn}
              >
                <Ionicons 
                  name="star" 
                  size={24} 
                  color={myRating && star <= myRating ? '#FFB800' : colors.border} 
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Description */}
          {restaurant.description ? (
            <Text style={styles.restDescription}>{restaurant.description}</Text>
          ) : null}

          {/* Meta chips */}
          <View style={styles.metaRow}>
            {restaurant.category && (
              <View style={styles.metaChip}>
                <Text style={styles.metaChipText}>{restaurant.category}</Text>
              </View>
            )}
            {restaurant.deliveryPrice != null && (
              <View style={styles.metaChip}>
                <Ionicons name="bicycle-outline" size={14} color={colors.accent} />
                <Text style={styles.metaChipText}>
                  {restaurant.deliveryPrice === 0 ? 'Free' : `₪${restaurant.deliveryPrice}`}
                </Text>
              </View>
            )}
            {restaurant.distanceKm != null && (
              <View style={styles.metaChip}>
                <Ionicons name="location-outline" size={14} color={colors.accent} />
                <Text style={styles.metaChipText}>
                  {Number(restaurant.distanceKm).toFixed(1)} km
                </Text>
              </View>
            )}
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Menu heading */}
          <Text style={styles.menuHeading}>Menu</Text>
          <Text style={styles.menuSubheading}>
            {products.length} item{products.length !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>
    );
  }

  // ── Empty menu ────────────────────────────────────────────────────────────
  function renderEmpty() {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="fast-food-outline" size={48} color={colors.subtext} />
        <Text style={styles.emptyText}>No items on the menu yet</Text>
      </View>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <View style={styles.screen}>
      <StatusBar barStyle={colors.background === '#1A1A2E' ? 'light-content' : 'dark-content'} />

      <FlatList
        data={products}
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={() => openProduct(item)} />
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <ProductModal
        product={selectedProduct}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddToCart={handleAddToCart}
      />
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────────

const createStyles = (colors) => StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    gap: 10,
    padding: 24,
  },
  listContent: {
    paddingBottom: 160,
  },

  /* Banner */
  bannerWrapper: {
    position: 'relative',
    height: BANNER_HEIGHT,
  },
  bannerImage: {
    width: SCREEN_WIDTH,
    height: BANNER_HEIGHT,
    backgroundColor: colors.border,
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  backBtn: {
    position: 'absolute',
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  bannerTimePill: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  bannerTimeText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
  },

  /* Info section */
  infoSection: {
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 8,
  },
  restName: {
    flex: 1,
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.card,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginTop: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ratingText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#D4A600',
  },
  ratingStarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 4,
    gap: 4,
  },
  starBtn: {
    padding: 2,
  },
  restDescription: {
    fontSize: 14,
    color: colors.subtext,
    lineHeight: 20,
    marginBottom: 14,
  },

  /* Meta chips */
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  metaChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    textTransform: 'capitalize',
  },

  /* Divider */
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 18,
  },

  /* Menu heading */
  menuHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 2,
  },
  menuSubheading: {
    fontSize: 13,
    color: colors.subtext,
    marginBottom: 16,
  },

  /* Empty */
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 40,
    gap: 8,
  },
  emptyText: {
    fontSize: 15,
    color: colors.subtext,
  },

  /* Error */
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  errorMsg: {
    fontSize: 14,
    color: colors.subtext,
    textAlign: 'center',
  },
  retryBtn: {
    backgroundColor: colors.accent,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  retryText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
  backLink: {
    marginTop: 8,
    padding: 8,
  },
  backLinkText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '600',
  },
});
