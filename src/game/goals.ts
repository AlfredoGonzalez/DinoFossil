import { WORLDS, type WorldGoal } from '@/data/worlds';
import type { GameState } from './types';

export function worldGoals(worldId = 1): WorldGoal[] {
  return WORLDS.find((w) => w.id === worldId)?.goals ?? [];
}

export function isGoalReached(state: GameState, goal: WorldGoal): boolean {
  return state.mine.shafts.length >= goal.shafts;
}

/** Metas alcanzadas cuyo premio aún no se ha cobrado. */
export function claimableGoals(state: GameState, worldId = 1): WorldGoal[] {
  return worldGoals(worldId).filter((g) => isGoalReached(state, g) && !state.goalsClaimed.includes(g.id));
}

/** Estrellas del mundo = metas cobradas. */
export function worldStars(state: GameState, worldId = 1): number {
  return worldGoals(worldId).filter((g) => state.goalsClaimed.includes(g.id)).length;
}

export function claimGoal(state: GameState, goalId: string): GameState | null {
  const goal = claimableGoals(state).find((g) => g.id === goalId);
  if (!goal) return null;
  return {
    ...state,
    amber: state.amber + goal.reward.amber,
    eggs: { ...state.eggs, [goal.reward.egg]: state.eggs[goal.reward.egg] + 1 },
    goalsClaimed: [...state.goalsClaimed, goal.id],
  };
}
