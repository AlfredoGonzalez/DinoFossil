import { STARTER_DINO } from '@/data/dinos';
import type { GameState, MineState } from './types';

export const SAVE_VERSION = 1;

export function initialMine(): MineState {
  return {
    shafts: [{ level: 1, deposit: 0, progress: 0, running: false }],
    elevator: { level: 1, progress: 0, running: false },
    museum: { level: 1, progress: 0, running: false },
    surface: 0,
  };
}

export function createInitialState(now: number): GameState {
  return {
    version: SAVE_VERSION,
    coins: 0,
    amber: 20,
    huellas: 0,
    prestigeCount: 0,
    runEarnings: 0,
    lifetimeEarnings: 0,
    mine: initialMine(),
    dinos: { [STARTER_DINO]: { level: 1, count: 1 } },
    managers: {},
    abilities: {},
    eggs: { common: 1, rare: 0, epic: 0, legendary: 0, mythic: 0 },
    incubator: null,
    adBoostUntil: 0,
    purchases: { doubleIncome: false, dinoPass: false, starterPack: false },
    goalsClaimed: [],
    lastActiveAt: now,
    lastDailyAmberAt: 0,
    settings: { sound: true, music: true, haptics: true, language: null },
  };
}

/**
 * Migra partidas guardadas de versiones anteriores. Añade un `case` por cada
 * cambio de forma del estado y sube SAVE_VERSION.
 */
export function migrateSave(raw: unknown, now: number): GameState {
  const fresh = createInitialState(now);
  if (!raw || typeof raw !== 'object') return fresh;
  const save = raw as Partial<GameState>;
  // Rellena con valores por defecto cualquier campo que falte (partidas antiguas).
  return {
    ...fresh,
    ...save,
    mine: { ...fresh.mine, ...save.mine },
    eggs: { ...fresh.eggs, ...save.eggs },
    purchases: { ...fresh.purchases, ...save.purchases },
    settings: { ...fresh.settings, ...save.settings },
    version: SAVE_VERSION,
  };
}
