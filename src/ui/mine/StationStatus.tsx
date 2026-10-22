import { StyleSheet } from 'react-native';
import { ProgressBar } from '../ProgressBar';
import { TapHint } from './TapHint';

/** Pie de la planta: la manita si espera al jugador, o la barra del ciclo en curso. */
export function StationStatus({ idle, progress, color }: { idle: boolean; progress: number; color: string }) {
  // Esperando al jugador: solo la manita (el gesto basta, sin texto).
  if (idle) return <TapHint style={styles.tapHint} />;
  return <ProgressBar value={progress} height={8} color={color} />;
}

const styles = StyleSheet.create({
  tapHint: { alignSelf: 'center' },
});
