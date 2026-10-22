/**
 * Ficha técnica de cada especie (solo números y categorías; los textos —región y dato curioso—
 * están en src/i18n/dinoFacts.ts). Medidas aproximadas en metros, tomadas de la bibliografía
 * divulgativa; cuando los paleontólogos dan un rango, se guarda como [mín, máx].
 */
export type Diet = 'herbivore' | 'carnivore' | 'omnivore';
export type Period = 'earlyJurassic' | 'lateJurassic' | 'earlyCretaceous' | 'lateCretaceous';
export type Measure = number | readonly [number, number];

export interface DinoFacts {
  diet: Diet;
  period: Period;
  /** Hace cuántos millones de años vivió (aprox.). */
  mya: number;
  length?: Measure;
  height?: Measure;
  /** Solo reptiles voladores: envergadura de las alas. */
  wingspan?: Measure;
}

export const DINO_FACTS: Record<string, DinoFacts> = {
  trex: { diet: 'carnivore', period: 'lateCretaceous', mya: 68, height: 4, length: 12 },
  compsognathus: { diet: 'carnivore', period: 'lateJurassic', mya: 150, height: 0.3, length: 1 },
  gallimimus: { diet: 'omnivore', period: 'lateCretaceous', mya: 70, height: 2, length: [6, 8] },
  protoceratops: { diet: 'herbivore', period: 'lateCretaceous', mya: 75, height: 0.7, length: 2 },
  oviraptor: { diet: 'omnivore', period: 'lateCretaceous', mya: 75, height: 1, length: [1.6, 2] },
  iguanodon: { diet: 'herbivore', period: 'earlyCretaceous', mya: 125, height: 3, length: 10 },
  parasaurolophus: { diet: 'herbivore', period: 'lateCretaceous', mya: 75, height: 3, length: [9, 10] },
  pachycephalosaurus: { diet: 'herbivore', period: 'lateCretaceous', mya: 68, height: 1.5, length: 4.5 },
  triceratops: { diet: 'herbivore', period: 'lateCretaceous', mya: 67, height: 3, length: 9 },
  stegosaurus: { diet: 'herbivore', period: 'lateJurassic', mya: 152, height: 4, length: 9 },
  ankylosaurus: { diet: 'herbivore', period: 'lateCretaceous', mya: 67, height: 1.7, length: [6, 8] },
  velociraptor: { diet: 'carnivore', period: 'lateCretaceous', mya: 75, height: 0.5, length: 2 },
  pterodactyl: { diet: 'carnivore', period: 'lateJurassic', mya: 150, wingspan: 1 },
  diplodocus: { diet: 'herbivore', period: 'lateJurassic', mya: 152, height: 5, length: 26 },
  brontosaurus: { diet: 'herbivore', period: 'lateJurassic', mya: 152, height: 5, length: 22 },
  allosaurus: { diet: 'carnivore', period: 'lateJurassic', mya: 152, height: 3, length: [8.5, 9.5] },
  carnotaurus: { diet: 'carnivore', period: 'lateCretaceous', mya: 71, height: 3, length: 8 },
  therizinosaurus: { diet: 'herbivore', period: 'lateCretaceous', mya: 70, height: 5, length: 10 },
  plesiosaurus: { diet: 'carnivore', period: 'earlyJurassic', mya: 190, length: 3.5 },
  spinosaurus: { diet: 'carnivore', period: 'lateCretaceous', mya: 95, length: [14, 15] },
  brachiosaurus: { diet: 'herbivore', period: 'lateJurassic', mya: 154, height: 12, length: 22 },
  quetzalcoatlus: { diet: 'carnivore', period: 'lateCretaceous', mya: 68, height: 5, wingspan: [10, 11] },
  mosasaurus: { diet: 'carnivore', period: 'lateCretaceous', mya: 70, length: [12, 17] },
  argentinosaurus: { diet: 'herbivore', period: 'lateCretaceous', mya: 95, length: [30, 35] },
};
