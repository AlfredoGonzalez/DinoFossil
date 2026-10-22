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

## Visitantes de la sala (`assets/art/sprites/visitors/`)

| Archivo | Estado | Cuándo se usa |
|---|---|---|
| `a.png`, `b.png`, `c.png` | ✅ entregados | Mientras la sala trabaja, un visitante cruza de izquierda a derecha; en cada vuelta entra uno al azar |

Caminando hacia la **derecha**, en el mismo formato 5 × 5. Se pueden añadir más (`d`, `e`…): se
registran en `src/ui/art.ts`, `src/ui/spriteSheets.ts` y la lista `VISITOR_SHEETS` de `HallFloor.tsx`.

## Laboratorista (`assets/art/sprites/lab/`) · ✅ entregado

Un dino **fuerte** (brazos gordos, delantal de laboratorio, guantes) que sube la caja del
montacargas tirando de una cuerda. En reposo está a la **derecha**, junto al montacargas, mirando
a la derecha (hacia la cuerda). Al tocar: tira de la cuerda **caminando hacia atrás, a la
izquierda** (la caja sube), suelta y regresa a la derecha (la caja baja). La cuerda y la polea las
dibuja el código (polea: `museum/pulley.png` en [02-casa-museo.md](02-casa-museo.md)).

En reposo la caja del montacargas espera **abajo**, vacía. Al tocar, él tira caminando hacia atrás
(unos 96 pt) y la caja sube llena; al soltar vuelve a su sitio y la caja baja vacía. Mientras tira,
`museum/dirt.png` (nube de tierra) sale de sus pies, crece y se desvanece. La cuerda de sus garras a
la polea la dibuja el código; si se entrega `museum/rope.png`, se usará para el tramo vertical.

Entregados como Therizinosaurio; Claude bajó `pull` 4 px y `walk` 7 px para que los pies pisen la
misma línea que `idle`.

| Archivo | Qué hace | Cómo |
|---|---|---|
| `idle.png` | Espera con la cuerda en las manos | Mirando a la derecha, en su sitio |
| `pull.png` | Tira de la cuerda con fuerza | **Mirando a la derecha y caminando hacia atrás** (en el sitio): el juego lo desplaza a la izquierda |
| `walk.png` | Regresa a su sitio | Caminando hacia delante, mirando a la derecha |

Personaje base (generador de imágenes, con la mascota como referencia de estilo):

```
Full body, side view facing right. A cute but strong chubby plush dinosaur lab worker with big
round muscular arms, wearing a small white lab apron with stitched pockets, thick yellow rubber
gloves and round safety goggles pushed up on its forehead. Warm orange felt body with a cream belly.
Standing upright on its two feet, determined friendly smile, both hands held forward at chest
height as if gripping a rope.
[BIBLIA DE ESTILO]
```

AutoSprite (side-scroller, 25 fotogramas, 256 px, Sharpen: None):

- **pull**: *Side view, facing right. The strong plush dinosaur grips a rope in front of it with both
  hands and pulls hard, leaning back and stepping backward, hand over hand, as if hauling a heavy
  load up with a pulley. In-place animation (it does not move across the frame), feet stay on the
  same line, loops seamlessly.*
- **idle**: *Side view, facing right. The strong plush dinosaur stands holding a rope with both hands
  at chest height, breathing calmly, small bounce, tail sways. In-place animation, loops seamlessly.*
- **walk**: *Side view, facing right. The strong plush dinosaur walks forward with relaxed arms.
  In-place animation, loops seamlessly.*

## Taquillero de la sala (`assets/art/sprites/hall/`) · pendiente

El que cobra la entrada a los visitantes: de pie junto a una taquilla o un cordón rojo, a la
**derecha** de la sala, mirando a la izquierda (hacia los visitantes; dibújalo mirando a la derecha y
el juego lo voltea).

| Archivo | Qué hace |
|---|---|
| `idle.png` | Espera tranquilo junto al cordón |
| `charge.png` | Recibe una moneda, la guarda y saluda con la mano (se repite en cada visita) |

Personaje base:

```
Full body, side view facing right. A cute chubby plush dinosaur museum usher wearing a small red
vest with golden buttons, a tiny red bow tie and a little red usher cap. Lavender felt body with a
cream belly. Standing upright next to nothing (no props), polite welcoming smile.
[BIBLIA DE ESTILO]
```

AutoSprite: **charge**: *Side view, facing right. The plush usher holds out one paw, receives a
golden coin, drops it into a small pouch at its belt and gives a friendly wave. In-place animation,
loops seamlessly.* · **idle**: *stands politely, small bounce, looks around. In-place animation,
loops seamlessly.*
