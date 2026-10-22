import { useEffect } from 'react';
import { cancelAnimation, Easing, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

/**
 * Progreso (0 → 1) de un ciclo de estación, animado en el hilo de UI para que se vea fluido:
 * el estado del juego solo avanza cada 100 ms. Arranca siempre desde el progreso real del
 * motor, así que al contratar un manager o activar Turbo a mitad de ciclo se termina el ciclo
 * en curso en vez de reiniciarlo. Sin `running` vuelve a 0.
 */
export function useCycle(running: boolean, progress: number, managed: boolean, cycleMs: number) {
  const p = useSharedValue(0);

  useEffect(() => {
    cancelAnimation(p);
    if (!running) {
      p.value = 0;
      return;
    }
    const start = Math.min(Math.max(progress, 0), 1);
    const rest = withTiming(1, { duration: cycleMs * (1 - start), easing: Easing.linear });
    p.value = start;
    p.value = managed
      ? // Con manager: acaba este ciclo y luego repite ciclos completos desde 0. (Un withRepeat
        // directo repetiría desde el punto de partida y se quedaría atrapado a medio ciclo.)
        withSequence(
          rest,
          withRepeat(withSequence(withTiming(0, { duration: 0 }), withTiming(1, { duration: cycleMs, easing: Easing.linear })), -1, false),
        )
      : rest;
    // progress solo se usa para sincronizar al arrancar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, managed, cycleMs, p]);

  return p;
}
