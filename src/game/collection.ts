import { DINOS, MAX_DINO_LEVEL } from '@/data/dinos';
import { AMBER_PER_MINUTES, HATCH_MINUTES } from '@/data/eggs';
import { getModifiers } from './modifiers';
import { pick, type Rng } from './random';
import type { GameState, Rarity } from './types';

export function addDino(state: GameState, dinoId: string): GameState {
  const owned = state.dinos[dinoId];
  const next = owned ? { count: owned.count + 1, level: Math.min(MAX_DINO_LEVEL, owned.level + 1) } : { count: 1, level: 1 };
  return { ...state, dinos: { ...state.dinos, [dinoId]: next } };
}

export function hatchSeconds(state: GameState, rarity: Rarity, now: number): number {
  return (HATCH_MINUTES[rarity] * 60) / getModifiers(state, now).hatchSpeed;
}

export function startIncubation(state: GameState, rarity: Rarity, now: number): GameState | null {
  if (state.incubator || state.eggs[rarity] <= 0) return null;
  return {
    ...state,
    eggs: { ...state.eggs, [rarity]: state.eggs[rarity] - 1 },
    incubator: { rarity, startedAt: now, endsAt: now + hatchSeconds(state, rarity, now) * 1000 },
  };
}

export function incubatorRemaining(state: GameState, now: number): number {
  return state.incubator ? Math.max(0, (state.incubator.endsAt - now) / 1000) : 0;
}

/** Reduce el tiempo restante del huevo en incubación (anuncio). */
export function skipIncubation(state: GameState, seconds: number): GameState {
  if (!state.incubator) return state;
  return { ...state, incubator: { ...state.incubator, endsAt: state.incubator.endsAt - seconds * 1000 } };
}

export function amberToFinish(state: GameState, now: number): number {
  return Math.ceil(incubatorRemaining(state, now) / 60 / AMBER_PER_MINUTES);
}

export function finishWithAmber(state: GameState, now: number): GameState | null {
  const cost = amberToFinish(state, now);
  if (!state.incubator || state.amber < cost) return null;
  return { ...state, amber: state.amber - cost, incubator: { ...state.incubator, endsAt: now } };
}

/** Eclosiona el huevo si ya está listo. Devuelve el dino obtenido. */
export function hatch(state: GameState, now: number, rng: Rng = Math.random): { state: GameState; dinoId: string } | null {
  if (!state.incubator || incubatorRemaining(state, now) > 0) return null;
  const pool = DINOS.filter((d) => d.rarity === state.incubator?.rarity);
  const dinoId = pick(pool, rng).id;
  return { state: addDino({ ...state, incubator: null }, dinoId), dinoId };
}
