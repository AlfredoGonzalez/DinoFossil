import { Image, StyleSheet, View } from 'react-native';
import { useGameStore } from '@/store/gameStore';
import { getArt } from '../art';
import { GameIcon } from '../GameIcon';
import { colors } from '../theme';
import { FLOOR_HEIGHT, LIFT_WIDTH } from './Floor';

const CRATE = 34;

/**
 * Montacargas: columna a la derecha del laboratorio y los sótanos. La caja baja vacía
 * durante la primera mitad del ciclo del laboratorio y sube llena en la segunda
 * (arte: museum/crate-empty y museum/crate-full; si faltan, museum/crate o la caja de código).
 */
export function Lift() {
  const basements = useGameStore((s) => s.game.mine.shafts.length);
  const progress = useGameStore((s) => s.game.mine.elevator.progress);
  const height = (basements + 1) * FLOOR_HEIGHT;
  const depth = progress < 0.5 ? progress * 2 : (1 - progress) * 2;
  const top = 30 + depth * (height - FLOOR_HEIGHT);
  const goingDown = progress < 0.5;
  const art = getArt(goingDown ? 'museum/crate-empty' : 'museum/crate-full') ?? getArt('museum/crate');
  return (
    <View pointerEvents="none" style={[styles.column, { height }]}>
      <View style={styles.rail} />
      <View style={[styles.rail, { right: 8, left: undefined }]} />
      {art ? (
        <Image source={art} style={[styles.crateArt, { top }]} resizeMode="contain" />
      ) : (
        <View style={[styles.crate, { top }]}>
          <GameIcon name="fossils" size={22} />
        </View>
      )}
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
  crateArt: { position: 'absolute', width: CRATE + 6, height: CRATE + 6 },
});
