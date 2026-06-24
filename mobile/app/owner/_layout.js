import { Stack } from 'expo-router';

/**
 * Layout for owner-specific routes.
 * Hides the native headers so screens can manage their own banners.
 */
export default function OwnerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
