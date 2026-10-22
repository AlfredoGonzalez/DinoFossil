import { ABILITY, DINO_BY_ID } from '@/data/dinos';
import { EGG_DROP_ODDS } from '@/data/eggs';
import { MINE_BALANCE } from '@/data/mine';
import { carrierCapacity, elevatorTripSeconds, shaftCycleSeconds, shaftCycleYield } from './economy';
import { getModifiers } from './modifiers';
import { rollRarity, type Rng } from './random';
import type { CarrierState, GameEvent, GameState, ShaftState, StationId } from './types';

export function shaftStationId(index: number): StationId {
  return `shaft-${index}`;
}

/** Multiplicador de velocidad de una estación (habilidad Turbo del manager). */
export function stationSpeed(state: GameState, station: StationId, now: number): number {
  const dinoId = state.managers[station];
  const ability = state.abilities[station];
  if (!dinoId || !ability || ability.activeUntil <= now) return 1;
  const species = DINO_BY_ID[dinoId];
  return species ? ABILITY[species.rarity].multiplier : 1;
}

/**
 * Avanza el progreso de un ciclo. Devuelve cuántos ciclos se completaron.
 * Sin manager, la estación hace un solo ciclo y se detiene hasta el siguiente toque.
 */
function advance<T extends { progress: number; running: boolean }>(
  station: T,
  managed: boolean,
  dt: number,
  cycleSeconds: number,
): { station: T; completed: number } {
  const next = { ...station, running: station.running || managed };
  if (!next.running) return { station: next, completed: 0 };
  next.progress += dt / cycleSeconds;
  let completed = 0;
  while (next.progress >= 1) {
    completed++;
    next.progress -= 1;
    if (!managed) {
      next.running = false;
      next.progress = 0;
      break;
    }
  }
  return { station: next, completed };
}

/** Un paso de simulación. Función pura: no muta `state`. */
export function tick(state: GameState, dt: number, now: number, rng: Rng = Math.random): { state: GameState; events: GameEvent[] } {
  if (dt <= 0) return { state, events: [] };
  const mods = getModifiers(state, now);
  const events: GameEvent[] = [];
  const { mine } = state;

  // 1) Galerías: excavan y acumulan en su depósito.
  const shafts: ShaftState[] = mine.shafts.map((shaft, i) => {
    const id = shaftStationId(i);
    const speed = stationSpeed(state, id, now);
    const { station, completed } = advance(shaft, !!state.managers[id], dt * speed, shaftCycleSeconds(i));
    if (completed > 0) station.deposit += completed * shaftCycleYield(i, shaft.level, mods.shaftSpeed);
    return station;
  });

  // 2) Ascensor: recoge de arriba hacia abajo y deja en superficie.
  let surface = mine.surface;
  let eggs = state.eggs;
  const elevatorSpeed = stationSpeed(state, 'elevator', now);
  const elevatorStep = advance<CarrierState>(
    mine.elevator,
    !!state.managers.elevator,
    dt * elevatorSpeed,
    elevatorTripSeconds(mine.shafts.length),
  );
  for (let trip = 0; trip < elevatorStep.completed; trip++) {
    let room = carrierCapacity('elevator', mine.elevator.level) * mods.elevatorCapacity;
    let moved = 0;
    for (const shaft of shafts) {
      const take = Math.min(shaft.deposit, room);
      shaft.deposit -= take;
      room -= take;
      moved += take;
      if (room <= 0) break;
    }
    surface += moved;
    if (moved > 0 && rng() < mods.eggChance) {
      const rarity = rollRarity(EGG_DROP_ODDS, rng);
      eggs = { ...eggs, [rarity]: eggs[rarity] + 1 };
      events.push({ type: 'eggFound', rarity });
    }
  }

  // 3) Museo: vende los fósiles de la superficie.
  let coinsEarned = 0;
  const museumSpeed = stationSpeed(state, 'museum', now);
  const museumStep = advance<CarrierState>(mine.museum, !!state.managers.museum, dt * museumSpeed, MINE_BALANCE.museum.cycleSeconds);
  for (let cycle = 0; cycle < museumStep.completed; cycle++) {
    const sold = Math.min(surface, carrierCapacity('museum', mine.museum.level) * mods.museumCapacity);
    surface -= sold;
    coinsEarned += sold * MINE_BALANCE.coinsPerFossil * mods.coinValue;
  }
  if (coinsEarned > 0) events.push({ type: 'sold', coins: coinsEarned });

  return {
    state: {
      ...state,
      coins: state.coins + coinsEarned,
      runEarnings: state.runEarnings + coinsEarned,
      lifetimeEarnings: state.lifetimeEarnings + coinsEarned,
      eggs,
      mine: { shafts, elevator: elevatorStep.station, museum: museumStep.station, surface },
      lastActiveAt: now,
    },
    events,
  };
}

/** Toque del jugador sobre una estación sin manager: arranca un ciclo. */
export function tapStation(state: GameState, station: StationId): GameState {
  const { mine } = state;
  if (station === 'elevator' || station === 'museum') {
    const current = mine[station];
    if (current.running) return state;
    return { ...state, mine: { ...mine, [station]: { ...current, running: true } } };
  }
  const index = Number(station.slice('shaft-'.length));
  const shaft = mine.shafts[index];
  if (!shaft || shaft.running) return state;
  const shafts = mine.shafts.slice();
  shafts[index] = { ...shaft, running: true };
  return { ...state, mine: { ...mine, shafts } };
}
