import { Stack } from 'expo-router';

/**
 * Restaurant route layout – headerless since the restaurant screen
 * renders its own banner with an overlaid back button.
 */
export default function RestaurantLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
