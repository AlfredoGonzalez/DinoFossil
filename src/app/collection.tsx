import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { ABILITY, DINOS, DINO_BY_ID } from '@/data/dinos';
import { collectionBonuses, dinoBonusValue } from '@/game/modifiers';
import type { BonusType } from '@/game/types';
import { dinoName, useTranslation } from '@/i18n';
import { tapFeedback } from '@/services/feedback';
import { useGameStore } from '@/store/gameStore';
import { BottomNav } from '@/ui/BottomNav';
import { ChunkyButton } from '@/ui/ChunkyButton';
import { CurrencyBar } from '@/ui/CurrencyBar';
import { GameModal } from '@/ui/GameModal';
import { GameText } from '@/ui/GameText';
import { IconLabel } from '@/ui/IconLabel';
import { DinoAvatar } from '@/ui/Icons';
import { Banner, Panel } from '@/ui/Panel';
import { Screen } from '@/ui/Screen';
import { colors, radius, rarityColors } from '@/ui/theme';

/** Colección de 24 especies con sus bonus pasivos. */
export default function CollectionScreen() {
  const { t } = useTranslation();
  const dinos = useGameStore((s) => s.game.dinos);
  const game = useGameStore((s) => s.game);
  const [selected, setSelected] = useState<string | null>(null);
  const discovered = DINOS.filter((d) => dinos[d.id]).length;
  const bonuses = collectionBonuses(game);
  const species = selected ? DINO_BY_ID[selected] : undefined;
  const owned = selected ? dinos[selected] : undefined;

  const bonusText = (type: BonusType, value: number) => t(`bonus.${type}`, { value: Math.round(value) });

  return (
    <Screen background="night" edges={['top']}>
      <CurrencyBar />
      <ScrollView contentContainerStyle={styles.content}>
        <Banner text={t('collection.title')} color={colors.blue} />
        <GameText color={colors.textLight} outline center>
          {t('collection.subtitle')}
        </GameText>
        <View style={styles.grid}>
          {DINOS.map((d) => {
            const have = dinos[d.id];
            return (
              <Pressable
                key={d.id}
                accessibilityRole="button"
                accessibilityLabel={`dino-${d.id}`}
                style={[styles.card, { borderColor: have ? rarityColors[d.rarity] : '#7C8CA8' }]}
                onPress={() => {
                  tapFeedback();
                  setSelected(d.id);
                }}
              >
                <DinoAvatar dinoId={d.id} size={64} silhouette={!have} />
                <GameText size={12} weight="black" center numberOfLines={1}>
                  {have ? dinoName(d.id) : t('collection.unknown')}
                </GameText>
                {have ? (
                  <View style={[styles.level, { backgroundColor: rarityColors[d.rarity] }]}>
                    <GameText size={10} color={colors.textLight} weight="black">
                      {t('common.lvl', { level: have.level })}
                    </GameText>
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>
        <Panel>
          <GameText weight="black" center>
            {t('collection.discovered', { count: discovered, total: DINOS.length })}
          </GameText>
        </Panel>
        <Panel title={t('collection.bonus')}>
          {(Object.entries(bonuses) as [BonusType, number][])
            .filter(([, v]) => v > 0)
            .map(([type, value]) => (
              <GameText key={type} size={14}>
                • {bonusText(type, value)}
              </GameText>
            ))}
        </Panel>
      </ScrollView>
      <BottomNav />
      <GameModal visible={!!species} onClose={() => setSelected(null)} title={species && owned ? dinoName(species.id) : t('collection.unknown')}>
        {species ? (
          <>
            <DinoAvatar dinoId={species.id} size={110} silhouette={!owned} ring={!!owned} />
            <GameText color={rarityColors[species.rarity]} weight="black" center>
              {t(`rarity.${species.rarity}`)}
            </GameText>
            {owned ? (
              <GameText center>
                {t('common.level', { level: owned.level })} · {t('collection.copies', { count: owned.count })}
              </GameText>
            ) : null}
            <View style={styles.infoBox}>
              <GameText size={13} weight="black">
                {t('collection.bonus')}
              </GameText>
              <GameText size={14}>
                {bonusText(species.bonus, dinoBonusValue(species, owned?.level ?? 1))}
              </GameText>
            </View>
            <View style={styles.infoBox}>
              <GameText size={13} weight="black">
                {t('collection.ability')}
              </GameText>
              <IconLabel icon="turbo" size={14}>
                <GameText size={14}>
                  {t('managers.turbo', { mult: ABILITY[species.rarity].multiplier, seconds: ABILITY[species.rarity].seconds })}
                </GameText>
              </IconLabel>
            </View>
            <ChunkyButton label={t('common.close')} onPress={() => setSelected(null)} />
          </>
        ) : null}
      </GameModal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 14, gap: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  card: {
    width: '31%',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor: colors.parchment,
    borderRadius: radius.md,
    borderWidth: 3,
  },
  level: { position: 'absolute', top: 4, right: 4, borderRadius: 8, paddingHorizontal: 5 },
  infoBox: { padding: 10, borderRadius: radius.sm, backgroundColor: colors.parchmentDark, gap: 2 },
});
