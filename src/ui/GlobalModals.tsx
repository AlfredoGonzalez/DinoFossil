import { router, usePathname } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { claimableGoals, worldStars } from '@/game/goals';
import { formatDuration, formatNumber } from '@/game/format';
import { useTranslation } from '@/i18n';
import { successFeedback } from '@/services/feedback';
import { watchRewardedAd } from '@/services/rewards';
import { useGameStore } from '@/store/gameStore';
import { useUiStore } from '@/store/uiStore';
import { ChunkyButton } from './ChunkyButton';
import { GameModal } from './GameModal';
import { GameText } from './GameText';
import { DinoAvatar, EggIcon, ResourceIcon } from './Icons';
import { colors } from './theme';

function OfflineModal() {
  const { t } = useTranslation();
  const report = useUiStore((s) => s.offlineReport);
  const close = () => useUiStore.getState().setOfflineReport(null);
  if (!report) return null;
  return (
    <GameModal visible title={t('offline.title')} testID="offline-modal">
      <DinoAvatar dinoId="trex" size={84} />
      <GameText center>{t('offline.body', { time: formatDuration(report.seconds) })}</GameText>
      <View style={styles.reward}>
        <ResourceIcon kind="coins" size={34} />
        <GameText size={32} weight="black">
          +{formatNumber(report.coins)}
        </GameText>
      </View>
      {report.capped ? (
        <GameText size={13} color={colors.muted} center>
          {t('offline.capped')}
        </GameText>
      ) : null}
      <View style={styles.row}>
        <ChunkyButton style={styles.flex} variant="blue" label={t('offline.collect')} onPress={close} />
        <ChunkyButton
          style={styles.flex}
          variant="green"
          label={`${t('offline.double')} 📺`}
          onPress={async () => {
            if (await watchRewardedAd()) {
              useGameStore.getState().addCoins(report.coins);
              successFeedback();
            }
            close();
          }}
        />
      </View>
    </GameModal>
  );
}

/** "¡Nivel completado!": aparece al cumplir una meta del mundo. */
function GoalModal() {
  const { t } = useTranslation();
  const goal = useGameStore((s) => claimableGoals(s.game)[0]);
  const stars = useGameStore((s) => worldStars(s.game));
  if (!goal) return null;
  const claim = (toMap: boolean) => {
    useGameStore.getState().claimGoal(goal.id);
    successFeedback();
    if (toMap) router.push('/map');
  };
  return (
    <GameModal visible title={t('goal.title')} testID="goal-modal">
      <GameText size={44} center>
        {[0, 1, 2].map((i) => (i < stars + 1 ? '⭐' : '☆')).join(' ')}
      </GameText>
      <DinoAvatar dinoId="trex" size={84} />
      <GameText center>{t('goal.desc', { n: goal.shafts })}</GameText>
      <GameText center weight="black">
        {t('goal.rewards')}
      </GameText>
      <View style={styles.reward}>
        <ResourceIcon kind="amber" size={30} />
        <GameText size={22} weight="black">
          ×{goal.reward.amber}
        </GameText>
        <EggIcon rarity={goal.reward.egg} size={34} />
        <GameText size={22} weight="black">
          ×1
        </GameText>
      </View>
      <View style={styles.row}>
        <ChunkyButton style={styles.flex} label={t('common.continue')} onPress={() => claim(false)} />
        <ChunkyButton style={styles.flex} variant="blue" label={t('goal.map')} onPress={() => claim(true)} />
      </View>
    </GameModal>
  );
}

const HIDDEN_ON = ['/', '/home'];

export function GlobalModals() {
  const pathname = usePathname();
  const hasOfflineReport = useUiStore((s) => s.offlineReport !== null);
  if (HIDDEN_ON.includes(pathname)) return null;
  // Un modal cada vez: primero las ganancias offline, luego las metas.
  return hasOfflineReport ? <OfflineModal /> : <GoalModal />;
}

const styles = StyleSheet.create({
  reward: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  row: { flexDirection: 'row', gap: 10 },
  flex: { flex: 1 },
});
