import { AD_REWARDS } from '@/data/mine';
import { AMBER_EGG_PRICES, IAP_PRODUCTS, type ProductId } from '@/data/shop';
import type { GameState, Rarity } from './types';

const HOUR = 3600 * 1000;
const DAY = 24 * HOUR;

/** Añade 4 h de ×2 producción, acumulable hasta 12 h. */
export function applyAdBoost(state: GameState, now: number): GameState {
  const base = Math.max(state.adBoostUntil, now);
  const adBoostUntil = Math.min(base + AD_REWARDS.boostHours * HOUR, now + AD_REWARDS.maxBoostHours * HOUR);
  return { ...state, adBoostUntil };
}

export function canAddAdBoost(state: GameState, now: number): boolean {
  return state.adBoostUntil < now + (AD_REWARDS.maxBoostHours - AD_REWARDS.boostHours) * HOUR + 1000;
}

export function canClaimDailyAmber(state: GameState, now: number): boolean {
  return now - state.lastDailyAmberAt >= DAY;
}

export function claimDailyAmber(state: GameState, now: number): GameState | null {
  if (!canClaimDailyAmber(state, now)) return null;
  return { ...state, amber: state.amber + AD_REWARDS.dailyAmber, lastDailyAmberAt: now };
}

export function buyEggWithAmber(state: GameState, rarity: Rarity): GameState | null {
  const price = AMBER_EGG_PRICES[rarity];
  if (price === undefined || state.amber < price) return null;
  return { ...state, amber: state.amber - price, eggs: { ...state.eggs, [rarity]: state.eggs[rarity] + 1 } };
}

/** Entrega el contenido de una compra con dinero real. */
export function applyPurchase(state: GameState, productId: ProductId): GameState {
  const product = IAP_PRODUCTS.find((p) => p.id === productId);
  if (!product) return state;
  const { grant } = product;
  const eggs = { ...state.eggs };
  for (const [rarity, n] of Object.entries(grant.eggs ?? {})) eggs[rarity as Rarity] += n ?? 0;
  return {
    ...state,
    amber: state.amber + (grant.amber ?? 0),
    eggs,
    purchases: {
      doubleIncome: state.purchases.doubleIncome || !!grant.doubleIncome,
      dinoPass: state.purchases.dinoPass || !!grant.dinoPass,
      starterPack: state.purchases.starterPack || !!grant.starterPack,
    },
  };
}

/** Restaura compras no consumibles (p. ej. al reinstalar). */
export function restorePurchases(state: GameState, owned: ProductId[]): GameState {
  return {
    ...state,
    purchases: {
      doubleIncome: state.purchases.doubleIncome || owned.includes('double_income'),
      dinoPass: state.purchases.dinoPass || owned.includes('dino_pass'),
      starterPack: state.purchases.starterPack || owned.includes('starter_pack'),
    },
  };
}
