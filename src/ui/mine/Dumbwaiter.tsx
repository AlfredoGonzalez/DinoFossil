import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { useGameStore } from '@/store/gameStore';
import { getArt } from '../art';
import { GameIcon } from '../GameIcon';
import { FLOOR_HEIGHT } from './Floor';

/** Ancho del hueco del montaplatos, pegado a la pared izquierda de la sala y el laboratorio. */
export const DUMBWAITER_WIDTH = 24;
const BOX = 22;
const BEAM = 9;
const PULLEY = 12;
/** Reposo: en el suelo del laboratorio. Arriba: a la altura del pasto de la sala. */
const BOTTOM_Y = FLOOR_HEIGHT * 2 - BEAM - BOX - 2;
const TOP_Y = FLOOR_HEIGHT - BEAM - BOX - 14;
const UP_MS = 1100;
const HOLD_MS = 500;
const DOWN_MS = 900;

/** Altura de la caja según el viaje: 0–1 sube, 1–2 arriba, 2–3 baja. */
function boxY(v: number): number {
  'worklet';
  if (v <= 0 || v >= 3) return BOTTOM_Y;
  if (v < 1) return BOTTOM_Y + (TOP_Y - BOTTOM_Y) * v;
  if (v < 2) return TOP_Y;
  return TOP_Y + (BOTTOM_Y - TOP_Y) * (v - 2);
}

/** Un huesito que salta de la caja hacia la taquilla y se desvanece. */
function Bone({ trip, index }: { trip: SharedValue<number>; index: number }) {
  const style = useAnimatedStyle(() => {
    // trip: 0–1 subiendo, 1–2 arriba (vacía la caja), 2–3 bajando.
    const k = Math.max(0, Math.min(1, (trip.value - 1 - index * 0.15) / 0.7));
    return {
      opacity: k > 0 && k < 1 ? 1 - k * k : 0,
      transform: [{ translateX: k * (34 + index * 10) }, { translateY: -Math.sin(k * Math.PI) * (14 + index * 4) }, { rotate: `${k * 200}deg` }],
    };
  });
  return (
    <Animated.View style={[styles.bone, style]}>
      <GameIcon name="fossils" size={12} />
    </Animated.View>
  );
}

/**
 * Montaplatos: sube los huesos limpios del laboratorio a la sala. Es un hueco estrecho con
 * cuerda y polea pegado a la pared izquierda de las dos plantas (se dibuja encima de ellas,
 * sin capturar toques). Cada vez que el laboratorio entrega un lote (crecen los fósiles
 * listos en la superficie), la caja sube llena, deja saltar los huesos hacia la taquilla
 * y baja vacía. Si llega otro lote a medio viaje, no se repite (es solo decorado).
 */
export function Dumbwaiter() {
  const trip = useSharedValue(0);
  const full = getArt('museum/crate-full');
  const empty = getArt('museum/crate-empty');

  useEffect(() => {
    let last = useGameStore.getState().game.mine.surface;
    const unsubscribe = useGameStore.subscribe((s) => {
      const surface = s.game.mine.surface;
      const delivered = surface > last;
      last = surface;
      // Solo si está en reposo (trip 0 o 3).
      if (!delivered || (trip.value > 0 && trip.value < 3)) return;
      trip.value = 0;
      trip.value = withSequence(
        withTiming(1, { duration: UP_MS, easing: Easing.inOut(Easing.quad) }),
        withTiming(2, { duration: HOLD_MS, easing: Easing.linear }),
        withTiming(3, { duration: DOWN_MS, easing: Easing.inOut(Easing.quad) }),
      );
    });
    return () => {
      unsubscribe();
      cancelAnimation(trip);
    };
  }, [trip]);

  const boxStyle = useAnimatedStyle(() => ({ transform: [{ translateY: boxY(trip.value) }] }));
  const ropeStyle = useAnimatedStyle(() => ({ height: Math.max(0, boxY(trip.value) - PULLEY) }));
  const fullStyle = useAnimatedStyle(() => ({ opacity: trip.value > 0 && trip.value < 1.2 ? 1 : 0 }));
  const emptyStyle = useAnimatedStyle(() => ({ opacity: trip.value > 0 && trip.value < 1.2 ? 0 : 1 }));
  const bonesStyle = useAnimatedStyle(() => ({ transform: [{ translateY: TOP_Y }] }));

  return (
    <View pointerEvents="none" style={styles.wrap}>
      {/* Guías del hueco y polea arriba, bajo el tejado. */}
      <View style={[styles.rail, styles.railLeft]} />
      <View style={[styles.rail, styles.railRight]} />
      <View style={styles.pulley} />
      <Animated.View style={[styles.rope, ropeStyle]} />
      <Animated.View style={[styles.box, boxStyle]}>
        {full && empty ? (
          <>
            <Animated.Image source={empty} resizeMode="contain" style={[styles.crate, emptyStyle]} />
            <Animated.Image source={full} resizeMode="contain" style={[styles.crate, fullStyle]} />
          </>
        ) : (
          <View style={styles.codeBox} />
        )}
      </Animated.View>
      <Animated.View style={[styles.bones, bonesStyle]}>
        {[0, 1, 2].map((i) => (
          <Bone key={i} trip={trip} index={i} />
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Sobre la sala y el laboratorio: desde el techo de la sala hasta el suelo del laboratorio.
  wrap: { position: 'absolute', left: 16, top: 0, width: DUMBWAITER_WIDTH, height: FLOOR_HEIGHT * 2, zIndex: 3 },
  rail: { position: 'absolute', top: PULLEY / 2, bottom: BEAM, width: 3, backgroundColor: '#6B4224', borderRadius: 1.5, opacity: 0.85 },
  railLeft: { left: 0 },
  railRight: { right: 0 },
  pulley: {
    position: 'absolute',
    top: 0,
    left: (DUMBWAITER_WIDTH - PULLEY) / 2,
    width: PULLEY,
    height: PULLEY,
    borderRadius: PULLEY / 2,
    backgroundColor: '#8A5A33',
    borderWidth: 2,
    borderColor: '#4A2C12',
  },
  rope: { position: 'absolute', top: PULLEY, left: DUMBWAITER_WIDTH / 2 - 1, width: 2, backgroundColor: '#C8A26B' },
  box: { position: 'absolute', top: 0, left: (DUMBWAITER_WIDTH - BOX) / 2, width: BOX, height: BOX },
  crate: { position: 'absolute', top: 0, left: 0, width: BOX, height: BOX },
  codeBox: { flex: 1, backgroundColor: '#A9774E', borderRadius: 3, borderWidth: 2, borderColor: '#6B4224' },
  bones: { position: 'absolute', top: 0, left: DUMBWAITER_WIDTH / 2, width: 0, height: 0 },
  bone: { position: 'absolute', top: 0, left: 0 },
});
