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
- Estilo **"foto de jefe"** (como `gallimimus` y `parasaurolophus`, ✅): busto mirando a cámara en
  3/4 con un **fondo borroso**. Mismo encuadre en todos; la ropa y el fondo cambian en cada especie.
- Se muestra recortado en un círculo (colección, lista de managers) y en el papel del cuadro
  "HIRED": que la cara quede en el tercio de arriba y centrada, y nada importante en las esquinas.
- Sin texto ni marco.

## Prompts listos (copiar y pegar)

Cada especie tiene su prompt completo: ya lleva el color, **una ropa distinta** (con corbata, con
moño, sin corbata, suéter, chamarra…) y **un fondo distinto**, y el brillo de los legendarios y
míticos. Solo copia el bloque y pégalo; no hay nada que rellenar.

Consejo: adjunta `assets/art/dinos/gallimimus.webp` como imagen de referencia y escribe antes del
prompt `Use image 1 only as the style and framing reference.` Así todos salen con el mismo encuadre y
el mismo fieltro, pero con su propia ropa y fondo.

## Lista

**Entregados ✅ los 24 retratos** (Claude los dejó en WebP de 512 × 512, ~30 KB cada uno).

| Archivo | Especie | Rareza | Color y rasgo | Ropa | Fondo |
|---|---|---|---|---|---|
| `trex.png` | T-Rex | común | verde lima con barriga crema (la mascota) | saco azul marino, camisa blanca, corbata roja | oficina alta con la ciudad al atardecer |
| `compsognathus.png` | Compsognathus | común | verde claro, cabecita pequeña y cuello fino | cárdigan beige, sin corbata | biblioteca acogedora |
| `gallimimus.png` | Gallimimus | común | amarillo arena, cuello largo de corredor | ✅ entregado | ✅ entregado |
| `protoceratops.png` | Protoceratops | común | naranja suave, pequeña gorguera sin cuernos | blazer gris con cuello alto | oficina moderna con plantas |
| `oviraptor.png` | Oviraptor | común | amarillo con plumitas, cresta redonda | chaleco menta, moño rojo | cafetería pastel |
| `iguanodon.png` | Iguanodonte | común | verde menta, pinchos en los pulgares | chaqueta de campo verde olivo | invernadero tropical |
| `parasaurolophus.png` | Parasaurio | común | rosa con cresta tubular hacia atrás | ✅ entregado | ✅ entregado |
| `pachycephalosaurus.png` | Paquicefalosaurio | común | lila con cabeza abombada | chamarra deportiva azul | parque soleado |
| `triceratops.png` | Triceratops | rara | naranja con gorguera crema y tres cuernos redondeados | saco de tweed con coderas, corbata verde | sala de museo con fósiles |
| `stegosaurus.png` | Stegosaurus | rara | amarillo con placas naranjas asomando por la espalda | traje gris oscuro, camisa rosa, sin corbata | terraza con foquitos al anochecer |
| `ankylosaurus.png` | Ankylosaurus | rara | lavanda con armadura de escudos | traje negro cruzado, corbata plateada | vestíbulo de mármol de un banco |
| `velociraptor.png` | Velociraptor | rara | rosa con plumitas, mirada traviesa | chamarra de mezclilla y sudadera amarilla | calle de noche con neones |
| `pterodactyl.png` | Pterodáctilo | rara | azul cielo con cresta y alas asomando | saco de piloto con botones dorados, corbata celeste | aeropuerto con aviones |
| `diplodocus.png` | Diplodocus | rara | turquesa, cuello largo (encuadra cabeza y cuello) | blazer café y suéter de cuello alto | lago con montañas |
| `brontosaurus.png` | Brontosaurio | épica | azul con lunares claros | saco de terciopelo vino, moño negro | teatro con luces de escenario |
| `allosaurus.png` | Alosaurio | épica | rojo coral con cuernitos sobre los ojos | traje negro, camisa negra, corbata roja | sala de juntas de rascacielos de noche |
| `carnotaurus.png` | Carnotauro | épica | naranja intenso con dos cuernitos de toro | camisa de mezclilla, chaleco de cuero y paliacate | rancho en el desierto |
| `therizinosaurus.png` | Therizinosaurio | épica | verde hoja con plumas | chaleco de punto mostaza y lentes redondos | jardín botánico |
| `plesiosaurus.png` | Plesiosaurio | épica | azul agua, cuello largo y aletas | blazer de lino blanco, sin corbata | oficina en la playa |
| `spinosaurus.png` | Espinosaurio | legendaria | verde azulado con vela en el lomo | traje verde esmeralda, corbata dorada | río en la selva al amanecer |
| `brachiosaurus.png` | Braquiosaurio | legendaria | morado, cuello muy alto | traje de tres piezas gris, corbata morada | observatorio con telescopio |
| `quetzalcoatlus.png` | Quetzalcoatlus | legendaria | naranja dorado con gran cresta | chaqueta de explorador y brújula de collar | acantilado sobre las nubes |
| `mosasaurus.png` | Mosasaurio | mítica | azul océano brillante con aletas | saco de capitán con charreteras | túnel de acuario con peces |
| `argentinosaurus.png` | Argentinosaurio | mítica | dorado con lunares | esmoquin blanco, moño negro | galería de palacio con candelabros |

