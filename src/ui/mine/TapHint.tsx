import { useEffect } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { GameIcon } from '../GameIcon';

const HAND = 28;

/**
 * Aviso flotante sobre el dino en reposo: una manita que "toca" hacia abajo. Sin texto:
 * el gesto basta. Solo decora: el toque lo recibe la planta entera.
 */
export function TapHint({ style }: { style?: StyleProp<ViewStyle> }) {
  const tap = useSharedValue(0);

  useEffect(() => {
    tap.value = withRepeat(
      withSequence(withTiming(1, { duration: 320, easing: Easing.in(Easing.quad) }), withTiming(0, { duration: 480, easing: Easing.out(Easing.quad) })),
      -1,
    );
    return () => cancelAnimation(tap);
  }, [tap]);

  const handStyle = useAnimatedStyle(() => ({ transform: [{ translateY: tap.value * 8 }, { scale: 1 - tap.value * 0.12 }] }));

  return (
    <View pointerEvents="none" style={[styles.wrap, style]}>
      <Animated.View style={handStyle}>
        <GameIcon name="tap" size={HAND} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
});
