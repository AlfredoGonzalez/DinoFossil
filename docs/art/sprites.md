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
| `idle.png` | ✅ entregado | En espera, junto al "¡Toca!" (sótano sin manager) |
| `walk.png` | ✅ entregado | Al tocar: camina a la derecha y regresa (ida y vuelta = 3 s, un ciclo de excavación); al volver suelta los huesos |
| `dig.png` | pendiente | Picando la pared al final del camino |
| `carry.png` | pendiente | Regresando con los huesitos en brazos |

Hoy, con manager, el excavador repite el paseo de ida y vuelta sin parar. Cuando lleguen `dig` y
`carry`, el ciclo será: caminar → picar → volver cargando → soltar.