## Prompts

### Comunes

**T-Rex** → `trex.png`

```
A corporate headshot of a cute plush felt baby T-Rex, lime-green with a cream belly, wearing a navy suit, a white shirt and a red tie, in front of a top-floor office window with the city skyline at sunset. Head and shoulders, looking at the viewer in a three-quarter view with a confident friendly smile, like a company boss photo. Face in the upper third and centered, nothing important in the corners. Plush felt toy style with visible dashed stitching, round glossy black button eyes with a white highlight, small rosy cheeks, chubby rounded shapes, soft warm lighting, background softly blurred (shallow depth of field). Square format. No text, no frame, no hat, no watermark.
```

**Compsognathus** → `compsognathus.png`

```
A corporate headshot of a cute plush felt baby Compsognathus, light green with a tiny head and a thin neck, wearing a beige knitted cardigan over a white collared shirt, no tie, in front of a cozy library with wooden bookshelves. Head and shoulders, looking at the viewer in a three-quarter view with a confident friendly smile, like a company boss photo. Face in the upper third and centered, nothing important in the corners. Plush felt toy style with visible dashed stitching, round glossy black button eyes with a white highlight, small rosy cheeks, chubby rounded shapes, soft warm lighting, background softly blurred (shallow depth of field). Square format. No text, no frame, no hat, no watermark.
```

**Protoceratops** → `protoceratops.png`

```
A corporate headshot of a cute plush felt baby Protoceratops, soft orange with a small frill and no horns, wearing a grey blazer over a black turtleneck, no tie, in front of a modern startup office with plants and warm lamps. Head and shoulders, looking at the viewer in a three-quarter view with a confident friendly smile, like a company boss photo. Face in the upper third and centered, nothing important in the corners. Plush felt toy style with visible dashed stitching, round glossy black button eyes with a white highlight, small rosy cheeks, chubby rounded shapes, soft warm lighting, background softly blurred (shallow depth of field). Square format. No text, no frame, no hat, no watermark.
```

**Oviraptor** → `oviraptor.png`

```
A corporate headshot of a cute plush felt baby Oviraptor, yellow with little feathers and a round crest, wearing a mint-green vest, a white shirt and a red bow tie, in front of a pastel bakery café. Head and shoulders, looking at the viewer in a three-quarter view with a confident friendly smile, like a company boss photo. Face in the upper third and centered, nothing important in the corners. Plush felt toy style with visible dashed stitching, round glossy black button eyes with a white highlight, small rosy cheeks, chubby rounded shapes, soft warm lighting, background softly blurred (shallow depth of field). Square format. No text, no frame, no hat, no watermark.
```

**Iguanodon** → `iguanodon.png`

