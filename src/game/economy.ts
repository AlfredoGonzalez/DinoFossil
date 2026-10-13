import { MINE_BALANCE } from '@/data/mine';

const S = MINE_BALANCE.shaft;
const E = MINE_BALANCE.elevator;
const M = MINE_BALANCE.museum;

export type CarrierKind = 'elevator' | 'museum';

/** ×2 por cada hito alcanzado (nivel 10, 25, 50…). */
export function milestoneMultiplier(level: number, milestones: readonly number[] = S.milestones): number {
  let count = 0;
  for (const m of milestones) if (level >= m) count++;
  return 2 ** count;
}

export function nextMilestone(level: number, milestones: readonly number[] = S.milestones): number | null {
  return milestones.find((m) => m > level) ?? null;
}

/** Fósiles por segundo de la galería `index` a un nivel dado (sin bonus). */
export function shaftRate(index: number, level: number): number {
  return S.baseRate * S.rateGrowth ** index * level * milestoneMultiplier(level);
}

export function shaftCycleYield(index: number, level: number, speedMultiplier = 1): number {
  return shaftRate(index, level) * speedMultiplier * S.cycleSeconds;
}

export function shaftFirstCost(index: number, level: number): number {
  return S.baseCost * S.costGrowthPerShaft ** index * S.levelCostGrowth ** (level - 1);
}

export function shaftUnlockCost(index: number): number {
  return S.unlockBase * S.unlockGrowth ** (index - 1);
}

export function elevatorTripSeconds(shaftCount: number): number {
  return E.baseTripSeconds + E.tripSecondsPerShaft * shaftCount;
}

export function carrierCapacity(kind: CarrierKind, level: number): number {
  const c = kind === 'elevator' ? E : M;
  return c.baseCapacity * c.capacityGrowth ** (level - 1) * level;
}

export function carrierFirstCost(kind: CarrierKind, level: number): number {
  const c = kind === 'elevator' ? E : M;
  return c.baseCost * c.levelCostGrowth ** (level - 1);
}

export function carrierMaxLevel(kind: CarrierKind): number {
  return kind === 'elevator' ? E.maxLevel : M.maxLevel;
}

export function carrierCostGrowth(kind: CarrierKind): number {
  return kind === 'elevator' ? E.levelCostGrowth : M.levelCostGrowth;
}

/** Coste de comprar `n` niveles seguidos empezando en un coste `first` (serie geométrica). */
export function bulkCost(first: number, growth: number, n: number): number {
  if (n <= 0) return 0;
  return (first * (growth ** n - 1)) / (growth - 1);
}

/** Cuántos niveles se pueden comprar con `budget`, sin pasar de `maxN`. */
export function maxAffordable(first: number, growth: number, budget: number, maxN: number): number {
  if (budget < first || maxN <= 0) return 0;
  const n = Math.floor(Math.log(1 + (budget * (growth - 1)) / first) / Math.log(growth));
  // Corrige errores de coma flotante en el borde.
  let result = Math.min(Math.max(n, 0), maxN);
  while (result > 0 && bulkCost(first, growth, result) > budget) result--;
  return result;
}
