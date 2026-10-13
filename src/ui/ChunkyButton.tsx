import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { tapFeedback } from '@/services/feedback';
import { GameText } from './GameText';
import { colors, radius } from './theme';

const VARIANTS = {
  green: [colors.green, colors.greenDark],
  blue: [colors.blue, colors.blueDark],
  orange: [colors.orange, colors.orangeDark],
  purple: [colors.purple, colors.purpleDark],
  wood: [colors.parchmentDark, colors.woodDark],
  red: [colors.red, colors.redDark],
  gold: [colors.gold, colors.goldDark],
  grey: [colors.grey, colors.greyDark],
} as const;

export type ButtonVariant = keyof typeof VARIANTS;

interface Props {
  label?: string;
  sublabel?: string;
  icon?: ReactNode;
  children?: ReactNode;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/** Botón "3D" con borde inferior más oscuro, como en los mockups. */
export function ChunkyButton({ label, sublabel, icon, children, onPress, variant = 'green', disabled, size = 'md', style, testID }: Props) {
  const [face, edge] = VARIANTS[disabled ? 'grey' : variant];
  const textColor = variant === 'wood' && !disabled ? colors.text : colors.textLight;
  const pad = size === 'lg' ? 16 : size === 'md' ? 10 : 6;
  const font = size === 'lg' ? 26 : size === 'md' ? 17 : 14;
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={() => {
        tapFeedback();
        onPress?.();
      }}
      style={style}
    >
      {({ pressed }) => (
        <View style={[styles.edge, { backgroundColor: edge, paddingBottom: pressed ? 2 : 5, marginTop: pressed ? 3 : 0 }]}>
          <View style={[styles.face, { backgroundColor: face, paddingVertical: pad, borderColor: edge }]}>
            <View style={styles.highlight} />
            {children ?? (
              <View style={styles.row}>
                {icon}
                {label ? (
                  <GameText size={font} color={textColor} weight="black" outline={textColor === colors.textLight} center>
                    {label}
                  </GameText>
                ) : null}
              </View>
            )}
            {sublabel ? (
              <GameText size={font * 0.62} color={textColor} center outline={textColor === colors.textLight}>
                {sublabel}
              </GameText>
            ) : null}
          </View>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  edge: { borderRadius: radius.md },
  face: {
    borderRadius: radius.md,
    borderWidth: 2,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  highlight: {
    position: 'absolute',
    top: 3,
    left: 8,
    right: 8,
    height: '38%',
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
