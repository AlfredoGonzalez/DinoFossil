import { ABILITY, ABILITY_COOLDOWN_SECONDS, DINO_BY_ID } from '@/data/dinos';
import type { GameState, StationId } from './types';

/** Estación donde trabaja un dino, si alguna. */
export function stationOfDino(state: GameState, dinoId: string): StationId | null {
  for (const [station, id] of Object.entries(state.managers)) if (id === dinoId) return station as StationId;
  return null;
}

/** Asigna un dino como manager. Si ya trabajaba en otra estación, se mueve. */
export function assignManager(state: GameState, station: StationId, dinoId: string | null): GameState {
  const managers = { ...state.managers };
  if (dinoId) {
    if (!state.dinos[dinoId]) return state;
    const previous = stationOfDino(state, dinoId);
    if (previous) delete managers[previous];
    managers[station] = dinoId;
  } else {
    delete managers[station];
  }
  const abilities = { ...state.abilities };
  delete abilities[station];
  return { ...state, managers, abilities };
}

export type AbilityStatus = { kind: 'none' } | { kind: 'ready' } | { kind: 'active'; seconds: number } | { kind: 'cooldown'; seconds: number };

export function abilityStatus(state: GameState, station: StationId, now: number): AbilityStatus {
  if (!state.managers[station]) return { kind: 'none' };
  const ability = state.abilities[station];
  if (!ability || ability.cooldownUntil <= now) return { kind: 'ready' };
  if (ability.activeUntil > now) return { kind: 'active', seconds: (ability.activeUntil - now) / 1000 };
  return { kind: 'cooldown', seconds: (ability.cooldownUntil - now) / 1000 };
}

export function activateAbility(state: GameState, station: StationId, now: number): GameState | null {
  const dinoId = state.managers[station];
  const species = dinoId ? DINO_BY_ID[dinoId] : undefined;
  if (!species || abilityStatus(state, station, now).kind !== 'ready') return null;
  const activeUntil = now + ABILITY[species.rarity].seconds * 1000;
  return {
    ...state,
    abilities: { ...state.abilities, [station]: { activeUntil, cooldownUntil: activeUntil + ABILITY_COOLDOWN_SECONDS * 1000 } },
  };
}