```
A corporate headshot of a cute plush felt baby Iguanodon, mint green with little thumb spikes, wearing an olive field jacket over a cream shirt with an open collar, in front of a greenhouse full of tropical plants. Head and shoulders, looking at the viewer in a three-quarter view with a confident friendly smile, like a company boss photo. Face in the upper third and centered, nothing important in the corners. Plush felt toy style with visible dashed stitching, round glossy black button eyes with a white highlight, small rosy cheeks, chubby rounded shapes, soft warm lighting, background softly blurred (shallow depth of field). Square format. No text, no frame, no hat, no watermark.
```

**Pachycephalosaurus** → `pachycephalosaurus.png`

```
A corporate headshot of a cute plush felt baby Pachycephalosaurus, lilac with a round domed head, wearing a navy zip-up track jacket over a white t-shirt, in front of a sunny park with green trees. Head and shoulders, looking at the viewer in a three-quarter view with a confident friendly smile, like a company boss photo. Face in the upper third and centered, nothing important in the corners. Plush felt toy style with visible dashed stitching, round glossy black button eyes with a white highlight, small rosy cheeks, chubby rounded shapes, soft warm lighting, background softly blurred (shallow depth of field). Square format. No text, no frame, no hat, no watermark.
```


### Raros

**Triceratops** → `triceratops.png`

```
A corporate headshot of a cute plush felt baby Triceratops, orange with a cream frill and three rounded horns, wearing a brown tweed jacket with elbow patches, a light blue shirt and a dark green tie, in front of a museum hall with fossil displays. Head and shoulders, looking at the viewer in a three-quarter view with a confident friendly smile, like a company boss photo. Face in the upper third and centered, nothing important in the corners. Plush felt toy style with visible dashed stitching, round glossy black button eyes with a white highlight, small rosy cheeks, chubby rounded shapes, soft warm lighting, background softly blurred (shallow depth of field). Square format. No text, no frame, no hat, no watermark.
```

**Stegosaurus** → `stegosaurus.png`

```
A corporate headshot of a cute plush felt baby Stegosaurus, yellow with orange back plates peeking over the shoulders, wearing a charcoal suit and a pink shirt with an open collar, no tie, in front of a rooftop terrace with string lights at dusk. Head and shoulders, looking at the viewer in a three-quarter view with a confident friendly smile, like a company boss photo. Face in the upper third and centered, nothing important in the corners. Plush felt toy style with visible dashed stitching, round glossy black button eyes with a white highlight, small rosy cheeks, chubby rounded shapes, soft warm lighting, background softly blurred (shallow depth of field). Square format. No text, no frame, no hat, no watermark.
```

**Ankylosaurus** → `ankylosaurus.png`

```
A corporate headshot of a cute plush felt baby Ankylosaurus, lavender with armored shield plates, wearing a black double-breasted suit, a white shirt and a silver tie, in front of an elegant marble bank lobby. Head and shoulders, looking at the viewer in a three-quarter view with a confident friendly smile, like a company boss photo. Face in the upper third and centered, nothing important in the corners. Plush felt toy style with visible dashed stitching, round glossy black button eyes with a white highlight, small rosy cheeks, chubby rounded shapes, soft warm lighting, background softly blurred (shallow depth of field). Square format. No text, no frame, no hat, no watermark.
```

**Velociraptor** → `velociraptor.png`

```
A corporate headshot of a cute plush felt baby Velociraptor, pink with little feathers and a mischievous look, wearing a denim jacket over a yellow hoodie, in front of a city street at night with colorful neon signs. Head and shoulders, looking at the viewer in a three-quarter view with a confident friendly smile, like a company boss photo. Face in the upper third and centered, nothing important in the corners. Plush felt toy style with visible dashed stitching, round glossy black button eyes with a white highlight, small rosy cheeks, chubby rounded shapes, soft warm lighting, background softly blurred (shallow depth of field). Square format. No text, no frame, no hat, no watermark.
```

**Pterodáctilo** → `pterodactyl.png`

