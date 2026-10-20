import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { formatNumber } from '@/game/format';
import { useGameStore } from '@/store/gameStore';
import { GameText } from './GameText';
import { ResourceIcon } from './Icons';
import type { ResourceKind } from './sprites';
import { colors } from './theme';

const ICON = 34;

/** Píldora de recurso: icono grande que sobresale por la izquierda y cifra sobre fieltro oscuro cosido. */
function Pill({ kind, value, testID }: { kind: ResourceKind; value: number; testID?: string }) {
  return (
    <View style={styles.slot} testID={testID}>
      <View style={styles.pill}>
        <View style={styles.stitch} />
        <GameText size={15} color={colors.textLight} weight="black" outline numberOfLines={1}>
          {formatNumber(value)}
        </GameText>
      </View>
      <View style={styles.icon}>
        <ResourceIcon kind={kind} size={ICON} />
      </View>
    </View>
  );
}

/** Barra superior de recursos: DinoCoins, Huellas, Ámbar y acceso a la tienda. */
export function CurrencyBar() {
  const coins = useGameStore((s) => s.game.coins);
  const amber = useGameStore((s) => s.game.amber);
  const huellas = useGameStore((s) => s.game.huellas);
  return (
    <View style={styles.bar}>
      <Pill kind="coins" value={coins} testID="coins" />
      <Pill kind="huellas" value={huellas} />
      <Pill kind="amber" value={amber} testID="amber" />
      <Pressable accessibilityRole="button" accessibilityLabel="shop" onPress={() => router.replace('/shop')} style={styles.plus}>
        <GameText size={20} weight="black" color={colors.textLight} outline>
          +
        </GameText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingLeft: 18, paddingRight: 10, paddingVertical: 8 },
  slot: { flex: 1, justifyContent: 'center' },
  pill: {
    height: 30,
    justifyContent: 'center',
    paddingLeft: ICON / 2 + 8,
    paddingRight: 10,
    backgroundColor: '#3E2A1A',
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#1F140B',
  },
  // Costura de fieltro dentro de la píldora.
  stitch: {
    position: 'absolute',
    top: 2,
    left: 2,
    right: 2,
    bottom: 2,
    borderRadius: 999,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(255, 230, 190, 0.35)',
  },
  icon: { position: 'absolute', left: -ICON / 2 + 2, top: (30 - ICON) / 2 - 1 },
  plus: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.green,
    borderWidth: 2,
    borderColor: colors.greenDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
