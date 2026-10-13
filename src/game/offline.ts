import { MINE_BALANCE } from '@/data/mine';
import { carrierCapacity, elevatorTripSeconds, shaftRate } from './economy';
import { getModifiers } from './modifiers';
import { shaftStationId } from './simulate';
import type { GameState } from './types';

export interface OfflineResult {
  state: GameState;
  /** Segundos efectivos simulados (ya limitados por el tope offline). */
  seconds: number;
  /** Segundos reales que estuvo fuera el jugador. */
  awaySeconds: number;
  coins: number;
}

/**
 * Ganancias mientras el juego estaba cerrado. Se calcula de forma analítica:
 * solo trabajan las estaciones con manager y el flujo queda limitado por el
 * cuello de botella (galerías → ascensor → museo).
 */
export function applyOfflineProgress(state: GameState, now: number): OfflineResult {
  const awaySeconds = Math.max(0, (now - state.lastActiveAt) / 1000);
  const mods = getModifiers(state, state.lastActiveAt, false);
  const t = Math.min(awaySeconds, mods.offlineCapSeconds);
  if (t <= 0) return { state: { ...state, lastActiveAt: now }, seconds: 0, awaySeconds, coins: 0 };

  const { mine } = state;
  const shafts = mine.shafts.map((shaft, i) => {
    const produced = state.managers[shaftStationId(i)] ? shaftRate(i, shaft.level) * mods.shaftSpeed * t : 0;
    return { ...shaft, deposit: shaft.deposit + produced };
  });

  let surface = mine.surface;
  if (state.managers.elevator) {
    const perSecond = (carrierCapacity('elevator', mine.elevator.level) * mods.elevatorCapacity) / elevatorTripSeconds(shafts.length);
    let room = perSecond * t;
    for (const shaft of shafts) {
      const take = Math.min(shaft.deposit, room);
      shaft.deposit -= take;
      room -= take;
      surface += take;
      if (room <= 0) break;
    }
  }

  let coins = 0;
  if (state.managers.museum) {
    const perSecond = (carrierCapacity('museum', mine.museum.level) * mods.museumCapacity) / MINE_BALANCE.museum.cycleSeconds;
    const sold = Math.min(surface, perSecond * t);
    surface -= sold;
    // El boost de anuncio (×2) solo cuenta durante la parte del tiempo en que estuvo activo.
    const boostedSeconds = Math.max(0, Math.min(state.adBoostUntil, state.lastActiveAt + t * 1000) - state.lastActiveAt) / 1000;
    const boostFactor = 1 + boostedSeconds / t;
    coins = sold * MINE_BALANCE.coinsPerFossil * mods.coinValue * boostFactor;
  }

  return {
    state: {
      ...state,
      coins: state.coins + coins,
      runEarnings: state.runEarnings + coins,
      lifetimeEarnings: state.lifetimeEarnings + coins,
      mine: { ...mine, shafts, surface },
      lastActiveAt: now,
    },
    seconds: t,
    awaySeconds,
    coins,
  };
}
