import type { Rarity } from '@/game/types';

export type ProductId =
  | 'amber_small'
  | 'amber_medium'
  | 'amber_large'
  | 'starter_pack'
  | 'double_income'
  | 'dino_pass';

export interface IapProduct {
  id: ProductId;
  kind: 'consumable' | 'nonConsumable';
  /** Precio de referencia para el modo mock; en las tiendas se usa el precio real. */
  fallbackPrice: string;
  grant: { amber?: number; eggs?: Partial<Record<Rarity, number>>; doubleIncome?: true; dinoPass?: true; starterPack?: true };
}

/** IDs que deben crearse igual en App Store Connect, Google Play y RevenueCat. */
export const IAP_PRODUCTS: readonly IapProduct[] = [
  { id: 'starter_pack', kind: 'nonConsumable', fallbackPrice: '$1.99', grant: { amber: 300, eggs: { epic: 2 }, starterPack: true } },
  { id: 'amber_small', kind: 'consumable', fallbackPrice: '$0.99', grant: { amber: 100 } },
  { id: 'amber_medium', kind: 'consumable', fallbackPrice: '$4.99', grant: { amber: 550 } },
  { id: 'amber_large', kind: 'consumable', fallbackPrice: '$9.99', grant: { amber: 1200 } },
  { id: 'double_income', kind: 'nonConsumable', fallbackPrice: '$6.99', grant: { doubleIncome: true } },
  { id: 'dino_pass', kind: 'nonConsumable', fallbackPrice: '$7.99', grant: { dinoPass: true } },
];

/** Huevos que se compran con Ámbar. */
export const AMBER_EGG_PRICES: Partial<Record<Rarity, number>> = {
  rare: 50,
  epic: 150,
  legendary: 500,
};
