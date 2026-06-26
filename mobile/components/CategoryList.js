import { FlatList, TouchableOpacity, Text, StyleSheet, View } from 'react-native';

import { useTheme } from '../context/ThemeContext';

/**
 * Horizontal scrollable category list with emoji icons.
 * Includes an "All" chip at the beginning.
 *
 * @param {Array}    categories       - Array of { id, name, icon }.
 * @param {string|null} selectedCategory - Currently selected category ID, or null for "All".
 * @param {function} onSelect         - Callback with category ID (or null for "All").
 */
export default function CategoryList({ categories, selectedCategory, onSelect }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  
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

const createStyles = (colors) => StyleSheet.create({
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
    backgroundColor: colors.card,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 6,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  chipActive: {
    backgroundColor: colors.accentLight,
    borderColor: colors.accent,
  },
  chipIcon: {
    fontSize: 18,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.subtext,
  },
  chipLabelActive: {
    color: colors.accent,
  },
});
