import { useEffect, useRef } from 'react';
import { Image, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { formatNumber } from '@/game/format';
import { getArt } from '../art';
import { GameIcon } from '../GameIcon';
import { GameText } from '../GameText';
import { colors } from '../theme';

export const BASKET_WIDTH = 66;
export const BASKET_HEIGHT = 52;

/**
 * Canasta de huesos de un sótano (arte: museum/basket) con el contador encima.
 * Da un saltito cada vez que el dino deja huesos.
 */
export function BoneBasket({ amount, style }: { amount: number; style?: StyleProp<ViewStyle> }) {
  const art = getArt('museum/basket');
  const hop = useSharedValue(0);
  const last = useRef(amount);

  useEffect(() => {
    if (amount > last.current) hop.value = withSequence(withTiming(1, { duration: 110 }), withTiming(0, { duration: 220 }));
    last.current = amount;
  }, [amount, hop]);

  const hopStyle = useAnimatedStyle(() => ({ transform: [{ translateY: -hop.value * 5 }, { scaleX: 1 + hop.value * 0.08 }] }));

  return (
    <View pointerEvents="none" style={[styles.wrap, style]}>
      <View style={styles.counter}>
        <GameIcon name="fossils" size={16} />
        <GameText size={12} color={colors.textLight} weight="black" outline numberOfLines={1}>
          {formatNumber(amount)}
        </GameText>
      </View>
      <Animated.View style={hopStyle}>
        {art ? (
          <Image source={art} resizeMode="contain" style={styles.art} />
        ) : (
          // Placeholder: canasta de mimbre con huesos asomando.
          <View style={styles.art}>
            <View style={styles.bones}>
              <GameIcon name="fossils" size={20} />
              <GameIcon name="fossils" size={24} />
              <GameIcon name="fossils" size={20} />
            </View>
            <View style={styles.basket}>
              <View style={styles.weave} />
            </View>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: BASKET_WIDTH, alignItems: 'center' },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    // Monta un poco sobre el borde de la canasta y deja aire al manager de arriba.
    marginBottom: -6,
    zIndex: 1,
    paddingLeft: 2,
    paddingRight: 6,
    borderRadius: 999,
    backgroundColor: '#3E2A1A',
    borderWidth: 2,
    borderColor: '#1F140B',
  },
  art: { width: BASKET_WIDTH, height: BASKET_HEIGHT, justifyContent: 'flex-end' },
  bones: { flexDirection: 'row', justifyContent: 'center', marginBottom: -12, zIndex: 0 },
  basket: {
    height: 32,
    marginHorizontal: 4,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    backgroundColor: '#D9A066',
    borderWidth: 2,
    borderColor: colors.woodDark,
    padding: 3,
  },
  weave: { flex: 1, borderRadius: 10, borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.woodDark },
});
