import { finishWithAmber, hatch, startIncubation } from '../collection';
import { activateAbility, assignManager } from '../managers';
import { tapStation, tick } from '../simulate';
import { createInitialState, migrateSave } from '../state';
import { completeTutorialStep, continueTutorial, currentTutorialStep, skipTutorial, syncTutorial, TUTORIAL_FINISHED, tutorialHatchDino } from '../tutorial';
import type { GameState } from '../types';
import { buyUpgrade } from '../upgrades';

const T0 = 1_700_000_000_000;
const noEggs = () => 0.99;

/** Simula `seconds` segundos y sincroniza el tutorial en cada tick, como hace la UI. */
function run(state: GameState, seconds: number): GameState {
  let s = state;
  for (let t = 0; t < seconds; t += 0.1) {
    s = tick(s, 0.1, T0 + t * 1000, noEggs).state;
    s = syncTutorial(s, T0) ?? s;
  }
  return s;
}

const tap = (s: GameState, station: Parameters<typeof tapStation>[1]) => syncTutorial(tapStation(s, station) ?? s, T0) ?? s;

describe('tutorial', () => {
  it('recorre todos los pasos de una partida nueva', () => {
    let s = createInitialState(T0);
    const step = () => currentTutorialStep(s);
    expect(step()).toBe('dig');
    s = tap(s, 'shaft-0');
    expect(step()).toBe('digWait');
    s = run(s, 6);
    expect(step()).toBe('bag');
    s = continueTutorial(s, T0)!;
    s = tap(s, 'elevator');
    s = run(s, 10);
    expect(step()).toBe('collect');
    s = tap(s, 'museum');
    s = run(s, 10);
    expect(step()).toBe('upgrade');
    // Al entrar en "mejora" alcanza para un nivel.
    s = syncTutorial(buyUpgrade(s, 'shaft-0', 1, T0)!, T0)!;
    expect(step()).toBe('eggDig');
    s = tap(s, 'shaft-0');
    s = run(s, 6);
    expect(step()).toBe('eggFound');
    s = continueTutorial(s, T0)!;
    expect(s.eggs.common).toBeGreaterThan(0);
    expect(step()).toBe('goEggs');
    s = completeTutorialStep(s, 'goEggs', T0)!;
    s = syncTutorial(startIncubation(s, 'common', T0)!, T0)!;
    expect(step()).toBe('speedUp');
    // Le alcanza el ámbar para terminar ya.
    s = syncTutorial(finishWithAmber(s, T0)!, T0)!;
    expect(step()).toBe('hatch');
    const born = hatch(s, T0, () => 0.99, tutorialHatchDino(s))!;
    expect(born.dinoId).toBe('trex');
    s = syncTutorial(born.state, T0)!;
    expect(step()).toBe('goDinos');
    s = completeTutorialStep(s, 'goDinos', T0)!;
    s = completeTutorialStep(s, 'openDino', T0)!;
    s = completeTutorialStep(s, 'profileTab', T0)!;
    s = completeTutorialStep(s, 'profileHire', T0)!;
    expect(step()).toBe('manager');
    s = syncTutorial(assignManager(s, 'shaft-0', 'trex')!, T0)!;
    expect(step()).toBe('turbo');
    s = syncTutorial(activateAbility(s, 'shaft-0', T0)!, T0)!;
    expect(step()).toBe('done');
    s = continueTutorial(s, T0)!;
    expect(s.tutorialStep).toBe(TUTORIAL_FINISHED);
    expect(step()).toBeNull();
  });

  it('un paso de la UI solo avanza si es el actual', () => {
    expect(completeTutorialStep(createInitialState(T0), 'goEggs', T0)).toBeNull();
  });

  it('se puede saltar, y las partidas antiguas con progreso no lo repiten', () => {
    expect(skipTutorial(createInitialState(T0))!.tutorialStep).toBe(TUTORIAL_FINISHED);
    const old = { ...createInitialState(T0), version: 1, lifetimeEarnings: 500 } as Partial<GameState>;
    delete old.tutorialStep;
    expect(migrateSave(old, T0).tutorialStep).toBe(TUTORIAL_FINISHED);
    // Una partida v1 sin progreso (p. ej. borrada con la versión anterior) sí lo ve.
    const blank = { ...createInitialState(T0), version: 1 } as Partial<GameState>;
    delete blank.tutorialStep;
    expect(migrateSave(blank, T0).tutorialStep).toBe(0);
  });
});
