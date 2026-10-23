# Módulo 2 · La Casa-Museo (pantalla principal del juego)

Es donde se pasa el 90 % del tiempo. La mina es el **corte de una casa de muñecas**:

- en los **sótanos** los dinos excavan fósiles;
- el **montacargas** los sube al **laboratorio**, donde se limpian;
- en la **sala de exposición** se exhiben y los visitantes pagan entrada (DinoCoins).

Estilo: el mismo "peluche/fieltro con costuras" del logo y la mascota → bloque **Biblia de estilo**
de [`../ART_GUIDE.md`](../ART_GUIDE.md), con `docs/art/referencias/mascot.webp` como referencia.
Para interiores y escenarios usa el bloque de **fondos**.

## Capas

```
┌──────────────────────────────┐
│ 🪙 12K  🐾 3  🔶 120      [+] │  ← barra de recursos (código)
│ [ ×2 4h ]          [🐾] [⚙]  │  ← botones (código; icono ⚙ = ui/icon-settings)
│        ╭──────────────╮      │
│   ╭────│  Casa-Museo  │───╮  │  ← museum/roof (el cartel y su texto son código)
│ ┌─┴────────────────────────┐ │
│ │[M] Sala de exposición [Nv]│ │  ← museum/hall + taquilla con pterodáctilo + visitantes
│ ├──────────────────────────┤ │
│ │[M] Laboratorio  🖌️  [Nv]│▒│ │  ← museum/lab                    ▒ = montacargas
│ ├══════════ suelo ══════════┤▒│     (raíles en código, caja = museum/crate)
│ │ ⛰️ ← 🦖🧺 [M]       [Nv]│▒│ │  ← museum/basement (se repite en cada sótano;
│ │ ⛰️ ← 🦖🧺 [M]       [Nv]│▒│ │     escena detallada en 04-sotanos.md)
│ │   [ + Nuevo sótano ]      │ │
│ └──────────────────────────┘ │
│  ░░░░░░ cimientos ░░░░░░░░░  │  ← museum/foundation
│ [Mapa][Dinos][Huevos][Tienda][Misiones] │ ← barra (código; iconos más adelante)
└──────────────────────────────┘
 detrás de todo: museum/sky (lo que se ve alrededor del tejado)
```

`[M]` = hueco del dino manager · `[Nv]` = botón de nivel/mejora. Los dinos que trabajan en cada
planta se dibujarán con sus sprites de la colección (módulo posterior).

## Archivos

Todos en `assets/art/museum/`.

