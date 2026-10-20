import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { ABILITY, DINOS } from '@/data/dinos';
import { stationOfDino } from '@/game/managers';
import type { StationId } from '@/game/types';
import { dinoName, useTranslation } from '@/i18n';
import { tapFeedback } from '@/services/feedback';
import { useGameStore } from '@/store/gameStore';
import { ChunkyButton } from '../ChunkyButton';
import { GameModal } from '../GameModal';
import { GameText } from '../GameText';
import { IconLabel } from '../IconLabel';
import { DinoAvatar } from '../Icons';
import { colors, radius, rarityColors } from '../theme';
import { stationName } from './stations';

export function ManagerPicker({ station, onClose }: { station: StationId | null; onClose: () => void }) {
  const { t } = useTranslation();
  const game = useGameStore((s) => s.game);
  if (!station) return null;
  const owned = DINOS.filter((d) => game.dinos[d.id]);
  const current = game.managers[station];

  return (
    <GameModal visible title={t('managers.title')} onClose={onClose} testID="manager-picker">
      <GameText size={14} color={colors.muted} center>
        {t('managers.hint')}
      </GameText>
      {owned.length === 0 ? (
        <>
          <GameText center>{t('managers.none')}</GameText>
          <ChunkyButton label={t('nav.incubator')} onPress={() => (onClose(), router.replace('/incubator'))} />
        </>
      ) : null}
      {owned.map((species) => {
        const workingAt = stationOfDino(game, species.id);
        const selected = current === species.id;
        const ability = ABILITY[species.rarity];
        return (
          <Pressable
            key={species.id}
            accessibilityRole="button"
            accessibilityLabel={`pick-${species.id}`}
            onPress={() => {
              tapFeedback();
              useGameStore.getState().assignManager(station, species.id);
              onClose();
            }}
            style={[styles.item, selected && styles.selected]}
          >
            <DinoAvatar dinoId={species.id} size={48} ring />
            <View style={styles.flex}>
              <GameText weight="black">
                {dinoName(species.id)}{' '}
                <GameText size={12} color={rarityColors[species.rarity]} weight="black">
                  {t(`rarity.${species.rarity}`)}
                </GameText>
              </GameText>
              <IconLabel icon="turbo" size={14}>
                <GameText size={12} color={colors.muted}>
                  {t('managers.turbo', { mult: ability.multiplier, seconds: ability.seconds })}
                </GameText>
              </IconLabel>
              {workingAt ? (
                <GameText size={12} color={colors.orangeDark}>
                  {t('managers.workingAt', { station: stationName(t, workingAt) })}
                </GameText>
              ) : null}
            </View>
          </Pressable>
        );
      })}
      {current ? (
        <ChunkyButton
          variant="red"
          size="sm"
          label={t('managers.remove')}
          onPress={() => {
            useGameStore.getState().assignManager(station, null);
            onClose();
          }}
        />
      ) : null}
    </GameModal>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 8,
    borderRadius: radius.md,
    backgroundColor: colors.parchmentDark,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selected: { borderColor: colors.green },
  flex: { flex: 1 },
});
