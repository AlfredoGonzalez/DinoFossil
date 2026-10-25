import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import type { StationId } from '@/game/types';
import { useGameStore } from '@/store/gameStore';
import { useNow } from '../hooks';
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

/** ¿Está activo ahora el Turbo del manager de esta planta? (se revisa cada medio segundo) */
export function useTurboActive(station: StationId): boolean {
  const until = useGameStore((s) => s.game.abilities[station]?.activeUntil ?? 0);
  const now = useNow(500);
  return until > now;
}

/** Resplandor dorado que late sobre toda la planta mientras el Turbo del manager está activo. */
export function TurboGlow() {
  const pulse = useSharedValue(0);
  useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 700, easing: Easing.inOut(Easing.sin) }), -1, true);
    return () => cancelAnimation(pulse);
  }, [pulse]);
  // Más fuerte de lo que parece necesario: sobre el fondo claro del laboratorio un dorado suave no se ve.
  const style = useAnimatedStyle(() => ({ opacity: 0.28 + pulse.value * 0.2 }));
  return <Animated.View pointerEvents="none" style={[styles.glow, style]} />;
}

const styles = StyleSheet.create({
  // Se extiende más allá de la escena para cubrir todo el piso (la planta recorta lo que sobra).
  glow: { position: 'absolute', top: -10, bottom: -10, left: -20, right: -80, backgroundColor: '#FFC21A', borderWidth: 6, borderColor: '#FF9F0A' },
});
