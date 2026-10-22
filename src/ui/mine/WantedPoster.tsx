import { useEffect } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { ABILITY, DINO_BY_ID } from '@/data/dinos';
import type { StationId } from '@/game/types';
import { currentLanguage, dinoName, useTranslation } from '@/i18n';
import { useGameStore } from '@/store/gameStore';
import { getArt } from '../art';
import { GameIcon } from '../GameIcon';
import { GameText } from '../GameText';
import { TurboButton } from './ManagerSlot';

/** Proporción del arte entregado (279 × 420). */
export const POSTER_HEIGHT = 84;
export const POSTER_WIDTH = Math.round((POSTER_HEIGHT * 279) / 420);
/** Ventanita de la foto en el arte: 27 %–73 % del ancho y 39.5 %–69.5 % del alto. */
const WINDOW = { left: POSTER_WIDTH * 0.27, top: POSTER_HEIGHT * 0.395, width: POSTER_WIDTH * 0.46, height: POSTER_HEIGHT * 0.3 };
const INK = '#4A2C12';

/** Foto tipo carné del manager: su retrato (dinos/<id>) sobre el color de la especie. */
function Photo({ dinoId }: { dinoId: string }) {
  const species = DINO_BY_ID[dinoId];
  const portrait = getArt(`dinos/${dinoId}`);
  return (
    <View style={[styles.photo, { backgroundColor: species?.color ?? '#B9B3A8' }]}>
      {portrait ? (
        <Image source={portrait} resizeMode="cover" style={styles.portrait} />
      ) : (
        <GameText size={WINDOW.height * 0.62} style={{ lineHeight: WINDOW.height * 0.9 }}>
          {species?.emoji ?? '🦖'}
        </GameText>
      )}
    </View>
  );
}

/**
 * Cuadro del manager colgado de un clavo (sótanos, laboratorio y sala).
 * - Sin manager: cartel "Se busca" con un "+" en la ventanita; al tocarlo se abre la lista.
 *   (El arte "HIRING" trae el texto en inglés: en español se usa el cuadro liso + texto.)
 * - Con manager: su foto tipo busto, su nombre y su "recompensa" (el Turbo de su rareza).
 *   El Turbo se activa con la chincheta ⚡ de la esquina; mientras dura, el cuadro se balancea.
 * Arte: museum/poster-hiring y museum/poster-hired (si faltan, papel dibujado con código).
 */
export function WantedPoster({ station, active, onPick }: { station: StationId; active: boolean; onPick: () => void }) {
  const { t } = useTranslation();
  const dinoId = useGameStore((s) => s.game.managers[station]);
  const species = dinoId ? DINO_BY_ID[dinoId] : undefined;
  const ability = species ? ABILITY[species.rarity] : undefined;
  const framed = getArt('museum/poster-hired');
  // El cartel "HIRING" lleva el texto dibujado: solo sirve tal cual en inglés.
  const hiringArt = currentLanguage() === 'en' ? getArt('museum/poster-hiring') : undefined;
  const art = !dinoId && hiringArt ? hiringArt : framed;
  const writeTitle = !(!dinoId && hiringArt);
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

  // Gira sobre el clavo (arriba al centro), como un péndulo.
  const swingStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${swing.value * 7}deg` }] }));

  return (
    <Animated.View style={[styles.wrap, swingStyle]}>
      <Pressable accessibilityRole="button" accessibilityLabel={`manager-${station}`} onPress={onPick} style={StyleSheet.absoluteFill}>
        {art ? <Image source={art} resizeMode="stretch" style={styles.art} /> : <View style={styles.paperFill} />}
        <View style={styles.top}>
          {species ? (
            <GameText size={7} weight="black" color={INK} center numberOfLines={1}>
              {dinoName(species.id)}
            </GameText>
          ) : writeTitle ? (
            <GameText size={8} weight="black" color={INK} center>
              {t('mine.wanted').toUpperCase()}
            </GameText>
          ) : null}
        </View>
        <View style={styles.window}>
          {dinoId ? (
            <Photo dinoId={dinoId} />
          ) : (
            <GameText size={20} weight="black" color={INK}>
              +
            </GameText>
          )}
        </View>
        <View style={styles.bottom}>
          {ability ? (
            <View style={styles.reward}>
              <GameIcon name="turbo" size={9} />
              <GameText size={7} weight="black" color={INK}>
                {t('mine.reward', { multiplier: ability.multiplier, seconds: ability.seconds })}
              </GameText>
            </View>
          ) : (
            <GameText size={7} weight="black" color={INK} center>
              {t('mine.hire')}
            </GameText>
          )}
        </View>
      </Pressable>
      <View style={styles.pin}>
        <TurboButton station={station} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // transformOrigin arriba: el giro es alrededor del clavo.
  wrap: { width: POSTER_WIDTH, height: POSTER_HEIGHT, transformOrigin: 'top' },
  // Ancho y alto explícitos: en web, absoluteFill sola deja la imagen a su tamaño original.
  art: { position: 'absolute', top: 0, left: 0, width: POSTER_WIDTH, height: POSTER_HEIGHT },
  paperFill: {
    position: 'absolute',
    top: 8,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F1DDB0',
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: '#A9774E',
  },
  // Franjas del arte: título (arriba), ventanita de la foto y recompensa (abajo).
  top: { position: 'absolute', top: POSTER_HEIGHT * 0.2, left: 4, right: 4, alignItems: 'center' },
  window: { position: 'absolute', ...WINDOW, alignItems: 'center', justifyContent: 'center' },
  bottom: { position: 'absolute', top: POSTER_HEIGHT * 0.73, left: 3, right: 3, alignItems: 'center' },
  photo: { width: '100%', height: '100%', borderRadius: 2, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  portrait: { width: '100%', height: '100%' },
  reward: { flexDirection: 'row', alignItems: 'center', gap: 1 },
  // Anclada por la izquierda: al mostrar la cuenta atrás crece hacia fuera, sin tapar el título.
  pin: { position: 'absolute', top: 4, left: POSTER_WIDTH - 14 },
});
