import type { ImageSourcePropType } from 'react-native';

/**
 * Retratos de dinos. Se migrarán al sistema de assets/art/ en el módulo de la colección;
 * mientras tanto, lo que no esté registrado aquí se dibuja con el emoji de la especie.
 */
export const SPRITES: { dinos: Partial<Record<string, ImageSourcePropType>> } = { dinos: {} };

export type ResourceKind = 'coins' | 'fossils' | 'amber' | 'huellas' | 'eggs' | 'dna' | 'plants';
