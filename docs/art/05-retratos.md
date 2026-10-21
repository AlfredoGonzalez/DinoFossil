# Módulo 5 · Retratos de los dinos

Una "foto" por especie. Aparece en el **cartel "Se busca"** del manager, en la lista de managers, en
la colección, en la incubadora y en la sala de exposición. Cada archivo que subas sustituye al emoji
de esa especie en todas esas pantallas.

Estilo: **Biblia de estilo** de [`../ART_GUIDE.md`](../ART_GUIDE.md), con la mascota
`docs/art/referencias/mascot.webp` como referencia ("Use image 1 only as the style reference"), para
que todos parezcan de la misma familia de peluches.

## Formato

- Carpeta `assets/art/dinos/`, nombre = id de la especie (tabla de abajo), p. ej. `trex.png`.
- PNG/WebP **transparente, cuadrado, 512 × 512**.
- **Busto** (cabeza y hombros), mirando a cámara en 3/4, centrado, con ~10 % de margen.
- Se muestra **dentro de un círculo** de 30–40 pt con el color de la especie de fondo: que la cara
  quede en el centro y se lea en pequeño. Nada importante en las esquinas.
- Sin texto, sin marco, sin fondo, sin sombra.

## Prompt (uno por especie)

```
A head-and-shoulders portrait of a cute chubby plush baby [SPECIES], [COLOR AND FEATURE],
looking at the viewer in a three-quarter view with a friendly proud smile, like an ID photo.
Centered, face in the middle of the image, generous padding, transparent or plain pure white
background. No text, no frame, no hat.
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
