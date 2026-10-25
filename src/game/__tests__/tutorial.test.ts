import { assignManager } from '../managers';
import { tapStation, tick } from '../simulate';
import { createInitialState, migrateSave } from '../state';
import { continueTutorial, currentTutorialStep, skipTutorial, syncTutorial, TUTORIAL_FINISHED } from '../tutorial';
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
    expect(currentTutorialStep(s)).toBe('dig');
    s = tap(s, 'shaft-0');
    expect(currentTutorialStep(s)).toBe('digWait');
    s = run(s, 6);
    expect(currentTutorialStep(s)).toBe('bag');
    s = continueTutorial(s, T0)!;
    expect(currentTutorialStep(s)).toBe('lift');
    s = tap(s, 'elevator');
    s = run(s, 10);
    expect(currentTutorialStep(s)).toBe('sell');
    s = tap(s, 'museum');
    s = run(s, 10);
    expect(currentTutorialStep(s)).toBe('upgrade');
    // Al entrar en "mejora" alcanza para un nivel.
    s = syncTutorial(buyUpgrade(s, 'shaft-0', 1, T0)!, T0)!;
    expect(currentTutorialStep(s)).toBe('manager');
    s = syncTutorial(assignManager(s, 'shaft-0', 'trex')!, T0)!;
    expect(currentTutorialStep(s)).toBe('done');
    s = continueTutorial(s, T0)!;
    expect(s.tutorialStep).toBe(TUTORIAL_FINISHED);
    expect(currentTutorialStep(s)).toBeNull();
  });

  it('se puede saltar, y las partidas antiguas no lo repiten', () => {
    expect(skipTutorial(createInitialState(T0))!.tutorialStep).toBe(TUTORIAL_FINISHED);
    const old = { ...createInitialState(T0), version: 1 } as Partial<GameState>;
    delete old.tutorialStep;
    expect(migrateSave(old, T0).tutorialStep).toBe(TUTORIAL_FINISHED);
  });
});
