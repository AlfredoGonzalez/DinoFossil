import { IAP_PRODUCTS, type ProductId } from '@/data/shop';

/**
 * Compras simuladas (web, Expo Go, o cuando faltan las claves de RevenueCat).
 * La implementación real está en purchases.native.ts.
 */
export async function initPurchases(): Promise<void> {}

export async function getPrices(): Promise<Partial<Record<ProductId, string>>> {
  return Object.fromEntries(IAP_PRODUCTS.map((p) => [p.id, p.fallbackPrice]));
}

export async function purchase(_id: ProductId): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return true;
}

export async function restore(): Promise<ProductId[]> {
  return [];
}

export const purchasesAreSimulated = true;
