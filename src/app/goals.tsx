import { ScrollView, StyleSheet, View } from 'react-native';
import { claimableGoals, isGoalReached, worldGoals, worldStars } from '@/game/goals';
import { formatNumber } from '@/game/format';
import { useTranslation } from '@/i18n';
import { successFeedback } from '@/services/feedback';
import { useGameStore } from '@/store/gameStore';
import { BottomNav } from '@/ui/BottomNav';
import { ChunkyButton } from '@/ui/ChunkyButton';
import { CurrencyBar } from '@/ui/CurrencyBar';
import { GameText } from '@/ui/GameText';
import { EggIcon, ResourceIcon } from '@/ui/Icons';
import { Banner, Panel } from '@/ui/Panel';
import { ProgressBar } from '@/ui/ProgressBar';
import { Screen } from '@/ui/Screen';
import { colors } from '@/ui/theme';

/** Misiones del mundo y estadísticas. */
export default function GoalsScreen() {
  const { t } = useTranslation();
  const game = useGameStore((s) => s.game);
  const goals = worldGoals();
  const claimable = new Set(claimableGoals(game).map((g) => g.id));
  const shafts = game.mine.shafts.length;

  return (
    <Screen background="jungle" edges={['top']}>
      <CurrencyBar />
      <ScrollView contentContainerStyle={styles.content}>
        <Banner text={t('goals.title')} />
        <Panel>
          <GameText weight="black" center>
            ⭐ {t('goals.stars', { stars: worldStars(game), total: goals.length })}
          </GameText>
        </Panel>
        {goals.map((goal) => {
          const done = game.goalsClaimed.includes(goal.id);
          return (
            <Panel key={goal.id}>
              <View style={styles.row}>
                <View style={styles.flex}>
                  <GameText weight="black">{t('goal.desc', { n: goal.shafts })}</GameText>
                  <ProgressBar value={Math.min(shafts, goal.shafts) / goal.shafts} height={10} />
                  <GameText size={12} color={colors.muted}>
                    {t('goals.progress', { current: Math.min(shafts, goal.shafts), target: goal.shafts })}
                  </GameText>
                </View>
                <View style={styles.reward}>
                  <ResourceIcon kind="amber" size={20} />
                  <GameText size={13} weight="black">
                    {goal.reward.amber}
                  </GameText>
                  <EggIcon rarity={goal.reward.egg} size={24} />
                </View>
              </View>
              <ChunkyButton
                size="sm"
                variant={done ? 'grey' : 'green'}
                disabled={!claimable.has(goal.id)}
                label={done ? `✅ ${t('goals.done')}` : t('goals.claim')}
                onPress={() => {
                  if (useGameStore.getState().claimGoal(goal.id)) successFeedback();
                }}
                style={{ marginTop: 8, opacity: isGoalReached(game, goal) || done ? 1 : 0.7 }}
              />
            </Panel>
          );
        })}
        <Panel title={t('goals.stats')}>
          <View style={styles.stat}>
            <GameText>{t('goals.lifetime')}</GameText>
            <GameText weight="black">{formatNumber(game.lifetimeEarnings)}</GameText>
          </View>
          <View style={styles.stat}>
            <GameText>{t('goals.prestiges')}</GameText>
            <GameText weight="black">{game.prestigeCount}</GameText>
          </View>
          <View style={styles.stat}>
            <GameText>{t('resources.huellas')}</GameText>
            <GameText weight="black">{game.huellas}</GameText>
          </View>
        </Panel>
      </ScrollView>
      <BottomNav />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 14, gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  flex: { flex: 1, gap: 4 },
  reward: { alignItems: 'center', gap: 2 },
  stat: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
});
