import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { GameText } from './GameText';
import { colors, radius } from './theme';

interface Props {
  children: ReactNode;
  title?: string;
  style?: StyleProp<ViewStyle>;
  variant?: 'parchment' | 'wood' | 'night';
}

/** Panel de pergamino con borde de madera, como las tarjetas de los mockups. */
export function Panel({ children, title, style, variant = 'parchment' }: Props) {
  const bg = variant === 'parchment' ? colors.parchment : variant === 'wood' ? colors.wood : colors.night;
  return (
    <View style={[styles.outer, style]}>
      <View style={[styles.inner, { backgroundColor: bg }]}>
        {title ? (
          <View style={styles.titleBar}>
            <GameText size={18} weight="black" color={colors.textLight} outline center>
              {title}
            </GameText>
          </View>
        ) : null}
        {children}
      </View>
    </View>
  );
}

export function Banner({ text, color = colors.green }: { text: string; color?: string }) {
  return (
    <View style={[styles.banner, { backgroundColor: color }]}>
      <GameText size={20} weight="black" color={colors.textLight} outline center>
        {text}
      </GameText>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderRadius: radius.lg,
    backgroundColor: colors.woodDark,
    padding: 4,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  inner: { borderRadius: radius.lg - 4, padding: 12, overflow: 'hidden' },
  titleBar: {
    marginHorizontal: -12,
    marginTop: -12,
    marginBottom: 10,
    paddingVertical: 8,
    backgroundColor: colors.wood,
    borderBottomWidth: 3,
    borderBottomColor: colors.woodDark,
  },
  banner: {
    alignSelf: 'center',
    paddingHorizontal: 22,
    paddingVertical: 6,
    borderRadius: radius.md,
    borderWidth: 3,
    borderColor: colors.greenDark,
  },
});
