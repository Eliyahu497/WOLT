import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContext';

// ─── Theme ──────────────────────────────────────────────────────────────────────
const ACCENT = '#FF6B00';
const ACCENT_LIGHT = '#FFF3E8';
const DARK = '#1A1A2E';
const GRAY = '#8E8E93';
const LIGHT_GRAY = '#F2F2F7';
const ERROR_RED = '#FF3B30';
const SUCCESS_GREEN = '#34C759';
const WHITE = '#FFFFFF';

// ─── Validators ─────────────────────────────────────────────────────────────────

function validateForm(f) {
  const e = {};

  if (!f.name.trim()) e.name = 'Full name is required';
  if (!f.email.trim()) e.email = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(f.email)) e.email = 'Enter a valid email address';

  if (!f.phone.trim()) e.phone = 'Phone number is required';
  else if (!/^\d{10}$/.test(f.phone)) e.phone = 'Phone must be exactly 10 digits';

  if (!f.userName.trim()) e.userName = 'Username is required';

  if (!f.password) e.password = 'Password is required';
  else if (f.password.length < 8) e.password = 'Must be at least 8 characters';
  else if (!/[a-zA-Z]/.test(f.password) || !/[0-9]/.test(f.password))
    e.password = 'Must contain both letters and numbers';

  if (!f.confirmPassword) e.confirmPassword = 'Please confirm your password';
  else if (f.password !== f.confirmPassword) e.confirmPassword = 'Passwords do not match';

  if (!f.lat.trim()) e.lat = 'Latitude is required';
  else if (isNaN(Number(f.lat)) || f.lat.trim() === '') e.lat = 'Must be a valid number';
  else if (Number(f.lat) < -90 || Number(f.lat) > 90) e.lat = 'Must be between -90 and 90';

  if (!f.lng.trim()) e.lng = 'Longitude is required';
  else if (isNaN(Number(f.lng)) || f.lng.trim() === '') e.lng = 'Must be a valid number';
  else if (Number(f.lng) < -180 || Number(f.lng) > 180) e.lng = 'Must be between -180 and 180';

  if (!f.avatar) e.avatar = 'Please select a profile photo';

  return e;
}

// ─── Component ──────────────────────────────────────────────────────────────────

