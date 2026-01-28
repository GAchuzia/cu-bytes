import { UserProvider } from './context';
import { Stack } from "expo-router";

export default function RootLayout() {
  
  return (
    <UserProvider>
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen name="home" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="enter" />
        <Stack.Screen name="scan" />
      </Stack>
    </UserProvider>
  );
}
