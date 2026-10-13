/** Paleta inspirada en los mockups: verdes de selva, madera/pergamino y botones "chunky". */
export const colors = {
  sky: '#8ED6F5',
  skyDeep: '#5BB8E8',
  grass: '#7BC86C',
  grassDark: '#4E9A3F',
  jungle: '#2F6B3A',
  dirt: '#8B5E3C',
  dirtDark: '#5E3B22',
  dirtLight: '#A9774E',
  parchment: '#FBEFD2',
  parchmentDark: '#EBD3A0',
  wood: '#B97A45',
  woodDark: '#7A4A24',
  text: '#4A2C12',
  textLight: '#FFFFFF',
  muted: '#8C7354',
  gold: '#FFC83D',
  goldDark: '#C98F0B',
  green: '#5CC94A',
  greenDark: '#2E8A23',
  blue: '#3D9BF0',
  blueDark: '#1F63B5',
  orange: '#FFA23A',
  orangeDark: '#C76A06',
  purple: '#9B6BE0',
  purpleDark: '#6236A8',
  red: '#F0564A',
  redDark: '#A8261C',
  grey: '#B9B3A8',
  greyDark: '#857D70',
  night: '#1E2A4A',
  overlay: 'rgba(20, 12, 4, 0.55)',
} as const;

export const rarityColors = {
  common: '#9E9E9E',
  rare: '#4CAF50',
  epic: '#3D8BFD',
  legendary: '#9B59D0',
  mythic: '#FF7A1A',
} as const;

export const fonts = {
  regular: 'Fredoka_500Medium',
  bold: 'Fredoka_600SemiBold',
  black: 'Fredoka_700Bold',
} as const;

export const radius = { sm: 10, md: 16, lg: 22, xl: 28 } as const;

/** Ancho máximo del contenido (tablets y web). */
export const MAX_WIDTH = 480;
