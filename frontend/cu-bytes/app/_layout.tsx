import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { UserProvider } from './_context';
import { colors } from './_styles/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
    <UserProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg, flex: 1 },
        }}
      >
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
    </SafeAreaProvider>
  );
}
