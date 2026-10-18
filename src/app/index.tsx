import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { useTranslation } from '@/i18n';
import { useHydrated } from '@/store/gameStore';
import { getArt } from '@/ui/art';
import { GameText } from '@/ui/GameText';
import { Logo } from '@/ui/Logo';
import { ProgressBar } from '@/ui/ProgressBar';
import { Screen } from '@/ui/Screen';
import { colors } from '@/ui/theme';

/** Pantalla de carga. */
export default function Loading() {
  const { t } = useTranslation();
  const hydrated = useHydrated();
  // ?preview=1 (solo web) deja la pantalla quieta al 100 % para revisar el arte.
  const { preview } = useLocalSearchParams<{ preview?: string }>();
  const stay = Platform.OS === 'web' && preview !== undefined;
  const [progress, setProgress] = useState(0);
  const bounce = useSharedValue(0);

  useEffect(() => {
    bounce.value = withRepeat(withSequence(withTiming(-14, { duration: 450 }), withTiming(0, { duration: 450 })), -1);
  }, [bounce]);

  useEffect(() => {
    const id = setInterval(() => setProgress((p) => Math.min(1, p + 0.04)), 90);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (hydrated && progress >= 1 && !stay) router.replace('/home');
  }, [hydrated, progress, stay]);

  const mascotStyle = useAnimatedStyle(() => ({ transform: [{ translateY: bounce.value }] }));
  const mascot = getArt('loading/mascot');

  return (
    <Screen background="jungle" backgroundImage={getArt('loading/background')}>
      <View style={styles.container}>
        <Logo />
        <GameText size={14} color={colors.textLight} weight="black" outline center>
          {t('loading.tagline').toUpperCase()}
        </GameText>
        <Animated.View style={[styles.mascot, mascotStyle]}>
          {mascot ? (
            <Image source={mascot} resizeMode="contain" style={styles.mascotImage} />
          ) : (
            <GameText size={150} style={{ lineHeight: 180 }}>
              🦖
            </GameText>
          )}
        </Animated.View>
        <View style={styles.bottom}>
          <GameText color={colors.textLight} outline center>
            {t('loading.progress')}
          </GameText>
          <ProgressBar value={progress} height={22} />
          <GameText size={20} color={colors.textLight} weight="black" outline center>
            {Math.round(progress * 100)}%
          </GameText>
          <GameText size={14} color={colors.textLight} outline center>
            {t('loading.tip')}
          </GameText>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'space-between' },
  mascot: { alignItems: 'center' },
  mascotImage: { width: 240, height: 240 },
  bottom: { gap: 8 },
});
