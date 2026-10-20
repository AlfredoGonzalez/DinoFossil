import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { MINE_BALANCE } from '@/data/mine';
import { getSheet } from '../spriteSheets';
import { SpriteSheet } from '../SpriteSheet';

const SIZE = 64;

interface Props {
  running: boolean;
  /** Progreso del ciclo al empezar a animar (para no desfasarse al volver a la pantalla). */
  progress: number;
  /** Con manager el ciclo se repite sin parar. */
  managed: boolean;
  /** Multiplicador de velocidad (Turbo). */
  speed: number;
}

/**
 * Excavador con sprites: en espera usa "idle"; durante un ciclo camina hacia la
 * derecha y regresa en espejo (ida y vuelta = un ciclo de excavación), y al
 * llegar vuelve a "idle". Si faltan las hojas devuelve null y se usa el placeholder.
 */
export function Walker({ running, progress, managed, speed }: Props) {
  const idle = getSheet('sprites/digger/idle');
  const walk = getSheet('sprites/digger/walk');
  const [track, setTrack] = useState(0);
  const p = useSharedValue(0);
  const cycleMs = (MINE_BALANCE.shaft.cycleSeconds * 1000) / speed;

  useEffect(() => {
    cancelAnimation(p);
    if (!running) {
      p.value = 0;
      return;
    }
    if (managed) {
      p.value = withRepeat(withTiming(1, { duration: cycleMs, easing: Easing.linear }), -1, false);
    } else {
      p.value = progress;
      p.value = withTiming(1, { duration: cycleMs * (1 - progress), easing: Easing.linear });
    }
    // progress solo se usa para sincronizar al arrancar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, managed, cycleMs, p]);

  // Movimiento y volteo en capas separadas: combinarlos en un solo transform desplaza de más en web.
  const moveStyle = useAnimatedStyle(() => {
    const along = p.value < 0.5 ? p.value * 2 : (1 - p.value) * 2;
    return { transform: [{ translateX: Math.min(along, 1) * track }] };
  });
  const faceStyle = useAnimatedStyle(() => ({ transform: [{ scaleX: p.value < 0.5 ? 1 : -1 }] }));

  if (!idle || !walk) return null;

  return (
    <View style={styles.track} onLayout={(e) => setTrack(Math.max(0, e.nativeEvent.layout.width - SIZE))}>
      <Animated.View style={[styles.mover, moveStyle]}>
        <Animated.View style={faceStyle}>
          <SpriteSheet sheet={running ? walk : idle} size={SIZE} />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

export function hasWalkerSprites(): boolean {
  return !!getSheet('sprites/digger/idle') && !!getSheet('sprites/digger/walk');
}

const styles = StyleSheet.create({
  track: { flex: 1, height: SIZE },
  mover: { position: 'absolute', left: 0, bottom: 0, width: SIZE, height: SIZE },
});
