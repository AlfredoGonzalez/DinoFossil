import { useEffect, useState } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming, type SharedValue } from 'react-native-reanimated';
import { MINE_BALANCE } from '@/data/mine';
import { getSheet, type Sheet } from '../spriteSheets';
import { SpriteSheet } from '../SpriteSheet';

export const WALKER_SIZE = 64;
const SIZE = WALKER_SIZE;
/** Fracciones del ciclo: ir a la tierra, escarbar y volver (cada una un tercio). */
const TO_TUNNEL = 1 / 3;
const DIGGING = 2 / 3;

interface Props {
  running: boolean;
  /** Progreso del ciclo al empezar a animar (para no desfasarse al volver a la pantalla). */
  progress: number;
  /** Con manager el ciclo se repite sin parar. */
  managed: boolean;
  /** Multiplicador de velocidad (Turbo). */
  speed: number;
  /** Posición del recorrido: a la izquierda el montón de tierra, a la derecha la canasta. */
  style?: StyleProp<ViewStyle>;
}

type Phase = 'out' | 'dig' | 'back';

/** Hoja visible solo durante su fase; se cambia en el hilo de UI con la opacidad. */
function PhaseSheet({ sheet, phase, p }: { sheet: Sheet; phase: Phase; p: SharedValue<number> }) {
  const style = useAnimatedStyle(() => {
    const current: Phase = p.value < TO_TUNNEL ? 'out' : p.value < DIGGING ? 'dig' : 'back';
    return { opacity: current === phase ? 1 : 0 };
  });
  return (
    <Animated.View style={[StyleSheet.absoluteFill, style]}>
      <SpriteSheet sheet={sheet} size={SIZE} />
    </Animated.View>
  );
}

/**
 * Excavador con sprites. En reposo ("idle") espera delante de la canasta, a la derecha,
 * mirando hacia la tierra. En cada ciclo de excavación: camina a la izquierda hasta el
 * montón de tierra, escarba ("dig") y regresa cargando ("carry", o "walk" mientras no
 * exista); al llegar suelta los huesos y vuelve a reposo. Si faltan idle o walk devuelve
 * null y se usa el placeholder.
 */
export function Walker({ running, progress, managed, speed, style }: Props) {
  const idle = getSheet('sprites/digger/idle');
  const walk = getSheet('sprites/digger/walk');
  const dig = getSheet('sprites/digger/dig') ?? idle;
  const carry = getSheet('sprites/digger/carry') ?? walk;
  const [track, setTrack] = useState(0);
  const p = useSharedValue(0);
  const cycleMs = (MINE_BALANCE.shaft.cycleSeconds * 1000) / speed;

  useEffect(() => {
    cancelAnimation(p);
    if (!running) {
      p.value = 0;
      return;
    }
    // Siempre se arranca desde el progreso real del motor: al contratar un manager o activar
    // Turbo a mitad de camino, el dino termina el ciclo en curso en vez de reiniciarlo.
    const start = Math.min(Math.max(progress, 0), 1);
    const rest = withTiming(1, { duration: cycleMs * (1 - start), easing: Easing.linear });
    p.value = start;
    p.value = managed
      ? // Con manager: acaba este ciclo y luego repite ciclos completos desde 0. (Un withRepeat
        // directo repetiría desde el punto de partida y el dino quedaría atrapado a medio ciclo.)
        withSequence(
          rest,
          withRepeat(withSequence(withTiming(0, { duration: 0 }), withTiming(1, { duration: cycleMs, easing: Easing.linear })), -1, false),
        )
      : rest;
    // progress solo se usa para sincronizar al arrancar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, managed, cycleMs, p]);

  // Posición: 1 = casa (derecha, en la canasta), 0 = montón de tierra (izquierda).
  // Movimiento y volteo en capas separadas: combinarlos en un solo transform desplaza de más en web.
  const moveStyle = useAnimatedStyle(() => {
    const v = p.value;
    const at = v < TO_TUNNEL ? 1 - v / TO_TUNNEL : v < DIGGING ? 0 : (v - DIGGING) / (1 - DIGGING);
    return { transform: [{ translateX: Math.min(Math.max(at, 0), 1) * track }] };
  });
  // Los sprites miran a la derecha: hacia la tierra (ida y escarbar) se voltean en espejo.
  const faceStyle = useAnimatedStyle(() => ({ transform: [{ scaleX: p.value < DIGGING ? -1 : 1 }] }));

  if (!idle || !walk || !dig || !carry) return null;

  return (
    <View pointerEvents="none" style={[styles.track, style]} onLayout={(e) => setTrack(Math.max(0, e.nativeEvent.layout.width - SIZE))}>
      <Animated.View style={[styles.mover, running ? moveStyle : { transform: [{ translateX: track }] }]}>
        {running ? (
          <Animated.View style={[styles.sprite, faceStyle]}>
            <PhaseSheet sheet={walk} phase="out" p={p} />
            <PhaseSheet sheet={dig} phase="dig" p={p} />
            <PhaseSheet sheet={carry} phase="back" p={p} />
          </Animated.View>
        ) : (
          // En reposo también mira hacia la tierra, listo para salir.
          <View style={styles.flipped}>
            <SpriteSheet sheet={idle} size={SIZE} />
          </View>
        )}
      </Animated.View>
    </View>
  );
}

export function hasWalkerSprites(): boolean {
  return !!getSheet('sprites/digger/idle') && !!getSheet('sprites/digger/walk');
}

const styles = StyleSheet.create({
  track: { height: SIZE },
  mover: { position: 'absolute', left: 0, bottom: 0, width: SIZE, height: SIZE },
  sprite: { width: SIZE, height: SIZE },
  flipped: { width: SIZE, height: SIZE, transform: [{ scaleX: -1 }] },
});
