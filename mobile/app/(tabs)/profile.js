import { View, Text, StyleSheet, TouchableOpacity, Switch, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function ProfileScreen() {
  const { user, role, logout } = useAuth();
  const { isDarkMode, toggleDarkMode, colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── Header Section ──────────────────────────────── */}
        <View style={styles.headerSection}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Ionicons name="person" size={40} color={colors.subtext} />
            </View>
          )}

          <Text style={styles.displayName}>{user?.name || 'User'}</Text>
          <Text style={styles.username}>@{user?.userName || '—'}</Text>

          <View style={styles.roleBadge}>
            <Ionicons
              name={role === 'manager' ? 'storefront-outline' : 'bag-handle-outline'}
              size={14}
              color={colors.white}
            />
            <Text style={styles.roleBadgeText}>{role || 'customer'}</Text>
          </View>
        </View>

        {/* ── Personal Details ────────────────────────────── */}
        <Text style={styles.sectionTitle}>Personal Details</Text>
        <View style={styles.detailsCard}>
          <DetailRow
            icon="person-outline"
            label="Full Name"
            value={user?.name || '—'}
            colors={colors}
            styles={styles}
          />
          <View style={styles.detailDivider} />
          <DetailRow
            icon="mail-outline"
            label="Email"
            value={user?.email || '—'}
            colors={colors}
            styles={styles}
          />
          <View style={styles.detailDivider} />
          <DetailRow
            icon="call-outline"
            label="Phone"
            value={user?.phone || '—'}
            colors={colors}
            styles={styles}
          />
          <View style={styles.detailDivider} />
          <DetailRow
            icon="shield-checkmark-outline"
            label="Role"
            value={role ? role.charAt(0).toUpperCase() + role.slice(1) : '—'}
            colors={colors}
            styles={styles}
          />
        </View>

        {/* ── Settings ────────────────────────────────────── */}
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.detailsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconCircle, { backgroundColor: isDarkMode ? '#5E35B1' : '#FFF3E0' }]}>
                <Ionicons
                  name={isDarkMode ? 'moon' : 'sunny'}
                  size={18}
                  color={isDarkMode ? '#EDE7F6' : '#FF6D00'}
                />
              </View>
              <Text style={styles.settingLabel}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* ── Logout ──────────────────────────────────────── */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout} activeOpacity={0.85}>
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * Reusable row component for displaying a labelled user detail.
 */
function DetailRow({ icon, label, value, colors, styles }) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailIconCircle}>
        <Ionicons name={icon} size={18} color={colors.accent} />
      </View>
      <View style={styles.detailTexts}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue} numberOfLines={1}>{value}</Text>
      </View>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────────

const createStyles = (colors) => StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  /* Header */
  headerSection: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 24,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 14,
  },
  avatarPlaceholder: {
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  displayName: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 2,
  },
  username: {
    fontSize: 15,
    color: colors.subtext,
    marginBottom: 12,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.accent,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleBadgeText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'capitalize',
  },

  /* Section title */
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.subtext,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 8,
    paddingHorizontal: 24,
  },

  /* Details card */
  detailsCard: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  detailIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  detailTexts: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.subtext,
    fontWeight: '500',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  detailDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 64,
  },

  /* Settings */
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },

  /* Logout */
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.error + '30',
  },
  logoutText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: '700',
  },
});
