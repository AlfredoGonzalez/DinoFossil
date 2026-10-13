# 🦖 Dino Fossil Tycoon

Idle tycoon tierno de dinosaurios para iOS y Android: excava fósiles, súbelos con el ascensor,
véndelos en el museo, incuba huevos, colecciona 24 especies y haz prestigio con Huellas Antiguas.

Hecho 100 % en código con **Expo (React Native) + TypeScript**, sin editores visuales.

## Probar en el navegador

**Online:** https://alfredogonzalez.github.io/DinoFossil/ (se publica solo en cada push con
`.github/workflows/deploy-web.yml`). Ábrelo en el móvil o, en el ordenador, con el modo
dispositivo de las herramientas de desarrollador (F12 → Ctrl+Shift+M).

Anuncios y compras son simulados en web. La partida se guarda en el navegador
(Ajustes → Borrar progreso para empezar de cero).

## Empezar

```bash
npm install
npm run web        # pruébalo en el navegador (anuncios y compras simulados)
npm test           # tests del motor del juego
```

En el móvil, AdMob y RevenueCat necesitan un *development build* (no funcionan en Expo Go):

```bash
npx eas-cli@latest login
npx eas-cli@latest build --profile development --platform android   # o ios
npx expo start --dev-client
```

En Expo Go el juego funciona igual, con anuncios y compras simulados.

## Configuración para publicar

Crea un archivo `.env.local` (no se sube a git):

```
EXPO_PUBLIC_ADMOB_ANDROID_APP_ID=ca-app-pub-xxx~xxx
EXPO_PUBLIC_ADMOB_IOS_APP_ID=ca-app-pub-xxx~xxx
EXPO_PUBLIC_ADMOB_ANDROID_REWARDED_ID=ca-app-pub-xxx/xxx
EXPO_PUBLIC_ADMOB_IOS_REWARDED_ID=ca-app-pub-xxx/xxx
EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_xxx
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_xxx
```

Sin estas variables se usan los IDs de prueba de AdMob y compras simuladas.
Los productos a crear en las tiendas están en `docs/GAME_DESIGN.md`.

Ajusta también `bundleIdentifier` / `package` en `app.config.ts`.

## Documentación

- `docs/GAME_DESIGN.md` — bucle, fórmulas, prestigio, monetización.
- `docs/ART_GUIDE.md` — biblia de estilo y prompts para generar el arte con IA.
- `CLAUDE.md` — convenciones del código para seguir desarrollando con IA.
