import { Image, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { getArt } from '../art';
import { GameIcon } from '../GameIcon';

/** Proporción del arte entregado (640 × 478); casi del alto de la planta. */
export const MOUND_HEIGHT = 100;
export const MOUND_WIDTH = Math.round((MOUND_HEIGHT * 640) / 478);
/** Parte del montón que queda fuera de cuadro por la izquierda: se ve que es grande. */
export const MOUND_CUT = Math.round(MOUND_WIDTH * 0.25);

/** Montón de tierra donde escarba el dino de cada sótano (arte: museum/dirt-mound, cara escarbada a la derecha). */
export function DirtMound({ style }: { style?: StyleProp<ViewStyle> }) {
  const art = getArt('museum/dirt-mound');
  return (
    <View pointerEvents="none" style={[styles.box, style]}>
      {art ? (
        <Image source={art} resizeMode="contain" style={styles.box} />
      ) : (
        // Placeholder: loma de tierra con un hueso asomando del lado del dino.
        <View style={styles.mound}>
          <View style={[styles.pebble, { left: 14, top: 22 }]} />
          <View style={[styles.pebble, { left: 34, top: 36, width: 8, height: 6 }]} />
          <GameIcon name="fossils" size={18} style={styles.bone} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { width: MOUND_WIDTH, height: MOUND_HEIGHT },
  mound: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: MOUND_HEIGHT - 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 60,
    backgroundColor: '#6B4423',
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: '#3B2414',
  },
  pebble: { position: 'absolute', width: 10, height: 8, borderRadius: 5, backgroundColor: '#8F6A4A' },
  bone: { position: 'absolute', right: 10, top: 14, transform: [{ rotate: '-30deg' }] },
});
