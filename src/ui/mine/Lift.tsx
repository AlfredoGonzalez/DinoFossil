import { Image, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { elevatorTripSeconds } from '@/game/economy';
import { stationSpeed } from '@/game/simulate';
import { useGameStore } from '@/store/gameStore';
import { getArt } from '../art';
import { GameIcon } from '../GameIcon';
import { colors } from '../theme';
import { FLOOR_HEIGHT, LIFT_WIDTH } from './Floor';
import { useCycle } from './useCycle';

const CRATE = 34;
/** Posición de la caja en reposo (arriba, en el laboratorio). */
const CRATE_TOP = 30;
const PULLEY = 20;
/** La cuerda sale del centro de la polea. */
const ROPE_TOP = 4 + PULLEY / 2;
const ROPE = 4;

/**
 * Montacargas: columna a la derecha del laboratorio y los sótanos. La caja cuelga de una
 * cuerda que pasa por una polea en lo alto; baja vacía durante la primera mitad del ciclo del
 * laboratorio y sube llena en la segunda. En reposo espera arriba, vacía.
 * Arte: museum/crate-empty y museum/crate-full (si faltan, museum/crate o la caja de código),
 * museum/pulley (gira con la cuerda) y museum/rope (tramo vertical que se repite).
 */
export function Lift() {
  const basements = useGameStore((s) => s.game.mine.shafts.length);
  const elevator = useGameStore((s) => s.game.mine.elevator);
  const managed = useGameStore((s) => !!s.game.managers.elevator);
  const speed = useGameStore((s) => stationSpeed(s.game, 'elevator', Date.now()));
  const height = (basements + 1) * FLOOR_HEIGHT;
  // Animada en el hilo de UI (el estado del juego solo avanza cada 100 ms y se veía a saltos).
  const p = useCycle(elevator.running, elevator.progress, managed, (elevatorTripSeconds(basements) * 1000) / speed);
  const travel = height - FLOOR_HEIGHT;

  const moveStyle = useAnimatedStyle(() => {
    const depth = p.value < 0.5 ? p.value * 2 : (1 - p.value) * 2;
    return { transform: [{ translateY: depth * travel }] };
  });
  // Llena solo mientras sube; bajando y en reposo, vacía (los huesos ya se descargaron).
  const emptyStyle = useAnimatedStyle(() => ({ opacity: p.value < 0.5 ? 1 : 0 }));
  const fullStyle = useAnimatedStyle(() => ({ opacity: p.value < 0.5 ? 0 : 1 }));
  // La cuerda llega desde la polea hasta el asa de la caja, y la polea gira lo que corre la cuerda.
  const ropeStyle = useAnimatedStyle(() => {
    const depth = p.value < 0.5 ? p.value * 2 : (1 - p.value) * 2;
    return { height: CRATE_TOP - ROPE_TOP + 4 + depth * travel };
  });
  const pulleyStyle = useAnimatedStyle(() => {
    const depth = p.value < 0.5 ? p.value * 2 : (1 - p.value) * 2;
    return { transform: [{ rotate: `${((depth * travel) / (PULLEY / 2)) * (180 / Math.PI)}deg` }] };
  });
  const pulleyArt = getArt('museum/pulley');
  const ropeArt = getArt('museum/rope');

  const empty = getArt('museum/crate-empty') ?? getArt('museum/crate');
  const full = getArt('museum/crate-full') ?? getArt('museum/crate');
  return (
    <View pointerEvents="none" style={[styles.column, { height }]}>
      <Animated.View style={[styles.rope, ropeStyle]}>
        {ropeArt ? <Image source={ropeArt} resizeMode="repeat" style={styles.ropeArt} /> : <View style={styles.ropeTwist} />}
      </Animated.View>
      <Animated.View style={[styles.pulley, pulleyStyle]}>
        {pulleyArt ? (
          <Image source={pulleyArt} resizeMode="contain" style={styles.pulleyArt} />
        ) : (
          <>
            <View style={styles.spoke} />
            <View style={[styles.spoke, styles.spokeCross]} />
          </>
        )}
      </Animated.View>
      <Animated.View style={[styles.carrier, moveStyle]}>
        {empty && full ? (
          <>
            <Animated.Image source={empty} style={[styles.crateArt, emptyStyle]} resizeMode="contain" />
            <Animated.Image source={full} style={[styles.crateArt, fullStyle]} resizeMode="contain" />
          </>
        ) : (
          <View style={styles.crate}>
            <GameIcon name="fossils" size={22} />
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    position: 'absolute',
    top: 0,
    right: 16,
    width: LIFT_WIDTH,
    backgroundColor: 'rgba(40,22,8,0.35)',
    borderLeftWidth: 3,
    borderLeftColor: colors.woodDark,
    alignItems: 'center',
  },
  // Cuerda centrada en la columna: trenzado de código mientras no haya arte.
  rope: { position: 'absolute', top: ROPE_TOP, left: (LIFT_WIDTH - 3 - ROPE) / 2, width: ROPE, overflow: 'hidden' },
  ropeArt: { width: ROPE, height: 2000 },
  ropeTwist: { flex: 1, backgroundColor: '#C8A26B', borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#8A6436', borderStyle: 'dashed' },
  pulley: {
    position: 'absolute',
    top: 4,
    width: PULLEY,
    height: PULLEY,
    borderRadius: PULLEY / 2,
    backgroundColor: '#8A6436',
    borderWidth: 3,
    borderColor: '#4A3020',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulleyArt: { position: 'absolute', width: PULLEY + 8, height: PULLEY + 8 },
  spoke: { position: 'absolute', width: PULLEY - 6, height: 2, backgroundColor: '#4A3020' },
  spokeCross: { transform: [{ rotate: '90deg' }] },
  crate: {
    position: 'absolute',
    width: CRATE,
    height: CRATE,
    borderRadius: 6,
    backgroundColor: '#D9A066',
    borderWidth: 2,
    borderColor: '#7A4A24',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carrier: { position: 'absolute', top: CRATE_TOP, width: CRATE + 6, height: CRATE + 6, alignItems: 'center', justifyContent: 'center' },
  crateArt: { position: 'absolute', width: CRATE + 6, height: CRATE + 6 },
});
