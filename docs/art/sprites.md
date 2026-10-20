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