```
A corporate headshot of a cute plush felt baby pterodactyl, sky blue with a crest and wings peeking over the shoulders, wearing a navy pilot-style blazer with gold buttons, a white shirt and a light blue tie, in front of an airport terminal window with planes and blue sky. Head and shoulders, looking at the viewer in a three-quarter view with a confident friendly smile, like a company boss photo. Face in the upper third and centered, nothing important in the corners. Plush felt toy style with visible dashed stitching, round glossy black button eyes with a white highlight, small rosy cheeks, chubby rounded shapes, soft warm lighting, background softly blurred (shallow depth of field). Square format. No text, no frame, no hat, no watermark.
```

**Diplodocus** → `diplodocus.png`

```
A corporate headshot of a cute plush felt baby Diplodocus, turquoise with a long neck (frame the head and the neck), wearing a brown blazer over a cream turtleneck sweater, in front of a calm lake with mountains. Head and shoulders, looking at the viewer in a three-quarter view with a confident friendly smile, like a company boss photo. Face in the upper third and centered, nothing important in the corners. Plush felt toy style with visible dashed stitching, round glossy black button eyes with a white highlight, small rosy cheeks, chubby rounded shapes, soft warm lighting, background softly blurred (shallow depth of field). Square format. No text, no frame, no hat, no watermark.
```


### Épicos

**Brontosaurio** → `brontosaurus.png`

```
A corporate headshot of a cute plush felt baby Brontosaurus, blue with light round spots, wearing a burgundy velvet jacket, a white shirt and a black bow tie, in front of a theater with warm stage lights. Head and shoulders, looking at the viewer in a three-quarter view with a confident friendly smile, like a company boss photo. Face in the upper third and centered, nothing important in the corners. Plush felt toy style with visible dashed stitching, round glossy black button eyes with a white highlight, small rosy cheeks, chubby rounded shapes, soft warm lighting, background softly blurred (shallow depth of field). Square format. No text, no frame, no hat, no watermark.
```

**Alosaurio** → `allosaurus.png`

```
A corporate headshot of a cute plush felt baby Allosaurus, coral red with little horns above the eyes, wearing a black suit, a black shirt and a red tie, in front of a glass boardroom in a skyscraper at night. Head and shoulders, looking at the viewer in a three-quarter view with a confident friendly smile, like a company boss photo. Face in the upper third and centered, nothing important in the corners. Plush felt toy style with visible dashed stitching, round glossy black button eyes with a white highlight, small rosy cheeks, chubby rounded shapes, soft warm lighting, background softly blurred (shallow depth of field). Square format. No text, no frame, no hat, no watermark.
```

**Carnotauro** → `carnotaurus.png`

```
A corporate headshot of a cute plush felt baby Carnotaurus, bright orange with two little bull horns, wearing a denim shirt with rolled sleeves, a brown leather vest and a red bandana around the neck, in front of a desert ranch at golden hour. Head and shoulders, looking at the viewer in a three-quarter view with a confident friendly smile, like a company boss photo. Face in the upper third and centered, nothing important in the corners. Plush felt toy style with visible dashed stitching, round glossy black button eyes with a white highlight, small rosy cheeks, chubby rounded shapes, soft warm lighting, background softly blurred (shallow depth of field). Square format. No text, no frame, no hat, no watermark.
```

**Therizinosaurio** → `therizinosaurus.png`

```
A corporate headshot of a cute plush felt baby Therizinosaurus, leaf green with soft feathers, wearing a mustard knitted sweater vest over a white shirt and small round glasses, in front of a botanical garden. Head and shoulders, looking at the viewer in a three-quarter view with a confident friendly smile, like a company boss photo. Face in the upper third and centered, nothing important in the corners. Plush felt toy style with visible dashed stitching, round glossy black button eyes with a white highlight, small rosy cheeks, chubby rounded shapes, soft warm lighting, background softly blurred (shallow depth of field). Square format. No text, no frame, no hat, no watermark.
```

**Plesiosaurio** → `plesiosaurus.png`

