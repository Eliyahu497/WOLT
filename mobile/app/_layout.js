import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import CartSheet from '../components/CartSheet';
import FloatingCartButton from '../components/FloatingCartButton';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

/**
 * Inner layout that reads auth state and redirects accordingly.
 * - Not authenticated  → (auth) group  (login / register)
 * - Authenticated      → (tabs) group  (customer dashboard)
 *   (future: owner group for managers)
 */
function RootNavigator() {
  const { isLoggedIn, isLoading, role } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();

  useEffect(() => {
    if (isLoading) return; // Still restoring session – do nothing yet

    const inAuthGroup = segments[0] === '(auth)';

    if (isLoggedIn && inAuthGroup) {
      // User IS signed in but still on auth screens → redirect to main app
      router.replace('/(tabs)');
    }
  }, [isLoggedIn, isLoading, segments]);

  // Show a loading spinner while restoring the session from AsyncStorage
  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <Slot />
      {/* Global Cart UI overlay */}
      {isLoggedIn && (
        <>
          <FloatingCartButton />
          <CartSheet />
        </>
      )}
    </>
  );
}

/**
 * Root Layout – wraps the entire app with the AuthProvider and CartProvider.
 */
export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <RootNavigator />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});
