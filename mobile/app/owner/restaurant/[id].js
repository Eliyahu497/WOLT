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
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { get, del } from '../../../services/api';

import ProductFormModal from '../../../components/ProductFormModal';
import RestaurantFormModal from '../../../components/RestaurantFormModal';

const ACCENT = '#FF6B00';
const DARK = '#1A1A2E';
const GRAY = '#8E8E93';
const LIGHT_GRAY = '#F2F2F7';
const WHITE = '#FFFFFF';
const RED = '#FF3B30';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_HEIGHT = 260;

export default function OwnerRestaurantScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Data state
  const [restaurant, setRestaurant] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals state
  const [showProductModal, setShowProductModal] = useState(false);
  const [showRestaurantModal, setShowRestaurantModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

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

  // ── Actions ───────────────────────────────────────────────────────────────

  function handleAddProduct() {
    setEditingProduct(null);
    setShowProductModal(true);
  }

  function handleEditProduct(product) {
    setEditingProduct(product);
    setShowProductModal(true);
  }

  function handleDeleteProduct(productId) {
    Alert.alert('Delete Product', 'Are you sure you want to delete this product?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await del(`/api/restaurants/${id}/products/${productId}`);
            fetchData();
          } catch (err) {
            Alert.alert('Error', err.message || 'Failed to delete product');
          }
        },
      },
    ]);
  }

  function handleEditRestaurant() {
    setShowRestaurantModal(true);
  }

  function handleDeleteRestaurant() {
    Alert.alert(
      'Delete Restaurant',
      'Are you absolutely sure? This will delete the restaurant and all its products.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: async () => {
            try {
              await del(`/api/restaurants/${id}`);
              // Go back to dashboard on success
              router.replace('/(tabs)');
            } catch (err) {
              Alert.alert('Error', err.message || 'Failed to delete restaurant');
            }
          },
        },
      ]
    );
  }

  // ── Rendering ─────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={ACCENT} />
      </View>
    );
  }

  if (error || !restaurant) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={GRAY} />
        <Text style={styles.errorTitle}>Error</Text>
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

  function renderHeader() {
    return (
      <View>
        <View style={styles.bannerWrapper}>
          <Image source={{ uri: restaurant.image }} style={styles.bannerImage} resizeMode="cover" />
          <View style={styles.bannerOverlay} />
          
          <TouchableOpacity
            style={[styles.backBtn, { top: insets.top + 8 }]}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color={WHITE} />
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.titleRow}>
            <Text style={styles.restName} numberOfLines={2}>{restaurant.name}</Text>
            
            <View style={styles.actionIcons}>
              <TouchableOpacity style={styles.iconBtn} onPress={handleEditRestaurant}>
                <Ionicons name="pencil" size={20} color={DARK} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={handleDeleteRestaurant}>
                <Ionicons name="trash" size={20} color={RED} />
              </TouchableOpacity>
            </View>
          </View>

          {restaurant.description ? (
            <Text style={styles.restDescription}>{restaurant.description}</Text>
          ) : null}

          <View style={styles.metaRow}>
            <View style={styles.metaChip}>
              <Text style={styles.metaChipText}>{restaurant.category}</Text>
            </View>
            <View style={styles.metaChip}>
              <Ionicons name="bicycle-outline" size={14} color={ACCENT} />
              <Text style={styles.metaChipText}>
                {restaurant.deliveryPrice === 0 ? 'Free' : `₪${restaurant.deliveryPrice}`}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.menuHeaderRow}>
            <View>
              <Text style={styles.menuHeading}>Menu Items</Text>
              <Text style={styles.menuSubheading}>{products.length} products</Text>
            </View>
            <TouchableOpacity style={styles.addProductBtn} onPress={handleAddProduct}>
              <Ionicons name="add" size={16} color={WHITE} />
              <Text style={styles.addProductText}>Add Product</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>₪{item.price}</Text>
              {item.description ? (
                <Text style={styles.productDesc} numberOfLines={2}>{item.description}</Text>
              ) : null}
            </View>
            
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.productImg} />
            )}
            
            {/* Actions Overlay */}
            <View style={styles.productActions}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => handleEditProduct(item)}>
                <Ionicons name="pencil" size={16} color={WHITE} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => handleDeleteProduct(item.id)}>
                <Ionicons name="trash" size={16} color={WHITE} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modals */}
      <ProductFormModal
        visible={showProductModal}
        onClose={() => setShowProductModal(false)}
        restaurantId={id}
        product={editingProduct}
        onSuccess={fetchData}
      />
      <RestaurantFormModal
        visible={showRestaurantModal}
        onClose={() => setShowRestaurantModal(false)}
        restaurant={restaurant}
        onSuccess={fetchData}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: WHITE },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: WHITE, padding: 24, gap: 10 },
  listContent: { paddingBottom: 40 },
  
  bannerWrapper: { height: BANNER_HEIGHT, position: 'relative' },
  bannerImage: { width: SCREEN_WIDTH, height: BANNER_HEIGHT, backgroundColor: '#E8E8E8' },
  bannerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.2)' },
  backBtn: { position: 'absolute', left: 16, width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },

  infoSection: { padding: 20 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  restName: { flex: 1, fontSize: 24, fontWeight: '800', color: DARK, paddingRight: 10 },
  actionIcons: { flexDirection: 'row', gap: 10 },
  iconBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: LIGHT_GRAY, justifyContent: 'center', alignItems: 'center' },
  restDescription: { fontSize: 14, color: GRAY, lineHeight: 20, marginBottom: 14 },
  
  metaRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: LIGHT_GRAY, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  metaChipText: { fontSize: 13, fontWeight: '600', color: DARK, textTransform: 'capitalize' },
  
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 16 },
  
  menuHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  menuHeading: { fontSize: 20, fontWeight: '800', color: DARK },
  menuSubheading: { fontSize: 13, color: GRAY },
  addProductBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: ACCENT, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, gap: 4 },
  addProductText: { color: WHITE, fontSize: 13, fontWeight: '700' },

  productCard: { flexDirection: 'row', marginHorizontal: 20, marginBottom: 12, backgroundColor: WHITE, borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#F0F0F0' },
  productInfo: { flex: 1, justifyContent: 'center', paddingRight: 12 },
  productName: { fontSize: 16, fontWeight: '700', color: DARK, marginBottom: 4 },
  productPrice: { fontSize: 15, fontWeight: '800', color: ACCENT, marginBottom: 4 },
  productDesc: { fontSize: 12, color: GRAY, lineHeight: 16 },
  productImg: { width: 80, height: 80, borderRadius: 10, backgroundColor: LIGHT_GRAY },
  
  productActions: { position: 'absolute', right: 8, top: -8, flexDirection: 'row', gap: 6 },
  actionBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#4A4A4A', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 3, shadowOffset: { height: 2 } },
  deleteBtn: { backgroundColor: RED },

  errorTitle: { fontSize: 18, fontWeight: '700', color: DARK },
  errorMsg: { fontSize: 14, color: GRAY, textAlign: 'center' },
  retryBtn: { backgroundColor: ACCENT, paddingHorizontal: 28, paddingVertical: 12, borderRadius: 12, marginTop: 8 },
  retryText: { color: WHITE, fontWeight: '700', fontSize: 15 },
  backLink: { padding: 8 },
  backLinkText: { color: ACCENT, fontSize: 14, fontWeight: '600' },
});
