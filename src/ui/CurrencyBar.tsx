import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { formatNumber } from '@/game/format';
import { useGameStore } from '@/store/gameStore';
import { GameText } from './GameText';
import { ResourceIcon } from './Icons';
import type { ResourceKind } from './sprites';
import { colors } from './theme';

function Pill({ kind, value, testID }: { kind: ResourceKind; value: number; testID?: string }) {
  return (
    <View style={styles.pill} testID={testID}>
      <ResourceIcon kind={kind} size={20} />
      <GameText size={15} color={colors.textLight} weight="black" outline>
        {formatNumber(value)}
      </GameText>
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
      <Pressable accessibilityRole="button" accessibilityLabel="shop" onPress={() => router.push('/shop')} style={styles.plus}>
        <GameText size={20} weight="black" color={colors.textLight} outline>
          +
        </GameText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6 },
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(40,20,5,0.55)',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.25)',
  },
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
