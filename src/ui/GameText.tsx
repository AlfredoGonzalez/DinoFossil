import { StyleSheet, Text, type TextProps } from 'react-native';
import { colors, fonts } from './theme';

interface Props extends TextProps {
  size?: number;
  color?: string;
  weight?: 'regular' | 'bold' | 'black';
  /** Contorno oscuro para títulos sobre fondos de color (estilo cartoon). */
  outline?: boolean;
  center?: boolean;
}

export function GameText({ size = 16, color = colors.text, weight = 'bold', outline, center, style, ...rest }: Props) {
  return (
    <Text
      {...rest}
      style={[
        { fontFamily: fonts[weight], fontSize: size, color },
        outline && styles.outline,
        center && styles.center,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  outline: {
    textShadowColor: 'rgba(60, 30, 5, 0.85)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
  center: { textAlign: 'center' },
});
