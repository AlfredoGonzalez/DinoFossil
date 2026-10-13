import { BONUS_PER_LEVEL, DINO_BY_ID, type DinoSpecies } from '@/data/dinos';
import { MINE_BALANCE, PRESTIGE } from '@/data/mine';
import type { BonusType, GameState } from './types';

export interface Modifiers {
  shaftSpeed: number;
  elevatorCapacity: number;
  museumCapacity: number;
  /** Multiplicador total de DinoCoins por fósil. */
  coinValue: number;
  offlineCapSeconds: number;
  eggChance: number;
  hatchSpeed: number;
  /** Multiplica los costes de mejora (≤ 1). */
  costMultiplier: number;
}

/** Bonus que aporta una especie a un nivel dado (en %, o minutos para offlineMinutes). */
export function dinoBonusValue(species: DinoSpecies, level: number): number {
  const perLevel = BONUS_PER_LEVEL[species.rarity] * (species.bonus === 'offlineMinutes' ? 5 : 1);
  return perLevel * level;
}

/** Suma de bonus de la colección de dinos por tipo (en %, salvo offlineMinutes). */
export function collectionBonuses(state: GameState): Record<BonusType, number> {
  const totals: Record<BonusType, number> = {
    shaftSpeed: 0,
    elevatorCapacity: 0,
    museumCapacity: 0,
    coinValue: 0,
    offlineMinutes: 0,
    eggChance: 0,
    hatchSpeed: 0,
    upgradeDiscount: 0,
  };
  for (const [id, owned] of Object.entries(state.dinos)) {
    const species = DINO_BY_ID[id];
    if (!species || !owned) continue;
    totals[species.bonus] += dinoBonusValue(species, owned.level);
  }
  return totals;
}

export function prestigeMultiplier(huellas: number): number {
  return 1 + huellas * PRESTIGE.bonusPerHuella;
}

export function isAdBoostActive(state: GameState, now: number): boolean {
  return state.adBoostUntil > now;
}

/**
 * Todos los multiplicadores activos. `includeAdBoost` es false para el cálculo
 * offline, que aplica el boost solo durante la parte del tiempo en que estuvo activo.
 */
export function getModifiers(state: GameState, now: number, includeAdBoost = true): Modifiers {
  const b = collectionBonuses(state);
  const pct = (v: number) => 1 + v / 100;
  const coinValue =
    pct(b.coinValue) *
    prestigeMultiplier(state.huellas) *
    (state.purchases.doubleIncome ? 2 : 1) *
    (includeAdBoost && isAdBoostActive(state, now) ? 2 : 1);
  return {
    shaftSpeed: pct(b.shaftSpeed),
    elevatorCapacity: pct(b.elevatorCapacity),
    museumCapacity: pct(b.museumCapacity),
    coinValue,
    offlineCapSeconds: (MINE_BALANCE.offlineCapMinutes + b.offlineMinutes) * 60,
    eggChance: MINE_BALANCE.eggChancePerTrip * pct(b.eggChance),
    hatchSpeed: pct(b.hatchSpeed),
    costMultiplier: Math.max(0.5, 1 - b.upgradeDiscount / 100),
  };
}
