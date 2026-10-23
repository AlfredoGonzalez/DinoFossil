import { useEffect, useState } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { getSheet } from '../spriteSheets';
import { SpriteSheet } from '../SpriteSheet';

const SIZE = 76;
/** Cuánto sube en el vuelo, en fracciones de su tamaño. */
const LIFT = 0.32;

type Phase = 'idle' | 'welcome' | 'wave';

/**
 * Altura del vuelo según el avance (0–1) de la hoja "welcome": en tierra aleteando, sube,
 * se mantiene en el aire y baja despacio. Sigue los tramos de la hoja (fotogramas 18–26
 * despega, 26–31 en el aire, 31–48 baja); la hoja se entrega con los pies fijos y el
 * juego hace el vuelo.
 */
function flight(t: number): number {
  'worklet';
  const f = t * 49;
  if (f < 18) return 0;
  if (f < 26) return Math.sin(((f - 18) / 8) * (Math.PI / 2));
  if (f < 31) return 1;
  if (f < 48) return Math.cos(((f - 31) / 17) * (Math.PI / 2));
  return 0;
}

/**
 * Pterodáctilo anfitrión de la sala, a la izquierda, por donde entran los visitantes.
 * En reposo ("idle") hasta que empieza una venta (`selling` pasa a true): despega, aletea en
 * el aire y aterriza ("welcome"), saluda ("wave") y vuelve a reposo. Si llega otra venta
 * a media función, la termina antes de repetir. Null si faltan sus hojas.
 */
export function HallHost({ selling, style }: { selling: boolean; style?: StyleProp<ViewStyle> }) {
  const idle = getSheet('sprites/hall/idle');
  const welcome = getSheet('sprites/hall/welcome');
  const wave = getSheet('sprites/hall/wave');
  const [phase, setPhase] = useState<Phase>('idle');
  const [wasSelling, setWasSelling] = useState(selling);
  const t = useSharedValue(0);

  // Al empezar una venta (ajuste de estado durante el render, sin efecto).
  if (selling !== wasSelling) {
    setWasSelling(selling);
    if (selling && phase === 'idle' && welcome) setPhase('welcome');
  }

  useEffect(() => {
    if (phase === 'idle') return;
    const sheet = phase === 'welcome' ? welcome : wave;
    const ms = sheet ? (sheet.frames / sheet.fps) * 1000 : 0;
    if (phase === 'welcome') {
      t.value = 0;
      t.value = withTiming(1, { duration: ms, easing: Easing.linear });
    }
    const id = setTimeout(() => setPhase(phase === 'welcome' && wave ? 'wave' : 'idle'), ms);
    return () => {
      clearTimeout(id);
      cancelAnimation(t);
    };
  }, [phase, t, welcome, wave]);

  const lift = useAnimatedStyle(() => ({
    transform: [{ translateY: phase === 'welcome' ? -flight(t.value) * LIFT * SIZE : 0 }],
  }));

  const sheet = phase === 'welcome' ? welcome : phase === 'wave' ? wave : idle;
  if (!idle || !sheet) return null;
  return (
    <Animated.View pointerEvents="none" style={[styles.host, style, lift]}>
      {/* key: cada fase arranca su hoja desde el primer fotograma. */}
      <SpriteSheet key={phase} sheet={sheet} size={SIZE} once={phase !== 'idle'} />
    </Animated.View>
  );
}

export function hasHallHostSprites(): boolean {
  return !!getSheet('sprites/hall/idle');
}

export const HALL_HOST_SIZE = SIZE;

const styles = StyleSheet.create({
  host: { width: SIZE, height: SIZE },
});
