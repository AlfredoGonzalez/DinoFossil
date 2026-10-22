import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming, type SharedValue } from 'react-native-reanimated';
import { getArt } from '../art';
import { getSheet, type Sheet } from '../spriteSheets';
import { SpriteSheet } from '../SpriteSheet';
import { PULLEY_FROM_SCENE } from './Lift';
import { useCycle } from './useCycle';

const SIZE = 64;
/** Cuánto camina hacia atrás mientras tira de la cuerda. */
const PULL_DISTANCE = 96;
/** Dónde agarra la cuerda, en fracciones del fotograma (las garras, al frente). */
const HANDS = { x: 0.8, y: 0.52 };
const ROPE = 3;
const DUST_W = 42;
const DUST_H = 25;
const DUST_MS = 420;

interface Props {
  running: boolean;
  progress: number;
  managed: boolean;
  /** Duración del viaje del montacargas (ya con Turbo), igual que en Lift. */
  cycleMs: number;
  /** Altura de la escena del laboratorio (para saber dónde queda la polea). */
  sceneHeight: number;
}

type Phase = 'pull' | 'back';

function PhaseSheet({ sheet, phase, p }: { sheet: Sheet; phase: Phase; p: SharedValue<number> }) {
  const style = useAnimatedStyle(() => ({ opacity: (p.value < 0.5 ? 'pull' : 'back') === phase ? 1 : 0 }));
  return (
    <Animated.View style={[StyleSheet.absoluteFill, style]}>
      <SpriteSheet sheet={sheet} size={SIZE} />
    </Animated.View>
  );
}

/**
 * Laboratorista: sube la caja del montacargas tirando de una cuerda que pasa por la polea.
 * En reposo ("idle") espera a la derecha, junto al montacargas, mirando hacia él. En cada
 * viaje: tira ("pull") caminando hacia atrás, a la izquierda, mientras la caja sube llena
 * (y levanta nubecitas de tierra con los pies, que se desvanecen); luego vuelve a su sitio
 * ("walk") mientras la caja baja vacía. La cuerda va de sus garras a la polea (código).
 * Devuelve null si faltan sus sprites (la planta usa el placeholder).
 */
export function LabWorker({ running, progress, managed, cycleMs, sceneHeight }: Props) {
  const idle = getSheet('sprites/lab/idle');
  const pull = getSheet('sprites/lab/pull');
  const walk = getSheet('sprites/lab/walk') ?? idle;
  const dust = getArt('museum/dirt');
  const [width, setWidth] = useState(0);
  const p = useCycle(running, progress, managed, cycleMs);
  const puff = useSharedValue(0);

  useEffect(() => {
    if (!running) {
      cancelAnimation(puff);
      puff.value = 0;
      return;
    }
    puff.value = 0;
    puff.value = withRepeat(withTiming(1, { duration: DUST_MS, easing: Easing.out(Easing.quad) }), -1, false);
    return () => cancelAnimation(puff);
  }, [running, puff]);

  // 0 = en su sitio (derecha); 1 = al final del tirón (izquierda).
  const offset = useAnimatedStyle(() => {
    const v = p.value;
    const away = v < 0.5 ? v * 2 : 2 - v * 2;
    return { transform: [{ translateX: -away * PULL_DISTANCE }] };
  });

  // Cuerda de las garras a la polea: un tramo recto que se estira y gira con él.
  const top = sceneHeight - 2 - SIZE;
  const ropeStyle = useAnimatedStyle(() => {
    const v = p.value;
    const away = v < 0.5 ? v * 2 : 2 - v * 2;
    const handX = width - SIZE + SIZE * HANDS.x - away * PULL_DISTANCE;
    const handY = SIZE * HANDS.y;
    const dx = width + PULLEY_FROM_SCENE.right - handX;
    const dy = PULLEY_FROM_SCENE.top - top - handY;
    return {
      left: handX,
      top: handY - ROPE / 2,
      width: Math.hypot(dx, dy),
      transform: [{ rotate: `${Math.atan2(dy, dx)}rad` }],
    };
  });

  // Nubecita de tierra: crece, se aleja hacia la derecha (por donde arrastra los pies) y se desvanece.
  const dustStyle = useAnimatedStyle(() => ({
    opacity: p.value > 0 && p.value < 0.5 ? (1 - puff.value) * 0.85 : 0,
    transform: [{ translateX: puff.value * 10 }, { translateY: -puff.value * 4 }, { scale: 0.55 + puff.value * 0.6 }],
  }));

  if (!idle || !pull || !walk) return null;

  return (
    <View pointerEvents="none" style={styles.track} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {width > 0 ? <Animated.View style={[styles.rope, ropeStyle]} /> : null}
      <Animated.View style={[styles.mover, offset]}>
        {dust ? <Animated.Image source={dust} resizeMode="contain" style={[styles.dust, dustStyle]} /> : null}
        {running ? (
          <View style={styles.sprite}>
            <PhaseSheet sheet={pull} phase="pull" p={p} />
            <PhaseSheet sheet={walk} phase="back" p={p} />
          </View>
        ) : (
          <SpriteSheet sheet={idle} size={SIZE} />
        )}
      </Animated.View>
    </View>
  );
}

export function hasLabWorkerSprites(): boolean {
  return !!getSheet('sprites/lab/idle') && !!getSheet('sprites/lab/pull');
}

/** Ancho que ocupa en la planta: su sitio más lo que retrocede al tirar. */
export const LAB_WORKER_WIDTH = SIZE + PULL_DISTANCE;

const styles = StyleSheet.create({
  track: { width: LAB_WORKER_WIDTH, height: SIZE },
  mover: { position: 'absolute', right: 0, bottom: 0, width: SIZE, height: SIZE },
  sprite: { width: SIZE, height: SIZE },
  // Gira alrededor de su punta izquierda (las garras).
  rope: {
    position: 'absolute',
    height: ROPE,
    backgroundColor: '#C8A26B',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#8A6436',
    borderStyle: 'dashed',
    borderRadius: 2,
    transformOrigin: 'left',
  },
  dust: { position: 'absolute', left: SIZE * 0.35, bottom: -2, width: DUST_W, height: DUST_H },
});
