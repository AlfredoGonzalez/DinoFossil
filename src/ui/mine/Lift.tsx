import { StyleSheet, View } from 'react-native';
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

/**
 * Montacargas: columna a la derecha del laboratorio y los sótanos. La caja baja vacía
 * durante la primera mitad del ciclo del laboratorio y sube llena en la segunda
 * (arte: museum/crate-empty y museum/crate-full; si faltan, museum/crate o la caja de código).
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
  // Vacía mientras baja, llena mientras sube (y en reposo, arriba, la última que llegó).
  const emptyStyle = useAnimatedStyle(() => ({ opacity: p.value > 0 && p.value < 0.5 ? 1 : 0 }));
  const fullStyle = useAnimatedStyle(() => ({ opacity: p.value > 0 && p.value < 0.5 ? 0 : 1 }));

  const empty = getArt('museum/crate-empty') ?? getArt('museum/crate');
  const full = getArt('museum/crate-full') ?? getArt('museum/crate');
  return (
    <View pointerEvents="none" style={[styles.column, { height }]}>
      <View style={styles.rail} />
      <View style={[styles.rail, { right: 8, left: undefined }]} />
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
  rail: { position: 'absolute', top: 0, bottom: 0, left: 8, width: 3, backgroundColor: '#C8A26B' },
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
  carrier: { position: 'absolute', top: 30, width: CRATE + 6, height: CRATE + 6, alignItems: 'center', justifyContent: 'center' },
  crateArt: { position: 'absolute', width: CRATE + 6, height: CRATE + 6 },
});
