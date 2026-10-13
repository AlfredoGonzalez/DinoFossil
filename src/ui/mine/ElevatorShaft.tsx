import { StyleSheet, View } from 'react-native';
import { useGameStore } from '@/store/gameStore';
import { GameText } from '../GameText';
import { colors } from '../theme';
import { SHAFT_ROW_HEIGHT } from './ShaftRow';

const CAR = 40;

/** Columna del ascensor a la derecha de las galerías; el vagón baja y sube según el progreso del viaje. */
export function ElevatorShaft() {
  const count = useGameStore((s) => s.game.mine.shafts.length);
  const progress = useGameStore((s) => s.game.mine.elevator.progress);
  const height = count * SHAFT_ROW_HEIGHT;
  const depth = progress < 0.5 ? progress * 2 : (1 - progress) * 2;
  const top = depth * (height - CAR - 10) + 4;
  return (
    <View pointerEvents="none" style={[styles.column, { height }]}>
      <View style={styles.rope} />
      <View style={[styles.car, { top }]}>
        <GameText size={20}>🛒</GameText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    position: 'absolute',
    right: 4,
    top: 0,
    width: 44,
    backgroundColor: 'rgba(20,10,0,0.45)',
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderColor: colors.woodDark,
    alignItems: 'center',
  },
  rope: { position: 'absolute', top: 0, bottom: 0, width: 3, backgroundColor: '#C8A26B' },
  car: {
    position: 'absolute',
    width: CAR - 4,
    height: CAR,
    borderRadius: 8,
    backgroundColor: colors.gold,
    borderWidth: 2,
    borderColor: colors.goldDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
