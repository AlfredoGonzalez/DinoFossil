import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { DINOS } from '@/data/dinos';
import { carrierCapacity } from '@/game/economy';
import { formatNumber } from '@/game/format';
import { getModifiers } from '@/game/modifiers';
import { useTranslation } from '@/i18n';
import { tapFeedback } from '@/services/feedback';
import { useGameStore } from '@/store/gameStore';
import { getArt } from '../art';
import { GameText } from '../GameText';
import { DinoAvatar, ResourceIcon } from '../Icons';
import { colors } from '../theme';
import { Floor } from './Floor';
import { ManagerSlot } from './ManagerSlot';
import { StationStatus } from './StationStatus';
import { UpgradeChip } from './UpgradeChip';

const MAX_EXHIBITS = 4;

/** Visitante que cruza la sala de un lado a otro. */
function Visitor({ width }: { width: number }) {
  const x = useSharedValue(0);
  useEffect(() => {
    x.value = withRepeat(withTiming(1, { duration: 9000, easing: Easing.linear }), -1);
  }, [x]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateX: -30 + x.value * (width + 60) }] }));
  const art = getArt('museum/visitor');
  return (
    <Animated.View pointerEvents="none" style={[styles.visitor, style]}>
      {art ? <Image source={art} style={styles.visitorArt} resizeMode="contain" /> : <GameText size={22}>🧒</GameText>}
    </Animated.View>
  );
}

/** Planta alta: la sala de exposición (estación "museum" del motor) vende los fósiles limpios. */
export function HallFloor({ onUpgrade, onPickManager }: { onUpgrade: () => void; onPickManager: () => void }) {
  const { t } = useTranslation();
  const [width, setWidth] = useState(0);
  const station = useGameStore((s) => s.game.mine.museum);
  const manager = useGameStore((s) => s.game.managers.museum);
  const ready = useGameStore((s) => s.game.mine.surface);
  const dinos = useGameStore((s) => s.game.dinos);
  const capacity = useGameStore((s) => carrierCapacity('museum', s.game.mine.museum.level) * getModifiers(s.game, Date.now()).museumCapacity);
  const exhibits = DINOS.filter((d) => dinos[d.id]).slice(0, MAX_EXHIBITS);
  const idle = !manager && !station.running;

  return (
    <Floor art={getArt('museum/hall')} color="#F3D9A4" floorColor="#A4693B">
      <ManagerSlot station="museum" onPick={onPickManager} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="tap-museum"
        style={styles.body}
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        onPress={() => {
          if (!idle) return;
          tapFeedback();
          useGameStore.getState().tap('museum');
        }}
      >
        <View style={styles.titleRow}>
          <GameText size={13} weight="black" color={colors.text}>
            🏛️ {t('mine.museum')}
          </GameText>
          <View style={styles.stock}>
            <ResourceIcon kind="fossils" size={14} />
            <GameText size={12} weight="black" color={colors.text}>
              {formatNumber(ready)}
            </GameText>
          </View>
        </View>
        <View style={styles.exhibits}>
          {exhibits.map((d) => (
            <View key={d.id} style={styles.pedestal}>
              <DinoAvatar dinoId={d.id} size={30} />
            </View>
          ))}
        </View>
        {width > 0 && (manager || station.running) ? <Visitor width={width} /> : null}
        <StationStatus idle={idle} progress={station.progress} color={colors.gold} />
      </Pressable>
      <View style={styles.side}>
        <UpgradeChip station="museum" level={station.level} onPress={onUpgrade} />
        <GameText size={10} weight="black" color={colors.text} center>
          {t('mine.perCycle', { value: formatNumber(capacity) })}
        </GameText>
      </View>
    </Floor>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, height: '86%', justifyContent: 'space-between', paddingVertical: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stock: { flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 8, paddingHorizontal: 5 },
  exhibits: { flexDirection: 'row', gap: 6 },
  pedestal: { paddingBottom: 3, borderBottomWidth: 5, borderBottomColor: '#C9A06A', borderRadius: 4 },
  visitor: { position: 'absolute', bottom: 12, left: 0 },
  visitorArt: { width: 30, height: 30 },
  side: { alignItems: 'center', gap: 3, width: 70 },
});
