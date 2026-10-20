# Módulo 1 · Pantalla de carga

Es lo primero que ve el jugador. Al terminar de cargar muestra **"¡Toca para jugar!"** y un toque
entra directamente al juego (ya no hay pantalla de inicio).

## Capas

```
┌─────────────────────────┐
│        [ LOGO ]         │  ← logo.png (recorte)
│  EXPLORA · EXCAVA · ... │  ← texto (código, traducido)
│                         │
│                         │
│ Cargando aventuras...   │  ← texto (código)
│ [■■■■■■■□□□□□□]  48 %   │  ← barra (código) → al terminar: "¡Toca para jugar!" 
│ Pequeños fósiles, ...   │  ← texto (código)
└─────────────────────────┘
  todo encima de background.jpg (pantalla completa)
```

## Archivos

| Archivo | Formato | Tamaño | Contenido |
|---|---|---|---|
| `assets/art/loading/background.jpg` | JPG/WebP opaco | **1290 × 2796** | Valle prehistórico: selva, helechos, volcán amistoso al fondo, cielo con nubes. **Sin personajes, logo ni texto.** |
| `assets/art/loading/logo.png` | PNG/WebP transparente | **1200 × 750** (aprox.; 4:3 también vale) | "DINO FOSSIL TYCOON" con el T-Rex asomándose. Único arte con texto. |
| `assets/splash-icon.png` | PNG transparente | **1024 × 1024** | Splash nativo (antes de que cargue el juego): mascota o logo simplificado. |

### Fondo — zonas seguras

El fondo se recorta para llenar cualquier pantalla. Sobre el lienzo de 1290 × 2796:

| Zona (coordenada Y en px) | Qué pasa ahí |
|---|---|
| 0 – 615 (22 % superior) | Va el **logo** encima: cielo tranquilo, sin detalles fuertes. |
| 538 – 2258 (franja central) | **Lo único que se ve en tablets** (iPad 3:4). Todo lo importante del paisaje (el volcán, el valle) debe estar aquí. |
| 251 – 2545 | Lo que se ve en móviles 16:9 (iPhone SE, Android antiguos). |
| 2097 – 2796 (25 % inferior) | Van **barra de carga y textos blancos** encima: hierba o tierra de colores medios, sin contraste fuerte, para que se lean. |
| Ancho completo | Se ve siempre entero. |

La ilustración central (los dinos, el esqueleto…) va **dentro del fondo**: el código ya no dibuja ninguna mascota encima. La referencia de estilo de la mascota está en `docs/art/referencias/mascot.webp`.

### Logo

- Margen transparente de ~40 px alrededor.
- Debe leerse bien a **300 pt de ancho** (≈ el ancho de la pantalla de un móvil menos márgenes).
- Si la proporción no es exactamente 16:10 no pasa nada: se ajusta sin deformarse.

### Splash nativo (opcional)

Es la imagen que muestra **el sistema del teléfono** durante una fracción de segundo, antes de que
arranque el juego (no aparece en la web). Si no la creas, se ve el icono por defecto sobre el azul
cielo del fondo; no pasa nada.

- Todo el dibujo dentro del **círculo central de ~640 px**: Android 12+ recorta el splash en círculo.
- Se ve sobre un color liso. Cuando llegue el fondo final, Claude ajustará ese color
  (`app.config.ts → expo-splash-screen → backgroundColor`) al color dominante del fondo.

## Prompts sugeridos

Añade al final de cada uno el bloque **"Biblia de estilo"** de [`../ART_GUIDE.md`](../ART_GUIDE.md)
(salvo en el fondo, que no lleva personaje).

**Fondo**

```
A vertical cartoon background for a cute mobile game loading screen: a lush prehistoric valley
with giant ferns and palm trees framing the left and right edges, a friendly smoking volcano and a
waterfall in the middle distance placed in the vertical center of the image, bright blue sky with
puffy clouds in the top quarter kept calm and simple, soft green grassy ground in the bottom quarter
with gentle low-contrast colors. Cheerful cozy daylight. Thick clean outlines, cel-shaded, saturated
jungle greens and sunny yellows. No characters, no text, no logo, no watermark. Aspect ratio 9:19.5.
```

**Logo** → usar el prompt de la sección "Logo" de `ART_GUIDE.md`.

## Cómo verlo

- Web publicada: https://alfredogonzalez.github.io/DinoFossil/ (tarda ~2–3 min en actualizarse tras subir).
- La carga dura ~2 s y luego **espera tu toque** ("¡Toca para jugar!"), así que puedes mirarla con calma.
- Si no ves el cambio, recarga sin caché (Ctrl+Shift+R) o abre una pestaña privada en el móvil.

## Checklist antes de entregar

- [ ] Nombres exactos: `background.jpg`, `logo.png` (y opcional `splash-icon.png`).
- [ ] Fondos sin texto; recortes con fondo transparente (no blanco).
- [ ] Tamaños y pesos dentro de lo indicado.
- [ ] Probado en la web publicada en móvil y, si es posible, en una tablet.
