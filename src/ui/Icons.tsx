import { Image, StyleSheet, View } from 'react-native';
import { DINO_BY_ID } from '@/data/dinos';
import { EGG_COLORS } from '@/data/eggs';
import type { Rarity } from '@/game/types';
import { GameText } from './GameText';
import { getArt } from './art';
import { GameIcon } from './GameIcon';
import { SPRITES, type ResourceKind } from './sprites';
import { colors, rarityColors } from './theme';

export function ResourceIcon({ kind, size = 22 }: { kind: ResourceKind; size?: number }) {
  return <GameIcon name={kind === 'eggs' ? 'egg-common' : kind} size={size} />;
}

interface DinoAvatarProps {
  dinoId: string;
  size?: number;
  /** Silueta gris para dinos aún no descubiertos. */
  silhouette?: boolean;
  ring?: boolean;
}

export function DinoAvatar({ dinoId, size = 56, silhouette, ring }: DinoAvatarProps) {
  const species = DINO_BY_ID[dinoId];
  const sprite = getArt(`dinos/${dinoId}`) ?? SPRITES.dinos[dinoId];
  const bg = silhouette ? '#CFC6B8' : (species?.color ?? colors.grass);
  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg,
          borderColor: ring && species ? rarityColors[species.rarity] : 'rgba(0,0,0,0.15)',
          borderWidth: ring ? 3 : 2,
        },
      ]}
    >
      {sprite && !silhouette ? (
        <Image source={sprite} style={{ width: size * 0.9, height: size * 0.9 }} resizeMode="contain" />
      ) : (
        <GameText size={size * 0.55} style={[{ lineHeight: size * 0.75 }, silhouette && styles.silhouette]}>
          {silhouette ? '❔' : (species?.emoji ?? '🦖')}
        </GameText>
      )}
    </View>
  );
}

export function EggIcon({ rarity, size = 40 }: { rarity: Rarity; size?: number }) {
  const art = getArt(`icons/egg-${rarity}`);
  if (art) return <Image source={art} resizeMode="contain" style={{ width: size, height: size }} />;
  return (
    <View
      style={{
        width: size * 0.78,
        height: size,
        borderRadius: size / 2,
        backgroundColor: EGG_COLORS[rarity],
        borderWidth: 2,
        borderColor: rarityColors[rarity],
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View style={[styles.spot, { top: size * 0.22, left: size * 0.14, width: size * 0.18, height: size * 0.18 }]} />
      <View style={[styles.spot, { top: size * 0.52, right: size * 0.12, width: size * 0.22, height: size * 0.22 }]} />
      <View style={[styles.spot, { bottom: size * 0.12, left: size * 0.28, width: size * 0.12, height: size * 0.12 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden', alignSelf: 'center' },
  silhouette: { opacity: 0.6 },
  spot: { position: 'absolute', borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.45)' },
});
