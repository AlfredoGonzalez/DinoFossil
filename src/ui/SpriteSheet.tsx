import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import type { Sheet } from './spriteSheets';

interface Props {
  sheet: Sheet;
  /** Lado del fotograma en pantalla (pt). */
  size: number;
  /** Una sola vez y se queda en el último fotograma (por defecto, en bucle). */
  once?: boolean;
}

/**
 * Reproduce una hoja de sprites en bucle (o una vez, con `once`). El fotograma se elige desplazando la
 * hoja completa dentro de una ventana del tamaño de un fotograma, en el hilo de UI.
 */
export function SpriteSheet({ sheet, size, once = false }: Props) {
  const { cols, rows, frames, fps, source } = sheet;
  const frame = useSharedValue(0);

  useEffect(() => {
    frame.value = 0;
    const play = withTiming(frames, { duration: (frames / fps) * 1000, easing: Easing.linear });
    frame.value = once ? play : withRepeat(play, -1, false);
    return () => cancelAnimation(frame);
  }, [frame, frames, fps, once]);

  const style = useAnimatedStyle(() => {
    const f = Math.min(frames - 1, Math.floor(frame.value));
    return { transform: [{ translateX: -(f % cols) * size }, { translateY: -Math.floor(f / cols) * size }] };
  });

  return (
    <View style={{ width: size, height: size, overflow: 'hidden' }}>
      <Animated.Image source={source} style={[{ width: size * cols, height: size * rows }, style]} />
    </View>
  );
}
