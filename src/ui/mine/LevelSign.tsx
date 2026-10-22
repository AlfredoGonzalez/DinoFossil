import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { formatNumber } from '@/game/format';
import type { StationId } from '@/game/types';
import { upgradeQuote } from '@/game/upgrades';
import { useTranslation } from '@/i18n';
import { tapFeedback } from '@/services/feedback';
import { useGameStore } from '@/store/gameStore';
import { GameIcon } from '../GameIcon';
import { GameText } from '../GameText';
import { colors } from '../theme';

/** 0 = no alcanza · 1 = alcanza un nivel · 2 = alcanza para llegar al siguiente hito ×2. */
type Reach = 0 | 1 | 2;

/** Flecha (o doble flecha) que late como un corazón: "pum-pum" y pausa. */
function BeatingArrow({ double }: { double: boolean }) {
  const beat = useSharedValue(1);
  useEffect(() => {
    beat.value = withRepeat(
      withSequence(
        withTiming(1.35, { duration: 120 }),
        withTiming(1, { duration: 120 }),
        withTiming(1.25, { duration: 120 }),
        withTiming(1, { duration: 160 }),
        withDelay(600, withTiming(1, { duration: 0 })),
      ),
      -1,
    );
    return () => cancelAnimation(beat);
  }, [beat]);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: beat.value }] }));
  return (
    <Animated.View style={[styles.arrows, style]}>
      <GameIcon name="upgrade" size={16} />
      {double ? <GameIcon name="upgrade" size={16} style={styles.second} /> : null}
    </Animated.View>
  );
}

/**
 * Letrero de madera con el nivel de la planta: clavado en el montón de tierra en los sótanos,
 * arriba a la izquierda en el laboratorio.
 * Se pone verde con una flecha que late cuando alcanza para mejorar, y con doble flecha
 * si alcanza para llegar al siguiente hito ×2. Abre el panel de mejora.
 */
export function LevelSign({
  station,
  level,
  detail,
  post = true,
  onPress,
}: {
  station: StationId;
  level: number;
  /** Segunda línea: producción o capacidad ya formateada. */
  detail: string;
  /** Palo para clavarlo en la tierra (sótanos); en el laboratorio cuelga sin él. */
  post?: boolean;
  onPress: () => void;
}) {
  const { t } = useTranslation();
  // Devuelve un número: los selectores deben dar valores estables.
  const reach = useGameStore((s): Reach => {
    const now = Date.now();
    const canBuy = (amount: 1 | 'milestone') => {
      const quote = upgradeQuote(s.game, station, amount, now);
      return quote.levels > 0 && quote.cost <= s.game.coins;
    };
    return canBuy('milestone') ? 2 : canBuy(1) ? 1 : 0;
  });
  const affordable = reach > 0;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`upgrade-${station}`}
      onPress={() => {
        tapFeedback();
        onPress();
      }}
      style={styles.wrap}
    >
      <View style={[styles.board, affordable ? styles.ready : styles.idle]}>
        <View style={styles.stitch} />
        <View style={styles.row}>
          {affordable ? <BeatingArrow double={reach === 2} /> : null}
          <GameText size={11} color={colors.textLight} weight="black" outline>
            {t('common.lvlShort')}
          </GameText>
          <GameText size={16} color={colors.textLight} weight="black" outline>
            {formatNumber(level)}
          </GameText>
        </View>
        <GameText size={10} color={colors.textLight} weight="black" outline center>
          {detail}
        </GameText>
      </View>
      {post ? <View style={styles.post} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  board: { minWidth: 64, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 2 },
  stitch: { position: 'absolute', top: 2, left: 2, right: 2, bottom: 2, borderRadius: 6, borderWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(255, 240, 210, 0.6)' },
  arrows: { flexDirection: 'row' },
  second: { marginLeft: -9 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3 },
  ready: { backgroundColor: colors.green, borderColor: colors.greenDark },
  idle: { backgroundColor: colors.wood, borderColor: colors.woodDark },
  // Palo que lo clava en la tierra.
  post: { width: 6, height: 12, marginTop: -1, backgroundColor: colors.woodDark, borderBottomLeftRadius: 2, borderBottomRightRadius: 2 },
});