export default function RegisterScreen() {
  const { register } = useAuth();
  const router = useRouter();

  // Form fields
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    userName: '',
    password: '',
    confirmPassword: '',
    lat: '',
    lng: '',
    avatar: null, // base64 or URI string
  });

  // Role
  const [role, setRole] = useState('customer');

  // UI state
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ── Field updater ─────────────────────────────────────────────────────────
  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
  }

  // ── Image Picker ──────────────────────────────────────────────────────────
  async function pickImage(source) {
    let result;

    if (source === 'camera') {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permission Required', 'Camera access is needed to take a photo.');
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.2,
        base64: true,
      });
    } else {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permission Required', 'Gallery access is needed to pick a photo.');
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.2,
        base64: true,
      });
    }

    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      const avatarData = asset.base64
        ? `data:image/jpeg;base64,${asset.base64}`
        : asset.uri;
      updateField('avatar', avatarData);
    }
  }

  function showImageOptions() {
    if (Platform.OS === 'web') {
      pickImage('gallery');
      return;
    }
    Alert.alert('Profile Photo', 'Choose a source', [
      { text: 'Camera', onPress: () => pickImage('camera') },
      { text: 'Gallery', onPress: () => pickImage('gallery') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleRegister() {
    setServerError('');
    const validationErrors = validateForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        location: {
          lat: Number(form.lat),
          lng: Number(form.lng),
        },
        userName: form.userName.trim(),
        password: form.password,
        role,
        avatar: form.avatar,
      });

      Alert.alert('Success! 🎉', 'Your account has been created. Please log in.', [
        { text: 'Go to Login', onPress: () => router.replace('/(auth)/login') },
      ]);
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  function renderField({ key, placeholder, icon, keyboardType, secureEntry, toggleSecure, isSecureVisible, maxLength }) {
    return (
      <View style={styles.fieldWrapper} key={key}>
        <View style={[styles.inputRow, errors[key] && styles.inputError]}>
          <Ionicons name={icon} size={20} color={GRAY} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={GRAY}
            autoCapitalize={key === 'email' || key === 'userName' ? 'none' : 'words'}
            autoCorrect={false}
            keyboardType={keyboardType || 'default'}
            secureTextEntry={secureEntry && !isSecureVisible}
            maxLength={maxLength}
            value={form[key]}
            onChangeText={(t) => updateField(key, t)}
          />
          {toggleSecure && (
            <TouchableOpacity onPress={toggleSecure} style={styles.eyeBtn}>
              <Ionicons
                name={isSecureVisible ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={GRAY}
              />
            </TouchableOpacity>
          )}
        </View>
        {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
      </View>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ─────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Ionicons name="person-add" size={28} color={WHITE} />
          </View>
          <Text style={styles.brand}>Create Account</Text>
          <Text style={styles.tagline}>Join thousands of food lovers</Text>
        </View>

        {/* ── Avatar Picker ──────────────────────────────────────────── */}
        <TouchableOpacity
          style={[styles.avatarPicker, errors.avatar && styles.avatarError]}
          onPress={showImageOptions}
          activeOpacity={0.8}
        >
          {form.avatar ? (
            <Image source={{ uri: form.avatar }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="camera-outline" size={32} color={GRAY} />
              <Text style={styles.avatarHint}>Add Photo</Text>
            </View>
          )}
          <View style={styles.avatarBadge}>
            <Ionicons name="add" size={16} color={WHITE} />
          </View>
        </TouchableOpacity>
        {errors.avatar && <Text style={[styles.errorText, { textAlign: 'center', marginBottom: 8 }]}>{errors.avatar}</Text>}

        {/* ── Role Selector ──────────────────────────────────────────── */}
        <Text style={styles.sectionLabel}>Account Type</Text>
        <View style={styles.roleRow}>
          <TouchableOpacity
            style={[styles.roleCard, role === 'customer' && styles.roleCardActive]}
            onPress={() => setRole('customer')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="bag-handle-outline"
              size={24}
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
              size={24}
              color={role === 'manager' ? ACCENT : GRAY}
            />
            <Text style={[styles.roleLabel, role === 'manager' && styles.roleLabelActive]}>
              Manager
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Form Fields ────────────────────────────────────────────── */}
        <Text style={styles.sectionLabel}>Personal Info</Text>

        {renderField({ key: 'name', placeholder: 'Full Name', icon: 'person-outline' })}
        {renderField({ key: 'email', placeholder: 'Email Address', icon: 'mail-outline', keyboardType: 'email-address' })}
        {renderField({ key: 'phone', placeholder: 'Phone (10 digits)', icon: 'call-outline', keyboardType: 'phone-pad', maxLength: 10 })}
        {renderField({ key: 'userName', placeholder: 'Username', icon: 'at-outline' })}

        <Text style={styles.sectionLabel}>Security</Text>

        {renderField({
          key: 'password',
          placeholder: 'Password (8+ chars, letters & numbers)',
          icon: 'lock-closed-outline',
          secureEntry: true,
          isSecureVisible: showPassword,
          toggleSecure: () => setShowPassword(!showPassword),
        })}
        {renderField({
          key: 'confirmPassword',
          placeholder: 'Confirm Password',
          icon: 'shield-checkmark-outline',
          secureEntry: true,
          isSecureVisible: showConfirm,
          toggleSecure: () => setShowConfirm(!showConfirm),
        })}

        <Text style={styles.sectionLabel}>Location</Text>

        <View style={styles.locationRow}>
          <View style={{ flex: 1 }}>
            {renderField({ key: 'lat', placeholder: 'Latitude', icon: 'location-outline', keyboardType: 'numeric' })}
          </View>
          <View style={{ width: 12 }} />
          <View style={{ flex: 1 }}>
            {renderField({ key: 'lng', placeholder: 'Longitude', icon: 'navigate-outline', keyboardType: 'numeric' })}
          </View>
        </View>

        {/* ── Server error ─────────────────────────────────────────── */}
        {serverError !== '' && (
          <View style={styles.serverErrorBox}>
            <Ionicons name="alert-circle" size={18} color={ERROR_RED} />
            <Text style={styles.serverErrorText}>{serverError}</Text>
          </View>
        )}

        {/* ── Submit ───────────────────────────────────────────────── */}
        <TouchableOpacity
          style={[styles.primaryBtn, isSubmitting && styles.primaryBtnDisabled]}
          onPress={handleRegister}
          disabled={isSubmitting}
          activeOpacity={0.85}
        >
          {isSubmitting ? (
            <ActivityIndicator color={WHITE} />
          ) : (
            <Text style={styles.primaryBtnText}>Create Account</Text>
          )}
        </TouchableOpacity>

        {/* ── Footer ───────────────────────────────────────────────── */}
        <Link href="/(auth)/login" asChild>
          <TouchableOpacity style={styles.footerLink}>
            <Text style={styles.footerText}>
              Already have an account?{' '}
              <Text style={styles.footerBold}>Log In</Text>
            </Text>
          </TouchableOpacity>
        </Link>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scrollContent: {
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 40,
  },

  /* Header */
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
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
    fontSize: 26,
    fontWeight: '800',
    color: DARK,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 14,
    color: GRAY,
    marginTop: 4,
  },

  /* Avatar */
  avatarPicker: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: LIGHT_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarError: {
    borderColor: ERROR_RED,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    alignItems: 'center',
    gap: 4,
  },
  avatarHint: {
    fontSize: 11,
    color: GRAY,
    fontWeight: '500',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: ACCENT,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: WHITE,
  },

  /* Role selector */
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: GRAY,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 8,
  },
  roleRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  roleCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
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
    fontSize: 14,
    fontWeight: '600',
    color: GRAY,
  },
  roleLabelActive: {
    color: ACCENT,
  },

  /* Inputs */
  fieldWrapper: {
    marginBottom: 14,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LIGHT_GRAY,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
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
    fontSize: 15,
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

  /* Location row */
  locationRow: {
    flexDirection: 'row',
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
    marginTop: 4,
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
    marginTop: 8,
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
    marginTop: 20,
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