```
A corporate headshot of a cute plush felt baby Plesiosaurus, aqua blue with a long neck and flippers, wearing a white linen blazer and a light aqua shirt with an open collar, in front of a beach office with an ocean view. Head and shoulders, looking at the viewer in a three-quarter view with a confident friendly smile, like a company boss photo. Face in the upper third and centered, nothing important in the corners. Plush felt toy style with visible dashed stitching, round glossy black button eyes with a white highlight, small rosy cheeks, chubby rounded shapes, soft warm lighting, background softly blurred (shallow depth of field). Square format. No text, no frame, no hat, no watermark.
```


### Legendarios

**Espinosaurio** → `spinosaurus.png`

```
A corporate headshot of a cute plush felt baby Spinosaurus, teal with a sail on its back, wearing an emerald green suit, a white shirt and a gold tie, in front of a jungle river at sunrise. Head and shoulders, looking at the viewer in a three-quarter view with a confident friendly smile, like a company boss photo. Face in the upper third and centered, nothing important in the corners. Plush felt toy style with visible dashed stitching, round glossy black button eyes with a white highlight, small rosy cheeks, chubby rounded shapes, soft warm lighting, background softly blurred (shallow depth of field). Square format. No text, no frame, no hat, no watermark. Surrounded by a soft golden glow.
```

**Braquiosaurio** → `brachiosaurus.png`

```
A corporate headshot of a cute plush felt baby Brachiosaurus, purple with a very tall neck, wearing a grey three-piece suit with a vest, a lavender shirt and a dark purple tie, in front of an observatory with a big telescope under a starry dome. Head and shoulders, looking at the viewer in a three-quarter view with a confident friendly smile, like a company boss photo. Face in the upper third and centered, nothing important in the corners. Plush felt toy style with visible dashed stitching, round glossy black button eyes with a white highlight, small rosy cheeks, chubby rounded shapes, soft warm lighting, background softly blurred (shallow depth of field). Square format. No text, no frame, no hat, no watermark. Surrounded by a soft golden glow.
```

**Quetzalcoatlus** → `quetzalcoatlus.png`

```
A corporate headshot of a cute plush felt baby Quetzalcoatlus, golden orange with a big crest, wearing a cream explorer jacket over a white shirt, no tie, with a small brass compass necklace, in front of a cliff high above the clouds. Head and shoulders, looking at the viewer in a three-quarter view with a confident friendly smile, like a company boss photo. Face in the upper third and centered, nothing important in the corners. Plush felt toy style with visible dashed stitching, round glossy black button eyes with a white highlight, small rosy cheeks, chubby rounded shapes, soft warm lighting, background softly blurred (shallow depth of field). Square format. No text, no frame, no hat, no watermark. Surrounded by a soft golden glow.
```


### Míticos

**Mosasaurio** → `mosasaurus.png`

```
A corporate headshot of a cute plush felt baby Mosasaurus, bright ocean blue with fins, wearing a deep navy captain coat with gold buttons and epaulettes over a white shirt, in front of an underwater aquarium tunnel with fish. Head and shoulders, looking at the viewer in a three-quarter view with a confident friendly smile, like a company boss photo. Face in the upper third and centered, nothing important in the corners. Plush felt toy style with visible dashed stitching, round glossy black button eyes with a white highlight, small rosy cheeks, chubby rounded shapes, soft warm lighting, background softly blurred (shallow depth of field). Square format. No text, no frame, no hat, no watermark. Surrounded by a soft golden glow and small sparkles.
```

**Argentinosaurio** → `argentinosaurus.png`

```
A corporate headshot of a cute plush felt baby Argentinosaurus, golden with spots, wearing a white tuxedo, a black bow tie and a gold pocket square, in front of a royal palace gallery with chandeliers. Head and shoulders, looking at the viewer in a three-quarter view with a confident friendly smile, like a company boss photo. Face in the upper third and centered, nothing important in the corners. Plush felt toy style with visible dashed stitching, round glossy black button eyes with a white highlight, small rosy cheeks, chubby rounded shapes, soft warm lighting, background softly blurred (shallow depth of field). Square format. No text, no frame, no hat, no watermark. Surrounded by a soft golden glow and small sparkles.
```


