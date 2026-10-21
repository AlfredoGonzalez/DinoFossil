import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { DINOS } from '@/data/dinos';
import { carrierCapacity } from '@/game/economy';
import { formatNumber } from '@/game/format';
import { getModifiers } from '@/game/modifiers';
import { useTranslation } from '@/i18n';
import { tapFeedback } from '@/services/feedback';
import { useGameStore } from '@/store/gameStore';
import { getArt } from '../art';
import { GameText } from '../GameText';
import { IconLabel } from '../IconLabel';
import { DinoAvatar, ResourceIcon } from '../Icons';
import { getSheet } from '../spriteSheets';
import { SpriteSheet } from '../SpriteSheet';
import { colors } from '../theme';
import { Floor } from './Floor';
import { ManagerSlot } from './ManagerSlot';
import { StationStatus } from './StationStatus';
import { UpgradeChip } from './UpgradeChip';

const MAX_EXHIBITS = 4;

const VISITOR_SHEETS = ['sprites/visitors/a', 'sprites/visitors/b', 'sprites/visitors/c'] as const;
const VISITOR_SIZE = 52;
const LAP_MS = 9000;

/**
 * Visitante que cruza la sala de izquierda a derecha. En cada vuelta entra uno de los
 * visitantes animados al azar (sprites/visitors/a|b|c); si no hay ninguno, el arte fijo
 * museum/visitor o un emoji.
 */
function Visitor({ width }: { width: number }) {
  const x = useSharedValue(0);
  const [lap, setLap] = useState({ n: 0, pick: 0 });
  const sheets = VISITOR_SHEETS.map((key) => getSheet(key)).filter((sheet) => sheet !== undefined);
  const sheet = sheets.length ? sheets[lap.pick % sheets.length] : undefined;

  useEffect(() => {
    x.value = 0;
    x.value = withTiming(1, { duration: LAP_MS, easing: Easing.linear });
    // Al terminar la vuelta entra otro visitante, elegido al azar.
    const id = setTimeout(() => setLap((l) => ({ n: l.n + 1, pick: Math.floor(Math.random() * VISITOR_SHEETS.length) })), LAP_MS);
    return () => clearTimeout(id);
  }, [lap.n, x]);

  const style = useAnimatedStyle(() => ({ transform: [{ translateX: -VISITOR_SIZE + x.value * (width + VISITOR_SIZE * 2) }] }));
  const art = getArt('museum/visitor');
  return (
    <Animated.View pointerEvents="none" style={[styles.visitor, style]}>
      {sheet ? (
        <SpriteSheet sheet={sheet} size={VISITOR_SIZE} />
      ) : art ? (
        <Image source={art} style={styles.visitorArt} resizeMode="contain" />
      ) : (
        <GameText size={22}>🧒</GameText>
      )}
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
          <IconLabel icon="station-hall" size={15}>
            {/* Texto claro con contorno: se lee sobre el arte de la sala, que es oscuro y detallado. */}
            <GameText size={13} weight="black" color={colors.textLight} outline>
              {t('mine.museum')}
            </GameText>
          </IconLabel>
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
        <GameText size={10} weight="black" color={colors.textLight} outline center>
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
  visitor: { position: 'absolute', bottom: 4, left: 0 },
  visitorArt: { width: 30, height: 30 },
  side: { alignItems: 'center', gap: 3, width: 70 },
});
