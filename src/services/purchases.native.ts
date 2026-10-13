import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';
import { IAP_PRODUCTS, type ProductId } from '@/data/shop';
import * as simulated from './purchases';

type PurchasesModule = typeof import('react-native-purchases');

const apiKey = Platform.OS === 'ios' ? process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY : process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY;
const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
// Sin clave de RevenueCat (o en Expo Go) usamos compras simuladas.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const rc: PurchasesModule | null = apiKey && !isExpoGo ? require('react-native-purchases') : null;

const PRODUCT_IDS = IAP_PRODUCTS.map((p) => p.id);
let products: import('react-native-purchases').PurchasesStoreProduct[] = [];

function isProductId(id: string): id is ProductId {
  return (PRODUCT_IDS as string[]).includes(id);
}

export async function initPurchases(): Promise<void> {
  if (!rc || !apiKey) return;
  rc.default.configure({ apiKey });
}

export async function getPrices(): Promise<Partial<Record<ProductId, string>>> {
  if (!rc) return simulated.getPrices();
  products = await rc.default.getProducts(PRODUCT_IDS, rc.PRODUCT_CATEGORY.NON_SUBSCRIPTION);
  return Object.fromEntries(products.map((p) => [p.identifier, p.priceString]));
}

export async function purchase(id: ProductId): Promise<boolean> {
  if (!rc) return simulated.purchase(id);
  const product = products.find((p) => p.identifier === id);
  if (!product) return false;
  try {
    await rc.default.purchaseStoreProduct(product);
    return true;
  } catch (error) {
    if ((error as { userCancelled?: boolean }).userCancelled) return false;
    throw error;
  }
}

export async function restore(): Promise<ProductId[]> {
  if (!rc) return simulated.restore();
  const info = await rc.default.restorePurchases();
  return info.allPurchasedProductIdentifiers.filter(isProductId);
}

export const purchasesAreSimulated = !rc;
