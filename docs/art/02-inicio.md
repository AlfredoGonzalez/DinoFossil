# Módulo 2 · Pantalla de inicio

La pantalla con **JUGAR / Iniciar sesión / Invitado**. Ya usa el logo del módulo 1 y, mientras no
entregues las piezas de esta ficha, reutiliza el fondo y la mascota de la carga.

Estilo: el mismo "peluche" del logo y la mascota → bloque **Biblia de estilo** de
[`../ART_GUIDE.md`](../ART_GUIDE.md), usando `assets/art/loading/mascot.webp` como referencia.

## Capas

```
┌─────────────────────────┐
│        [ LOGO ]         │  ← módulo 1 (ya entregado)
│ ¡Un mundo prehistórico… │  ← texto (código, traducido)
│                         │
│   [  HERO: grupo de  ]  │  ← home/hero.png (recorte)
│   [  dinos + huevos  ]  │
│                         │
│  [      JUGAR       ]   │  ← botones (código)
│  [ G Iniciar sesión ]   │
│  [     Invitado     ]   │
│ [⚙]  [🏆]  [🏪]  [✉]    │  ← iconos ui/icon-*.png dentro de botones azules (código)
│ Ajustes Logros Tienda…  │  ← texto (código)
└─────────────────────────┘
  todo encima de home/background.jpg (pantalla completa)
```

## Archivos

| Archivo | Formato | Tamaño | Contenido | Si falta… |
|---|---|---|---|---|
| `assets/art/home/background.jpg` | JPG/WebP opaco | **1290 × 2796** | Paisaje de inicio (puede ser una variante del de carga: lo alto de un acantilado, un claro de la selva…). **Sin personajes ni texto.** *Opcional.* | se usa el fondo de carga |
| `assets/art/home/hero.png` | PNG/WebP transparente | **1600 × 1000** | Grupo de 3–4 dinos de peluche celebrando sobre un pequeño saliente de hierba con huevos de fósil | se usa la mascota de carga |
| `assets/art/ui/icon-settings.png` | PNG/WebP transparente | **384 × 384** | Engranaje | emoji ⚙️ |
| `assets/art/ui/icon-goals.png` | PNG/WebP transparente | **384 × 384** | Trofeo | emoji 🏆 |
| `assets/art/ui/icon-shop.png` | PNG/WebP transparente | **384 × 384** | Tienda / puesto con toldo | emoji 🏪 |
| `assets/art/ui/icon-news.png` | PNG/WebP transparente | **384 × 384** | Sobre / carta | emoji ✉️ |

Los iconos van en `ui/` porque se reutilizarán en otras pantallas (la tienda en la barra inferior,
los ajustes en la mina…).

**No hace falta crear:** los botones (llevan texto traducible y ya imitan el estilo del mockup) ni el
icono de Google (debe ser el logo oficial de Google, y ese botón aún no funciona).

### Fondo — zonas seguras (opcional)

Sobre el lienzo de 1290 × 2796:

| Zona (Y en px) | Qué va encima |
|---|---|
| 0 – 620 | Logo: cielo tranquilo |
| 650 – 1150 | Subtítulo blanco: evita zonas muy claras o muy recargadas |
| 1150 – 1900 | Hero: ideal un claro o saliente "donde pararse" |
| 1900 – 2450 | Botones: colores medios, sin detalles importantes |
| 2450 – 2796 | Iconos y versión |
| 538 – 2258 | Lo único visible en tablet (3:4) |

### Hero

- Lienzo **1600 × 1000**, fondo transparente. Se muestra en una caja de hasta ~360 × 240 pt
  (en móviles pequeños, más pequeño): **debe leerse bien en pequeño**.
- Personajes sugeridos: la mascota T-Rex (protagonista, al centro o a la izquierda), un triceratops,
  un brontosaurio y un pterodáctilo volando cerca; todos de peluche y con sombrero de explorador.
- Base: un pequeño saliente de hierba con 2–3 huevos de fósil manchados. **La base toca el borde
  inferior** del lienzo.
- Márgenes: ~60 px a los lados y **nada importante en los 120 px superiores** (el subtítulo queda justo encima).
- Peso ≤ 300 KB (expórtalo en WebP si el PNG pesa más).

### Iconos

- Un solo objeto por icono, centrado, con ~32 px de margen transparente.
- Estilo peluche/fieltro con costuras, colores cálidos que destaquen sobre **botón azul** (#3D9BF0).
- Se muestran a **34 pt**: formas simples y gruesas, sin detalles finos ni texto.
- Peso ≤ 100 KB cada uno.

## Prompts sugeridos

Añade al final el bloque **Biblia de estilo** (personajes/iconos) o el de **fondos** de `ART_GUIDE.md`.

**Hero**

```
A group of four kawaii plush-toy dinosaurs celebrating together on a small floating grassy ledge:
the mint-green T-Rex mascot in a safari pith helmet and small backpack in the center waving happily,
a peach triceratops on the left, a sand-yellow brontosaurus with a long neck on the right, and a small
pterodactyl flying just above them. Two or three cream spotted fossil eggs sit on the grass at their feet.
The ledge touches the bottom edge of the image, wide horizontal composition, characters close together.
[BIBLIA DE ESTILO]
```

**Fondo (opcional)**

```
A vertical cartoon background for a cute mobile game home screen: the top of a sunny grassy cliff
overlooking a prehistoric jungle valley with a friendly volcano far away, giant ferns framing the left
and right edges, calm blue sky with soft clouds in the top quarter, an open grassy clearing in the
middle of the image, gentle low-contrast greens in the bottom third. Aspect ratio 9:19.5.
[ESTILO DE FONDOS]
```

**Iconos** (uno por imagen, cambiando el objeto)

```
A single game UI icon of [a wooden cog gear | a golden felt trophy cup | a small market stall with a
striped red-and-white awning | a cream envelope sealed with a green dinosaur-footprint wax seal], made
like a plush felt toy with dashed stitching, chunky rounded shape, centered with generous padding.
[BIBLIA DE ESTILO]
```

## Cómo verlo

- Web: https://alfredogonzalez.github.io/DinoFossil/ (se actualiza 2–3 min después de subir).
- La pantalla de inicio sale justo después de la carga.
- Si no ves el cambio, recarga sin caché (Ctrl+Shift+R) o usa una pestaña privada.

## Checklist antes de entregar

- [ ] Nombres exactos: `home/hero.png`, `ui/icon-settings.png`, `ui/icon-goals.png`,
      `ui/icon-shop.png`, `ui/icon-news.png` (y opcional `home/background.jpg`). `.webp` también vale.
- [ ] Recortes con transparencia real (no fondo blanco).
- [ ] Tamaños y **pesos** dentro de lo indicado (comprime con squoosh.app o TinyPNG).
- [ ] Revisado en la web en un móvil.
