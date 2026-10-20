# Guía de arte (generación con IA)

El juego usa emojis y degradados como placeholder. El arte final se entrega **módulo a módulo**:
cada módulo tiene una ficha en [`docs/art/`](art/README.md) con los nombres de archivo exactos,
tamaños y zonas seguras. Basta con soltar las imágenes en `assets/art/<módulo>/` y se aplican solas.

Este documento contiene la biblia de estilo común y prompts generales.

## 1. Biblia de estilo (cópiala en TODOS los prompts)

La consistencia entre sprites es lo más difícil con IA. Este bloque fija el estilo **"peluche"**
del arte ya entregado (logo y mascota del módulo 1); pégalo al final de cada prompt sin cambiarlo:

```
Style: kawaii plush-toy characters for a cozy mobile game. Dinosaurs look like soft stuffed toys made of
felt and fleece, with visible dashed stitching along the seams, a few small sewn-on patches, round glossy
black button eyes with a white highlight, small rosy cheeks, short stubby limbs and chubby rounded bodies.
Soft pastel palette: mint green, peach, sand yellow, olive green, cream belly. Explorer accessories in
khaki and brown leather (safari pith helmet, small backpack). Clean dark-brown outline, soft gentle
shading, warm cheerful lighting. Generous padding around the subject.
Plain pure white background. No text, no watermark, no logos, no ground shadow.
```

Para **fondos** (sin personajes), usa en su lugar:

```
Style: bright cozy cartoon illustration for a mobile game, clean dark-brown outlines, soft cel shading,
lush jungle greens, sky blue, warm sunny highlights, friendly rounded shapes. No characters, no text,
no watermark.
```

Referencias de estilo: pasa `docs/art/referencias/mascot.webp` (y el logo para UI con texto) como imagen
de referencia en cada generación: "Use image 1 only as the style reference".

Paleta de la interfaz (coincide con `src/ui/theme.ts`): verde `#5CC94A`, dorado `#FFC83D`,
madera `#B97A45`, pergamino `#FBEFD2`, cielo `#8ED6F5`, tierra `#8B5E3C`.

## 2. Flujo de trabajo

1. **El ancla ya existe**: la mascota entregada (`docs/art/referencias/mascot.webp`). Úsala siempre como referencia.
2. **Para cada dino siguiente**, pasa el T-Rex ancla como imagen de referencia
   ("Use image 1 only as the style reference") y repite la biblia de estilo.
3. Pide **fondo blanco** (casi ningún modelo genera transparencia) y quítalo después
   (remove.bg, Photoshop o `rembg`).
4. Recorta el espacio sobrante y exporta **PNG cuadrado de 512×512** (los dinos) o 256×256 (iconos).
5. Guarda el archivo en la ruta indicada en las tablas y regístralo:

```ts
// src/ui/sprites.ts
export const SPRITES = {
  dinos: {
    trex: require('../../assets/sprites/dinos/trex.png'),
  },
  resources: {
    coins: require('../../assets/sprites/resources/coins.png'),
  },
};
```

## 3. Mascota / dinos (24)

Plantilla (sustituye lo que está entre corchetes):

```
A cute chibi cartoon baby [SPECIES], [COLOR DESCRIPTION], [SIGNATURE FEATURE],
wearing a tiny tan safari explorer hat, smiling happily with its mouth slightly open.
[STYLE BIBLE]
```

| Archivo (`assets/sprites/dinos/`) | Especie | Color y rasgo distintivo |
|---|---|---|
| `trex.png` | T-Rex (mascota, el ancla) | verde lima con barriga crema; mochila marrón y un hueso de fósil en las manos |
| `compsognathus.png` | Compsognathus | verde claro, cuerpo diminuto y cola larga |
| `gallimimus.png` | Gallimimus | amarillo arena, patas largas de corredor |
| `protoceratops.png` | Protoceratops | naranja suave, pequeña gorguera sin cuernos |
| `oviraptor.png` | Oviraptor | amarillo con plumas, abraza un huevo |
| `iguanodon.png` | Iguanodonte | verde menta, pinchos en los pulgares |
| `parasaurolophus.png` | Parasaurio | rosa con cresta tubular hacia atrás |
| `pachycephalosaurus.png` | Paquicefalosaurio | lila con cabeza abombada |
| `triceratops.png` | Triceratops | naranja con gorguera crema y tres cuernos redondeados |
| `stegosaurus.png` | Stegosaurus | amarillo con placas naranjas en el lomo |
| `ankylosaurus.png` | Ankylosaurus | lavanda con armadura de escudos y maza en la cola |
| `velociraptor.png` | Velociraptor | rosa con plumitas, pose traviesa |
| `pterodactyl.png` | Pterodáctilo | azul cielo con alas abiertas y cresta |
| `diplodocus.png` | Diplodocus | turquesa con cuello largo |
| `brontosaurus.png` | Brontosaurio | azul con lunares claros y cuello largo |
| `allosaurus.png` | Alosaurio | rojo coral con pequeños cuernos sobre los ojos |
| `carnotaurus.png` | Carnotauro | naranja intenso con dos cuernitos de toro |
| `therizinosaurus.png` | Therizinosaurio | verde hoja, plumas y garras largas inofensivas |
| `plesiosaurus.png` | Plesiosaurio | azul agua con aletas, nadando |
| `spinosaurus.png` | Espinosaurio | verde azulado con vela en el lomo |
| `brachiosaurus.png` | Braquiosaurio | morado, cuello muy alto |
| `quetzalcoatlus.png` | Quetzalcoatlus | naranja dorado, alas gigantes |
| `mosasaurus.png` | Mosasaurio | azul océano brillante con aletas (mítico: añade un aura mágica dorada) |
| `argentinosaurus.png` | Argentinosaurio | dorado con lunares, enorme y adorable (mítico: aura dorada y destellos) |

