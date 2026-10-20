import { useEffect } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { useTranslation } from '@/i18n';
import { GameIcon } from '../GameIcon';
import { GameText } from '../GameText';
import { colors } from '../theme';

const HAND = 28;

/**
 * Aviso flotante sobre el dino en reposo: una manita que "toca" hacia abajo y un globo
 * "¡Toca!" que late. Solo decora: el toque lo recibe la planta entera.
 */
export function TapHint({ style }: { style?: StyleProp<ViewStyle> }) {
  const { t } = useTranslation();
  const tap = useSharedValue(0);

  useEffect(() => {
    tap.value = withRepeat(
      withSequence(withTiming(1, { duration: 320, easing: Easing.in(Easing.quad) }), withTiming(0, { duration: 480, easing: Easing.out(Easing.quad) })),
      -1,
    );
    return () => cancelAnimation(tap);
  }, [tap]);

  const handStyle = useAnimatedStyle(() => ({ transform: [{ translateY: tap.value * 8 }, { scale: 1 - tap.value * 0.12 }] }));
  const labelStyle = useAnimatedStyle(() => ({ transform: [{ scale: 1 + tap.value * 0.1 }] }));

  return (
    <View pointerEvents="none" style={[styles.wrap, style]}>
      <Animated.View style={[styles.label, labelStyle]}>
        <GameText size={13} color={colors.text} weight="black">
          {t('mine.tap')}
        </GameText>
      </Animated.View>
      <Animated.View style={handStyle}>
        <GameIcon name="tap" size={HAND} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  label: {
    marginBottom: 12,
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: 10,
    backgroundColor: colors.gold,
    borderWidth: 2,
    borderColor: colors.goldDark,
  },
});
