import { useEffect } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { DINO_BY_ID } from '@/data/dinos';
import type { StationId } from '@/game/types';
import { currentLanguage } from '@/i18n';
import { useGameStore } from '@/store/gameStore';
import { getArt, type ArtKey } from '../art';
import { GameText } from '../GameText';
import { TurboButton } from './ManagerSlot';

const INK = '#4A2C12';

/**
 * Dos formatos del cuadro del manager:
 * - `wall`: colgado de un clavo en una viga (sótanos y laboratorio); se balancea con el Turbo.
 * - `easel`: sobre un tripié, en el suelo de la sala; con el Turbo se tambalea desde las patas.
 * `window` es la ventanita de la foto, en fracciones del arte (se mide al recibirlo).
 */
const VARIANTS = {
  wall: {
    hiring: 'museum/poster-hiring',
    hired: 'museum/poster-hired',
    aspect: 279 / 420,
    window: { left: 0.27, top: 0.395, width: 0.46, height: 0.3 },
    pivot: 'top',
  },
  easel: {
    hiring: 'museum/easel-hiring',
    hired: 'museum/easel-hired',
    aspect: 0.62,
    window: { left: 0.27, top: 0.2, width: 0.46, height: 0.28 },
    pivot: 'bottom',
  },
} as const satisfies Record<string, { hiring: ArtKey; hired: ArtKey; aspect: number; window: object; pivot: string }>;

export type PosterVariant = keyof typeof VARIANTS;

/** Foto tipo carné del manager: su retrato (dinos/<id>) sobre el color de la especie. */
function Photo({ dinoId, size }: { dinoId: string; size: number }) {
  const species = DINO_BY_ID[dinoId];
  const portrait = getArt(`dinos/${dinoId}`);
  return (
    <View style={[styles.photo, { backgroundColor: species?.color ?? '#B9B3A8' }]}>
      {portrait ? (
        <Image source={portrait} resizeMode="cover" style={styles.portrait} />
      ) : (
        <GameText size={size * 0.62} style={{ lineHeight: size * 0.9 }}>
          {species?.emoji ?? '🦖'}
        </GameText>
      )}
    </View>
  );
}

interface Props {
  station: StationId;
  /** Turbo activo: el cuadro se mueve. */
  active: boolean;
  onPick: () => void;
  variant?: PosterVariant;
  /** Alto en pantalla; el ancho sale de la proporción del arte. */
  height: number;
}

/**
 * Cuadro del manager (sótanos, laboratorio y sala). Sin textos, solo imagen:
 * - Sin manager: cartel "HIRING" (o, en español, el cuadro liso: el texto dibujado no se
 *   traduce) con un "+" en la ventanita. Al tocarlo se abre la lista de dinos.
 * - Con manager: el cuadro "HIRED" con su foto tipo busto en la ventanita.
 * El Turbo se activa con la chincheta ⚡ de la esquina; mientras dura, el cuadro se mueve.
 * Arte: museum/poster-* (pared) y museum/easel-* (tripié); si faltan, papel dibujado con código.
 */
export function WantedPoster({ station, active, onPick, variant = 'wall', height }: Props) {
  const v = VARIANTS[variant];
  const width = Math.round(height * v.aspect);
  const dinoId = useGameStore((s) => s.game.managers[station]);
  const hired = getArt(v.hired);
  const hiring = currentLanguage() === 'en' ? getArt(v.hiring) : undefined;
  const art = dinoId ? hired : (hiring ?? hired);
  const swing = useSharedValue(0);

  useEffect(() => {
    if (active) {
      swing.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 450, easing: Easing.inOut(Easing.sin) }),
          withTiming(-1, { duration: 900, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 450, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
      );
    } else {
      cancelAnimation(swing);
      swing.value = withTiming(0, { duration: 300 });
    }
  }, [active, swing]);

  // En la pared gira sobre el clavo, como un péndulo; en el tripié se tambalea un poco menos.
  const maxDeg = variant === 'wall' ? 7 : 4;
  const swingStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${swing.value * maxDeg}deg` }] }));

  const win = {
    left: width * v.window.left,
    top: height * v.window.top,
    width: width * v.window.width,
    height: height * v.window.height,
  };

  return (
    <Animated.View style={[{ width, height, transformOrigin: v.pivot }, swingStyle]}>
      <Pressable accessibilityRole="button" accessibilityLabel={`manager-${station}`} onPress={onPick} style={StyleSheet.absoluteFill}>
        {art ? (
          // Ancho y alto explícitos: en web, absoluteFill sola deja la imagen a su tamaño original.
          <Image source={art} resizeMode="stretch" style={{ position: 'absolute', top: 0, left: 0, width, height }} />
        ) : (
          <CodeFrame variant={variant} />
        )}
        <View style={[styles.window, win]}>
          {dinoId ? (
            <Photo dinoId={dinoId} size={win.height} />
          ) : (
            <GameText size={Math.max(10, win.height * 0.8)} weight="black" color={INK}>
              +
            </GameText>
          )}
        </View>
      </Pressable>
      <View style={[styles.pin, { left: width - 10 }]}>
        <TurboButton station={station} />
      </View>
    </Animated.View>
  );
}

/** Marco provisional mientras no llegue el arte (papel; en el tripié, con sus patas). */
function CodeFrame({ variant }: { variant: PosterVariant }) {
  if (variant === 'wall') return <View style={styles.paper} />;
  return (
    <>
      <View style={[styles.leg, styles.legLeft]} />
      <View style={[styles.leg, styles.legRight]} />
      <View style={[styles.paper, styles.easelPaper]} />
    </>
  );
}

const styles = StyleSheet.create({
  paper: {
    position: 'absolute',
    top: 4,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F1DDB0',
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: '#A9774E',
  },
  easelPaper: { top: 0, bottom: '45%' },
  leg: { position: 'absolute', bottom: 0, width: 3, height: '60%', backgroundColor: '#7A4A24', borderRadius: 2 },
  legLeft: { left: '22%', transform: [{ rotate: '8deg' }] },
  legRight: { right: '22%', transform: [{ rotate: '-8deg' }] },
  window: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  photo: { width: '100%', height: '100%', borderRadius: 2, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  portrait: { width: '100%', height: '100%' },
  pin: { position: 'absolute', top: -2 },
});
