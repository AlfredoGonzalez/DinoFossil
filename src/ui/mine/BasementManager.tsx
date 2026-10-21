import { Pressable, StyleSheet, View } from 'react-native';
import type { StationId } from '@/game/types';
import { useTranslation } from '@/i18n';
import { useGameStore } from '@/store/gameStore';
import { GameText } from '../GameText';
import { DinoAvatar } from '../Icons';
import { getSheet } from '../spriteSheets';
import { SpriteSheet } from '../SpriteSheet';
import { colors } from '../theme';
import { TurboButton } from './ManagerSlot';

/** Un poco mayor que el excavador: el jefe es ancho y bajito, así queda de su altura. */
const SIZE = 72;
const BADGE = 16;

/**
 * Manager de un sótano, de pie junto a la bolsa:
 * - sin manager: letrero "Se busca" que abre la lista de dinos;
 * - con manager: el jefe de traje (sprites/manager/idle) mirando hacia la tierra, con el
 *   retrato de la especie asignada en el gafete y el Turbo sobre la cabeza. Mientras no
 *   exista el sprite, se ve el retrato redondo.
 */
export function BasementManager({ station, onPick }: { station: StationId; onPick: () => void }) {
  const { t } = useTranslation();
  const dinoId = useGameStore((s) => s.game.managers[station]);
  const sheet = getSheet('sprites/manager/idle');

  if (!dinoId) {
    return (
      <Pressable accessibilityRole="button" accessibilityLabel={`manager-${station}`} onPress={onPick} style={styles.wanted}>
        <View style={styles.board}>
          <View style={styles.stitch} />
          <GameText size={9} color={colors.textLight} weight="black" outline center>
            {t('mine.wanted').toUpperCase()}
          </GameText>
          <GameText size={11} color={colors.textLight} weight="black" outline center>
            + {t('mine.hire')}
          </GameText>
        </View>
        <View style={styles.post} />
      </Pressable>
    );
  }

  return (
    <View style={styles.wrap}>
      <TurboButton station={station} />
      <Pressable accessibilityRole="button" accessibilityLabel={`manager-${station}`} onPress={onPick}>
        {sheet ? (
          <View style={styles.figure}>
            {/* El sprite mira a la derecha: se voltea para vigilar al excavador. */}
            <View style={styles.flipped}>
              <SpriteSheet sheet={sheet} size={SIZE} />
            </View>
            <View style={styles.badge}>
              <DinoAvatar dinoId={dinoId} size={BADGE} ring />
            </View>
          </View>
        ) : (
          <DinoAvatar dinoId={dinoId} size={40} ring />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 1 },
  figure: { width: SIZE, height: SIZE },
  flipped: { width: SIZE, height: SIZE, transform: [{ scaleX: -1 }] },
  // Gafete: retrato de la especie asignada, en la solapa del saco (el jefe mira a la izquierda).
  badge: { position: 'absolute', left: SIZE * 0.39 - BADGE / 2, bottom: SIZE * 0.26 },
  wanted: { alignItems: 'center', marginBottom: -2 },
  board: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: colors.wood,
    borderWidth: 2,
    borderColor: colors.woodDark,
  },
  stitch: { position: 'absolute', top: 2, left: 2, right: 2, bottom: 2, borderRadius: 4, borderWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(255, 240, 210, 0.6)' },
  post: { width: 5, height: 14, marginTop: -1, backgroundColor: colors.woodDark },
});
