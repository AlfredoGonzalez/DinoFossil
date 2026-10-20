import { router } from 'expo-router';
import { useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { WORLDS } from '@/data/worlds';
import { worldStars } from '@/game/goals';
import { useTranslation } from '@/i18n';
import { tapFeedback } from '@/services/feedback';
import { useGameStore } from '@/store/gameStore';
import { BottomNav } from '@/ui/BottomNav';
import { CurrencyBar } from '@/ui/CurrencyBar';
import { GameText } from '@/ui/GameText';
import { GameIcon } from '@/ui/GameIcon';
import { Stars } from '@/ui/Stars';
import { Screen } from '@/ui/Screen';
import { colors, radius } from '@/ui/theme';

/** Mapa de los 9 mundos: el 1 abajo y el 9 arriba, en zigzag. */
export default function MapScreen() {
  const { t } = useTranslation();
  const stars = useGameStore((s) => worldStars(s.game));
  const scroll = useRef<ScrollView>(null);
  const ordered = [...WORLDS].reverse();

  return (
    <Screen background="sky" edges={['top']}>
      <CurrencyBar />
      <ScrollView ref={scroll} contentContainerStyle={styles.list} onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: false })}>
        {ordered.map((world, i) => {
          const name = t(`worlds.${world.key}.name` as 'worlds.eggValley.name');
          return (
            <Pressable
              key={world.id}
              accessibilityRole="button"
              accessibilityLabel={name}
              disabled={!world.playable}
              onPress={() => {
                tapFeedback();
                router.push(`/world/${world.id}`);
              }}
              style={[styles.island, { alignSelf: i % 2 === 0 ? 'flex-start' : 'flex-end' }]}
            >
              <View style={[styles.islandTop, { backgroundColor: world.color, opacity: world.playable ? 1 : 0.75 }]}>
                <GameText size={46} style={{ lineHeight: 56 }}>
                  {world.emoji}
                </GameText>
                {!world.playable ? (
                  <View style={styles.lock}>
                    <GameIcon name="lock" size={24} />
                  </View>
                ) : null}
              </View>
              <View style={styles.islandDirt} />
              <View style={styles.label}>
                <GameText size={13} weight="black" center>
                  {world.id}. {name}
                </GameText>
                {world.playable ? (
                  <Stars filled={stars} size={15} />
                ) : (
                  <GameText size={11} color={colors.muted} center>
                    {t('map.locked')}
                  </GameText>
                )}
              </View>
            </Pressable>
          );
        })}
        <View style={styles.sign}>
          <GameText size={16} weight="black" center>
            {t('map.sign')}
          </GameText>
        </View>
      </ScrollView>
      <BottomNav />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: 20, gap: 4 },
  island: { width: '58%', alignItems: 'center' },
  islandTop: {
    width: '100%',
    height: 92,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(0,0,0,0.18)',
  },
  islandDirt: {
    width: '80%',
    height: 22,
    marginTop: -6,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    backgroundColor: colors.dirt,
  },
  lock: {
    position: 'absolute',
    bottom: 6,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 14,
    paddingHorizontal: 4,
  },
  label: {
    marginTop: -12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: colors.parchment,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.woodDark,
  },
  sign: {
    alignSelf: 'flex-end',
    width: 170,
    marginTop: -40,
    padding: 10,
    backgroundColor: colors.wood,
    borderRadius: radius.sm,
    borderWidth: 3,
    borderColor: colors.woodDark,
    transform: [{ rotate: '-6deg' }],
  },
});
