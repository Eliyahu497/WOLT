import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ACCENT = '#FF6B00';
const LIGHT_GRAY = '#F2F2F7';
const GRAY = '#8E8E93';
const DARK = '#1A1A2E';

/**
 * A search bar component with a magnifying glass icon and clear button.
 *
 * @param {string}   value      - Current search query text.
 * @param {function} onChangeText - Callback when the text changes.
 * @param {string}   [placeholder] - Placeholder text.
 */
export default function SearchBar({ value, onChangeText, placeholder = 'Search restaurants...' }) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Ionicons name="search" size={20} color={GRAY} style={styles.icon} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={GRAY}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText('')} style={styles.clearBtn}>
            <Ionicons name="close-circle" size={18} color={GRAY} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LIGHT_GRAY,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: DARK,
  },
  clearBtn: {
    padding: 4,
    marginLeft: 4,
  },
});
