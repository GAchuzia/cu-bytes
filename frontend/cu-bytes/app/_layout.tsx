import { Stack } from 'expo-router';

import { UserProvider } from './_context';

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="dining" />
        <Stack.Screen name="enter" />
        <Stack.Screen name="entries" />
        <Stack.Screen name="home" />
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="recommendations" />
        <Stack.Screen name="register" />
        <Stack.Screen name="scan" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="statistics" />
      </Stack>
    </UserProvider>
  );
}
