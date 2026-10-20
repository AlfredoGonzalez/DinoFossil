import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { GameIcon } from './GameIcon';
import type { IconName } from './iconNames';

/** Icono + texto en una fila (sustituye a los "emoji + texto" de los títulos). */
export function IconLabel({ icon, size = 16, children }: { icon: IconName; size?: number; children: ReactNode }) {
  return (
    <View style={styles.row}>
      <GameIcon name={icon} size={size} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', gap: 4 } });
