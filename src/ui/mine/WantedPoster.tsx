import { useEffect } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { ABILITY, DINO_BY_ID } from '@/data/dinos';
import type { StationId } from '@/game/types';
import { dinoName, useTranslation } from '@/i18n';
import { useGameStore } from '@/store/gameStore';
import { getArt } from '../art';
import { GameIcon } from '../GameIcon';
import { GameText } from '../GameText';
import { DinoAvatar } from '../Icons';
import { rarityColors } from '../theme';
import { TurboButton } from './ManagerSlot';

export const POSTER_WIDTH = 62;
export const POSTER_HEIGHT = 84;
const PHOTO = 38;
const INK = '#4A2C12';

/**
 * Cartel "Se busca" colgado de un clavo: el manager de la planta.
 * - Sin manager: hueco de la foto vacío con un "+". Al tocarlo se abre la lista de dinos.
 * - Con manager: foto de la especie (retrato dinos/<id>), su nombre y, como recompensa,
 *   su poder Turbo (varía con la rareza). El Turbo se activa con la chincheta ⚡ de la esquina.
 * Mientras el Turbo está activo (`active`), el cartel se balancea sobre su clavo.
 * Arte del papel: museum/wanted-poster (los textos siempre son código, para traducirlos).
 */
export function WantedPoster({ station, active, onPick }: { station: StationId; active: boolean; onPick: () => void }) {
  const { t } = useTranslation();
  const dinoId = useGameStore((s) => s.game.managers[station]);
  const species = dinoId ? DINO_BY_ID[dinoId] : undefined;
  const ability = species ? ABILITY[species.rarity] : undefined;
  const art = getArt('museum/wanted-poster');
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
      <Pressable accessibilityRole="button" accessibilityLabel={`manager-${station}`} onPress={onPick} style={styles.paper}>
        {art ? <Image source={art} resizeMode="stretch" style={StyleSheet.absoluteFill} /> : <View style={styles.paperFill} />}
        <GameText size={8} weight="black" color={INK} center>
          {t('mine.wanted').toUpperCase()}
        </GameText>
        <View style={[styles.photo, species && { borderColor: rarityColors[species.rarity] }]}>
          {dinoId ? (
            <DinoAvatar dinoId={dinoId} size={PHOTO - 4} />
          ) : (
            <GameText size={24} weight="black" color={INK}>
              +
            </GameText>
          )}
        </View>
        {species && ability ? (
          <>
            <GameText size={7} weight="black" color={INK} center numberOfLines={1}>
              {dinoName(species.id)}
            </GameText>
            <View style={styles.reward}>
              <GameIcon name="turbo" size={9} />
              <GameText size={7} weight="black" color={INK}>
                {t('mine.reward', { multiplier: ability.multiplier, seconds: ability.seconds })}
              </GameText>
            </View>
          </>
        ) : (
          <GameText size={8} weight="black" color={INK} center>
            {t('mine.hire')}
          </GameText>
        )}
      </Pressable>
      {/* Clavo (si el arte no lo trae, lo dibuja el código). */}
      {art ? null : <View style={styles.nail} />}
      <View style={styles.pin}>
        <TurboButton station={station} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // transformOrigin arriba: el giro es alrededor del clavo.
  wrap: { width: POSTER_WIDTH, height: POSTER_HEIGHT, paddingTop: 6, transformOrigin: 'top' },
  paper: { flex: 1, alignItems: 'center', justifyContent: 'space-evenly', paddingHorizontal: 3, paddingVertical: 2 },
  paperFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F1DDB0',
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: '#A9774E',
    transform: [{ rotate: '-1.5deg' }],
  },
  photo: {
    width: PHOTO,
    height: PHOTO,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(122, 74, 36, 0.12)',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#A9774E',
    borderRadius: 3,
  },
  reward: { flexDirection: 'row', alignItems: 'center', gap: 1 },
  nail: { position: 'absolute', top: 2, left: POSTER_WIDTH / 2 - 4, width: 8, height: 8, borderRadius: 4, backgroundColor: '#5E5A55', borderWidth: 1.5, borderColor: '#2E2A25' },
  // Anclada por la izquierda: al mostrar la cuenta atrás crece hacia fuera, sin tapar el título.
  pin: { position: 'absolute', top: -2, left: POSTER_WIDTH - 14 },
});
