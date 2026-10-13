import i18n from '@/i18n';
import { useGameStore } from '@/store/gameStore';
import { useUiStore } from '@/store/uiStore';
import { showRewardedAd } from './ads';

/**
 * Pide ver un anuncio con recompensa. Con el Pase Dino se concede la
 * recompensa directamente sin anuncio.
 */
export async function watchRewardedAd(): Promise<boolean> {
  if (useGameStore.getState().game.purchases.dinoPass) return true;
  const ok = await showRewardedAd();
  if (!ok) useUiStore.getState().toast(i18n.t('shop.adFailed'), '📺');
  return ok;
}
