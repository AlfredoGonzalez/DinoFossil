import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { DINO_BY_ID } from '@/data/dinos';
import { EGG_DROP_ODDS } from '@/data/eggs';
import { AD_REWARDS } from '@/data/mine';
import { amberToFinish, hatchSeconds, incubatorRemaining } from '@/game/collection';
import { formatDuration } from '@/game/format';
import { RARITIES } from '@/game/types';
import { dinoName, useTranslation } from '@/i18n';
import { playSfx } from '@/services/audio';
import { successFeedback } from '@/services/feedback';
import { watchRewardedAd } from '@/services/rewards';
import { useGameStore } from '@/store/gameStore';
import { BottomNav } from '@/ui/BottomNav';
import { ChunkyButton } from '@/ui/ChunkyButton';
import { CurrencyBar } from '@/ui/CurrencyBar';
import { GameModal } from '@/ui/GameModal';
import { GameText } from '@/ui/GameText';
import { GameIcon } from '@/ui/GameIcon';
import { useNow } from '@/ui/hooks';
import { DinoAvatar, EggIcon } from '@/ui/Icons';
import { Banner, Panel } from '@/ui/Panel';
import { ProgressBar } from '@/ui/ProgressBar';
import { Screen } from '@/ui/Screen';
import { TutorialSpot } from '@/ui/tutorial/TutorialAnchor';
import { colors, radius, rarityColors } from '@/ui/theme';

interface Reveal {
  dinoId: string;
  level: number;
  duplicate: boolean;
}

