// ============================
// frontend/app/_layout.js
// Configures the navigation stack for the Expo Router.
// Defines which screens are available and sets common
// header styles. File is intentionally minimal.
// ----------------------------
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4a7c2c',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="login" 
        options={{ title: '🌾 Kisan AI Login' }} 
      />
      <Stack.Screen 
        name="signup" 
        options={{ title: 'Farmer Registration' }} 
      />
      <Stack.Screen 
        name="home" 
        options={{ title: 'Ask Question' }} 
      />
      <Stack.Screen 
        name="history" 
        options={{ title: 'Query History' }} 
      />
    </Stack>
  );
}