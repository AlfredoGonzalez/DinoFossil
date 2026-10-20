# Dino Fossil Tycoon — guía para agentes

Lee también `AGENTS.md` (reglas generales de Expo). Este archivo añade las convenciones del proyecto.

## Qué es

Idle tycoon tierno de dinosaurios (estilo Idle Miner) para iOS y Android con Expo SDK 57,
expo-router y TypeScript. Diseño y fórmulas: `docs/GAME_DESIGN.md`. Arte: `docs/ART_GUIDE.md`.

## Estructura

- `src/game/` — **motor puro** (sin React ni Expo). Toda regla de juego va aquí, como funciones
  puras `(state, …) => newState | null`. `null` = acción no válida. El tiempo (`now`) y el azar
  (`rng`) se pasan como parámetros para poder testear.
- `src/data/` — balance y contenido (números, dinos, mundos, productos). Ajusta aquí, no en el motor.
- `src/store/gameStore.ts` — Zustand persistido; las acciones solo envuelven funciones del motor.
- `src/store/uiStore.ts` — estado efímero (toasts, modales).
- `src/services/` — anuncios, compras, audio y vibración. `x.ts` = versión simulada (web/Expo Go),
  `x.native.ts` = implementación real.
- `src/ui/` — componentes visuales (ChunkyButton, Panel, GameText, GameModal…) y `src/ui/mine/`.
- `src/app/` — pantallas (rutas de expo-router).
- `src/i18n/` — textos en `es.ts` (fuente de verdad) y `en.ts` (tipado contra `es`).

## Reglas

- Nunca escribas texto visible sin i18n: añade la clave en `es.ts` y en `en.ts`.
- Los selectores de Zustand deben devolver valores estables (primitivos o referencias del estado).
  Un selector que crea objetos nuevos provoca renders infinitos (error React #185).
- No llames a `Date.now()` durante el render; usa `useNow()` de `src/ui/hooks.ts`.
- Si cambias la forma de `GameState`, sube `SAVE_VERSION` y adapta `migrateSave` en `src/game/state.ts`.
- Arte final: imágenes en `assets/art/<módulo>/<pieza>.(png|webp|jpg)`. `scripts/generate-art.mjs`
  genera `src/ui/art.generated.ts` (ignorado en git); las pantallas usan `getArt('<módulo>/<pieza>')` de
  `src/ui/art.ts` y caen al placeholder si falta. Al añadir un hueco nuevo, decláralo en `ART_SPECS` y
  documéntalo en `docs/art/`. Iconos: usa `<GameIcon name=… />` (lista en `src/ui/iconNames.ts`, arte en `assets/art/icons/`), nunca
  emojis sueltos en la UI. (Los retratos de dinos aún usan `src/ui/sprites.ts`; migrarlos en su módulo.)

## Comandos

```bash
npm test             # tests del motor (Jest)
npm run typecheck    # tsc --noEmit
npm run lint         # expo lint
npm run web          # jugar en el navegador (anuncios y compras simulados)
npx eas-cli@latest build --profile development --platform android|ios  # dev build con AdMob/RevenueCat
```

Ejecuta tests, typecheck y lint antes de dar una tarea por terminada.
