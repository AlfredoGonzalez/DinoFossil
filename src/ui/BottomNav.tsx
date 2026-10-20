import { router, usePathname, type Href } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { claimableGoals } from '@/game/goals';
import { incubatorRemaining } from '@/game/collection';
import { useTranslation } from '@/i18n';
import { tapFeedback } from '@/services/feedback';
import { useGameStore } from '@/store/gameStore';
import { useNow } from './hooks';
import { GameText } from './GameText';
import { GameIcon } from './GameIcon';
import type { IconName } from './iconNames';
import { colors } from './theme';

const TABS: { key: 'map' | 'dinos' | 'incubator' | 'shop' | 'goals'; icon: IconName; href: Href }[] = [
  { key: 'map', icon: 'nav-map', href: '/map' },
  { key: 'dinos', icon: 'nav-dinos', href: '/collection' },
  { key: 'incubator', icon: 'nav-eggs', href: '/incubator' },
  { key: 'shop', icon: 'nav-shop', href: '/shop' },
  { key: 'goals', icon: 'nav-missions', href: '/goals' },
];

export function BottomNav() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const now = useNow(1000);
  const goalsBadge = useGameStore((s) => claimableGoals(s.game).length > 0);
  const eggBadge = useGameStore((s) => (s.game.incubator ? incubatorRemaining(s.game, now) <= 0 : Object.values(s.game.eggs).some((n) => n > 0)));
  return (
    <View style={styles.bar}>
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        const badge = (tab.key === 'goals' && goalsBadge) || (tab.key === 'incubator' && eggBadge);
        return (
          <Pressable
            key={tab.key}
            accessibilityRole="button"
            accessibilityLabel={t(`nav.${tab.key}`)}
            style={[styles.tab, active && styles.active]}
            onPress={() => {
              tapFeedback();
              if (!active) router.push(tab.href);
            }}
          >
            <GameIcon name={tab.icon} size={30} />
            <GameText size={12} color={colors.textLight} weight="black" outline>
              {t(`nav.${tab.key}`)}
            </GameText>
            {badge ? <View style={styles.badge} /> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 6,
    backgroundColor: colors.woodDark,
    borderTopWidth: 3,
    borderTopColor: '#5E3A1E',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.wood,
    borderWidth: 2,
    borderColor: '#5E3A1E',
    borderStyle: 'dashed',
  },
  active: { backgroundColor: colors.green, borderColor: colors.greenDark, borderStyle: 'solid' },
  badge: {
    position: 'absolute',
    top: -4,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.red,
    borderWidth: 2,
    borderColor: '#fff',
  },
});
