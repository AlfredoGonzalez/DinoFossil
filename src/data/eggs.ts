import type { Rarity } from '@/game/types';

/** Probabilidades de rareza cuando se encuentra un huevo excavando. Se muestran al jugador. */
export const EGG_DROP_ODDS: Record<Rarity, number> = {
  common: 0.7,
  rare: 0.2,
  epic: 0.07,
  legendary: 0.025,
  mythic: 0.005,
};

/** Minutos de incubación por rareza. */
export const HATCH_MINUTES: Record<Rarity, number> = {
  common: 5,
  rare: 30,
  epic: 120,
  legendary: 360,
  mythic: 720,
};

/** Ámbar para acelerar: 1 ámbar por cada N minutos restantes (redondeando arriba). */
export const AMBER_PER_MINUTES = 6;

export const EGG_COLORS: Record<Rarity, string> = {
  common: '#E8D9B5',
  rare: '#8BD17C',
  epic: '#6FA8F5',
  legendary: '#B58CF0',
  mythic: '#FF9B54',
};
