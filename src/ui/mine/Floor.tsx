import type { ReactNode } from 'react';
import { Image, StyleSheet, View, type ImageSourcePropType } from 'react-native';
import { colors } from '../theme';

export const FLOOR_HEIGHT = 124;
/** Ancho reservado a la derecha para el montacargas (laboratorio y sótanos). */
export const LIFT_WIDTH = 46;

interface Props {
  children: ReactNode;
  /** Arte del interior de la planta; sin él se usa `color` (placeholder). */
  art?: ImageSourcePropType;
  color: string;
  /** Color del zócalo/suelo de la planta. */
  floorColor: string;
  withLift?: boolean;
}

/** Una planta de la Casa-Museo: interior (arte o color), suelo de madera y contenido encima. */
export function Floor({ children, art, color, floorColor, withLift }: Props) {
  return (
    <View style={[styles.floor, { backgroundColor: color }]}>
      {art ? <Image source={art} resizeMode="cover" style={styles.art} /> : null}
      <View style={[styles.content, withLift && { paddingRight: LIFT_WIDTH + 6 }]}>{children}</View>
      <View style={[styles.beam, { backgroundColor: floorColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  floor: {
    height: FLOOR_HEIGHT,
    marginHorizontal: 10,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderColor: colors.woodDark,
    overflow: 'hidden',
  },
  art: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
  content: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 6 },
  beam: { height: 9, borderTopWidth: 2, borderTopColor: 'rgba(0,0,0,0.25)' },
});
