import { Fredoka_500Medium, Fredoka_600SemiBold, Fredoka_700Bold, useFonts } from '@expo-google-fonts/fredoka';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { setLanguage } from '@/i18n';
import { initAds } from '@/services/ads';
import { initPurchases } from '@/services/purchases';
import { useGameStore } from '@/store/gameStore';
import { GlobalModals } from '@/ui/GlobalModals';
import { FakeAdOverlay, Toasts } from '@/ui/Overlays';
import { useGameLoop } from '@/ui/useGameLoop';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ Fredoka_500Medium, Fredoka_600SemiBold, Fredoka_700Bold });
  const language = useGameStore((s) => s.game.settings.language);

  useGameLoop();

  useEffect(() => {
    setLanguage(language);
  }, [language]);

  useEffect(() => {
    void initAds().catch(() => undefined);
    void initPurchases().catch(() => undefined);
  }, []);

  useEffect(() => {
    if (fontsLoaded) void SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
        <GlobalModals />
        <Toasts />
        <FakeAdOverlay />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
