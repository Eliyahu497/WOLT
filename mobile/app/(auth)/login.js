import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

// ─── Theme ──────────────────────────────────────────────────────────────────────
const ACCENT = '#FF6B00';
const ACCENT_LIGHT = '#FFF3E8';
const DARK = '#1A1A2E';
const GRAY = '#8E8E93';
const LIGHT_GRAY = '#F2F2F7';
const ERROR_RED = '#FF3B30';
const WHITE = '#FFFFFF';

export default function LoginScreen() {
  const { login } = useAuth();

  // Form state
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Role selection: 'customer' or 'manager'
  const [role, setRole] = useState('customer');

  // UI state
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Validation ──────────────────────────────────────────────────────────────
  function validate() {
    const next = {};
    if (!userName.trim()) next.userName = 'Username is required';
    if (!password.trim()) next.password = 'Password is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function handleLogin() {
    setServerError('');
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await login(userName.trim(), password);
      // Navigation handled automatically by _layout.js auth redirect
    } catch (err) {
      setServerError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          {/* ── Header ─────────────────────────────────────────────────── */}
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Ionicons name="fast-food" size={32} color={WHITE} />
            </View>
            <Text style={styles.brand}>Want</Text>
            <Text style={styles.tagline}>Delicious food, delivered fast</Text>
          </View>

          {/* ── Role Selector ──────────────────────────────────────────── */}
          <Text style={styles.sectionLabel}>I am a</Text>
          <View style={styles.roleRow}>
            <TouchableOpacity
              style={[styles.roleCard, role === 'customer' && styles.roleCardActive]}
              onPress={() => setRole('customer')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="bag-handle-outline"
                size={26}
                color={role === 'customer' ? ACCENT : GRAY}
              />
              <Text style={[styles.roleLabel, role === 'customer' && styles.roleLabelActive]}>
                Customer
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleCard, role === 'manager' && styles.roleCardActive]}
              onPress={() => setRole('manager')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="storefront-outline"
                size={26}
                color={role === 'manager' ? ACCENT : GRAY}
              />
              <Text style={[styles.roleLabel, role === 'manager' && styles.roleLabelActive]}>
                Manager
              </Text>
            </TouchableOpacity>
          </View>

          {/* ── Username ───────────────────────────────────────────────── */}
          <View style={styles.fieldWrapper}>
            <View style={[styles.inputRow, errors.userName && styles.inputError]}>
              <Ionicons name="person-outline" size={20} color={GRAY} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor={GRAY}
                autoCapitalize="none"
                autoCorrect={false}
                value={userName}
                onChangeText={(t) => {
                  setUserName(t);
                  if (errors.userName) setErrors((p) => ({ ...p, userName: null }));
                }}
              />
            </View>
            {errors.userName && <Text style={styles.errorText}>{errors.userName}</Text>}
          </View>

          {/* ── Password ───────────────────────────────────────────────── */}
          <View style={styles.fieldWrapper}>
            <View style={[styles.inputRow, errors.password && styles.inputError]}>
              <Ionicons name="lock-closed-outline" size={20} color={GRAY} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={GRAY}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  if (errors.password) setErrors((p) => ({ ...p, password: null }));
                }}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={GRAY}
                />
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          {/* ── Server error ───────────────────────────────────────────── */}
          {serverError !== '' && (
            <View style={styles.serverErrorBox}>
              <Ionicons name="alert-circle" size={18} color={ERROR_RED} />
              <Text style={styles.serverErrorText}>{serverError}</Text>
            </View>
          )}

          {/* ── Login button ───────────────────────────────────────────── */}
          <TouchableOpacity
            style={[styles.primaryBtn, isSubmitting && styles.primaryBtnDisabled]}
            onPress={handleLogin}
            disabled={isSubmitting}
            activeOpacity={0.85}
          >
            {isSubmitting ? (
              <ActivityIndicator color={WHITE} />
            ) : (
              <Text style={styles.primaryBtnText}>Log In</Text>
            )}
          </TouchableOpacity>

          {/* ── Footer link ────────────────────────────────────────────── */}
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity style={styles.footerLink}>
              <Text style={styles.footerText}>
                Don't have an account?{' '}
                <Text style={styles.footerBold}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: WHITE,
  },
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'center',
  },

  /* Header */
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: ACCENT,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  brand: {
    fontSize: 30,
    fontWeight: '800',
    color: DARK,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 14,
    color: GRAY,
    marginTop: 4,
  },

  /* Role selector */
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: GRAY,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  roleRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  roleCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: LIGHT_GRAY,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  roleCardActive: {
    backgroundColor: ACCENT_LIGHT,
    borderColor: ACCENT,
  },
  roleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: GRAY,
  },
  roleLabelActive: {
    color: ACCENT,
  },

  /* Inputs */
  fieldWrapper: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LIGHT_GRAY,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: ERROR_RED,
    backgroundColor: '#FFF5F5',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: DARK,
  },
  eyeBtn: {
    padding: 6,
  },
  errorText: {
    fontSize: 12,
    color: ERROR_RED,
    marginTop: 4,
    marginLeft: 4,
  },

  /* Server error */
  serverErrorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF0F0',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  serverErrorText: {
    flex: 1,
    fontSize: 13,
    color: ERROR_RED,
    fontWeight: '500',
  },

  /* Primary button */
  primaryBtn: {
    backgroundColor: ACCENT,
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryBtnDisabled: {
    opacity: 0.7,
  },
  primaryBtnText: {
    color: WHITE,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  /* Footer */
  footerLink: {
    alignSelf: 'center',
    marginTop: 24,
    padding: 8,
  },
  footerText: {
    fontSize: 14,
    color: GRAY,
  },
  footerBold: {
    color: ACCENT,
    fontWeight: '700',
  },
});
