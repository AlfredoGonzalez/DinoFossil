import { useUiStore } from '@/store/uiStore';

/**
 * Anuncios simulados: se usan en web, en Expo Go y en tests. Muestran un
 * overlay de "Anuncio de prueba" y siempre conceden la recompensa.
 * La implementación real con AdMob está en ads.native.ts.
 */
export async function initAds(): Promise<void> {}

export async function showRewardedAd(): Promise<boolean> {
  const ui = useUiStore.getState();
  ui.setFakeAdPlaying(true);
  await new Promise((resolve) => setTimeout(resolve, 1500));
  ui.setFakeAdPlaying(false);
  return true;
}

export async function showPrivacyOptions(): Promise<void> {}

export const adsAreSimulated = true;
