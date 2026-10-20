# Módulo 3 · Iconos

Todos los iconos del juego en un solo encargo. Hoy se ven como emojis; cada archivo que subas a
`assets/art/icons/` sustituye a su emoji en **todas** las pantallas donde aparece.

Estilo: el mismo "peluche/fieltro con costuras" del logo → bloque **Biblia de estilo** de
[`../ART_GUIDE.md`](../ART_GUIDE.md), con `docs/art/referencias/mascot.webp` y el logo como referencia.

## Reglas comunes

- **PNG/WebP transparente, cuadrado**: **256 × 256 px** (los de la tienda, **384 × 384**).
- Un solo objeto por icono, **centrado**, con ~24 px de margen transparente.
- Se ven **pequeños** (de 12 a 44 pt): formas gruesas y simples, **sin texto ni números**, contorno
  marrón oscuro para que destaquen sobre fondos claros, oscuros, madera y botones de color.
- Misma luz y mismo grosor de contorno en todos: que parezcan una familia.
- Peso ≤ 60 KB cada uno (≤ 120 KB los de tienda).

## Lista (nombre de archivo = nombre exacto)

### Prioridad 1 · Se ven todo el tiempo (17)

| Archivo | Qué dibujar | Dónde sale |
|---|---|---|
| `coins.png` | Moneda dorada de fieltro con una huella de dino grabada (DinoCoin) | Barra superior, precios |
| `huellas.png` | Huella de dino antigua, morada y brillante (Huellas Antiguas) | Barra superior, prestigio |
| `amber.png` | Gema de ámbar naranja con un mosquito dentro | Barra superior, tienda, incubadora |
| `fossils.png` | Hueso de fósil color crema | Sótanos, sala, montacargas |
| `egg-common.png` | Huevo crema con manchas marrones | Incubadora, recompensas |
| `egg-rare.png` | Huevo verde con manchas claras | Incubadora, recompensas |
| `egg-epic.png` | Huevo azul con manchas | Incubadora, recompensas |
| `egg-legendary.png` | Huevo morado con brillos | Incubadora, recompensas |
| `egg-mythic.png` | Huevo naranja-dorado con llamitas/brillos | Incubadora, recompensas |
| `nav-map.png` | Mapa del tesoro enrollado | Barra inferior |
| `nav-dinos.png` | Cabeza de dino de peluche (colección) | Barra inferior |
| `nav-eggs.png` | Huevo en un nido | Barra inferior |
| `nav-shop.png` | Puesto de mercado con toldo de rayas | Barra inferior |
| `nav-missions.png` | Pergamino/lista con un check | Botón de misiones (cabecera) |
| `nav-museum.png` | La Casa-Museo en miniatura (tejado rojo, cartel) | Botón central grande de la barra: vuelve al juego |
| `settings.png` | Engranaje de madera | Cabecera de la mina |
| `ad.png` | Televisor retro con botón de play (ver anuncio) | Botones de recompensa |

### Prioridad 2 · Estados y detalles (13)

| Archivo | Qué dibujar | Dónde sale |
|---|---|---|
| `turbo.png` | Rayo amarillo | Habilidad del manager, boost |
| `timer.png` | Reloj de arena | Recarga de habilidades, incubación |
| `tap.png` | Manita señalando hacia abajo | "¡Toca!" en cada planta y sobre el dino de los sótanos |
| `upgrade.png` | Flecha verde hacia arriba | Botón de nivel cuando alcanza para mejorar |
| `star.png` | Estrella dorada llena | Estrellas del mundo, hitos |
| `star-empty.png` | La misma estrella, vacía/gris | Estrellas no conseguidas |
| `lock.png` | Candado | Mundos bloqueados |
| `check.png` | Marca de verificación verde | Misiones cumplidas |
| `station-hall.png` | Columnas de museo / vitrina | Título de la sala |
| `station-lab.png` | Microscopio o lupa | Título del laboratorio |
| `station-basement.png` | Pico de excavación | Título de los sótanos, "Nuevo sótano" |
| `dna.png` | Hélice de ADN | Recurso de mundos futuros |
| `plants.png` | Hoja de helecho jurásico | Recurso de mundos futuros |

### Prioridad 3 · Tienda (6, 384 × 384)

| Archivo | Qué dibujar |
|---|---|
| `shop-starter.png` | Caja de regalo con lazo y un huevo asomando |
| `shop-amber-small.png` | Bolsita de tela con unas pocas gemas de ámbar |
| `shop-amber-medium.png` | Cofre abierto con un montón de ámbar |
| `shop-amber-large.png` | Gran tesoro: cofre desbordando ámbar y una corona |
| `shop-double-income.png` | Dos monedas DinoCoin apiladas con un brillo (ingresos ×2) |
| `shop-dino-pass.png` | Ticket/pase dorado con una huella de dino |

**Total: 36 iconos.** Si hay que priorizar, la tanda 1 ya cambia por completo el aspecto del juego.

## No hace falta crear

- Los retratos de los 24 dinos (irán en el módulo de la colección).
- Las islas de los mundos (módulo del mapa).
- Los botones y paneles (son código y llevan texto traducible).

## Prompt sugerido

Uno por icono, cambiando el objeto; añade el bloque **Biblia de estilo**:

```
A single game UI icon of [OBJETO], made like a plush felt toy with dashed stitching and a clean
dark-brown outline, chunky rounded shape that reads well at small sizes, soft warm lighting,
centered with generous transparent padding, square format.
[BIBLIA DE ESTILO]
```

Consejo: genera primero `coins`, `amber` y `huellas` juntos en una sola imagen ("a set of three
matching icons") para fijar el estilo, y usa esa imagen como referencia para el resto.

## Cómo verlo

Sube los archivos a `assets/art/icons/` (puedes subirlos por tandas). En 2–3 minutos se ven en
https://alfredogonzalez.github.io/DinoFossil/ (recarga sin caché si no aparecen).

## Problemas comunes

- **No renombres los archivos desde la web de GitHub.** Al renombrar `amber-Photoroom.png` el archivo
  quedó dañado (2 bytes) y el icono no salía. Renómbralos en tu ordenador antes de subirlos, o sube el
  archivo de nuevo con el nombre correcto. Si un archivo llega dañado, el juego lo ignora y muestra el
  emoji, y la publicación avisa con `[art] … no es una imagen válida`.
- **Tamaño y nombre:** no pasa nada si llegan a 2048 px o con la extensión duplicada (`ad.png.png`):
  `scripts/optimize-icons.py` los recorta, los deja en 256 px WebP (~20 KB) y corrige el nombre. La web
  publicada lo hace sola en cada publicación.

## Checklist antes de entregar

- [ ] Nombres exactos de la lista (`.webp` también vale).
- [ ] Fondo transparente real, cuadrados, objeto centrado.
- [ ] Sin texto ni números dentro.
- [ ] Probados en pequeño (que se entiendan a 24 px).