Empieza por los **comunes**: son los primeros managers que consigue el jugador. Si un archivo pesa
mucho o trae fondo, súbelo igual: Claude lo recorta y lo convierte.

## Videos de la ficha (opcional)

Al tocar un dino descubierto en **Dinos**, su ficha reproduce un video **una sola vez** en lugar del
retrato, y se queda en el último cuadro.

- Archivo: `assets/art/dinos/<id>.mp4` (mismo id que el retrato, p. ej. `gallimimus.mp4` ✅).
- Cuadrado (1:1), 3–6 s. Se reproduce **sin sonido** (si la herramienta añade audio, no pasa nada).
- **Imagen → video, usando el retrato como primer cuadro.** Mientras carga se ve el retrato, así que
  el arranque no "salta". El último cuadro es el que se queda: que termine sonriendo a cámara.
- Si la herramienta deja poner **cuadro inicial y final** (Kling, Luma), pon el retrato en los dos: el
  video empieza y acaba igual que el retrato y queda perfecto.
- Claude lo recorta a 480 × 480 y le quita el audio: de ~2.5 MB queda en ~150 KB.

### Prompts de video (copiar y pegar, con el retrato adjunto)

Cada dino hace un gesto propio que va con su ropa y su carácter. Todos llevan la misma cola: cámara
fija, mismo fondo, sin objetos nuevos y final quieto sonriendo.

**T-Rex** → `trex.mp4`

```
The plush felt T-Rex in the image proudly straightens its tie with its tiny arms, then gives a happy little thumbs-up. Keep the exact same character, outfit, framing and background as the image; the camera does not move and the background stays softly blurred. Gentle, cute stop-motion plush toy movement, about 5 seconds. It ends facing the viewer in a three-quarter view with a friendly smile, holding still for the last second. No text, no new objects, no camera cuts.
```

**Compsognathus** → `compsognathus.mp4`

```
The plush felt Compsognathus in the image tilts its tiny head curiously, then gives a small shy wave. Keep the exact same character, outfit, framing and background as the image; the camera does not move and the background stays softly blurred. Gentle, cute stop-motion plush toy movement, about 5 seconds. It ends facing the viewer in a three-quarter view with a friendly smile, holding still for the last second. No text, no new objects, no camera cuts.
```

**Protoceratops** → `protoceratops.mp4`

```
The plush felt Protoceratops in the image nods thoughtfully, then breaks into a big smile and wiggles its frill. Keep the exact same character, outfit, framing and background as the image; the camera does not move and the background stays softly blurred. Gentle, cute stop-motion plush toy movement, about 5 seconds. It ends facing the viewer in a three-quarter view with a friendly smile, holding still for the last second. No text, no new objects, no camera cuts.
```

**Oviraptor** → `oviraptor.mp4`

```
The plush felt Oviraptor in the image straightens its red bow tie, fluffs its little feathers and winks. Keep the exact same character, outfit, framing and background as the image; the camera does not move and the background stays softly blurred. Gentle, cute stop-motion plush toy movement, about 5 seconds. It ends facing the viewer in a three-quarter view with a friendly smile, holding still for the last second. No text, no new objects, no camera cuts.
```

**Iguanodon** → `iguanodon.mp4`

```
The plush felt Iguanodon in the image raises one thumb spike like a thumbs-up and nods. Keep the exact same character, outfit, framing and background as the image; the camera does not move and the background stays softly blurred. Gentle, cute stop-motion plush toy movement, about 5 seconds. It ends facing the viewer in a three-quarter view with a friendly smile, holding still for the last second. No text, no new objects, no camera cuts.
```

**Parasaurio** → `parasaurolophus.mp4`

```
The plush felt Parasaurolophus in the image puffs its cheeks and toots through its tubular crest like a trumpet, then laughs. Keep the exact same character, outfit, framing and background as the image; the camera does not move and the background stays softly blurred. Gentle, cute stop-motion plush toy movement, about 5 seconds. It ends facing the viewer in a three-quarter view with a friendly smile, holding still for the last second. No text, no new objects, no camera cuts.
```

