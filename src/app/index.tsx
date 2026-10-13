import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { useTranslation } from '@/i18n';
import { useHydrated } from '@/store/gameStore';
import { GameText } from '@/ui/GameText';
import { Logo } from '@/ui/Logo';
import { ProgressBar } from '@/ui/ProgressBar';
import { Screen } from '@/ui/Screen';
import { colors } from '@/ui/theme';

/** Pantalla de carga. */
export default function Loading() {
  const { t } = useTranslation();
  const hydrated = useHydrated();
  const [progress, setProgress] = useState(0);
  const bounce = useSharedValue(0);

  useEffect(() => {
    bounce.value = withRepeat(withSequence(withTiming(-14, { duration: 450 }), withTiming(0, { duration: 450 })), -1);
  }, [bounce]);

  useEffect(() => {
    const id = setInterval(() => setProgress((p) => Math.min(1, p + 0.08)), 90);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (hydrated && progress >= 1) router.replace('/home');
  }, [hydrated, progress]);

  const mascotStyle = useAnimatedStyle(() => ({ transform: [{ translateY: bounce.value }] }));

  return (
    <Screen background="jungle">
      <View style={styles.container}>
        <Logo />
        <GameText size={14} color={colors.textLight} weight="black" outline center>
          {t('loading.tagline').toUpperCase()}
        </GameText>
        <Animated.View style={[styles.mascot, mascotStyle]}>
          <GameText size={150} style={{ lineHeight: 180 }}>
            🦖
          </GameText>
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
  bottom: { gap: 8 },
});
