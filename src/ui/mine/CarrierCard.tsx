import { Pressable, StyleSheet, View } from 'react-native';
import { carrierCapacity } from '@/game/economy';
import { formatNumber } from '@/game/format';
import { getModifiers } from '@/game/modifiers';
import { useTranslation } from '@/i18n';
import { tapFeedback } from '@/services/feedback';
import { useGameStore } from '@/store/gameStore';
import { GameText } from '../GameText';
import { ResourceIcon } from '../Icons';
import { ProgressBar } from '../ProgressBar';
import { colors, radius } from '../theme';
import { Digger } from './Digger';
import { ManagerSlot } from './ManagerSlot';
import { UpgradeChip } from './UpgradeChip';

interface Props {
  kind: 'elevator' | 'museum';
  onUpgrade: () => void;
  onPickManager: () => void;
}

/** Tarjeta del museo (vende) o del ascensor (transporta). */
export function CarrierCard({ kind, onUpgrade, onPickManager }: Props) {
  const { t } = useTranslation();
  const carrier = useGameStore((s) => s.game.mine[kind]);
  const manager = useGameStore((s) => s.game.managers[kind]);
  const surface = useGameStore((s) => s.game.mine.surface);
  const capacity = useGameStore((s) => {
    const mods = getModifiers(s.game, Date.now());
    return carrierCapacity(kind, s.game.mine[kind].level) * (kind === 'elevator' ? mods.elevatorCapacity : mods.museumCapacity);
  });
  const idle = !manager && !carrier.running;

  return (
    <View style={[styles.card, kind === 'museum' ? styles.museum : styles.elevator]}>
      <ManagerSlot station={kind} onPick={onPickManager} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`tap-${kind}`}
        style={styles.body}
        onPress={() => {
          if (!idle) return;
          tapFeedback();
          useGameStore.getState().tap(kind);
        }}
      >
        <View style={styles.titleRow}>
          <GameText size={15} weight="black" color={colors.textLight} outline>
            {kind === 'museum' ? '🏛️ ' : '🛗 '}
            {t(`mine.${kind}`)}
          </GameText>
          {kind === 'museum' ? (
            <View style={styles.surface}>
              <ResourceIcon kind="fossils" size={16} />
              <GameText size={13} weight="black" color={colors.textLight} outline>
                {formatNumber(surface)}
              </GameText>
            </View>
          ) : null}
        </View>
        <View style={styles.titleRow}>
          <Digger dinoId={manager} running={carrier.running} tool={kind === 'museum' ? '🪙' : '🛒'} />
          <GameText size={12} color={colors.textLight} weight="black" outline>
            {t(kind === 'museum' ? 'mine.perCycle' : 'mine.perTrip', { value: formatNumber(capacity) })}
          </GameText>
        </View>
        {idle ? (
          <View style={styles.tapHint}>
            <GameText size={14} color={colors.text} weight="black">
              👆 {t('mine.tap')}
            </GameText>
          </View>
        ) : (
          <ProgressBar value={carrier.progress} height={8} color={kind === 'museum' ? colors.gold : colors.blue} />
        )}
      </Pressable>
      <UpgradeChip station={kind} level={carrier.level} onPress={onUpgrade} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
    marginHorizontal: 8,
    borderRadius: radius.md,
    borderWidth: 3,
  },
  museum: { backgroundColor: '#C98B52', borderColor: colors.woodDark },
  elevator: { backgroundColor: '#6E7B8B', borderColor: '#3F4955' },
  body: { flex: 1, gap: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  surface: { flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 10, paddingHorizontal: 6 },
  tapHint: { alignSelf: 'center', backgroundColor: colors.gold, borderRadius: 10, paddingHorizontal: 8 },
});
