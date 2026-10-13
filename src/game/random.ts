import type { Rarity } from './types';
import { RARITIES } from './types';

export type Rng = () => number;

export function rollRarity(odds: Record<Rarity, number>, rng: Rng): Rarity {
  let roll = rng();
  for (const rarity of RARITIES) {
    roll -= odds[rarity];
    if (roll < 0) return rarity;
  }
  return 'common';
}

export function pick<T>(items: readonly T[], rng: Rng): T {
  const item = items[Math.floor(rng() * items.length)];
  if (item === undefined) throw new Error('pick() sobre una lista vacía');
  return item;
}