| Archivo | Formato | Tamaño | Contenido | Si falta… |
|---|---|---|---|---|
| `sky.jpg` ✅ | JPG/WebP opaco | **1290 × 2796** | Paisaje detrás de la casa: cielo, colinas, palmeras lejanas. Solo se ve alrededor del tejado. *Opcional.* | fondo de la carga |
| `roof.png` ✅ | PNG/WebP transparente | **1290 × 430** | Tejado de tejas de fieltro con chimenea y alero. **Deja libre un hueco central abajo** (≈ 520 × 170 px) para el cartel "Casa-Museo". | tejado de código |
| `hall.png` ✅ | JPG/WebP opaco | **1290 × 520** | Sala de exposición **al aire libre**: sendero, pabellón con vitrinas, esqueletos con cordón rojo y cartel EXIT. **Sin personajes.** | verde claro |
| `ticket-desk.png` ✅ | PNG/WebP transparente | ~**512 × 308** | Mesita de entradas (TICKETS) y recuerdos (gorritos de dino). El pterodáctilo va detrás, mirando a la izquierda. | sin mesita |
| `lab.png` ✅ | JPG/WebP opaco | **1290 × 480** | Interior del laboratorio: azulejos claros, estanterías con frascos, lupa gigante, mesa de trabajo baja. | color azul claro |
| `basement.png` ✅ | JPG/WebP opaco | **1290 × 480** | Pared de tierra con vigas de madera, raíces, piedrecitas y algún hueso incrustado, **sin objetos grandes** (el montón de tierra y la canasta van encima, ver [04-sotanos.md](04-sotanos.md)). Se repite en cada sótano: que los bordes izquierdo/derecho no tengan elementos llamativos cortados. | color tierra |
| `foundation.png` ✅ | JPG/WebP opaco | **1290 × 360** | Roca y tierra profunda bajo la casa (cimientos de piedra, cristales pequeños). La parte de arriba debe empalmar con el sótano. | color tierra oscura |
| `crate-empty.png` ✅ | PNG/WebP transparente | **256 × 256** | Caja del montacargas **vacía**: se ve mientras baja. | `crate.png` o caja de código |
| `crate-full.png` ✅ | PNG/WebP transparente | **256 × 256** | La misma caja **llena de huesos**: se ve mientras sube. Que ambas tengan la misma perspectiva. | `crate.png` o caja de código |
| `pulley.png` ✅ | PNG/WebP transparente | ~**210 × 256** | Polea con su soporte y argolla, de frente. Va **fija** arriba del montacargas, en el laboratorio. | rueda de código que gira |
| `pulley-wheel.png` (opcional) | PNG/WebP transparente | **256 × 256** | Solo la **rueda** (sin soporte ni argolla), del mismo tamaño que en `pulley.png`: el código la hace girar debajo del soporte. Para que se vea girar, quita la rueda de `pulley.png` y deja solo soporte, argolla y cabos. | — |
| `rope.png` (pendiente) | PNG/WebP transparente | **32 × 256** | Tramo **vertical** de cuerda trenzada, que empalme arriba con abajo: el código lo repite hasta la caja. | cuerda de código |
| `easel-hiring.png` / `easel-hired.png` ✅ | PNG/WebP transparente | ~**300 × 480** | El cuadro del manager sobre un tripié, para la sala. "Hiring" con el texto (solo inglés) y "Hired" liso con la **misma ventanita** para la foto en el mismo lugar. | cuadro de código con patas |
| `visitor.png` | PNG/WebP transparente | **512 × 512** | *(Reemplazado por los visitantes animados de [sprites.md](sprites.md#visitantes-de-la-sala-assetsartspritesvisitors).)* | emoji 🧒 |

### Zonas seguras de las plantas (`hall`, `lab`, `basement`)

Cada planta se muestra como una franja de unos **360 × 124 pt** en móvil (más ancha en tablet), recortada
para llenar el espacio. Sobre el lienzo de 1290 × 480:

| Zona | Qué hay encima |
|---|---|
| 0 – 200 px desde la izquierda | El círculo del dino manager |
| Últimos 330 px de la derecha | Botón de nivel y, en laboratorio/sótanos, la columna del montacargas |
| 60 px superiores y 60 inferiores | Pueden recortarse en pantallas anchas |
| Últimos 40 px de abajo | Viga del suelo (la dibuja el código) |
| **Centro (≈ 200 – 960 px)** | **Escena libre**: aquí se ve el dino trabajando y los textos. Detalles suaves, sin contraste fuerte, para que se lean los textos blancos/oscuros |

### Tejado

- Proporción ~3:1. Se muestra a lo ancho de la pantalla, ~120 pt de alto.
- El cartel con el nombre (y su texto traducido) lo pone el código en el centro inferior: déjalo libre.
- Bordes de tejas que "cierren" con las paredes de madera (marco marrón oscuro `#7A4A24`).

## Prompts sugeridos

**Interiores** (cambia lo del corchete; añade el bloque de **fondos** de `ART_GUIDE.md`)

```
A wide horizontal cross-section interior of one floor of a cozy dollhouse-style dinosaur museum, seen
straight from the front like a stage, [an exhibition hall with warm patterned wallpaper, a wooden
wainscot, framed fossil drawings and a red velvet rope | a fossil-cleaning laboratory with pale tiles,
shelves of jars, a giant magnifying glass and a low workbench | an underground earthen basement with
wooden support beams, hanging roots, pebbles and a few fossil bones in the walls]. Felt and fabric
textures with visible stitching, soft warm lighting. Keep the left and right edges calm and the center
open, no characters, flat front view. Aspect ratio 1290:480.
```

**Tejado**

```
The roof of a cozy dollhouse-style dinosaur museum seen from the front: rounded rows of terracotta
felt roof tiles with stitched edges, a small brick chimney on the right, a wooden eave along the bottom
edge. Leave a plain empty area in the bottom center for a sign. Transparent background around the roof.
Wide format 3:1.
[BIBLIA DE ESTILO]
```

**Caja del montacargas**

```
A small wooden crate made of felt and fabric with stitched edges, filled with cream fossil bones poking
out of the top, front view, centered with padding.
[BIBLIA DE ESTILO]
```

**Visitante**

```
A tiny kawaii plush baby dinosaur tourist wearing a little cap and a camera around its neck, walking
to the right in side view, full body.
[BIBLIA DE ESTILO]
```

## Cómo verlo

- Web: https://alfredogonzalez.github.io/DinoFossil/ → toca para jugar (se actualiza 2–3 min después de subir).
- Para ver varios sótanos, juega un poco o desbloquéalos con DinoCoins.
- Si no ves el cambio, recarga sin caché (Ctrl+Shift+R) o usa una pestaña privada.

## Checklist antes de entregar

- [ ] Carpeta `assets/art/museum/` y nombres exactos (`.webp` también vale).
- [ ] Interiores sin personajes ni texto; recortes con transparencia real.
- [ ] Centro de cada planta despejado para el dino y los textos.
- [ ] Pesos: fondos ≤ 600 KB, recortes ≤ 300 KB (squoosh.app o TinyPNG).
