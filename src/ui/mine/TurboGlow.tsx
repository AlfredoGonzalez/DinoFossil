import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

/** Resplandor dorado que late sobre toda la planta mientras el Turbo del manager está activo. */
export function TurboGlow() {
  const pulse = useSharedValue(0);
  useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 700, easing: Easing.inOut(Easing.sin) }), -1, true);
    return () => cancelAnimation(pulse);
  }, [pulse]);
  const style = useAnimatedStyle(() => ({ opacity: 0.08 + pulse.value * 0.16 }));
  return <Animated.View pointerEvents="none" style={[styles.glow, style]} />;
}

const styles = StyleSheet.create({
  // Se extiende más allá de la escena para cubrir todo el piso (la planta recorta lo que sobra).
  glow: { position: 'absolute', top: -10, bottom: -10, left: -20, right: -80, backgroundColor: '#FFD54A' },
});
