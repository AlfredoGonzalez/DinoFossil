import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { formatDuration, formatNumber } from '@/game/format';
import { isAdBoostActive } from '@/game/modifiers';
import { canAddAdBoost } from '@/game/rewards';
import { pendingHuellas } from '@/game/prestige';
import { shaftStationId } from '@/game/simulate';
import type { StationId } from '@/game/types';
import { nextShaftUnlockCost } from '@/game/upgrades';
import { useTranslation } from '@/i18n';
import { playSfx } from '@/services/audio';
import { successFeedback, tapFeedback } from '@/services/feedback';
import { watchRewardedAd } from '@/services/rewards';
import { useGameStore } from '@/store/gameStore';
import { BottomNav } from '@/ui/BottomNav';
import { ChunkyButton } from '@/ui/ChunkyButton';
import { CurrencyBar } from '@/ui/CurrencyBar';
import { GameText } from '@/ui/GameText';
import { useNow } from '@/ui/hooks';
import { ResourceIcon } from '@/ui/Icons';
import { CarrierCard } from '@/ui/mine/CarrierCard';
import { ElevatorShaft } from '@/ui/mine/ElevatorShaft';
import { ManagerPicker } from '@/ui/mine/ManagerPicker';
import { PrestigeModal } from '@/ui/mine/PrestigeModal';
import { ShaftRow } from '@/ui/mine/ShaftRow';
import { UpgradeSheet } from '@/ui/mine/UpgradeSheet';
import { Screen } from '@/ui/Screen';
import { colors, radius } from '@/ui/theme';

function Header({ onPrestige }: { onPrestige: () => void }) {
  const { t } = useTranslation();
  const now = useNow(1000);
  const boostUntil = useGameStore((s) => s.game.adBoostUntil);
  const canBoost = useGameStore((s) => canAddAdBoost(s.game, now));
  const prestigeReady = useGameStore((s) => pendingHuellas(s.game) > 0);
  const boosting = isAdBoostActive(useGameStore.getState().game, now);

  return (
    <View style={styles.header}>
      <View style={styles.title}>
        <GameText size={16} weight="black" color={colors.textLight} outline>
          🦴 {t('mine.title')}
        </GameText>
        <GameText size={12} color={colors.textLight} outline>
          {t('worlds.eggValley.name')}
        </GameText>
      </View>
      <ChunkyButton
        testID="boost"
        size="sm"
        variant={boosting ? 'orange' : 'blue'}
        disabled={!canBoost}
        label={boosting ? t('mine.boost', { time: formatDuration((boostUntil - now) / 1000) }) : `📺 ${t('mine.boostCta')}`}
        onPress={async () => {
          if (await watchRewardedAd()) {
            useGameStore.getState().adBoost();
            successFeedback();
          }
        }}
      />
      <ChunkyButton testID="prestige" size="sm" variant={prestigeReady ? 'purple' : 'wood'} label="🐾" onPress={onPrestige} />
    </View>
  );
}

function UnlockRow() {
  const { t } = useTranslation();
  const cost = useGameStore((s) => nextShaftUnlockCost(s.game));
  const affordable = useGameStore((s) => cost !== null && s.game.coins >= cost);
  if (cost === null) {
    return (
      <View style={styles.unlock}>
        <GameText color={colors.textLight} weight="black" outline center>
          🏆 {t('mine.allShafts')}
        </GameText>
      </View>
    );
  }
  return (
    <View style={styles.unlock}>
      <ChunkyButton
        testID="unlock-shaft"
        variant="gold"
        disabled={!affordable}
        onPress={() => {
          if (useGameStore.getState().unlockShaft()) {
            playSfx('upgrade');
            successFeedback();
          }
        }}
      >
        <GameText size={16} color={colors.textLight} weight="black" outline>
          ⛏️ {t('mine.newShaft')}
        </GameText>
        <View style={styles.cost}>
          <ResourceIcon kind="coins" size={18} />
          <GameText size={15} color={colors.textLight} weight="black" outline>
            {formatNumber(cost)}
          </GameText>
        </View>
      </ChunkyButton>
    </View>
  );
}

/** Pantalla principal: la mina (galerías → ascensor → museo). */
export default function MineScreen() {
  const shaftCount = useGameStore((s) => s.game.mine.shafts.length);
  const [upgrading, setUpgrading] = useState<StationId | null>(null);
  const [picking, setPicking] = useState<StationId | null>(null);
  const [prestigeOpen, setPrestigeOpen] = useState(false);

  return (
    <Screen background="sky" edges={['top']}>
      <CurrencyBar />
      <Header onPrestige={() => (tapFeedback(), setPrestigeOpen(true))} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.surface}>
          <CarrierCard kind="museum" onUpgrade={() => setUpgrading('museum')} onPickManager={() => setPicking('museum')} />
          <CarrierCard kind="elevator" onUpgrade={() => setUpgrading('elevator')} onPickManager={() => setPicking('elevator')} />
        </View>
        <View style={styles.grassEdge} />
        <View>
          {Array.from({ length: shaftCount }, (_, i) => (
            <ShaftRow
              key={i}
              index={i}
              onUpgrade={() => setUpgrading(shaftStationId(i))}
              onPickManager={() => setPicking(shaftStationId(i))}
            />
          ))}
          <ElevatorShaft />
        </View>
        <UnlockRow />
      </ScrollView>
      <BottomNav />
      <UpgradeSheet station={upgrading} onClose={() => setUpgrading(null)} />
      <ManagerPicker station={picking} onClose={() => setPicking(null)} />
      <PrestigeModal visible={prestigeOpen} onClose={() => setPrestigeOpen(false)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingBottom: 6 },
  title: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.sm,
    backgroundColor: colors.wood,
    borderWidth: 2,
    borderColor: colors.woodDark,
  },
  scroll: { flex: 1, backgroundColor: colors.dirtDark },
  content: { paddingBottom: 24 },
  surface: { gap: 8, paddingVertical: 10, backgroundColor: colors.grass },
  grassEdge: { height: 10, backgroundColor: colors.grassDark },
  unlock: { padding: 14, backgroundColor: colors.dirtDark },
  cost: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
