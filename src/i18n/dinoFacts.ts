/** Textos de la ficha de cada especie: dónde se descubrió y un dato curioso. */
export const DINO_FACT_TEXTS: Record<'es' | 'en', Record<string, { region: string; fact: string }>> = {
  es: {
    trex: {
      region: 'Norteamérica (EE. UU. y Canadá)',
      fact: 'Tenía una de las mordidas más fuertes de cualquier animal terrestre. Sus bracitos parecían inútiles, pero cada uno podía levantar unos 200 kg.',
    },
    compsognathus: {
      region: 'Europa (Alemania y Francia)',
      fact: 'Era del tamaño de un pavo. En la panza de uno de sus fósiles se encontró la última comida que hizo: una lagartija.',
    },
    gallimimus: {
      region: 'Mongolia, Asia (Formación Nemegt)',
      fact: "Su nombre significa 'imitador de gallina'. Gracias a sus largas patas y huesos huecos, era uno de los dinosaurios más rápidos de su época, capaz de correr a unos 60 km/h para escapar de grandes depredadores.",
    },
    protoceratops: {
      region: 'Mongolia, Asia (desierto de Gobi)',
      fact: 'Uno de sus fósiles más famosos quedó congelado en plena pelea con un Velociraptor: los dos murieron sepultados por una duna.',
    },
    oviraptor: {
      region: 'Mongolia, Asia (desierto de Gobi)',
      fact: "Aunque su nombre significa 'ladrón de huevos', evidencia reciente sugiere que en realidad empollaba y protegía sus propios nidos.",
    },
    iguanodon: {
      region: 'Europa (Bélgica e Inglaterra)',
      fact: 'Fue uno de los primeros dinosaurios descubiertos, en 1825. Al principio creyeron que el pincho de su pulgar era un cuerno en la nariz.',
    },
    parasaurolophus: {
      region: 'Norteamérica (Alberta, Canadá)',
      fact: 'Su cresta era un tubo hueco de más de un metro: al soplar sonaba como un trombón para llamar a su manada.',
    },
    pachycephalosaurus: {
      region: 'Norteamérica (EE. UU.)',
      fact: 'El techo de su cráneo era una cúpula de hueso de hasta 25 cm de grosor, como un casco natural.',
    },
    triceratops: {
      region: 'Norteamérica (EE. UU. y Canadá)',
      fact: 'Su cráneo, con cuernos y gola, medía hasta 2.5 m: uno de los más grandes de cualquier animal terrestre.',
    },
    stegosaurus: {
      region: 'Norteamérica (EE. UU.) y Portugal',
      fact: "Su cerebro era del tamaño de una ciruela. Las púas de su cola se llaman 'thagomizer' por culpa de una tira cómica.",
    },
    ankylosaurus: {
      region: 'Norteamérica (EE. UU. y Canadá)',
      fact: 'Estaba blindado hasta los párpados, y el mazo de su cola podía romperle los huesos a un depredador.',
    },
    velociraptor: {
      region: 'Mongolia, Asia (desierto de Gobi)',
      fact: 'No era como en las películas: medía lo que un pavo y estaba cubierto de plumas.',
    },
    pterodactyl: {
      region: 'Europa (Alemania)',
      fact: 'No era un dinosaurio, sino un reptil volador. Fue el primer pterosaurio en recibir nombre, en 1809.',
    },
    diplodocus: {
      region: 'Norteamérica (EE. UU.)',
      fact: 'Su cola era tan larga y fina que quizá podía restallarla como un látigo, ¡más rápido que el sonido!',
    },
    brontosaurus: {
      region: 'Norteamérica (EE. UU.)',
      fact: 'En 1903 se decidió que era un Apatosaurus y su nombre desapareció. En 2015 un estudio demostró que sí era distinto y lo recuperó.',
    },
    allosaurus: {
      region: 'Norteamérica (EE. UU.) y Portugal',
      fact: "Fue el gran cazador del Jurásico. Un esqueleto apodado 'Big Al' tiene 19 huesos rotos o infectados: tuvo una vida muy dura.",
    },
    carnotaurus: {
      region: 'Argentina (Patagonia)',
      fact: "Su nombre significa 'toro carnívoro' por los cuernos sobre sus ojos. Sus brazos eran aún más pequeños que los del T-Rex.",
    },
    therizinosaurus: {
      region: 'Mongolia, Asia',
      fact: 'Tenía las garras más largas de cualquier animal conocido, de hasta 1 m, pero las usaba para jalar ramas: comía plantas.',
    },
    plesiosaurus: {
      region: 'Inglaterra (costa de Lyme Regis)',
      fact: 'No era un dinosaurio, sino un reptil marino. El primer esqueleto completo lo encontró Mary Anning, una joven cazadora de fósiles, en 1823.',
    },
    spinosaurus: {
      region: 'Norte de África (Egipto y Marruecos)',
      fact: 'Es el dinosaurio carnívoro más largo conocido. Tenía una gran vela en la espalda y nadaba con su cola de remo para pescar.',
    },
    brachiosaurus: {
      region: 'Norteamérica (Colorado, EE. UU.)',
      fact: 'Sus patas delanteras eran más largas que las traseras, así que podía asomar la cabeza por la ventana de un cuarto piso.',
    },
    quetzalcoatlus: {
      region: 'Norteamérica (Texas, EE. UU.)',
      fact: 'Uno de los animales voladores más grandes de la historia: de pie era tan alto como una jirafa y cazaba caminando, como una cigüeña.',
    },
    mosasaurus: {
      region: 'Países Bajos (Maastricht) y mares de todo el mundo',
      fact: 'No era un dinosaurio: era un reptil marino pariente de los lagartos y las serpientes. Su nombre viene del río Mosa, donde se halló en 1764.',
    },
    argentinosaurus: {
      region: 'Argentina (Neuquén)',
      fact: 'Uno de los animales terrestres más grandes que han existido: pesaba unas 70 toneladas, como 10 elefantes juntos.',
    },
  },
  en: {
    trex: {
      region: 'North America (USA and Canada)',
      fact: 'It had one of the strongest bites of any land animal. Its tiny arms looked useless, but each one could lift about 200 kg.',
    },
    compsognathus: {
      region: 'Europe (Germany and France)',
      fact: "It was the size of a turkey. One fossil still has its last meal in its belly: a lizard.",
    },
    gallimimus: {
      region: 'Mongolia, Asia (Nemegt Formation)',
      fact: "Its name means 'chicken mimic'. Thanks to its long legs and hollow bones it was one of the fastest dinosaurs of its time, running at about 60 km/h to escape big predators.",
    },
    protoceratops: {
      region: 'Mongolia, Asia (Gobi Desert)',
      fact: 'One of its most famous fossils is frozen mid-fight with a Velociraptor: both were buried by a collapsing dune.',
    },
    oviraptor: {
      region: 'Mongolia, Asia (Gobi Desert)',
      fact: "Although its name means 'egg thief', recent evidence suggests it actually brooded and protected its own nests.",
    },
    iguanodon: {
      region: 'Europe (Belgium and England)',
      fact: 'It was one of the first dinosaurs ever discovered, in 1825. At first, its thumb spike was mistaken for a horn on its nose.',
    },
    parasaurolophus: {
      region: 'North America (Alberta, Canada)',
      fact: 'Its crest was a hollow tube over a metre long: blowing through it sounded like a trombone to call the herd.',
    },
    pachycephalosaurus: {
      region: 'North America (USA)',
      fact: 'The top of its skull was a bony dome up to 25 cm thick, like a built-in helmet.',
    },
    triceratops: {
      region: 'North America (USA and Canada)',
      fact: 'Its skull, with horns and frill, was up to 2.5 m long: one of the largest of any land animal.',
    },
    stegosaurus: {
      region: 'North America (USA) and Portugal',
      fact: "Its brain was about the size of a plum. The spikes on its tail are called a 'thagomizer' because of a comic strip.",
    },
    ankylosaurus: {
      region: 'North America (USA and Canada)',
      fact: 'It was armoured right down to its eyelids, and its tail club could break a predator’s bones.',
    },
    velociraptor: {
      region: 'Mongolia, Asia (Gobi Desert)',
      fact: 'Not like the movies: it was the size of a turkey and covered in feathers.',
    },
    pterodactyl: {
      region: 'Europe (Germany)',
      fact: 'It was not a dinosaur but a flying reptile. It was the first pterosaur ever named, in 1809.',
    },
    diplodocus: {
      region: 'North America (USA)',
      fact: 'Its tail was so long and thin it may have cracked it like a whip, faster than the speed of sound!',
    },
    brontosaurus: {
      region: 'North America (USA)',
      fact: 'In 1903 it was lumped in with Apatosaurus and its name disappeared. In 2015 a study showed it was different after all and brought it back.',
    },
    allosaurus: {
      region: 'North America (USA) and Portugal',
      fact: "It was the top hunter of the Jurassic. A skeleton nicknamed 'Big Al' has 19 broken or infected bones: it had a rough life.",
    },
    carnotaurus: {
      region: 'Argentina (Patagonia)',
      fact: "Its name means 'meat-eating bull' because of the horns above its eyes. Its arms were even smaller than a T-Rex’s.",
    },
    therizinosaurus: {
      region: 'Mongolia, Asia',
      fact: 'It had the longest claws of any known animal, up to 1 m, but it used them to pull down branches: it ate plants.',
    },
    plesiosaurus: {
      region: 'England (Lyme Regis coast)',
      fact: 'It was not a dinosaur but a marine reptile. The first complete skeleton was found in 1823 by Mary Anning, a young fossil hunter.',
    },
    spinosaurus: {
      region: 'North Africa (Egypt and Morocco)',
      fact: 'It is the longest meat-eating dinosaur known. It had a huge sail on its back and swam with its paddle-like tail to catch fish.',
    },
    brachiosaurus: {
      region: 'North America (Colorado, USA)',
      fact: 'Its front legs were longer than its back legs, so it could peek into a fourth-floor window.',
    },
    quetzalcoatlus: {
      region: 'North America (Texas, USA)',
      fact: 'One of the largest flying animals ever: standing up it was as tall as a giraffe, and it hunted on foot like a stork.',
    },
    mosasaurus: {
      region: 'Netherlands (Maastricht) and seas worldwide',
      fact: 'It was not a dinosaur but a marine reptile related to lizards and snakes. It is named after the Meuse river, where it was found in 1764.',
    },
    argentinosaurus: {
      region: 'Argentina (Neuquén)',
      fact: 'One of the largest land animals that ever lived: it weighed about 70 tonnes, like 10 elephants put together.',
    },
  },
};
