import { MINE_BALANCE } from '@/data/mine';
import {
  bulkCost,
  carrierCostGrowth,
  carrierFirstCost,
  carrierMaxLevel,
  maxAffordable,
  nextMilestone,
  shaftFirstCost,
  shaftUnlockCost,
} from './economy';
import { getModifiers } from './modifiers';
import type { GameState, StationId } from './types';

/** 'milestone': los niveles justos para llegar al siguiente hito ×2 (solo sótanos). */
export type BuyAmount = 1 | 10 | 'milestone' | 'max';

interface LevelInfo {
  level: number;
  maxLevel: number;
  first: number;
  growth: number;
  /** Solo los sótanos tienen hitos. */
  milestones: boolean;
}

function levelInfo(state: GameState, station: StationId, now: number): LevelInfo | null {
  const discount = getModifiers(state, now).costMultiplier;
  if (station === 'elevator' || station === 'museum') {
    const level = state.mine[station].level;
    return { level, maxLevel: carrierMaxLevel(station), first: carrierFirstCost(station, level) * discount, growth: carrierCostGrowth(station), milestones: false };
  }
  const index = Number(station.slice('shaft-'.length));
  const shaft = state.mine.shafts[index];
  if (!shaft) return null;
  return {
    level: shaft.level,
    maxLevel: MINE_BALANCE.shaft.maxLevel,
    first: shaftFirstCost(index, shaft.level) * discount,
    growth: MINE_BALANCE.shaft.levelCostGrowth,
    milestones: true,
  };
}

/** Cuántos niveles se comprarían y a qué precio con la cantidad elegida. */
export function upgradeQuote(state: GameState, station: StationId, amount: BuyAmount, now: number): { levels: number; cost: number } {
  const info = levelInfo(state, station, now);
  if (!info) return { levels: 0, cost: 0 };
  const room = info.maxLevel - info.level;
  let levels: number;
  if (amount === 'max') levels = Math.max(1, Math.min(room, maxAffordable(info.first, info.growth, state.coins, room)));
  else if (amount === 'milestone') {
    const target = info.milestones ? nextMilestone(info.level) : null;
    levels = target === null ? 0 : Math.min(target - info.level, room);
  } else levels = Math.min(amount, room);
  return { levels, cost: bulkCost(info.first, info.growth, levels) };
}

export function buyUpgrade(state: GameState, station: StationId, amount: BuyAmount, now: number): GameState | null {
  const { levels, cost } = upgradeQuote(state, station, amount, now);
  if (levels <= 0 || cost > state.coins) return null;
  const coins = state.coins - cost;
  if (station === 'elevator' || station === 'museum') {
    const current = state.mine[station];
    return { ...state, coins, mine: { ...state.mine, [station]: { ...current, level: current.level + levels } } };
  }
  const index = Number(station.slice('shaft-'.length));
  const shafts = state.mine.shafts.slice();
  const shaft = shafts[index];
  if (!shaft) return null;
  shafts[index] = { ...shaft, level: shaft.level + levels };
  return { ...state, coins, mine: { ...state.mine, shafts } };
}

export function nextShaftUnlockCost(state: GameState): number | null {
  const index = state.mine.shafts.length;
  if (index >= MINE_BALANCE.maxShafts) return null;
  return shaftUnlockCost(index);
}

export function unlockShaft(state: GameState): GameState | null {
  const cost = nextShaftUnlockCost(state);
  if (cost === null || state.coins < cost) return null;
  return {
    ...state,
    coins: state.coins - cost,
    mine: { ...state.mine, shafts: [...state.mine.shafts, { level: 1, deposit: 0, progress: 0, running: false }] },
  };
}
