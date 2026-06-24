import { Stack } from 'expo-router';

/**
 * Auth group layout – uses a simple Stack navigator for login ↔ register flow.
 * The header is hidden to give full control over the screen design.
 */
export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
