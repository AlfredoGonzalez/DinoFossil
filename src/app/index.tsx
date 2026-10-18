import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { useTranslation } from '@/i18n';
import { tapFeedback } from '@/services/feedback';
import { useHydrated } from '@/store/gameStore';
import { getArt } from '@/ui/art';
import { GameText } from '@/ui/GameText';
import { Logo } from '@/ui/Logo';
import { ProgressBar } from '@/ui/ProgressBar';
import { Screen } from '@/ui/Screen';
import { colors } from '@/ui/theme';

/** Pantalla de carga: al terminar espera un toque del jugador para entrar al juego. */
export default function Loading() {
  const { t } = useTranslation();
  const hydrated = useHydrated();
  const [progress, setProgress] = useState(0);
  const ready = hydrated && progress >= 1;
  const bounce = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    bounce.value = withRepeat(withSequence(withTiming(-14, { duration: 450 }), withTiming(0, { duration: 450 })), -1);
  }, [bounce]);

  useEffect(() => {
    if (ready) pulse.value = withRepeat(withSequence(withTiming(1.08, { duration: 600 }), withTiming(1, { duration: 600 })), -1);
  }, [ready, pulse]);

  useEffect(() => {
    const id = setInterval(() => setProgress((p) => Math.min(1, p + 0.04)), 90);
    return () => clearInterval(id);
  }, []);

  const mascotStyle = useAnimatedStyle(() => ({ transform: [{ translateY: bounce.value }] }));
  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));
  const mascot = getArt('loading/mascot');

  return (
    <Screen background="jungle" backgroundImage={getArt('loading/background')}>
      <Pressable
        testID="tap-to-play"
        accessibilityRole="button"
        accessibilityLabel={t('loading.tapToPlay')}
        disabled={!ready}
        style={styles.container}
        onPress={() => {
          tapFeedback(true);
          router.replace('/mine');
        }}
      >
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
          {ready ? (
            <Animated.View style={pulseStyle}>
              <GameText size={30} color={colors.textLight} weight="black" outline center>
                {t('loading.tapToPlay')}
              </GameText>
            </Animated.View>
          ) : (
            <>
              <GameText color={colors.textLight} outline center>
                {t('loading.progress')}
              </GameText>
              <ProgressBar value={progress} height={22} />
              <GameText size={20} color={colors.textLight} weight="black" outline center>
                {Math.round(progress * 100)}%
              </GameText>
            </>
          )}
          <GameText size={14} color={colors.textLight} outline center>
            {t('loading.tip')}
          </GameText>
        </View>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'space-between' },
  mascot: { alignItems: 'center' },
  mascotImage: { width: 240, height: 240 },
  // Altura fija: el cambio de barra a "Toca para jugar" no mueve el resto de la pantalla.
  bottom: { gap: 8, minHeight: 120, justifyContent: 'flex-end' },
});
