import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from './theme';

interface Props {
  value: number;
  color?: string;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

export function ProgressBar({ value, color = colors.green, height = 12, style }: Props) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }, style]}>
      <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color, borderRadius: height / 2 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderWidth: 2,
    borderColor: 'rgba(60,30,5,0.6)',
    overflow: 'hidden',
  },
  fill: { height: '100%' },
});
