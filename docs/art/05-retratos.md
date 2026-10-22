# Módulo 5 · Retratos de los dinos

Una "foto" por especie. Aparece en el **cartel "Se busca"** del manager, en la lista de managers, en
la colección, en la incubadora y en la sala de exposición. Cada archivo que subas sustituye al emoji
de esa especie en todas esas pantallas.

Estilo: **Biblia de estilo** de [`../ART_GUIDE.md`](../ART_GUIDE.md), con la mascota
`docs/art/referencias/mascot.webp` como referencia ("Use image 1 only as the style reference"), para
que todos parezcan de la misma familia de peluches.

## Formato

- Carpeta `assets/art/dinos/`, nombre = id de la especie (tabla de abajo), p. ej. `trex.png`.
- JPG/PNG/WebP **cuadrado** (Claude lo deja en 512 × 512).
- Estilo **"foto de jefe"** (como `gallimimus` y `parasaurolophus`, ✅): busto con saco y corbata,
  mirando a cámara en 3/4, con un **fondo borroso** de oficina/ciudad. Mismo encuadre en todos.
- Se muestra recortado en un círculo (colección, lista de managers) y en el papel del cuadro
  "HIRED": que la cara quede en el tercio de arriba y centrada, y nada importante en las esquinas.
- Sin texto ni marco.

## Prompt (uno por especie)

```
A corporate headshot of a cute plush felt baby [SPECIES], [COLOR AND FEATURE], wearing a dark
felt suit jacket, a light blue shirt and a dark tie, looking at the viewer in a three-quarter view
with a confident friendly smile, like a company boss photo. Head and shoulders, face in the upper
third and centered, softly blurred city/office background (shallow depth of field). Square format.
No text, no frame, no hat.
[BIBLIA DE ESTILO]
```

Para **legendarios** añade: `surrounded by a soft golden glow`; para **míticos**:
`surrounded by a soft golden glow and small sparkles`.

## Lista

| Archivo | Especie | Rareza | Color y rasgo |
|---|---|---|---|
| `trex.png` | T-Rex | común | verde lima con barriga crema (la mascota) |
| `compsognathus.png` | Compsognathus | común | verde claro, cabecita pequeña y cuello fino |
| `gallimimus.png` | Gallimimus | común | amarillo arena, cuello largo de corredor |
| `protoceratops.png` | Protoceratops | común | naranja suave, pequeña gorguera sin cuernos |
| `oviraptor.png` | Oviraptor | común | amarillo con plumitas, cresta redonda |
| `iguanodon.png` | Iguanodonte | común | verde menta, pinchos en los pulgares |
| `parasaurolophus.png` | Parasaurio | común | rosa con cresta tubular hacia atrás |
| `pachycephalosaurus.png` | Paquicefalosaurio | común | lila con cabeza abombada |
| `triceratops.png` | Triceratops | rara | naranja con gorguera crema y tres cuernos redondeados |
| `stegosaurus.png` | Stegosaurus | rara | amarillo con placas naranjas asomando por la espalda |
| `ankylosaurus.png` | Ankylosaurus | rara | lavanda con armadura de escudos |
| `velociraptor.png` | Velociraptor | rara | rosa con plumitas, mirada traviesa |
| `pterodactyl.png` | Pterodáctilo | rara | azul cielo con cresta y alas asomando |
| `diplodocus.png` | Diplodocus | rara | turquesa, cuello largo (encuadra cabeza y cuello) |
| `brontosaurus.png` | Brontosaurio | épica | azul con lunares claros |
| `allosaurus.png` | Alosaurio | épica | rojo coral con cuernitos sobre los ojos |
| `carnotaurus.png` | Carnotauro | épica | naranja intenso con dos cuernitos de toro |
| `therizinosaurus.png` | Therizinosaurio | épica | verde hoja con plumas |
| `plesiosaurus.png` | Plesiosaurio | épica | azul agua, cuello largo y aletas |
| `spinosaurus.png` | Espinosaurio | legendaria | verde azulado con vela en el lomo |
| `brachiosaurus.png` | Braquiosaurio | legendaria | morado, cuello muy alto |
| `quetzalcoatlus.png` | Quetzalcoatlus | legendaria | naranja dorado con gran cresta |
| `mosasaurus.png` | Mosasaurio | mítica | azul océano brillante con aletas |
| `argentinosaurus.png` | Argentinosaurio | mítica | dorado con lunares |

Empieza por los **comunes**: son los primeros managers que consigue el jugador. Si un archivo pesa
mucho o trae fondo, súbelo igual: Claude lo recorta y lo convierte.

## Videos de la ficha (opcional)

Al tocar un dino descubierto en **Dinos**, su ficha reproduce un video **una sola vez** en lugar del
retrato, y se queda en el último cuadro.

- Archivo: `assets/art/dinos/<id>.mp4` (mismo id que el retrato, p. ej. `gallimimus.mp4` ✅).
- Cuadrado (1:1), 3–6 s, mismo encuadre de "foto de jefe" que el retrato. Se reproduce **sin sonido**.
- Mientras carga se ve el retrato, así que conviene que el primer cuadro se parezca a él. El último
  cuadro es el que se queda en pantalla: que termine en una pose bonita (saludando, sonriendo…).
- Claude lo recorta a 480 × 480 y le quita el audio: de ~2.5 MB queda en ~150 KB.

Los datos de la ficha (dieta, época, tamaño, región y dato curioso) ya están escritos para las 24
especies en `src/data/dinoFacts.ts` y `src/i18n/dinoFacts.ts`.