**Paquicefalosaurio** → `pachycephalosaurus.mp4`

```
The plush felt Pachycephalosaurus in the image does a playful little head bob toward the viewer, then laughs. Keep the exact same character, outfit, framing and background as the image; the camera does not move and the background stays softly blurred. Gentle, cute stop-motion plush toy movement, about 5 seconds. It ends facing the viewer in a three-quarter view with a friendly smile, holding still for the last second. No text, no new objects, no camera cuts.
```

**Triceratops** → `triceratops.mp4`

```
The plush felt Triceratops in the image adjusts the lapels of its tweed jacket and nods wisely. Keep the exact same character, outfit, framing and background as the image; the camera does not move and the background stays softly blurred. Gentle, cute stop-motion plush toy movement, about 5 seconds. It ends facing the viewer in a three-quarter view with a friendly smile, holding still for the last second. No text, no new objects, no camera cuts.
```

**Stegosaurus** → `stegosaurus.mp4`

```
The plush felt Stegosaurus in the image laughs happily while its back plates wiggle. Keep the exact same character, outfit, framing and background as the image; the camera does not move and the background stays softly blurred. Gentle, cute stop-motion plush toy movement, about 5 seconds. It ends facing the viewer in a three-quarter view with a friendly smile, holding still for the last second. No text, no new objects, no camera cuts.
```

**Ankylosaurus** → `ankylosaurus.mp4`

```
The plush felt Ankylosaurus in the image taps its armored chest proudly and nods once. Keep the exact same character, outfit, framing and background as the image; the camera does not move and the background stays softly blurred. Gentle, cute stop-motion plush toy movement, about 5 seconds. It ends facing the viewer in a three-quarter view with a friendly smile, holding still for the last second. No text, no new objects, no camera cuts.
```

**Velociraptor** → `velociraptor.mp4`

```
The plush felt Velociraptor in the image glances left and right with a cheeky grin, then points at the viewer and winks. Keep the exact same character, outfit, framing and background as the image; the camera does not move and the background stays softly blurred. Gentle, cute stop-motion plush toy movement, about 5 seconds. It ends facing the viewer in a three-quarter view with a friendly smile, holding still for the last second. No text, no new objects, no camera cuts.
```

**Pterodáctilo** → `pterodactyl.mp4`

```
The plush felt pterodactyl in the image gives its wings a short flap behind its shoulders, then does a pilot salute. Keep the exact same character, outfit, framing and background as the image; the camera does not move and the background stays softly blurred. Gentle, cute stop-motion plush toy movement, about 5 seconds. It ends facing the viewer in a three-quarter view with a friendly smile, holding still for the last second. No text, no new objects, no camera cuts.
```

**Diplodocus** → `diplodocus.mp4`

```
The plush felt Diplodocus in the image gently sways its long neck up and down, then smiles. Keep the exact same character, outfit, framing and background as the image; the camera does not move and the background stays softly blurred. Gentle, cute stop-motion plush toy movement, about 5 seconds. It ends facing the viewer in a three-quarter view with a friendly smile, holding still for the last second. No text, no new objects, no camera cuts.
```

**Brontosaurio** → `brontosaurus.mp4`

```
The plush felt Brontosaurus in the image takes a polite little bow like a stage performer and comes back up smiling. Keep the exact same character, outfit, framing and background as the image; the camera does not move and the background stays softly blurred. Gentle, cute stop-motion plush toy movement, about 5 seconds. It ends facing the viewer in a three-quarter view with a friendly smile, holding still for the last second. No text, no new objects, no camera cuts.
```

**Alosaurio** → `allosaurus.mp4`

```
The plush felt Allosaurus in the image leans in with a serious boss face, then breaks into a big friendly smile. Keep the exact same character, outfit, framing and background as the image; the camera does not move and the background stays softly blurred. Gentle, cute stop-motion plush toy movement, about 5 seconds. It ends facing the viewer in a three-quarter view with a friendly smile, holding still for the last second. No text, no new objects, no camera cuts.
```

