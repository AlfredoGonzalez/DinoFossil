import { useState } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedProps, useAnimatedStyle, type SharedValue } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { GameText } from '../GameText';
import { getSheet, type Sheet } from '../spriteSheets';
import { SpriteSheet } from '../SpriteSheet';
import { colors } from '../theme';
import { useCycle } from './useCycle';

export const WALKER_SIZE = 64;
const SIZE = WALKER_SIZE;
/** Segundos (sin Turbo) que tarda en ir hasta la tierra, y lo mismo en volver. */
const WALK_SECONDS = 4 / 3;
/** El reloj sobre la cabeza solo aparece si el escarbado dura al menos esto. */
const MIN_TIMER_SECONDS = 3;
const RING = 30;
const STROKE = 4;
const RADIUS = (RING - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  running: boolean;
  /** Progreso del ciclo al empezar a animar (para no desfasarse al volver a la pantalla). */
  progress: number;
  /** Con manager el ciclo se repite sin parar. */
  managed: boolean;
  /** Multiplicador de velocidad (Turbo). */
  speed: number;
  /** Duración del ciclo de esta galería, sin Turbo (las profundas tardan más). */
  cycleSeconds: number;
  /** Tiempo restante de escarbado ya formateado (lo calcula la planta con el estado del juego). */
  timerLabel: string;
  /** Posición del recorrido: a la izquierda el montón de tierra, a la derecha la canasta. */
  style?: StyleProp<ViewStyle>;
}

type Phase = 'out' | 'dig' | 'back';

interface PhaseProps {
  p: SharedValue<number>;
  outEnd: number;
  digEnd: number;
}

/** Hoja visible solo durante su fase; se cambia en el hilo de UI con la opacidad. */
function PhaseSheet({ sheet, phase, p, outEnd, digEnd }: PhaseProps & { sheet: Sheet; phase: Phase }) {
  const style = useAnimatedStyle(() => {
    const current: Phase = p.value < outEnd ? 'out' : p.value < digEnd ? 'dig' : 'back';
    return { opacity: current === phase ? 1 : 0 };
  });
  return (
    <Animated.View style={[StyleSheet.absoluteFill, style]}>
      <SpriteSheet sheet={sheet} size={SIZE} />
    </Animated.View>
  );
}

/**
 * Reloj circular junto a la cabeza mientras escarba: el anillo se llena de forma fluida
 * (hilo de UI) y dentro va el tiempo que falta. Solo se ve durante la fase de escarbar.
 */
function DigTimer({ p, outEnd, digEnd, label }: PhaseProps & { label: string }) {
  const visible = useAnimatedStyle(() => ({ opacity: p.value >= outEnd && p.value < digEnd ? 1 : 0 }));
  const ring = useAnimatedProps(() => {
    const done = Math.min(Math.max((p.value - outEnd) / (digEnd - outEnd), 0), 1);
    return { strokeDashoffset: CIRCUMFERENCE * (1 - done) };
  });
  return (
    <Animated.View style={[styles.timer, visible]}>
      <Svg width={RING} height={RING}>
        <Circle cx={RING / 2} cy={RING / 2} r={RADIUS} stroke="rgba(0,0,0,0.35)" strokeWidth={STROKE} fill="rgba(62,42,26,0.85)" />
        <AnimatedCircle
          cx={RING / 2}
          cy={RING / 2}
          r={RADIUS}
          stroke={colors.gold}
          strokeWidth={STROKE}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          animatedProps={ring}
          // Empieza arriba (las 12) y avanza en el sentido del reloj.
          transform={`rotate(-90 ${RING / 2} ${RING / 2})`}
        />
      </Svg>
      <View style={styles.timerText}>
        <GameText size={label.length > 4 ? 7 : 8} color={colors.textLight} weight="black" numberOfLines={1}>
          {label}
        </GameText>
      </View>
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
export function Walker({ running, progress, managed, speed, cycleSeconds, timerLabel, style }: Props) {
  const idle = getSheet('sprites/digger/idle');
  const walk = getSheet('sprites/digger/walk');
  const dig = getSheet('sprites/digger/dig') ?? idle;
  const carry = getSheet('sprites/digger/carry') ?? walk;
  const [track, setTrack] = useState(0);
  const cycleMs = (cycleSeconds * 1000) / speed;
  const p = useCycle(running, progress, managed, cycleMs);
  // Ida y vuelta duran siempre lo mismo; en las galerías profundas solo se alarga el escarbado.
  const walkFrac = Math.min(1 / 3, WALK_SECONDS / cycleSeconds);
  const outEnd = walkFrac;
  const digEnd = 1 - walkFrac;
  const digSeconds = ((digEnd - outEnd) * cycleSeconds) / speed;

  // Posición: 1 = casa (derecha, en la canasta), 0 = montón de tierra (izquierda).
  // Movimiento y volteo en capas separadas: combinarlos en un solo transform desplaza de más en web.
  const moveStyle = useAnimatedStyle(() => {
    const v = p.value;
    const at = v < outEnd ? 1 - v / outEnd : v < digEnd ? 0 : (v - digEnd) / (1 - digEnd);
    return { transform: [{ translateX: Math.min(Math.max(at, 0), 1) * track }] };
  });
  // Los sprites miran a la derecha: hacia la tierra (ida y escarbar) se voltean en espejo.
  const faceStyle = useAnimatedStyle(() => ({ transform: [{ scaleX: p.value < digEnd ? -1 : 1 }] }));

  if (!idle || !walk || !dig || !carry) return null;

  return (
    <View pointerEvents="none" style={[styles.track, style]} onLayout={(e) => setTrack(Math.max(0, e.nativeEvent.layout.width - SIZE))}>
      <Animated.View style={[styles.mover, running ? moveStyle : { transform: [{ translateX: track }] }]}>
        {running ? (
          <Animated.View style={[styles.sprite, faceStyle]}>
            <PhaseSheet sheet={walk} phase="out" p={p} outEnd={outEnd} digEnd={digEnd} />
            <PhaseSheet sheet={dig} phase="dig" p={p} outEnd={outEnd} digEnd={digEnd} />
            <PhaseSheet sheet={carry} phase="back" p={p} outEnd={outEnd} digEnd={digEnd} />
          </Animated.View>
        ) : null}
        {running && digSeconds >= MIN_TIMER_SECONDS ? <DigTimer p={p} outEnd={outEnd} digEnd={digEnd} label={timerLabel} /> : null}
        {running ? null : (
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
  // Arriba a la derecha de la cabeza, como un bocadillo: no tapa los letreros de la pared.
  timer: { position: 'absolute', top: -14, left: SIZE - 18, width: RING, height: RING },
  timerText: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
});
