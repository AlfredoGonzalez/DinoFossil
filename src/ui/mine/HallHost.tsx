import { useEffect, useState } from 'react';
import { Image, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { getArt } from '../art';
import { TapHint } from './TapHint';
import { getSheet } from '../spriteSheets';
import { SpriteSheet } from '../SpriteSheet';

const SIZE = 60;
/** Cuánto sube en el vuelo, en fracciones de su tamaño (hasta rozar el techo de la sala). */
const LIFT = 0.5;
/** Mesita de entradas y recuerdos (museum/ticket-desk, 512 × 308). */
const DESK_W = 84;
const DESK_H = Math.round((DESK_W * 308) / 512);
/** Altura de sus pies sobre el suelo: quedan tapados por el frente de la mesita. */
const FEET = 15;
/** Con manager vuela solo cada tantos ms. */
const AUTO_MS = 10000;
const DUST_W = 50;
const DUST_H = 30;

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

/** Nube de polvo (0–1) al despegar (fotogramas 17–25) y al aterrizar (44–49). */
function dust(t: number): number {
  'worklet';
  const f = t * 49;
  if (f >= 17 && f < 25) return 1 - (f - 17) / 8;
  if (f >= 44) return Math.min(1, (f - 44) / 2) * (1 - Math.max(0, f - 46) / 3);
  return 0;
}

/**
 * Pterodáctilo de la taquilla: detrás de la mesita de entradas y recuerdos, mirando a la
 * izquierda, animando a los visitantes a pasar. En reposo ("idle") hasta que cambia `flights`
 * (cada toque a la sala): despega levantando polvo, vuela, aterriza y vuelve a reposo. Un toque
 * a media función no la reinicia (la venta sí se cobra; eso lo decide la sala). Con manager
 * vuela solo cada 10 s. Con `hint`, la manita sobre su cabeza. Dibuja también la mesita
 * (encima de él) y el polvo (encima de todo). Null si faltan sus hojas.
 */
export function HallHost({ flights, managed, hint, style }: { flights: number; managed: boolean; hint: boolean; style?: StyleProp<ViewStyle> }) {
  const idle = getSheet('sprites/hall/idle');
  const welcome = getSheet('sprites/hall/welcome');
  const dirt = getArt('museum/dirt');
  const desk = getArt('museum/ticket-desk');
  const [flying, setFlying] = useState(false);
  const [seen, setSeen] = useState(flights);
  const t = useSharedValue(0);
  // Primitivos para las dependencias: getSheet devuelve un objeto nuevo en cada render, y la sala
  // se repinta con cada tick del juego; si el efecto dependiera de él, el vuelo se reiniciaría sin fin.
  const canFly = !!welcome;
  const flightMs = welcome ? (welcome.frames / welcome.fps) * 1000 : 0;

  // Toque nuevo (ajuste de estado durante el render, sin efecto): vuela si estaba en reposo.
  if (flights !== seen) {
    setSeen(flights);
    if (!flying && welcome) setFlying(true);
  }

  // Con manager, un vuelo cada 10 s.
  useEffect(() => {
    if (!managed || !canFly) return;
    const id = setInterval(() => setFlying(true), AUTO_MS);
    return () => clearInterval(id);
  }, [managed, canFly]);

  useEffect(() => {
    if (!flying || !flightMs) return;
    t.value = 0;
    t.value = withTiming(1, { duration: flightMs, easing: Easing.linear });
    const id = setTimeout(() => setFlying(false), flightMs);
    return () => {
      clearTimeout(id);
      cancelAnimation(t);
    };
  }, [flying, t, flightMs]);

  const lift = useAnimatedStyle(() => ({ transform: [{ translateY: flying ? -flight(t.value) * LIFT * SIZE : 0 }, { scaleX: -1 }] }));
  const puff = useAnimatedStyle(() => {
    const d = flying ? dust(t.value) : 0;
    return { opacity: d * 0.9, transform: [{ scale: 0.6 + (1 - d) * 0.6 }] };
  });

  const sheet = flying ? welcome : idle;
  if (!idle || !sheet) return null;
  return (
    <View pointerEvents="none" style={[styles.wrap, style]}>
      <Animated.View style={[styles.host, lift]}>
        {/* key: cada vuelo arranca su hoja desde el primer fotograma. */}
        <SpriteSheet key={flying ? 'fly' : 'idle'} sheet={sheet} size={SIZE} once={flying} />
      </Animated.View>
      {desk ? <Image source={desk} resizeMode="contain" style={styles.desk} /> : null}
      {dirt ? <Animated.Image source={dirt} resizeMode="contain" style={[styles.dust, puff]} /> : null}
      {hint ? <TapHint style={styles.hint} /> : null}
    </View>
  );
}

export function hasHallHostSprites(): boolean {
  return !!getSheet('sprites/hall/idle');
}

/** Ancho que ocupa la taquilla (la mesita). */
export const HALL_HOST_WIDTH = DESK_W;

const styles = StyleSheet.create({
  wrap: { width: DESK_W, height: FEET + SIZE },
  // Detrás de la parte ancha de la mesita, un poco a la derecha de su centro.
  host: { position: 'absolute', left: DESK_W - SIZE - 6, bottom: FEET, width: SIZE, height: SIZE },
  desk: { position: 'absolute', left: 0, bottom: 0, width: DESK_W, height: DESK_H },
  // A la altura de la mesita, por delante: el polvo que levanta al despegar y al aterrizar.
  dust: { position: 'absolute', left: DESK_W - SIZE - 6 + (SIZE - DUST_W) / 2, bottom: FEET + 4, width: DUST_W, height: DUST_H, opacity: 0 },
  // Manita sobre su cabeza.
  hint: { position: 'absolute', left: DESK_W - SIZE / 2 - 6 - 14, bottom: FEET + SIZE - 10 },
});
