import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { get, patch, del } from '../../services/api';

import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function OrdersScreen() {
  const { colors } = useTheme();
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const styles = createStyles(colors);
  const [orders, setOrders] = useState([]);
  const [restaurantsMap, setRestaurantsMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setError('');
      // Fetch orders and all restaurants to get names
      const [ordersData, restaurantsData] = await Promise.all([
        get('/api/orders'),
        get('/api/restaurants'),
      ]);

      // Create lookup map for restaurant names
      const map = {};
      restaurantsData.forEach((r) => {
        map[r.id] = r.name;
      });
      setRestaurantsMap(map);

      // Sort orders descending (assuming last created is at the end)
      setOrders(ordersData.reverse());
    } catch (err) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (isLoggedIn) fetchOrders();
    }, [fetchOrders, isLoggedIn])
  );

  const onRefresh = () => {
    if (!isLoggedIn) return;
    setRefreshing(true);
    fetchOrders();
  };

  // ── Handlers ────────────────────────────────────────────────────────────────

  async function handleCancelOrder(orderId) {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            setUpdatingOrderId(orderId);
            try {
              await del(`/api/orders/${orderId}`);
              await fetchOrders();
            } catch (err) {
              Alert.alert('Error', err.message || 'Failed to cancel order');
            } finally {
              setUpdatingOrderId(null);
            }
          },
        },
      ]
    );
  }

  async function updateItemQuantity(order, productId, delta) {
    const newItems = order.items
      .map((item) => {
        if (item.productId === productId) {
          return { ...item, quantity: item.quantity + delta };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);

    setUpdatingOrderId(order.id);

    try {
      if (newItems.length === 0) {
        // If all items removed, cancel the order entirely
        await del(`/api/orders/${order.id}`);
      } else {
        // Otherwise update via PATCH
        await patch(`/api/orders/${order.id}`, { items: newItems });
      }
      await fetchOrders();
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to update order');
    } finally {
      setUpdatingOrderId(null);
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  function renderOrderItem({ item: order }) {
    const isUpdating = updatingOrderId === order.id;
    const shortId = order.id.split('-')[0].toUpperCase();
    const restName = restaurantsMap[order.restaurantId] || 'Unknown Restaurant';

    return (
      <View style={styles.card}>
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text style={styles.restName} numberOfLines={1}>{restName}</Text>
            <Text style={styles.orderId}>Order #{shortId}</Text>
          </View>
          <Text style={styles.totalPrice}>₪{Number(order.total).toLocaleString()}</Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Items List */}
        <View style={styles.itemsContainer}>
          {order.items.map((item, index) => (
            <View key={`${item.productId}-${index}`} style={styles.itemRow}>
              
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.quantity}x {item.name || 'Item'}
                </Text>
                <Text style={styles.itemPrice}>
                  ₪{(item.price * item.quantity).toLocaleString()}
                </Text>
              </View>

              {/* Quantity Controls */}
              <View style={styles.qtyControls}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  disabled={isUpdating}
                  onPress={() => updateItemQuantity(order, item.productId, -1)}
                >
                  <Ionicons name="remove" size={16} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  disabled={isUpdating}
                  onPress={() => updateItemQuantity(order, item.productId, 1)}
                >
                  <Ionicons name="add" size={16} color={colors.text} />
                </TouchableOpacity>
              </View>

            </View>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          {isUpdating ? (
            <ActivityIndicator color={colors.accent} size="small" />
          ) : (
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => handleCancelOrder(order.id)}
            >
              <Ionicons name="close-circle-outline" size={18} color={colors.error} />
              <Text style={styles.cancelBtnText}>Cancel Order</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  function renderEmpty() {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="receipt-outline" size={64} color={colors.subtext} />
        <Text style={styles.emptyTitle}>No past orders</Text>
        <Text style={styles.emptySubtitle}>
          You haven't placed any orders yet. Once you do, they will appear here.
        </Text>
      </View>
    );
  }

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Orders</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="lock-closed-outline" size={64} color={colors.subtext} />
          <Text style={styles.emptyTitle}>Login Required</Text>
          <Text style={styles.emptySubtitle}>
            Please log in to view your past orders.
          </Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.retryText}>Log In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="cloud-offline-outline" size={48} color={colors.subtext} />
        <Text style={styles.errorTitle}>Oops!</Text>
        <Text style={styles.errorMsg}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={fetchOrders}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Orders</Text>
      </View>

      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
        }
      />
    </SafeAreaView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 24,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },

  /* Card */
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  restName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 2,
  },
  orderId: {
    fontSize: 13,
    color: colors.subtext,
    fontWeight: '500',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.accent,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 14,
  },

  /* Items */
  itemsContainer: {
    gap: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 13,
    color: colors.subtext,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 12,
  },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Actions */
  actionsRow: {
    marginTop: 16,
    alignItems: 'flex-end',
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.error + '30', // 30 is hex for roughly 20% opacity
    backgroundColor: colors.error + '10', // 10 is hex for roughly 6% opacity
  },
  cancelBtnText: {
    color: colors.error,
    fontSize: 13,
    fontWeight: '700',
  },

  /* Empty State */
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  emptySubtitle: {
    fontSize: 15,
    color: colors.subtext,
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 22,
  },

  /* Error State */
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  errorMsg: {
    fontSize: 14,
    color: colors.subtext,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  retryBtn: {
    marginTop: 12,
    backgroundColor: colors.accent,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
});
