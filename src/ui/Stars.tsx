import { StyleSheet, View } from 'react-native';
import { GameIcon } from './GameIcon';

/** Fila de estrellas del mundo (llenas hasta `filled`). */
export function Stars({ filled, total = 3, size = 16 }: { filled: number; total?: number; size?: number }) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }, (_, i) => (
        <GameIcon key={i} name={i < filled ? 'star' : 'star-empty'} size={size} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({ row: { flexDirection: 'row', justifyContent: 'center', gap: 2 } });
