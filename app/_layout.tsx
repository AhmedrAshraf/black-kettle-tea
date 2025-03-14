import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Creepster': require('../assets/fonts/Creepster-Regular.ttf'),
    'Nosifer': require('../assets/fonts/Nosifer-Regular.ttf'),
    'SpecialElite': require('../assets/fonts/SpecialElite-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <Stack 
        screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' }
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' }
          }} 
        />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}