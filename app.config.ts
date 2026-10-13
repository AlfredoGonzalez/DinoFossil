import type { ConfigContext, ExpoConfig } from 'expo/config';

// IDs de prueba oficiales de AdMob. Sustitúyelos con variables de entorno
// (EXPO_PUBLIC_ADMOB_*) antes de publicar en las tiendas.
const ADMOB_TEST_ANDROID_APP_ID = 'ca-app-pub-3940256099942544~3347511713';
const ADMOB_TEST_IOS_APP_ID = 'ca-app-pub-3940256099942544~1458002511';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Dino Fossil Tycoon',
  slug: 'dino-fossil-tycoon',
  scheme: 'dinofossil',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.dinofossil.tycoon',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    package: 'com.dinofossil.tycoon',
    adaptiveIcon: {
      backgroundColor: '#8FD16A',
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundImage: './assets/android-icon-background.png',
      monochromeImage: './assets/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    favicon: './assets/favicon.png',
    output: 'single',
  },
  plugins: [
    'expo-router',
    'expo-status-bar',
    'expo-localization',
    'expo-audio',
    'expo-font',
    [
      'expo-splash-screen',
      {
        image: './assets/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#8FD16A',
      },
    ],
    [
      'expo-tracking-transparency',
      {
        userTrackingPermission:
          'Usamos este identificador para mostrarte anuncios más relevantes a cambio de recompensas.',
      },
    ],
    [
      'react-native-google-mobile-ads',
      {
        androidAppId: process.env.EXPO_PUBLIC_ADMOB_ANDROID_APP_ID ?? ADMOB_TEST_ANDROID_APP_ID,
        iosAppId: process.env.EXPO_PUBLIC_ADMOB_IOS_APP_ID ?? ADMOB_TEST_IOS_APP_ID,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    // Prefijo de la web publicada en GitHub Pages (/DinoFossil). Vacío en local y en nativo.
    baseUrl: process.env.EXPO_BASE_URL || undefined,
  },
});
