# Módulo 4 · Los sótanos

Cada sótano es una escenita donde el dino excavador va y viene entre la tierra y su canasta.
Estilo: el mismo "peluche/fieltro con costuras" de siempre → bloque **Biblia de estilo** de
[`../ART_GUIDE.md`](../ART_GUIDE.md), con `docs/art/referencias/mascot.webp` como referencia.

## Cómo se ve

```
┌───────────────────── [⛏️ Sótanos] ─────────────────┬────┐  ← tablita centrada, una sola vez
│ ⛰️⛰️[Nv 12 ⬆]                           [🦴 1.2K]  │ ▒  │
│ ⛰️⛰️1.5/s   [SE BUSCA]          👇 (⏱ al escarbar)  │ ▒  │
│ ⛰️⛰️⛰️  ← ← ← ← ← ←  (👤M)  🦖 👜                  │ ▒  │  ▒ montacargas
└───────────────────────────────────────────────────┴────┘
 ↑ el 25 % izquierdo del montón queda fuera de cuadro
```

- **Montón de tierra** grande, casi del alto del sótano y cortado por la izquierda. Encima va
  clavado el **letrero de nivel**, centrado al 25 % del ancho (entre la pared y la tablita
  "Sótanos") para que se vea el hueso. Es madera; se pone verde con una flecha que late cuando
  alcanza para mejorar, y con **doble flecha** si alcanza para llegar al siguiente ×2.
- **En reposo**, el dino está delante de la bolsa mirando a la izquierda, con la manita encima
  (sin texto). Al tocar cualquier parte del sótano:
  1. camina hasta el montón;
  2. escarba;
  3. regresa cargando huesos;
  4. al dejarlos, la bolsa da un saltito y sube el contador.

  Ida y vuelta duran siempre ~1.3 s; en los sótanos profundos solo se alarga el escarbado, y
  mientras escarba aparece un **reloj circular** junto a su cabeza con el tiempo que falta.
- **Manager**: un cuadro pequeño (~32 × 48 pt) colgado de la viga, justo debajo de la tablita
  "Sótanos" y detrás del camino del dino. Vacío lleva un **+**; con manager, solo su foto. El mismo
  cuadro cuelga en el laboratorio; en la sala va sobre un tripié (`easel-*`). Vacío lleva
  un **+** (abre la lista de dinos); con manager, la foto de la especie ([05-retratos.md](05-retratos.md)),
  su nombre y su "recompensa": el Turbo de su rareza (de ×2 · 30 s a ×5 · 90 s). La chincheta ⚡ de
  la esquina activa el Turbo; mientras dura, el cartel se balancea y todo el piso brilla en dorado.
  Con manager el ciclo se repite solo.
- **Bolsa** pegada al montacargas, que es quien se la lleva.

## Archivos

Todos en `assets/art/museum/` (PNG o WebP **con transparencia**):

| Archivo | Tamaño | Contenido | Si falta… |
|---|---|---|---|
| `basket.png` ✅ | ~**365 × 420** | Bolsa de tela con huesos asomando. La base toca el borde inferior. | bolsa de código |
| `dirt-mound.png` ✅ | ~**640 × 478** | Montón de tierra de fieltro marrón con piedritas, alguna raíz y la punta de un hueso. **El lado donde se escarba mira a la derecha**, hacia el dino (más empinado y con tierra suelta). La base toca el borde inferior. | loma de código |

Y el cartel del manager, también en `assets/art/museum/`:

| Archivo | Tamaño | Contenido | Si falta… |
|---|---|---|---|
| `poster-hired.png` | ~**280 × 420** | Cuadro de fieltro liso colgado de un clavo, con ventanita para la foto. Con manager, la foto del dino va en la ventanita (sin nombre ni textos). En español también se usa vacío, con un "+". | papel de código |
| `poster-hiring.png` | ~**280 × 420** | El mismo cuadro con "HIRING" dibujado: solo se usa en inglés y sin manager (el texto dibujado no se puede traducir). | `poster-hired` + texto |

El código escribe encima, de arriba abajo: "SE BUSCA" (franja superior, ~15 % del alto), la foto
(un cuadro centrado de ~45 % del ancho, a media altura), y el nombre + la recompensa (franja inferior,
~25 % del alto). Deja esas zonas **lisas**.

Y en `assets/art/icons/`, siguiendo las reglas de [03-iconos.md](03-iconos.md):

| Archivo | Contenido |
|---|---|
| `tap.png` ✅ | Manita tierna de peluche con el índice **apuntando hacia abajo** (va sobre la cabeza del dino) |
| `upgrade.png` ✅ | Flecha verde gordita hacia arriba (sale en el botón de nivel cuando te alcanza para mejorar) |

En pantalla, la bolsa mide unos 33 × 38 pt (~60 % del dino) y el montón unos 134 × 100 pt (se ve ~75 %).
Claude recorta el aire transparente y las pasa a WebP al recibirlas. Dibuja formas grandes y
legibles, sin detalles finos que se pierdan al reducir.

## Sprites

No hace falta hacer nuevos. Las hojas del excavador ([sprites.md](sprites.md)) siguen mirando a la
**derecha**: el código las voltea cuando el dino va hacia la tierra o espera en reposo.

*(Opcional, más adelante)*: `sprites/digger/drop.png`, el dino vaciando los huesos en la canasta,
en el mismo formato 5 × 5.

## Prompts sugeridos

**Bolsa / canasta**

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

- [x] `basket` y `dirt-mound` en `assets/art/museum/`, con transparencia real (sin fondo blanco).
- [ ] La base de cada objeto toca el borde de abajo, para que se apoyen en el suelo.
- [ ] El lado escarbado del montón mira a la **derecha**.
- [ ] La manita apunta hacia **abajo**.
- [ ] Peso ≤ 300 KB cada uno.
