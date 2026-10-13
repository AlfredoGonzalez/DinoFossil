import type { BonusType, Rarity } from '@/game/types';

export interface DinoSpecies {
  id: string;
  rarity: Rarity;
  /** Placeholder visual hasta tener el sprite generado con IA (ver docs/ART_GUIDE.md). */
  emoji: string;
  color: string;
  bonus: BonusType;
}

/** Bonus por nivel de colección según rareza (en % salvo offlineMinutes). */
export const BONUS_PER_LEVEL: Record<Rarity, number> = {
  common: 2,
  rare: 4,
  epic: 8,
  legendary: 15,
  mythic: 25,
};

/** Multiplicador de la habilidad "Turbo" de un manager según su rareza. */
export const ABILITY: Record<Rarity, { multiplier: number; seconds: number }> = {
  common: { multiplier: 2, seconds: 30 },
  rare: { multiplier: 2.5, seconds: 45 },
  epic: { multiplier: 3, seconds: 60 },
  legendary: { multiplier: 4, seconds: 75 },
  mythic: { multiplier: 5, seconds: 90 },
};

export const ABILITY_COOLDOWN_SECONDS = 300;
export const MAX_DINO_LEVEL = 10;

/** La mascota con la que empieza todo jugador. */
export const STARTER_DINO = 'trex';

export const DINOS: readonly DinoSpecies[] = [
  // Comunes (8)
  { id: 'trex', rarity: 'common', emoji: '🦖', color: '#7BC86C', bonus: 'shaftSpeed' },
  { id: 'compsognathus', rarity: 'common', emoji: '🦎', color: '#A5D86E', bonus: 'eggChance' },
  { id: 'gallimimus', rarity: 'common', emoji: '🦤', color: '#F2C46D', bonus: 'elevatorCapacity' },
  { id: 'protoceratops', rarity: 'common', emoji: '🦏', color: '#E9A86A', bonus: 'museumCapacity' },
  { id: 'oviraptor', rarity: 'common', emoji: '🐣', color: '#F5D76E', bonus: 'hatchSpeed' },
  { id: 'iguanodon', rarity: 'common', emoji: '🦎', color: '#8CC9A8', bonus: 'coinValue' },
  { id: 'parasaurolophus', rarity: 'common', emoji: '🦕', color: '#F29BB8', bonus: 'offlineMinutes' },
  { id: 'pachycephalosaurus', rarity: 'common', emoji: '🦖', color: '#C9A0DC', bonus: 'upgradeDiscount' },
  // Raros (6)
  { id: 'triceratops', rarity: 'rare', emoji: '🦏', color: '#F4A259', bonus: 'museumCapacity' },
  { id: 'stegosaurus', rarity: 'rare', emoji: '🦕', color: '#F6C453', bonus: 'shaftSpeed' },
  { id: 'ankylosaurus', rarity: 'rare', emoji: '🐢', color: '#B39DDB', bonus: 'elevatorCapacity' },
  { id: 'velociraptor', rarity: 'rare', emoji: '🦖', color: '#F48FB1', bonus: 'eggChance' },
  { id: 'pterodactyl', rarity: 'rare', emoji: '🦅', color: '#90CAF9', bonus: 'coinValue' },
  { id: 'diplodocus', rarity: 'rare', emoji: '🦕', color: '#80CBC4', bonus: 'offlineMinutes' },
  // Épicos (5)
  { id: 'brontosaurus', rarity: 'epic', emoji: '🦕', color: '#64B5F6', bonus: 'elevatorCapacity' },
  { id: 'allosaurus', rarity: 'epic', emoji: '🦖', color: '#E57373', bonus: 'shaftSpeed' },
  { id: 'carnotaurus', rarity: 'epic', emoji: '🐉', color: '#FF8A65', bonus: 'museumCapacity' },
  { id: 'therizinosaurus', rarity: 'epic', emoji: '🦃', color: '#AED581', bonus: 'hatchSpeed' },
  { id: 'plesiosaurus', rarity: 'epic', emoji: '🐊', color: '#4FC3F7', bonus: 'upgradeDiscount' },
  // Legendarios (3)
  { id: 'spinosaurus', rarity: 'legendary', emoji: '🐊', color: '#4DB6AC', bonus: 'coinValue' },
  { id: 'brachiosaurus', rarity: 'legendary', emoji: '🦒', color: '#9575CD', bonus: 'shaftSpeed' },
  { id: 'quetzalcoatlus', rarity: 'legendary', emoji: '🦅', color: '#FFB74D', bonus: 'eggChance' },
  // Míticos (2)
  { id: 'mosasaurus', rarity: 'mythic', emoji: '🐋', color: '#29B6F6', bonus: 'coinValue' },
  { id: 'argentinosaurus', rarity: 'mythic', emoji: '🦕', color: '#FFD54F', bonus: 'shaftSpeed' },
];

export const DINO_BY_ID: Record<string, DinoSpecies> = Object.fromEntries(DINOS.map((d) => [d.id, d]));
