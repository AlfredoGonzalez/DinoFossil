import { STARTER_DINO } from '@/data/dinos';
import { amberToFinish, incubatorRemaining } from './collection';
import { shaftStationId } from './simulate';
import type { GameState } from './types';
import { upgradeQuote } from './upgrades';

/**
 * Tutorial de la primera partida. Cada paso tiene una condición sobre el estado que lo da por
 * cumplido. Tipos de paso:
 * - `tap`: la UI resalta algo con un círculo; se cumple cuando el estado cambia (o la UI llama a
 *   completeTutorialStep, p. ej. al tocar una pestaña de la barra).
 * - `wait`: no se puede tocar nada; deja ver la animación y avanza solo.
 * - `continue`: un toque en cualquier parte (continueTutorial).
 * - `inline`: lo explica la propia pantalla (la ficha del dino, que va en una ventana).
 */
export const TUTORIAL_STEPS = [
  // La Casa-Museo: excavar, subir, recoger, mejorar.
  'dig',
  'digWait',
  'bag',
  'lift',
  'liftWait',
  'collect',
  'collectWait',
  'upgrade',
  // El huevo: otra excavación lo encuentra, se incuba, se acelera con ámbar y nace el T-Rex.
  'eggDig',
  'eggDigWait',
  'eggFound',
  'goEggs',
  'incubate',
  'speedUp',
  'hatch',
  // La colección: su ficha y sus mecánicas.
  'goDinos',
  'openDino',
  'profileTab',
  'profileHire',
  // De vuelta en la casa: contratarlo y usar su rayo.
  'manager',
  'turbo',
  'done',
] as const;
export type TutorialStep = (typeof TUTORIAL_STEPS)[number];

/** Valor de `tutorialStep` cuando ya terminó (o se saltó). */
export const TUTORIAL_FINISHED = 100;

export type TutorialKind = 'tap' | 'wait' | 'continue' | 'inline';

export const TUTORIAL_KIND: Record<TutorialStep, TutorialKind> = {
  dig: 'tap',
  digWait: 'wait',
  bag: 'continue',
  lift: 'tap',
  liftWait: 'wait',
  collect: 'tap',
  collectWait: 'wait',
  upgrade: 'tap',
  eggDig: 'tap',
  eggDigWait: 'wait',
  eggFound: 'continue',
  goEggs: 'tap',
  incubate: 'tap',
  speedUp: 'tap',
  hatch: 'tap',
  goDinos: 'tap',
  openDino: 'tap',
  profileTab: 'inline',
  profileHire: 'inline',
  manager: 'tap',
  turbo: 'tap',
  done: 'continue',
};

const FIRST_SHAFT = shaftStationId(0);

/** ¿Está cumplido el paso? Los pasos que dependen de la UI (pestañas, ficha) devuelven false. */
function isComplete(state: GameState, step: TutorialStep, now: number): boolean {
  const shaft = state.mine.shafts[0];
  const { elevator, museum, surface } = state.mine;
  switch (step) {
    case 'dig':
    case 'eggDig':
      return !!shaft?.running;
    case 'digWait':
      return !!shaft && !shaft.running && shaft.deposit > 0;
    case 'eggDigWait':
      return !!shaft && !shaft.running;
    case 'lift':
      return elevator.running || surface > 0;
    case 'liftWait':
      return !elevator.running;
    case 'collect':
      return museum.running;
    case 'collectWait':
      return !museum.running;
    case 'upgrade':
      return !!shaft && shaft.level >= 2;
    case 'incubate':
      return !!state.incubator;
    case 'speedUp':
      return !!state.incubator && incubatorRemaining(state, now) <= 0;
    case 'hatch':
      return !state.incubator && !!state.dinos[STARTER_DINO];
    case 'manager':
      return !!state.managers[FIRST_SHAFT];
    case 'turbo':
      return !!state.abilities[FIRST_SHAFT];
    default:
      return false;
  }
}

export function currentTutorialStep(state: GameState): TutorialStep | null {
  return TUTORIAL_STEPS[state.tutorialStep] ?? null;
}

export function inTutorial(state: GameState): boolean {
  return state.tutorialStep < TUTORIAL_FINISHED;
}

/** Al entrar en un paso: regala lo justo para que se pueda cumplir. */
function enter(state: GameState, step: TutorialStep, now: number): GameState {
  switch (step) {
    case 'upgrade': {
      // Monedas para un nivel del primer sótano.
      const quote = upgradeQuote(state, FIRST_SHAFT, 1, now);
      return quote.cost > state.coins ? { ...state, coins: quote.cost } : state;
    }
    case 'eggFound':
      // La segunda excavación "encuentra" un huevo común.
      return { ...state, eggs: { ...state.eggs, common: Math.max(1, state.eggs.common) } };
    case 'speedUp': {
      // Ámbar para terminar la incubación ya.
      const cost = amberToFinish(state, now);
      return cost > state.amber ? { ...state, amber: cost } : state;
    }
    default:
      return state;
  }
}

function moveTo(state: GameState, index: number, now: number): GameState {
  const next = { ...state, tutorialStep: index };
  const step = currentTutorialStep(next);
  return step ? enter(next, step, now) : { ...next, tutorialStep: TUTORIAL_FINISHED };
}

/** Avanza todos los pasos ya cumplidos. Devuelve null si no cambia nada. */
export function syncTutorial(state: GameState, now: number): GameState | null {
  let s = state;
  let step = currentTutorialStep(s);
  while (step && isComplete(s, step, now)) {
    s = moveTo(s, s.tutorialStep + 1, now);
    step = currentTutorialStep(s);
  }
  return s === state ? null : s;
}

/** La UI cumplió el paso `step` (tocó la pestaña, abrió la ficha…). Null si no era el paso actual. */
export function completeTutorialStep(state: GameState, step: TutorialStep, now: number): GameState | null {
  if (currentTutorialStep(state) !== step) return null;
  const next = moveTo(state, state.tutorialStep + 1, now);
  return syncTutorial(next, now) ?? next;
}

/** Toque para seguir en un paso `continue`. */
export function continueTutorial(state: GameState, now: number): GameState | null {
  const step = currentTutorialStep(state);
  if (!step || TUTORIAL_KIND[step] !== 'continue') return null;
  return completeTutorialStep(state, step, now);
}

export function skipTutorial(state: GameState): GameState | null {
  return inTutorial(state) ? { ...state, tutorialStep: TUTORIAL_FINISHED } : null;
}

/** En el tutorial el primer huevo siempre trae al T-Rex. */
export function tutorialHatchDino(state: GameState): string | null {
  return currentTutorialStep(state) === 'hatch' ? STARTER_DINO : null;
}
