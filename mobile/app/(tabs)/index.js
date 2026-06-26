import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { get } from '../../services/api';
import SearchBar from '../../components/SearchBar';
import CategoryList from '../../components/CategoryList';
import RestaurantCard from '../../components/RestaurantCard';
import RestaurantFormModal from '../../components/RestaurantFormModal';
import { useTheme } from '../../context/ThemeContext';

// ─── Sort options ───────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { key: 'popularity', label: 'Popularity', icon: 'flame-outline' },
  { key: 'rating', label: 'Rating ⭐', icon: 'star-outline' },
  { key: 'distance', label: 'Distance 📍', icon: 'location-outline' },
];

export default function DashboardScreen() {
  const { user, role } = useAuth();
  const router = useRouter();
  const { colors } = useTheme();
  
  const styles = createStyles(colors);

  // Data state
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Filter & sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState('popularity');
  const [showSortModal, setShowSortModal] = useState(false);
  const [showRestaurantModal, setShowRestaurantModal] = useState(false);

  // ── Fetch data ──────────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    try {
      setError('');
      const [restaurantsData, categoriesData] = await Promise.all([
        get('/api/restaurants'),
        get('/api/categories'),
      ]);
      setRestaurants(restaurantsData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    }
  }, []);

  // Initial load
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await fetchData();
      setIsLoading(false);
    })();
  }, [fetchData]);

  // Pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  // ── Filtered & sorted list ────────────────────────────────────────────────
  const filteredRestaurants = useMemo(() => {
    let list = [...restaurants];

    // Manager filter
    if (role === 'manager' && user?.id) {
      list = list.filter((r) => r.owner === user.id);
    }

    // Filter by category
    if (selectedCategory) {
      list = list.filter((r) => r.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.name?.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          r.category?.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case 'rating':
        list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case 'distance':
        list.sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
        break;
      case 'popularity':
      default:
        list.sort((a, b) => (b.orderCount ?? 0) - (a.orderCount ?? 0));
        break;
    }

    return list;
  }, [restaurants, selectedCategory, searchQuery, sortBy, role, user]);

  // ── Render helpers ────────────────────────────────────────────────────────

  function renderRestaurant({ item }) {
    const isManager = role === 'manager';
    return (
      <RestaurantCard
        restaurant={item}
        onPress={() => {
          if (isManager) {
            router.push(`/owner/restaurant/${item.id}`);
          } else {
            router.push(`/restaurant/${item.id}`);
          }
        }}
      />
    );
  }

  function renderListHeader() {
    const isManager = role === 'manager';

    return (
      <View>
        {/* Greeting */}
        <View style={styles.greeting}>
          <View>
            <Text style={styles.greetHello}>
              {getGreeting()} 👋
            </Text>
            <Text style={styles.greetName}>
              {user?.name || user?.userName || 'Food Lover'}
            </Text>
          </View>
          {/* Sort button */}
          <TouchableOpacity
            style={styles.sortBtn}
            onPress={() => setShowSortModal(true)}
            activeOpacity={0.75}
          >
            <Ionicons name="swap-vertical-outline" size={18} color={colors.accent} />
            <Text style={styles.sortBtnText}>Sort</Text>
          </TouchableOpacity>
        </View>

        {isManager && (
          <TouchableOpacity 
            style={styles.addRestaurantBtn} 
            onPress={() => setShowRestaurantModal(true)}
          >
            <Ionicons name="add-circle" size={24} color={colors.white} />
            <Text style={styles.addRestaurantText}>Add New Restaurant</Text>
          </TouchableOpacity>
        )}

        {/* Search bar */}
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

        {/* Categories */}
        <CategoryList
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />

        {/* Result count */}
        <View style={styles.resultRow}>
          <Text style={styles.resultCount}>
            {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? 's' : ''}
          </Text>
          <Text style={styles.sortLabel}>
            Sorted by {SORT_OPTIONS.find((o) => o.key === sortBy)?.label}
          </Text>
        </View>
      </View>
    );
  }

  function renderEmpty() {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="restaurant-outline" size={56} color={colors.subtext} />
        <Text style={styles.emptyTitle}>No restaurants found</Text>
        <Text style={styles.emptySubtitle}>
          Try adjusting your search or category filter
        </Text>
      </View>
    );
  }

  // ── Sort modal ────────────────────────────────────────────────────────────
  function renderSortModal() {
    return (
      <Modal
        visible={showSortModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSortModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowSortModal(false)}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Sort By</Text>

            {SORT_OPTIONS.map((option) => {
              const isActive = sortBy === option.key;
              return (
                <TouchableOpacity
                  key={option.key}
                  style={[styles.sortOption, isActive && styles.sortOptionActive]}
                  onPress={() => {
                    setSortBy(option.key);
                    setShowSortModal(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.sortOptionLeft}>
                    <Ionicons
                      name={option.icon}
                      size={22}
                      color={isActive ? colors.accent : colors.subtext}
                    />
                    <Text style={[styles.sortOptionText, isActive && styles.sortOptionTextActive]}>
                      {option.label}
                    </Text>
                  </View>
                  {isActive && (
                    <Ionicons name="checkmark-circle" size={22} color={colors.accent} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="cloud-offline-outline" size={48} color={colors.subtext} />
        <Text style={styles.errorTitle}>Oops!</Text>
        <Text style={styles.errorMsg}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={onRefresh}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={filteredRestaurants}
        renderItem={renderRestaurant}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
      />
      {renderSortModal()}
      <RestaurantFormModal 
        visible={showRestaurantModal} 
        onClose={() => setShowRestaurantModal(false)} 
        onSuccess={fetchData} 
      />
    </SafeAreaView>
  );
}

// ── Helpers ─────────────────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

// ─── Styles ─────────────────────────────────────────────────────────────────────

const createStyles = (colors) => StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    gap: 12,
  },
  listContent: {
    paddingBottom: 24,
  },

  /* Greeting */
  greeting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
  },
  greetHello: {
    fontSize: 14,
    color: colors.subtext,
    fontWeight: '500',
  },
  greetName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginTop: 2,
  },

  /* Add Restaurant Btn */
  addRestaurantBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8,
  },
  addRestaurantText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },

  /* Sort button */
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.accentLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  sortBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.accent,
  },

  /* Result row */
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  resultCount: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  sortLabel: {
    fontSize: 12,
    color: colors.subtext,
  },

  /* Empty */
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.subtext,
    textAlign: 'center',
    paddingHorizontal: 40,
  },

  /* Error */
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  errorMsg: {
    fontSize: 14,
    color: colors.subtext,
    textAlign: 'center',
    paddingHorizontal: 40,
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

  /* Sort modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 12,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 16,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 4,
  },
  sortOptionActive: {
    backgroundColor: colors.accentLight,
  },
  sortOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sortOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  sortOptionTextActive: {
    color: colors.accent,
  },
});
