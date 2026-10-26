# Módulo 8 · Mapa de mundos

La pestaña **Mapa** muestra los 9 mundos como islas flotantes, del 1 (abajo) al 9 (arriba), en
zigzag. Hoy son manchas de color con un emoji; cada isla que subas sustituye a la suya.

En el MVP solo se juega el **mundo 1**. Los demás se ven **apagados y con candado** ("Próximamente"),
así que basta con que se entienda qué hay en cada uno. El nombre, las estrellas y el candado los pone
el código encima: **sin texto en la imagen**.

## Archivos

| Archivo | Tamaño | Formato | Contenido |
|---|---|---|---|
| `map/world-1` … `map/world-9` | 1024 × 768 (4:3) | PNG/WebP **transparente** | Una isla por mundo |
| `map/background` (opcional) | 1290 × 2796 | JPG/WebP opaco | Cielo detrás de las islas (si falta, el degradado azul actual) |

Sube todo a `assets/art/map/`. Si la herramienta no da transparencia, genera con fondo blanco y
quítalo con Photoroom, como con los iconos. Claude las recorta y optimiza.

## Reglas

- **Misma vista y tamaño en todas**: vista 3/4 desde arriba, la isla ocupando casi todo el ancho,
  con su "raíz" de tierra y roca por debajo (como islas flotantes).
- Que se distingan por **color y silueta** aun pequeñas (se ven a ~220 pt de ancho).
- Nada importante en la esquina inferior derecha: ahí va el candado.
- Consejo: genera primero la isla 1 y úsala como referencia para las demás
  (`Use image 1 only as the style and framing reference.`).

## Prompts (copiar y pegar)

**1. Valle de los Huevos** → `assets/art/map/world-1.png`

```
A single floating island seen from a three-quarter top view, shaped like a rounded chunk of earth with a rocky felt underside, carrying a sunny green valley with soft grassy hills, a cozy little wooden museum house with a red roof, and a few big speckled dinosaur eggs in a straw nest. Plush felt toy style for a cozy kids mobile game: everything looks hand-sewn from felt and fleece with visible dashed stitching, chunky rounded shapes, soft pastel colors, soft warm lighting, clean dark-brown outline. Centered, the whole island visible with generous padding, plain pure white background. No text, no labels, no characters, no frame.
```

**2. Bosque Jurásico** → `assets/art/map/world-2.png`

```
A single floating island seen from a three-quarter top view, shaped like a rounded chunk of earth with a rocky felt underside, carrying a lush jungle of giant ferns and round palm trees with a small waterfall. Plush felt toy style for a cozy kids mobile game: everything looks hand-sewn from felt and fleece with visible dashed stitching, chunky rounded shapes, soft pastel colors, soft warm lighting, clean dark-brown outline. Centered, the whole island visible with generous padding, plain pure white background. No text, no labels, no characters, no frame.
```

**3. Mina de Ámbar** → `assets/art/map/world-3.png`

```
A single floating island seen from a three-quarter top view, shaped like a rounded chunk of earth with a rocky felt underside, carrying a rocky hill with a wooden mine entrance and rails, glowing orange amber crystals poking out of the rock. Plush felt toy style for a cozy kids mobile game: everything looks hand-sewn from felt and fleece with visible dashed stitching, chunky rounded shapes, soft pastel colors, soft warm lighting, clean dark-brown outline. Centered, the whole island visible with generous padding, plain pure white background. No text, no labels, no characters, no frame.
```

**4. Desierto de Fósiles** → `assets/art/map/world-4.png`

```
A single floating island seen from a three-quarter top view, shaped like a rounded chunk of earth with a rocky felt underside, carrying golden sand dunes with cacti and a big dinosaur skeleton half buried in the sand. Plush felt toy style for a cozy kids mobile game: everything looks hand-sewn from felt and fleece with visible dashed stitching, chunky rounded shapes, soft pastel colors, soft warm lighting, clean dark-brown outline. Centered, the whole island visible with generous padding, plain pure white background. No text, no labels, no characters, no frame.
```

**5. Volcán Rugiente** → `assets/art/map/world-5.png`

```
A single floating island seen from a three-quarter top view, shaped like a rounded chunk of earth with a rocky felt underside, carrying a chubby smoking volcano with soft orange lava rivers and glowing red crystals. Plush felt toy style for a cozy kids mobile game: everything looks hand-sewn from felt and fleece with visible dashed stitching, chunky rounded shapes, soft pastel colors, soft warm lighting, clean dark-brown outline. Centered, the whole island visible with generous padding, plain pure white background. No text, no labels, no characters, no frame.
```

**6. Islas Flotantes** → `assets/art/map/world-6.png`

```
A single floating island seen from a three-quarter top view, shaped like a rounded chunk of earth with a rocky felt underside, carrying a cluster of tiny floating islands linked by rope bridges, fluffy clouds and a pterodactyl nest. Plush felt toy style for a cozy kids mobile game: everything looks hand-sewn from felt and fleece with visible dashed stitching, chunky rounded shapes, soft pastel colors, soft warm lighting, clean dark-brown outline. Centered, the whole island visible with generous padding, plain pure white background. No text, no labels, no characters, no frame.
```

**7. Glaciar Perdido** → `assets/art/map/world-7.png`

```
A single floating island seen from a three-quarter top view, shaped like a rounded chunk of earth with a rocky felt underside, carrying icy blue glacier hills with snow, ice crystals and a frozen cave. Plush felt toy style for a cozy kids mobile game: everything looks hand-sewn from felt and fleece with visible dashed stitching, chunky rounded shapes, soft pastel colors, soft warm lighting, clean dark-brown outline. Centered, the whole island visible with generous padding, plain pure white background. No text, no labels, no characters, no frame.
```

**8. Mundo Meteorito** → `assets/art/map/world-8.png`

```
A single floating island seen from a three-quarter top view, shaped like a rounded chunk of earth with a rocky felt underside, carrying a purple rocky crater with a big glowing meteorite in the middle and small sparkling stars. Plush felt toy style for a cozy kids mobile game: everything looks hand-sewn from felt and fleece with visible dashed stitching, chunky rounded shapes, soft pastel colors, soft warm lighting, clean dark-brown outline. Centered, the whole island visible with generous padding, plain pure white background. No text, no labels, no characters, no frame.
```

**9. Reino Dino Legendario** → `assets/art/map/world-9.png`

```
A single floating island seen from a three-quarter top view, shaped like a rounded chunk of earth with a rocky felt underside, carrying a golden castle with round towers and dinosaur-shaped flags on top of a green hill. Plush felt toy style for a cozy kids mobile game: everything looks hand-sewn from felt and fleece with visible dashed stitching, chunky rounded shapes, soft pastel colors, soft warm lighting, clean dark-brown outline. Centered, the whole island visible with generous padding, plain pure white background. No text, no labels, no characters, no frame.
```

**Fondo del mapa (opcional)** → `assets/art/map/background.jpg`

```
A tall vertical sky background for a kids mobile game map: soft pastel blue sky that gets lighter toward the top, fluffy felt clouds scattered on the sides, a few tiny stitched stars near the top. Plush felt toy style for a cozy kids mobile game: everything looks hand-sewn from felt and fleece with visible dashed stitching, chunky rounded shapes, soft pastel colors, soft warm lighting, clean dark-brown outline. Mostly empty in the center so floating islands can sit on top. Portrait 9:19.5. No text, no islands, no characters.
```

## Checklist

- [ ] 9 islas con el nombre exacto (`world-1` … `world-9`), fondo transparente.
- [ ] Misma vista y escala en todas.
- [ ] Sin texto.
