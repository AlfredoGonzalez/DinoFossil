import { STARTER_DINO } from '@/data/dinos';
import { createInitialState } from '@/game/state';
import type { GameState } from '@/game/types';

/** Partida nueva con el T-Rex ya nacido (como queda tras el tutorial). */
export function newGame(now: number): GameState {
  const s = createInitialState(now);
  return { ...s, dinos: { [STARTER_DINO]: { level: 1, count: 1 } } };
}
