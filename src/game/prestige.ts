import { PRESTIGE } from '@/data/mine';
import { prestigeMultiplier } from './modifiers';
import { initialMine } from './state';
import type { GameState, StationId } from './types';

export function pendingHuellas(state: GameState): number {
  return Math.floor(Math.sqrt(state.runEarnings / PRESTIGE.divisor));
}

/** DinoCoins totales de la partida necesarias para ganar `huellas` huellas. */
export function earningsForHuellas(huellas: number): number {
  return huellas * huellas * PRESTIGE.divisor;
}

export function prestigePreview(state: GameState) {
  const gain = pendingHuellas(state);
  return {
    gain,
    currentMultiplier: prestigeMultiplier(state.huellas),
    nextMultiplier: prestigeMultiplier(state.huellas + gain),
    nextAt: earningsForHuellas(gain + 1),
  };
}

const KEPT_STATIONS: StationId[] = ['shaft-0', 'elevator', 'museum'];

/**
 * Reinicia la mina a cambio de Huellas Antiguas (+10 % de producción cada una).
 * Se conservan Ámbar, dinos, huevos, compras y metas cobradas.
 */
export function doPrestige(state: GameState): GameState | null {
  const gain = pendingHuellas(state);
  if (gain < 1) return null;
  const managers: GameState['managers'] = {};
  for (const station of KEPT_STATIONS) {
    const dino = state.managers[station];
    if (dino) managers[station] = dino;
  }
  return {
    ...state,
    coins: 0,
    runEarnings: 0,
    huellas: state.huellas + gain,
    prestigeCount: state.prestigeCount + 1,
    mine: initialMine(),
    managers,
    abilities: {},
  };
}
