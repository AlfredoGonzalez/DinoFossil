import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { WORLDS } from '@/data/worlds';
import { useTranslation } from '@/i18n';
import { ChunkyButton } from '@/ui/ChunkyButton';
import { GameText } from '@/ui/GameText';
import { EggIcon, ResourceIcon } from '@/ui/Icons';
import { Banner, Panel } from '@/ui/Panel';
import { Screen } from '@/ui/Screen';
import { colors, radius } from '@/ui/theme';

/** Intro de un mundo antes de entrar a la mina. */
export default function WorldScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const world = WORLDS.find((w) => String(w.id) === id) ?? WORLDS[0]!;
  const key = world.key as 'eggValley';

  return (
    <Screen background="jungle">
      <View style={styles.container}>
        <GameText size={18} color={colors.textLight} weight="black" outline center>
          {t('world.title')}
        </GameText>
        <Banner text={t(`worlds.${key}.name`)} />
        <View style={[styles.art, { backgroundColor: world.color }]}>
          <GameText size={120} style={{ lineHeight: 140 }}>
            {world.emoji}
          </GameText>
        </View>
        <Panel>
          <GameText center>{t(`worlds.${key}.desc`)}</GameText>
        </Panel>
        <Panel>
          <GameText weight="black">{t('world.rewards')}</GameText>
          <View style={styles.rewards}>
            {(['coins', 'eggs', 'plants', 'fossils'] as const).map((kind) => (
              <View key={kind} style={styles.reward}>
                {kind === 'eggs' ? <EggIcon rarity="common" size={34} /> : <ResourceIcon kind={kind} size={34} />}
              </View>
            ))}
          </View>
          <ChunkyButton
            testID="explore"
            size="lg"
            label={t('world.explore')}
            sublabel={t('world.stage')}
            disabled={!world.playable}
            onPress={() => router.replace('/mine')}
          />
        </Panel>
        <View style={styles.footer}>
          <ChunkyButton variant="blue" label={`◀ ${t('common.back')}`} onPress={() => router.back()} />
          <GameText size={70} style={{ lineHeight: 80 }}>
            🦖
          </GameText>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  art: {
    flex: 1,
    minHeight: 140,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  rewards: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
  reward: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.parchmentDark,
    borderWidth: 2,
    borderColor: colors.wood,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
});
