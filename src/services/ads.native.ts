import Constants, { ExecutionEnvironment } from 'expo-constants';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import { Platform } from 'react-native';
import * as simulated from './ads';

type AdsModule = typeof import('react-native-google-mobile-ads');

// Expo Go no incluye el SDK de AdMob: allí usamos los anuncios simulados.
const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const ads: AdsModule | null = isExpoGo ? null : require('react-native-google-mobile-ads');

function rewardedUnitId(): string {
  if (!ads) return '';
  const id = Platform.OS === 'ios' ? process.env.EXPO_PUBLIC_ADMOB_IOS_REWARDED_ID : process.env.EXPO_PUBLIC_ADMOB_ANDROID_REWARDED_ID;
  return __DEV__ || !id ? ads.TestIds.REWARDED : id;
}

let rewarded: import('react-native-google-mobile-ads').RewardedAd | null = null;
let loaded = false;

function preload() {
  if (!ads) return;
  loaded = false;
  rewarded = ads.RewardedAd.createForAdRequest(rewardedUnitId());
  rewarded.addAdEventListener(ads.RewardedAdEventType.LOADED, () => {
    loaded = true;
  });
  rewarded.addAdEventListener(ads.AdEventType.ERROR, () => {
    loaded = false;
    setTimeout(preload, 30_000);
  });
  rewarded.load();
}

/** Consentimiento (UMP/GDPR) → ATT en iOS → inicializar SDK → precargar anuncio. */
export async function initAds(): Promise<void> {
  if (!ads) return;
  try {
    await ads.AdsConsent.gatherConsent();
  } catch {
    // Sin consentimiento resuelto se siguen pudiendo pedir anuncios no personalizados.
  }
  if (Platform.OS === 'ios') await requestTrackingPermissionsAsync();
  await ads.default().initialize();
  preload();
}

export async function showRewardedAd(): Promise<boolean> {
  if (!ads) return simulated.showRewardedAd();
  const ad = rewarded;
  if (!ad || !loaded) return false;
  return new Promise((resolve) => {
    let earned = false;
    const offEarned = ad.addAdEventListener(ads.RewardedAdEventType.EARNED_REWARD, () => {
      earned = true;
    });
    const offClosed = ad.addAdEventListener(ads.AdEventType.CLOSED, () => {
      offEarned();
      offClosed();
      preload();
      resolve(earned);
    });
    ad.show().catch(() => {
      offEarned();
      offClosed();
      preload();
      resolve(false);
    });
  });
}

export async function showPrivacyOptions(): Promise<void> {
  if (!ads) return;
  await ads.AdsConsent.showPrivacyOptionsForm();
}

export const adsAreSimulated = !ads;
