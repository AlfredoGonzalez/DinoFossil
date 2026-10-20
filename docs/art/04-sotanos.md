# Módulo 4 · Los sótanos

Cada sótano es una escenita donde el dino excavador va y viene entre la tierra y su canasta.
Estilo: el mismo "peluche/fieltro con costuras" de siempre → bloque **Biblia de estilo** de
[`../ART_GUIDE.md`](../ART_GUIDE.md), con `docs/art/referencias/mascot.webp` como referencia.

## Cómo se ve

```
┌───────────────────────────────────────────────┬────┐
│ [⛏️ Sótanos]                         (👤 M)   │    │  ← letrero solo en el primer sótano
│               [¡Toca!] 👇           [🦴 1.2K] │ Nv │
│  ⛰️⛰️⛰️  ← ← ← ← ← ← ← ←  🦖 🧺                │ ⬆️ │  ▒ montacargas
│  montón de tierra        dino  canasta        │1.5/s│
└───────────────────────────────────────────────┴────┘
```

- **En reposo**, el dino está delante de la canasta mirando a la izquierda, y encima flota la
  manita con "¡Toca!". Al tocar cualquier parte del sótano:
  1. camina a la izquierda hasta el montón;
  2. escarba;
  3. regresa cargando huesos;
  4. al dejarlos, la canasta da un saltito y sube el contador.
- **Con manager** (retrato arriba a la derecha), el ciclo se repite solo y la manita no aparece.
- **Botón de nivel**: va a la derecha, junto al montacargas. Es código y no necesita imagen.

## Archivos

Todos en `assets/art/museum/` (PNG o WebP **con transparencia**):

| Archivo | Tamaño | Contenido | Si falta… |
|---|---|---|---|
| `basket.png` | **512 × 400** | Canasta de mimbre de fieltro, vista de frente/lado, llena de huesos color crema que asoman por arriba. La base de la canasta toca el borde inferior de la imagen. | canasta de código |
| `dirt-mound.png` | **512 × 400** | Montón de tierra de fieltro marrón con piedritas, alguna raíz y la punta de un hueso. **El lado donde se escarba mira a la derecha**, hacia el dino (más empinado y con tierra suelta). La base toca el borde inferior. | loma de código |

Y en `assets/art/icons/`, siguiendo las reglas de [03-iconos.md](03-iconos.md):

| Archivo | Contenido |
|---|---|
| `tap.png` | Manita tierna de peluche con el índice **apuntando hacia abajo** (va sobre la cabeza del dino) |
| `upgrade.png` | Flecha verde gordita hacia arriba (sale en el botón de nivel cuando te alcanza para mejorar) |

En pantalla, la canasta mide unos 66 × 52 pt y el montón unos 84 × 64 pt. Dibuja formas grandes y
legibles, sin detalles finos que se pierdan al reducir.

## Sprites

No hace falta hacer nuevos. Las hojas del excavador ([sprites.md](sprites.md)) siguen mirando a la
**derecha**: el código las voltea cuando el dino va hacia la tierra o espera en reposo.

*(Opcional, más adelante)*: `sprites/digger/drop.png`, el dino vaciando los huesos en la canasta,
en el mismo formato 5 × 5.

## Prompts sugeridos

**Canasta**

```
A cute wicker basket made of soft felt and fabric with visible stitched seams, filled to the top with
cream-colored fossil bones poking out, seen from the front at a slight side angle, chunky rounded shape,
its bottom resting on the lower edge of the image, centered with padding.
[BIBLIA DE ESTILO]
```

**Montón de tierra**

```
A small mound of brown dirt made of felt and fleece with stitched seams, a few pebbles, a tiny root and
the tip of a fossil bone sticking out. The right side of the mound is steeper with loose crumbs of soil,
as if someone has been digging into it from the right. Side view, its base flat on the lower edge of
the image, centered with padding.
[BIBLIA DE ESTILO]
```

**Manita "toca"**

```
A single cute plush cartoon hand made of felt with stitched seams, index finger pointing straight down,
other fingers curled, chunky rounded shape, centered with padding.
[BIBLIA DE ESTILO]
```

**Flecha de mejora**

```
A single chunky rounded green arrow pointing up, made of felt with a stitched seam and a soft highlight,
centered with padding.
[BIBLIA DE ESTILO]
```

## Fondo del sótano

`museum/basement` ([02-casa-museo.md](02-casa-museo.md)) se ve detrás de esta escena. Si lo haces,
déjalo como una **pared de tierra sin objetos grandes**: la tierra, la canasta y el dino van encima.

## Checklist antes de entregar

- [ ] `basket` y `dirt-mound` en `assets/art/museum/`, con transparencia real (sin fondo blanco).
- [ ] La base de cada objeto toca el borde de abajo, para que se apoyen en el suelo.
- [ ] El lado escarbado del montón mira a la **derecha**.
- [ ] La manita apunta hacia **abajo**.
- [ ] Peso ≤ 300 KB cada uno.
