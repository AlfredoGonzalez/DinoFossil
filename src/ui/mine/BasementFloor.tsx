import { Pressable, StyleSheet, View } from 'react-native';
import { shaftRate } from '@/game/economy';
import { formatNumber } from '@/game/format';
import { getModifiers } from '@/game/modifiers';
import { shaftStationId, stationSpeed } from '@/game/simulate';
import { useTranslation } from '@/i18n';
import { tapFeedback } from '@/services/feedback';
import { useGameStore } from '@/store/gameStore';
import { getArt } from '../art';
import { GameText } from '../GameText';
import { ResourceIcon } from '../Icons';
import { colors } from '../theme';
import { Digger } from './Digger';
import { Floor } from './Floor';
import { ManagerSlot } from './ManagerSlot';
import { StationStatus } from './StationStatus';
import { UpgradeChip } from './UpgradeChip';

/** Un sótano de excavación (estación "shaft-i" del motor). */
export function BasementFloor({ index, onUpgrade, onPickManager }: { index: number; onUpgrade: () => void; onPickManager: () => void }) {
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
  // Cada sótano es un poco más oscuro que el anterior: se nota la profundidad.
  const shade = Math.min(index * 6, 40);

  return (
    <Floor art={getArt('museum/basement')} color={`rgb(${110 - shade}, ${72 - shade}, ${42 - shade / 2})`} floorColor="#3B2414" withLift>
      <ManagerSlot station={station} onPick={onPickManager} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`tap-${station}`}
        style={styles.body}
        onPress={() => {
          if (!idle) return;
          tapFeedback();
          useGameStore.getState().tap(station);
        }}
      >
        <GameText size={13} weight="black" color={colors.textLight} outline>
          ⛏️ {t('mine.shaft', { n: index + 1 })}
        </GameText>
        <View style={styles.dig}>
          <Digger dinoId={manager} running={shaft.running} />
          <View style={styles.pile}>
            <ResourceIcon kind="fossils" size={18} />
            <GameText size={13} color={colors.textLight} weight="black" outline>
              {formatNumber(shaft.deposit)}
            </GameText>
          </View>
        </View>
        <StationStatus idle={idle} progress={shaft.progress} color={colors.gold} />
      </Pressable>
      <View style={styles.side}>
        <UpgradeChip station={station} level={shaft.level} onPress={onUpgrade} />
        <GameText size={10} color={colors.textLight} weight="black" outline center>
          {formatNumber(rate)}/s
        </GameText>
      </View>
    </Floor>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, height: '86%', justifyContent: 'space-between', paddingVertical: 4 },
  dig: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  pile: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  side: { alignItems: 'center', gap: 3, width: 70 },
});
