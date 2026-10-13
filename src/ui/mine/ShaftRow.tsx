import { Pressable, StyleSheet, View } from 'react-native';
import { shaftRate } from '@/game/economy';
import { formatNumber } from '@/game/format';
import { getModifiers } from '@/game/modifiers';
import { shaftStationId, stationSpeed } from '@/game/simulate';
import { useTranslation } from '@/i18n';
import { tapFeedback } from '@/services/feedback';
import { useGameStore } from '@/store/gameStore';
import { GameText } from '../GameText';
import { ResourceIcon } from '../Icons';
import { ProgressBar } from '../ProgressBar';
import { colors } from '../theme';
import { Digger } from './Digger';
import { ManagerSlot } from './ManagerSlot';
import { UpgradeChip } from './UpgradeChip';

export const SHAFT_ROW_HEIGHT = 104;

interface Props {
  index: number;
  onUpgrade: () => void;
  onPickManager: () => void;
}

export function ShaftRow({ index, onUpgrade, onPickManager }: Props) {
  const { t } = useTranslation();
  const station = shaftStationId(index);
  const shaft = useGameStore((s) => s.game.mine.shafts[index]);
  const manager = useGameStore((s) => s.game.managers[station]);
  const rate = useGameStore((s) => {
    const sh = s.game.mine.shafts[index];
    const now = Date.now();
    return sh ? shaftRate(index, sh.level) * getModifiers(s.game, now).shaftSpeed * stationSpeed(s.game, station, now) : 0;
  });
  if (!shaft) return null;
  const idle = !manager && !shaft.running;

  return (
    <View style={[styles.row, { backgroundColor: index % 2 === 0 ? colors.dirt : colors.dirtLight }]}>
      <ManagerSlot station={station} onPick={onPickManager} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`tap-${station}`}
        style={styles.work}
        onPress={() => {
          if (!idle) return;
          tapFeedback();
          useGameStore.getState().tap(station);
        }}
      >
        <GameText size={12} color={colors.textLight} weight="black" outline>
          {t('mine.shaft', { n: index + 1 })}
        </GameText>
        <View style={styles.dig}>
          <Digger dinoId={manager} running={shaft.running} />
          <View style={styles.pile}>
            <ResourceIcon kind="fossils" size={20} />
            <GameText size={14} color={colors.textLight} weight="black" outline>
              {formatNumber(shaft.deposit)}
            </GameText>
          </View>
        </View>
        {idle ? (
          <View style={styles.tapHint}>
            <GameText size={14} color={colors.text} weight="black">
              👆 {t('mine.tap')}
            </GameText>
          </View>
        ) : (
          <ProgressBar value={shaft.progress} height={8} color={colors.gold} />
        )}
      </Pressable>
      <View style={styles.info}>
        <UpgradeChip station={station} level={shaft.level} onPress={onUpgrade} />
        <GameText size={12} color={colors.textLight} weight="black" outline>
          ⭐ {formatNumber(rate)}/s
        </GameText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: SHAFT_ROW_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 6,
    paddingRight: 52,
    gap: 6,
    borderBottomWidth: 4,
    borderBottomColor: colors.dirtDark,
  },
  work: {
    flex: 1,
    height: SHAFT_ROW_HEIGHT - 16,
    padding: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(30,15,5,0.45)',
    justifyContent: 'space-between',
  },
  dig: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  pile: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  tapHint: { alignSelf: 'center', backgroundColor: colors.gold, borderRadius: 10, paddingHorizontal: 8 },
  info: { alignItems: 'center', gap: 4 },
});
