import { FlatList, TouchableOpacity, Text, StyleSheet, View } from 'react-native';

const ACCENT = '#FF6B00';
const ACCENT_LIGHT = '#FFF3E8';
const LIGHT_GRAY = '#F2F2F7';
const GRAY = '#8E8E93';
const DARK = '#1A1A2E';

/**
 * Horizontal scrollable category list with emoji icons.
 * Includes an "All" chip at the beginning.
 *
 * @param {Array}    categories       - Array of { id, name, icon }.
 * @param {string|null} selectedCategory - Currently selected category ID, or null for "All".
 * @param {function} onSelect         - Callback with category ID (or null for "All").
 */
export default function CategoryList({ categories, selectedCategory, onSelect }) {
  // Prepend an "All" option
  const data = [{ id: null, name: 'All', icon: '🔥' }, ...categories];

  function renderItem({ item }) {
    const isActive = selectedCategory === item.id;

    return (
      <TouchableOpacity
        style={[styles.chip, isActive && styles.chipActive]}
        onPress={() => onSelect(item.id)}
        activeOpacity={0.7}
      >
        <Text style={styles.chipIcon}>{item.icon}</Text>
        <Text style={[styles.chipLabel, isActive && styles.chipLabelActive]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.wrapper}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id ?? 'all'}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 10,
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LIGHT_GRAY,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 6,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  chipActive: {
    backgroundColor: ACCENT_LIGHT,
    borderColor: ACCENT,
  },
  chipIcon: {
    fontSize: 18,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: GRAY,
  },
  chipLabelActive: {
    color: ACCENT,
  },
});
