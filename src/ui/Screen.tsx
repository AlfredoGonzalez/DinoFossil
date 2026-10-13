import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MAX_WIDTH } from './theme';

const BACKGROUNDS = {
  jungle: ['#9FE0F7', '#8ED07A', '#4E9A3F'],
  sky: ['#7FD0F5', '#B6E7F9', '#8ED07A'],
  cave: ['#5E3B22', '#3E2614', '#2A190D'],
  night: ['#2B3A67', '#3E4E85', '#1E2A4A'],
  sunset: ['#FFCF7A', '#FFA65C', '#B9643A'],
} as const;

export type Background = keyof typeof BACKGROUNDS;

interface Props {
  children: ReactNode;
  background?: Background;
  edges?: ('top' | 'bottom')[];
}

/** Contenedor de pantalla: fondo degradado, safe area y ancho máximo en tablets/web. */
export function Screen({ children, background = 'jungle', edges = ['top', 'bottom'] }: Props) {
  return (
    <LinearGradient colors={BACKGROUNDS[background]} style={styles.fill}>
      <SafeAreaView edges={edges} style={styles.fill}>
        <View style={styles.column}>{children}</View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  column: { flex: 1, width: '100%', maxWidth: MAX_WIDTH, alignSelf: 'center' },
});
