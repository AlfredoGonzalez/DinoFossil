import { shaftStationId } from './simulate';
import type { GameState } from './types';
import { upgradeQuote } from './upgrades';

/**
 * Tutorial de la primera partida. Cada paso tiene una condición sobre el estado que lo da por
 * cumplido; los de tipo `continue` se cumplen con un toque en cualquier parte (los marca la UI
 * con continueTutorial). Los pasos `wait` no muestran nada: dejan ver la animación (el dino
 * excavando, la caja subiendo…) y avanzan solos al terminar.
 */
export const TUTORIAL_STEPS = ['dig', 'digWait', 'bag', 'lift', 'liftWait', 'sell', 'sellWait', 'upgrade', 'manager', 'done'] as const;
export type TutorialStep = (typeof TUTORIAL_STEPS)[number];

/** Valor de `tutorialStep` cuando ya terminó (o se saltó). */
export const TUTORIAL_FINISHED = TUTORIAL_STEPS.length;

export type TutorialKind = 'tap' | 'wait' | 'continue';

export const TUTORIAL_KIND: Record<TutorialStep, TutorialKind> = {
  dig: 'tap',
  digWait: 'wait',
  bag: 'continue',
  lift: 'tap',
  liftWait: 'wait',
  sell: 'tap',
  sellWait: 'wait',
  upgrade: 'tap',
  manager: 'tap',
  done: 'continue',
};

const FIRST_SHAFT = shaftStationId(0);

/** ¿Está cumplido el paso? Los pasos `continue` nunca se cumplen solos. */
function isComplete(state: GameState, step: TutorialStep): boolean {
  const shaft = state.mine.shafts[0];
  const { elevator, museum, surface } = state.mine;
  switch (step) {
    case 'dig':
      return !!shaft && (shaft.running || shaft.deposit > 0);
    case 'digWait':
      return !!shaft && !shaft.running && shaft.deposit > 0;
    case 'lift':
      return elevator.running || surface > 0;
    case 'liftWait':
      return !elevator.running;
    case 'sell':
      return museum.running;
    case 'sellWait':
      return !museum.running;
    case 'upgrade':
      return !!shaft && shaft.level >= 2;
    case 'manager':
      return !!state.managers[FIRST_SHAFT];
    default:
      return false;
  }
}

export function currentTutorialStep(state: GameState): TutorialStep | null {
  return TUTORIAL_STEPS[state.tutorialStep] ?? null;
}

/** Al entrar en "mejora": si no alcanza para un nivel del primer sótano, regala lo justo. */
function enter(state: GameState, step: TutorialStep, now: number): GameState {
  if (step !== 'upgrade') return state;
  const quote = upgradeQuote(state, FIRST_SHAFT, 1, now);
  return quote.cost > state.coins ? { ...state, coins: quote.cost } : state;
}

/** Avanza todos los pasos ya cumplidos. Devuelve null si no cambia nada. */
export function syncTutorial(state: GameState, now: number): GameState | null {
  let s = state;
  let step = currentTutorialStep(s);
  while (step && isComplete(s, step)) {
    s = { ...s, tutorialStep: s.tutorialStep + 1 };
    step = currentTutorialStep(s);
    if (step) s = enter(s, step, now);
  }
  return s === state ? null : s;
}

/** Toque para seguir en un paso `continue`. */
export function continueTutorial(state: GameState, now: number): GameState | null {
  const step = currentTutorialStep(state);
  if (!step || TUTORIAL_KIND[step] !== 'continue') return null;
  const next = { ...state, tutorialStep: state.tutorialStep + 1 };
  const nextStep = currentTutorialStep(next);
  const entered = nextStep ? enter(next, nextStep, now) : next;
  return syncTutorial(entered, now) ?? entered;
}

export function skipTutorial(state: GameState): GameState | null {
  return state.tutorialStep >= TUTORIAL_FINISHED ? null : { ...state, tutorialStep: TUTORIAL_FINISHED };
}
