import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { useGameStore } from '@/store/gameStore';

/** Vibración suave al tocar (respeta el ajuste del jugador). */
export function tapFeedback(strong = false) {
  if (Platform.OS === 'web' || !useGameStore.getState().game.settings.haptics) return;
  void Haptics.impactAsync(strong ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light);
}

export function successFeedback() {
  if (Platform.OS === 'web' || !useGameStore.getState().game.settings.haptics) return;
  void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}