Para los legendarios y míticos añade: `surrounded by a soft glowing golden aura and small sparkles`.

## 4. Iconos de recursos (256×256, `assets/sprites/resources/`)

```
A single glossy cartoon game icon of [OBJECT], chunky and rounded, thick dark-brown outline,
cel-shaded with a bright highlight, centered with padding, plain pure white background.
No text, no watermark.
```

| Archivo | Objeto |
|---|---|
| `coins.png` | una moneda de oro con un pequeño dino grabado (DinoCoin) |
| `fossils.png` | un hueso de fósil color crema |
| `amber.png` | una gema de ámbar naranja con un mosquito dentro |
| `huellas.png` | una huella de dino antigua y morada, brillante |
| `eggs.png` | un huevo de dino crema con manchas |
| `dna.png` | una hélice de ADN azul y morada |
| `plants.png` | una hoja jurásica verde de helecho |

## 5. Escenarios

**Fondo de pantalla de carga / inicio** (vertical 1080×1920):

```
A vertical cartoon background illustration of a lush prehistoric jungle valley for a cute mobile game:
giant ferns and palm trees framing both sides, a friendly smoking volcano in the far distance,
a waterfall, bright blue sky with puffy clouds. Lower third is an open grassy clearing left empty
for characters and buttons. Soft daylight, cheerful cozy mood. Thick clean outlines, cel-shaded,
saturated jungle greens and sunny yellows. No characters, no text, no watermark. Aspect ratio 9:16.
```

**Islas del mapa** (una por mundo, 512×512, fondo blanco). Plantilla:
`A floating cartoon island seen from a 3/4 top view, [THEME], small and round with rocky dirt underneath, cozy mobile game style ...`

| Mundo | THEME |
|---|---|
| 1 Valle de los Huevos | grassy meadow with a nest of giant spotted eggs |
| 2 Bosque Jurásico | dense jungle with giant ferns and a tiny hut |
| 3 Mina de Ámbar | cave entrance glowing with orange amber crystals |
| 4 Desierto de Fósiles | sand dunes with a giant dinosaur skull |
| 5 Volcán Rugiente | small erupting volcano with lava rivers |
| 6 Islas Flotantes | cluster of tiny islands linked by rope bridges |
| 7 Glaciar Perdido | icy glacier with blue crystals and an igloo |
| 8 Mundo Meteorito | purple crater with a glowing meteorite |
| 9 Reino Dino Legendario | golden castle on a hill |

**Galería de la mina** (fila horizontal repetible, 1080×300):

```
A horizontal side-view cross-section of an underground fossil dig tunnel for a cute mobile idle game:
warm brown soil layers, wooden support beams on the left and right, a few fossil bones and small
stones embedded in the walls, a mine cart on rails at the bottom. Flat side view, tileable left-to-right,
soft warm lantern light. Cartoon cel-shaded style with thick outlines. No characters, no text. Aspect ratio 18:5.
```

## 6. Logo

Ahora el logo es tipográfico (`src/ui/Logo.tsx`). Para la versión ilustrada:

```
A cheerful cartoon game logo with the words "DINO FOSSIL" (EXACT, verbatim) in chunky rounded
bubble letters, "DINO" in lime green and "FOSSIL" in golden yellow, each letter with a thick
dark-brown outline and a glossy highlight, and a small cream wooden plaque underneath with the word
"TYCOON" (EXACT, verbatim) in bold dark-brown letters. A cute green baby T-Rex peeks from behind the
left side holding a fossil bone. Centered, plain pure white background, generous padding.
Ensure each word appears once and is perfectly legible. No watermark.
```

Genera 4 variantes y usa la máxima calidad: es la imagen con texto, la más difícil.

## 7. Icono de la app (1024×1024)

```
A square mobile app icon: the cute green baby T-Rex mascot with a tan safari hat, head and
shoulders, smiling and holding a fossil bone, centered on a bright jungle-green radial
gradient background. Thick dark-brown outline, cel-shaded, glossy. Fills the frame edge to
edge with the face clearly readable at small sizes. No text, no watermark.
```

Sustituye `assets/icon.png`, `assets/android-icon-foreground.png` (solo el dino, fondo
transparente) y `assets/splash-icon.png`.

## 8. Sonido (opcional)

Los efectos se registran en `src/services/audio.ts` (`tap`, `coins`, `upgrade`, `egg`,
`hatch`, `prestige`). Formato `.mp3` corto (< 1 s), en `assets/sfx/`.
