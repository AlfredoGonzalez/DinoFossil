import { TUTORIAL_FINISHED, TUTORIAL_STEPS, type TutorialStep } from './tutorial';
import type { GameState, MineState } from './types';

export const SAVE_VERSION = 3;

/** Pasos del tutorial en el guardado v2 (para traducir el paso a la lista actual). */
const V2_TUTORIAL = ['dig', 'digWait', 'bag', 'lift', 'liftWait', 'sell', 'sellWait', 'upgrade', 'manager', 'done'];
const V2_TO_V3: Record<string, string> = { sell: 'collect', sellWait: 'collectWait', manager: 'eggDig' };

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
    // Sin dinos: el primero (el T-Rex) nace del huevo en el tutorial.
    dinos: {},
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
    tutorialStep: 0,
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
  // v1 → v2: el tutorial es nuevo. Quien ya había ganado algo no lo repite; una partida v1 sin
  // progreso (recién creada o recién borrada con una versión anterior) sí lo ve.
  const playedBefore = (save.lifetimeEarnings ?? 0) > 0 || (save.prestigeCount ?? 0) > 0;
  let tutorialStep = typeof save.tutorialStep === 'number' ? save.tutorialStep : playedBefore ? TUTORIAL_FINISHED : 0;
  // v2 → v3: la lista de pasos creció; se traduce el paso por su nombre.
  if (save.version === 2 && typeof save.tutorialStep === 'number') {
    const name = V2_TUTORIAL[save.tutorialStep];
    const index = name && name !== 'done' ? TUTORIAL_STEPS.indexOf((V2_TO_V3[name] ?? name) as TutorialStep) : -1;
    tutorialStep = index >= 0 ? index : TUTORIAL_FINISHED;
  }
  // Rellena con valores por defecto cualquier campo que falte (partidas antiguas).
  return {
    ...fresh,
    ...save,
    mine: { ...fresh.mine, ...save.mine },
    eggs: { ...fresh.eggs, ...save.eggs },
    purchases: { ...fresh.purchases, ...save.purchases },
    settings: { ...fresh.settings, ...save.settings },
    tutorialStep,
    version: SAVE_VERSION,
  };
}
