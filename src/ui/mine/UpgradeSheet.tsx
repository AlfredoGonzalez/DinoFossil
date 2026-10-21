import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { MINE_BALANCE } from '@/data/mine';
import { carrierCapacity, carrierMaxLevel, nextMilestone, shaftRate } from '@/game/economy';
import { formatNumber } from '@/game/format';
import { getModifiers } from '@/game/modifiers';
import type { GameState, StationId } from '@/game/types';
import { upgradeQuote, type BuyAmount } from '@/game/upgrades';
import { useTranslation } from '@/i18n';
import { playSfx } from '@/services/audio';
import { successFeedback } from '@/services/feedback';
import { useGameStore } from '@/store/gameStore';
import { ChunkyButton } from '../ChunkyButton';
import { GameIcon } from '../GameIcon';
import { GameModal } from '../GameModal';
import { GameText } from '../GameText';
import { IconLabel } from '../IconLabel';
import { useNow } from '../hooks';
import { ResourceIcon } from '../Icons';
import { colors, radius } from '../theme';
import { shaftIndex, stationName } from './stations';


function stat(station: StationId, level: number, game: GameState, now: number): number {
  const mods = getModifiers(game, now);
  const index = shaftIndex(station);
  if (index !== null) return shaftRate(index, level) * mods.shaftSpeed;
  if (station === 'elevator') return carrierCapacity('elevator', level) * mods.elevatorCapacity;
  return carrierCapacity('museum', level) * mods.museumCapacity;
}

export function UpgradeSheet({ station, onClose }: { station: StationId | null; onClose: () => void }) {
  const { t } = useTranslation();
  const [chosen, setAmount] = useState<BuyAmount>(1);
  const game = useGameStore((s) => s.game);
  const time = useNow(1000);
  if (!station) return null;

  const index = shaftIndex(station);
  const level = index !== null ? (game.mine.shafts[index]?.level ?? 1) : game.mine[station as 'elevator' | 'museum'].level;
  const maxLevel = index !== null ? MINE_BALANCE.shaft.maxLevel : carrierMaxLevel(station as 'elevator' | 'museum');
  const maxed = level >= maxLevel;
  const milestone = index !== null ? nextMilestone(level) : null;
  // "Hasta el hito" solo existe en los sótanos y mientras quede algún hito por delante.
  const amounts: BuyAmount[] = milestone ? [1, 10, 'milestone', 'max'] : [1, 10, 'max'];
  const amount = amounts.includes(chosen) ? chosen : 1;
  const quote = upgradeQuote(game, station, amount, time);
  const now = stat(station, level, game, time);
  const next = stat(station, level + quote.levels, game, time);
  const label = index !== null ? t('upgrade.production') : t('upgrade.capacity');

  return (
    <GameModal visible title={t('upgrade.title', { name: stationName(t, station), level })} onClose={onClose} testID="upgrade-sheet">
      <View style={styles.statRow}>
        <GameText>{label}</GameText>
        <GameText weight="black">
          {formatNumber(now)}
          {index !== null ? '/s' : ''} →{' '}
          <GameText weight="black" color={colors.greenDark}>
            {formatNumber(next)}
            {index !== null ? '/s' : ''}
          </GameText>
        </GameText>
      </View>
      {milestone ? (
        <View style={styles.milestone}>
          <IconLabel icon="star" size={16}>
            <GameText size={14} color={colors.purpleDark} center>
              {t('upgrade.nextMilestone', { level: milestone })}
            </GameText>
          </IconLabel>
        </View>
      ) : null}
      <View style={styles.amounts}>
        {amounts.map((a) => (
          <ChunkyButton
            key={String(a)}
            testID={`amount-${a}`}
            size="sm"
            style={styles.flex}
            variant={amount === a ? 'orange' : 'wood'}
            icon={a === 'milestone' ? <GameIcon name="star" size={16} /> : undefined}
            label={a === 'max' ? t('common.max') : a === 'milestone' ? t('upgrade.toMilestone', { level: milestone }) : `×${a}`}
            onPress={() => setAmount(a)}
          />
        ))}
      </View>
      {maxed ? (
        <GameText weight="black" center>
          {t('upgrade.maxed')}
        </GameText>
      ) : (
        <ChunkyButton
          testID="buy-upgrade"
          disabled={quote.cost > game.coins}
          onPress={() => {
            if (useGameStore.getState().upgrade(station, amount)) {
              playSfx('upgrade');
              successFeedback();
            }
          }}
        >
          <GameText size={17} color={colors.textLight} weight="black" outline>
            {t('upgrade.buy', { levels: quote.levels })}
          </GameText>
          <View style={styles.cost}>
            <ResourceIcon kind="coins" size={18} />
            <GameText size={15} color={colors.textLight} weight="black" outline>
              {formatNumber(quote.cost)}
            </GameText>
          </View>
        </ChunkyButton>
      )}
    </GameModal>
  );
}

const styles = StyleSheet.create({
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: radius.sm,
    backgroundColor: colors.parchmentDark,
  },
  amounts: { flexDirection: 'row', gap: 8 },
  milestone: { alignItems: 'center' },
  flex: { flex: 1 },
  cost: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
