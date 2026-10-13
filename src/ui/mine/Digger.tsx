import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { DINO_BY_ID } from '@/data/dinos';
import { GameText } from '../GameText';

/** Dino excavando: se balancea mientras la estación trabaja. */
export function Digger({ dinoId, running, tool = '⛏️' }: { dinoId?: string; running: boolean; tool?: string }) {
  const swing = useSharedValue(0);

  useEffect(() => {
    if (running) {
      swing.value = withRepeat(withSequence(withTiming(1, { duration: 220 }), withTiming(0, { duration: 220 })), -1);
    } else {
      cancelAnimation(swing);
      swing.value = withTiming(0);
    }
  }, [running, swing]);

  const bodyStyle = useAnimatedStyle(() => ({ transform: [{ translateY: -swing.value * 4 }] }));
  const toolStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${-35 + swing.value * 60}deg` }] }));
  const emoji = (dinoId && DINO_BY_ID[dinoId]?.emoji) || '🦖';

  return (
    <View style={styles.wrap}>
      <Animated.View style={bodyStyle}>
        <GameText size={40} style={{ lineHeight: 48 }}>
          {emoji}
        </GameText>
      </Animated.View>
      <Animated.View style={[styles.tool, toolStyle]}>
        <GameText size={22}>{tool}</GameText>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'flex-end' },
  tool: { marginLeft: -8, marginBottom: 14 },
});
