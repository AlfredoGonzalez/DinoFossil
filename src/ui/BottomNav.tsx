import { router, usePathname, type Href } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withSequence, withTiming } from 'react-native-reanimated';
import { incubatorRemaining } from '@/game/collection';
import { useTranslation } from '@/i18n';
import { tapFeedback } from '@/services/feedback';
import { useGameStore } from '@/store/gameStore';
import { GameIcon } from './GameIcon';
import { TutorialSpot, type TutorialTargetId } from './tutorial/TutorialAnchor';
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

const GROW_MS = 600;

/**
 * Icono que, al activarse, sube poco a poco saliendo de su casilla mientras crece y,
 * al terminar, se sacude. Siempre arranca en reposo: al cambiar de pestaña se monta
 * una barra nueva y, si empezara ya crecido, la animación no se vería.
 */
function TabIcon({ icon, active }: { icon: IconName; active: boolean }) {
  const lift = useSharedValue(0);
  const wiggle = useSharedValue(0);

  useEffect(() => {
    lift.value = withTiming(active ? 1 : 0, { duration: GROW_MS, easing: Easing.inOut(Easing.cubic) });
    wiggle.value = active
      ? withDelay(
          GROW_MS,
          withSequence(
            withTiming(-1, { duration: 80 }),
            withTiming(1, { duration: 120 }),
            withTiming(-0.6, { duration: 110 }),
            withTiming(0.3, { duration: 100 }),
            withTiming(0, { duration: 90 }),
          ),
        )
      : 0;
  }, [active, lift, wiggle]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: -lift.value * 22 }, { scale: 1 + lift.value * 0.45 }, { rotate: `${wiggle.value * 12}deg` }],
  }));

  return (
    <Animated.View style={style}>
      <GameIcon name={icon} size={ICON} />
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
        const badge = tab.key === 'incubator' && eggBadge;
        return (
          <TutorialSpot key={tab.key} id={`nav-${tab.key}` as TutorialTargetId} style={styles.spot}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t(`nav.${tab.key}`)}
            style={[styles.tab, styles.fill, active && styles.active]}
            onPress={() => {
              tapFeedback();
              // Tutorial: "vamos a los huevos" / "mira tu dino en la colección".
              if (tab.key === 'incubator') useGameStore.getState().completeTutorialStep('goEggs');
              if (tab.key === 'dinos') useGameStore.getState().completeTutorialStep('goDinos');
              // replace: las pestañas se sustituyen entre sí, así no se acumulan pantallas al ir y volver.
              if (!active) router.replace(tab.href);
            }}
          >
            <TabIcon icon={tab.icon} active={active} />
            <GameText size={11} color={colors.textLight} weight="black" outline numberOfLines={1}>
              {t(`nav.${tab.key}`)}
            </GameText>
            {badge ? <View style={styles.badge} /> : null}
          </Pressable>
          </TutorialSpot>
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
  // La pestaña ocupa todo su hueco (TutorialSpot, que la envuelve para el tutorial).
  spot: { flex: 1 },
  fill: { alignSelf: 'stretch' },
  tab: {
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
  // Pestaña activa: madera clara con borde liso (las inactivas, madera con costura punteada).
  active: { backgroundColor: colors.orange, borderColor: colors.orangeDark, borderStyle: 'solid' },
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