**Carnotauro** → `carnotaurus.mp4`

```
The plush felt Carnotaurus in the image tugs its red bandana and gives a confident grin. Keep the exact same character, outfit, framing and background as the image; the camera does not move and the background stays softly blurred. Gentle, cute stop-motion plush toy movement, about 5 seconds. It ends facing the viewer in a three-quarter view with a friendly smile, holding still for the last second. No text, no new objects, no camera cuts.
```

**Therizinosaurio** → `therizinosaurus.mp4`

```
The plush felt Therizinosaurus in the image pushes up its round glasses with one claw and smiles. Keep the exact same character, outfit, framing and background as the image; the camera does not move and the background stays softly blurred. Gentle, cute stop-motion plush toy movement, about 5 seconds. It ends facing the viewer in a three-quarter view with a friendly smile, holding still for the last second. No text, no new objects, no camera cuts.
```

**Plesiosaurio** → `plesiosaurus.mp4`

```
The plush felt Plesiosaurus in the image tilts its head side to side happily and waves a flipper. Keep the exact same character, outfit, framing and background as the image; the camera does not move and the background stays softly blurred. Gentle, cute stop-motion plush toy movement, about 5 seconds. It ends facing the viewer in a three-quarter view with a friendly smile, holding still for the last second. No text, no new objects, no camera cuts.
```

**Espinosaurio** → `spinosaurus.mp4`

```
The plush felt Spinosaurus in the image straightens its gold tie while the sail on its back ripples softly. Keep the exact same character, outfit, framing and background as the image; the camera does not move and the background stays softly blurred. Gentle, cute stop-motion plush toy movement, about 5 seconds. It ends facing the viewer in a three-quarter view with a friendly smile, holding still for the last second. No text, no new objects, no camera cuts.
```

**Braquiosaurio** → `brachiosaurus.mp4`

```
The plush felt Brachiosaurus in the image looks up toward the stars, then back at the viewer with a smile. Keep the exact same character, outfit, framing and background as the image; the camera does not move and the background stays softly blurred. Gentle, cute stop-motion plush toy movement, about 5 seconds. It ends facing the viewer in a three-quarter view with a friendly smile, holding still for the last second. No text, no new objects, no camera cuts.
```

**Quetzalcoatlus** → `quetzalcoatlus.mp4`

```
The plush felt Quetzalcoatlus in the image checks its little brass compass, then looks up and smiles as a breeze moves its crest. Keep the exact same character, outfit, framing and background as the image; the camera does not move and the background stays softly blurred. Gentle, cute stop-motion plush toy movement, about 5 seconds. It ends facing the viewer in a three-quarter view with a friendly smile, holding still for the last second. No text, no new objects, no camera cuts.
```

**Mosasaurio** → `mosasaurus.mp4`

```
The plush felt Mosasaurus in the image gives a captain salute while small bubbles float up around it. Keep the exact same character, outfit, framing and background as the image; the camera does not move and the background stays softly blurred. Gentle, cute stop-motion plush toy movement, about 5 seconds. It ends facing the viewer in a three-quarter view with a friendly smile, holding still for the last second. No text, no new objects, no camera cuts.
```

**Argentinosaurio** → `argentinosaurus.mp4`

```
The plush felt Argentinosaurus in the image adjusts its bow tie elegantly and nods while golden sparkles twinkle. Keep the exact same character, outfit, framing and background as the image; the camera does not move and the background stays softly blurred. Gentle, cute stop-motion plush toy movement, about 5 seconds. It ends facing the viewer in a three-quarter view with a friendly smile, holding still for the last second. No text, no new objects, no camera cuts.
```


Los datos de la ficha (dieta, época, tamaño, región y dato curioso) ya están escritos para las 24
especies en `src/data/dinoFacts.ts` y `src/i18n/dinoFacts.ts`.
