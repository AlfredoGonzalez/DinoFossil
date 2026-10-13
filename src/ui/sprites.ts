import type { ImageSourcePropType } from 'react-native';

/**
 * Registro de sprites. Cuando generes un asset con IA (ver docs/ART_GUIDE.md),
 * guárdalo en assets/sprites/ y regístralo aquí, por ejemplo:
 *   dinos: { trex: require('../../assets/sprites/dinos/trex.png') }
 * Todo lo que no esté registrado se dibuja con el emoji de placeholder.
 */
export const SPRITES: {
  dinos: Partial<Record<string, ImageSourcePropType>>;
  resources: Partial<Record<ResourceKind, ImageSourcePropType>>;
} = {
  dinos: {},
  resources: {},
};

export type ResourceKind = 'coins' | 'fossils' | 'amber' | 'huellas' | 'eggs' | 'dna' | 'plants';

export const RESOURCE_EMOJI: Record<ResourceKind, string> = {
  coins: '🪙',
  fossils: '🦴',
  amber: '🔶',
  huellas: '🐾',
  eggs: '🥚',
  dna: '🧬',
  plants: '🌿',
};
