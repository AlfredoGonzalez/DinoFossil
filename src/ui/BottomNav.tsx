import { router, usePathname, type Href } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { incubatorRemaining } from '@/game/collection';
import { useTranslation } from '@/i18n';
import { tapFeedback } from '@/services/feedback';
import { useGameStore } from '@/store/gameStore';
import { GameIcon } from './GameIcon';
import { GameText } from './GameText';
import { useNow } from './hooks';
import type { IconName } from './iconNames';
import { colors } from './theme';

type TabKey = 'map' | 'dinos' | 'museum' | 'incubator' | 'shop';

/** El botón central (Casa-Museo) es la pantalla principal: un toque desde cualquier sitio vuelve al juego. */
const TABS: { key: TabKey; icon: IconName; href: Href }[] = [
  { key: 'map', icon: 'nav-map', href: '/map' },
  { key: 'dinos', icon: 'nav-dinos', href: '/collection' },
  { key: 'museum', icon: 'nav-museum', href: '/mine' },
  { key: 'incubator', icon: 'nav-eggs', href: '/incubator' },
  { key: 'shop', icon: 'nav-shop', href: '/shop' },
];

const ICON = 34;

/** Icono que, al activarse, salta hacia arriba saliendo de su casilla, crece y se balancea. */
function TabIcon({ icon, active, big }: { icon: IconName; active: boolean; big: boolean }) {
  const lift = useSharedValue(active ? 1 : 0);
  const wiggle = useSharedValue(0);

  useEffect(() => {
    lift.value = withSpring(active ? 1 : 0, { damping: 9, stiffness: 180 });
    if (active) {
      wiggle.value = withSequence(withTiming(-1, { duration: 90 }), withTiming(1, { duration: 140 }), withTiming(-0.5, { duration: 120 }), withTiming(0, { duration: 120 }));
    }
  }, [active, lift, wiggle]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: -lift.value * (big ? 14 : 22) },
      { scale: 1 + lift.value * (big ? 0.25 : 0.45) },
      { rotate: `${wiggle.value * 10}deg` },
    ],
  }));

  return (
    <Animated.View style={style}>
      <GameIcon name={icon} size={big ? 48 : ICON} />
    </Animated.View>
  );
}

export function BottomNav() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const now = useNow(1000);
  const eggBadge = useGameStore((s) => (s.game.incubator ? incubatorRemaining(s.game, now) <= 0 : Object.values(s.game.eggs).some((n) => n > 0)));
  return (
    <View style={styles.bar}>
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        const big = tab.key === 'museum';
        const badge = tab.key === 'incubator' && eggBadge;
        return (
          <Pressable
            key={tab.key}
            accessibilityRole="button"
            accessibilityLabel={t(`nav.${tab.key}`)}
            style={[styles.tab, big && styles.bigTab, active && styles.active]}
            onPress={() => {
              tapFeedback();
              // replace: las pestañas se sustituyen entre sí, así no se acumulan pantallas al ir y volver.
              if (!active) router.replace(tab.href);
            }}
          >
            <TabIcon icon={tab.icon} active={active} big={big} />
            <GameText size={11} color={colors.textLight} weight="black" outline numberOfLines={1}>
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
    alignItems: 'flex-end',
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
    height: 62,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 4,
    borderRadius: 12,
    backgroundColor: colors.wood,
    borderWidth: 2,
    borderColor: '#5E3A1E',
    borderStyle: 'dashed',
  },
  // El botón central es más grande y sobresale de la barra.
  bigTab: { flex: 1.25, height: 80, marginTop: -22, borderRadius: 16, backgroundColor: colors.orange, borderColor: colors.orangeDark, borderStyle: 'solid' },
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
