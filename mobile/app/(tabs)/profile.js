import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function ProfileScreen() {
  const { user, role, logout } = useAuth();
  const { isDarkMode, toggleDarkMode, colors } = useTheme();
  
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>👤</Text>
      <Text style={styles.title}>{user?.name || 'User'}</Text>
      <Text style={styles.subtitle}>@{user?.userName || '—'}</Text>

      <View style={styles.badge}>
        <Text style={styles.badgeText}>{role || 'customer'}</Text>
      </View>

      <View style={styles.settingRow}>
        <Text style={styles.settingText}>Dark Mode</Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleDarkMode}
          trackColor={{ false: colors.border, true: colors.accent }}
          thumbColor={colors.white}
        />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 24,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.subtext,
    marginBottom: 16,
  },
  badge: {
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 32,
  },
  badgeText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 300,
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  logoutButton: {
    backgroundColor: colors.error,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  logoutText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