function Capsule() {
  const { t } = useTranslation();
  const now = useNow(500);
  const incubator = useGameStore((s) => s.game.incubator);
  const remaining = useGameStore((s) => incubatorRemaining(s.game, now));
  const amberCost = useGameStore((s) => amberToFinish(s.game, now));
  const amber = useGameStore((s) => s.game.amber);
  const [reveal, setReveal] = useState<Reveal | null>(null);
  const wobble = useSharedValue(0);

  useEffect(() => {
    wobble.value = withRepeat(withSequence(withTiming(1, { duration: 300 }), withTiming(-1, { duration: 300 })), -1, true);
  }, [wobble]);
  const eggStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${wobble.value * (remaining <= 0 ? 10 : 3)}deg` }] }));

  const total = incubator ? (incubator.endsAt - incubator.startedAt) / 1000 : 1;

  return (
    <Panel>
      <View style={styles.capsule}>
        <View style={styles.glass}>
          {incubator ? (
            <Animated.View style={eggStyle}>
              <EggIcon rarity={incubator.rarity} size={110} />
            </Animated.View>
          ) : (
            <GameText color={colors.textLight} weight="black" outline center>
              {t('incubator.empty')}
            </GameText>
          )}
        </View>
        <View style={styles.base} />
      </View>
      {incubator ? (
        <View style={styles.controls}>
          <ProgressBar value={1 - remaining / Math.max(1, total)} color={colors.green} height={16} />
          {remaining > 0 ? (
            <>
              <GameText size={22} weight="black" center>
                ⏳ {formatDuration(remaining)}
              </GameText>
              <View style={styles.row}>
                <TutorialSpot id="speed-up" style={styles.flex}>
                  <ChunkyButton
                    testID="speed-up"
                    disabled={amber < amberCost}
                    label={t('incubator.speedUp')}
                    sublabel={`${amberCost} ${t('resources.amber')}`}
                    onPress={() => useGameStore.getState().finishWithAmber()}
                  />
                </TutorialSpot>
                <ChunkyButton
                  style={styles.flex}
                  variant="blue"
                  label={t('incubator.skipAd')}
                  icon={<GameIcon name="ad" size={20} />}
                  onPress={async () => {
                    if (await watchRewardedAd()) useGameStore.getState().skipIncubation(AD_REWARDS.eggSkipMinutes * 60);
                  }}
                />
              </View>
            </>
          ) : (
            <TutorialSpot id="hatch">
              <ChunkyButton
                testID="hatch"
                size="lg"
                variant="orange"
                label={t('incubator.hatch')}
                onPress={() => {
                  const result = useGameStore.getState().hatch();
                  if (result) {
                    playSfx('hatch');
                    successFeedback();
                    setReveal(result);
                  }
                }}
              />
            </TutorialSpot>
          )}
        </View>
      ) : null}
      <GameModal visible={reveal !== null} onClose={() => setReveal(null)} testID="hatch-reveal">
        {reveal ? (
          <>
            <GameText size={22} weight="black" center>
              🎉{' '}
              {reveal.duplicate
                ? t('incubator.duplicate', { name: dinoName(reveal.dinoId), level: reveal.level })
                : t('incubator.hatched', { name: dinoName(reveal.dinoId) })}
            </GameText>
            <DinoAvatar dinoId={reveal.dinoId} size={120} ring />
            <GameText color={rarityColors[DINO_BY_ID[reveal.dinoId]?.rarity ?? 'common']} weight="black" center>
              {t(`rarity.${DINO_BY_ID[reveal.dinoId]?.rarity ?? 'common'}`)}
            </GameText>
            <ChunkyButton label={t('common.continue')} onPress={() => setReveal(null)} />
          </>
        ) : null}
      </GameModal>
    </Panel>
  );
}

/** Incubadora: huevos por rareza, temporizador y aceleración con Ámbar o anuncio. */
export default function IncubatorScreen() {
  const { t } = useTranslation();
  const eggs = useGameStore((s) => s.game.eggs);
  const busy = useGameStore((s) => s.game.incubator !== null);
  const game = useGameStore((s) => s.game);
  const now = useNow(5000);

  return (
    <Screen background="jungle" edges={['top']}>
      <CurrencyBar />
      <ScrollView contentContainerStyle={styles.content}>
        <Banner text={t('incubator.title')} />
        <GameText color={colors.textLight} weight="black" outline center>
          {t('incubator.subtitle')}
        </GameText>
        <Capsule />
        <Panel title={t('incubator.eggTypes')}>
          {RARITIES.map((rarity) => (
            <View key={rarity} style={styles.eggRow}>
              <EggIcon rarity={rarity} size={38} />
              <View style={styles.flex}>
                <GameText weight="black" color={rarityColors[rarity]}>
                  {t(`rarity.${rarity}`)} ×{eggs[rarity]}
                </GameText>
                <GameText size={12} color={colors.muted}>
                  ⏳ {formatDuration(hatchSeconds(game, rarity, now))}
                </GameText>
              </View>
              {rarity === 'common' ? (
                <TutorialSpot id="incubate-common">
                  <ChunkyButton
                    testID={`incubate-${rarity}`}
                    size="sm"
                    disabled={busy || eggs[rarity] <= 0}
                    label={busy ? t('incubator.busy') : t('incubator.incubate')}
                    onPress={() => useGameStore.getState().startIncubation(rarity)}
                  />
                </TutorialSpot>
              ) : (
                <ChunkyButton
                  testID={`incubate-${rarity}`}
                  size="sm"
                  disabled={busy || eggs[rarity] <= 0}
                  label={busy ? t('incubator.busy') : t('incubator.incubate')}
                  onPress={() => useGameStore.getState().startIncubation(rarity)}
                />
              )}
            </View>
          ))}
        </Panel>
        <Panel title={t('incubator.odds')}>
          {RARITIES.map((rarity) => (
            <View key={rarity} style={styles.oddsRow}>
              <GameText color={rarityColors[rarity]} weight="black">
                {t(`rarity.${rarity}`)}
              </GameText>
              <GameText weight="black">{(EGG_DROP_ODDS[rarity] * 100).toFixed(1)}%</GameText>
            </View>
          ))}
        </Panel>
      </ScrollView>
      <BottomNav />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 14, gap: 12 },
  capsule: { alignItems: 'center' },
  glass: {
    width: 170,
    height: 190,
    borderRadius: 60,
    backgroundColor: 'rgba(160,230,255,0.55)',
    borderWidth: 6,
    borderColor: '#3D8BC9',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  base: { width: 200, height: 28, marginTop: -8, borderRadius: radius.md, backgroundColor: '#2F5F8F' },
  controls: { gap: 10, marginTop: 12 },
  row: { flexDirection: 'row', gap: 10 },
  flex: { flex: 1 },
  eggRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 },
  oddsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 },
});
