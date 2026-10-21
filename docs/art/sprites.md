# Hojas de sprites (animaciones)

Las animaciones de personajes se entregan como **hojas de sprites**: una imagen con todos los
fotogramas en cuadrícula. El juego las reproduce solas; solo hay que subirlas con el nombre exacto.

## Formato

- **Cuadrícula de fotogramas cuadrados**, de izquierda a derecha y de arriba abajo.
  Formato actual: **5 × 5 fotogramas de 256 × 256 px = 1280 × 1280 px, 25 fotogramas**.
- Fondo transparente; el personaje **en la misma posición** en todos los fotogramas (pies a la misma altura).
- El personaje **mira a la derecha**. Para ir a la izquierda el juego lo voltea en espejo.
- PNG o WebP, ≤ 300 KB por hoja (Claude las convierte a WebP si pesan más).

Si una hoja nueva tiene otra cuadrícula (p. ej. 4 × 4) o debe ir más rápida o más lenta, se ajusta en
`src/ui/spriteSheets.ts` (columnas, filas, fotogramas y fps).

## Excavador de los sótanos (`assets/art/sprites/digger/`)

| Archivo | Estado | Cuándo se usa |
|---|---|---|
| `idle.png` | ✅ entregado | En reposo delante de la canasta (derecha), mirando a la izquierda (en espejo), con la manita "¡Toca!" |
| `walk.png` | ✅ entregado | Ida hacia el montón de tierra (izquierda, en espejo) |
| `dig.png` | ✅ entregado (reescalado ×1,78 y centrado por Claude) | Escarbando en el montón de tierra (en espejo) |
| `carry.png` | ✅ entregado (reescalado ×1,68 por Claude) | Regreso a la derecha cargando tierra con huesos |

Ciclo de excavación (3 s, o menos con mejoras/Turbo), repartido en tercios:
**camina a la tierra → escarba → regresa cargando → suelta los huesos en la canasta y vuelve a reposo**.
Escena completa del sótano: [04-sotanos.md](04-sotanos.md).
Sin manager, un ciclo por toque; con manager, en bucle. En los sótanos no hay barra de progreso:
el propio paseo del dino indica cuánto falta.

### Si una hoja sale con el personaje más pequeño

Pasa cuando la herramienta incluye tierra u objetos alrededor y "aleja" el encuadre. No hace falta
repetirla: Claude mide el cuerpo del dino (no la tierra), la reescala al tamaño de `idle`/`walk` y
alinea los pies en la misma línea.

### Prompts usados en AutoSprite (side-scroller, 25 fotogramas, 256 px, Sharpen: None)

- **Dig**: *Side view, facing right. The cute plush T-Rex stands in place and digs into the ground right
  in front of it using both little front paws, scooping dirt with quick alternating strokes. Small clumps
  of brown dirt and pebbles fly backward over its shoulder… In-place animation… loops seamlessly.*
- **Carry**: *Side view, facing right. The cute plush T-Rex walks forward while hugging a small pile of
  brown dirt with a cream fossil bone sticking out on top… In-place animation… loops seamlessly.*

## Jefe de traje (manager de los sótanos, `assets/art/sprites/manager/`)

Un solo personaje para todos los managers: el retrato de la especie que contrates se pone en su
**gafete** con código, así que no hace falta un sprite por especie.

| Archivo | Estado | Cuándo se usa |
|---|---|---|
| `idle.png` | ⏳ pendiente | De pie junto a la bolsa, anotando en su tabla mientras vigila al excavador (el juego lo voltea para que mire a la tierra) |

Mientras no exista, se ve el retrato redondo del dino contratado. Sin manager se ve el letrero "Se busca".

Reglas extra:
- **Mismo tamaño en pantalla que el excavador**: misma altura de cuerpo y pies a la misma línea.
  Si sale más pequeño, Claude lo reescala como con `dig` y `carry`.
- **El pecho despejado**: el gafete (un círculo de ~22 pt) se dibuja encima, a la altura del pecho,
  un poco a la izquierda del centro del fotograma. Que ahí no haya nada importante (corbata pequeña o
  solapa lisa).
- Sin cambios bruscos de pose: es un bucle tranquilo.

### Paso 1 · Personaje base (generador de imágenes)

Pásale `docs/art/referencias/mascot.webp` como referencia de estilo y añade la **Biblia de estilo** de
[`../ART_GUIDE.md`](../ART_GUIDE.md):

```
Full body, side view facing right. A cute chubby plush baby dinosaur foreman in a tiny dark-brown felt
suit jacket with stitched lapels, a cream shirt and a small red bow tie, wearing round glasses on its
snout. It holds a small wooden clipboard with a sheet of paper in one little arm and a pencil in the
other. Mint-green felt body with a cream belly, like the mascot. Standing upright on its two feet,
calm and confident smile. Keep the center of the chest plain (no badges or pins).
[BIBLIA DE ESTILO]
```

### Paso 2 · Animación en AutoSprite (side-scroller, 25 fotogramas, 256 px, Sharpen: None)

- **Name**: `idle` (manager)
- **Action**:

```
Side view, facing right. The cute plush dinosaur foreman stands in place holding its clipboard,
looks down at it and writes a few quick notes with the pencil, then looks up and to the right as if
checking on a worker, gives a small satisfied nod, and looks back down at the clipboard. Gentle
breathing bob, tail sways slightly. In-place animation, feet stay planted on the same line,
loops seamlessly.
```

*(Opcional, más adelante)*: `cheer.png`, levantando la tabla con alegría, para cuando actives Turbo.
