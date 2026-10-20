/**
 * Iconos del juego. Cada uno se carga de assets/art/icons/<nombre>.(png|webp) y,
 * mientras no exista, se dibuja con su emoji. Ficha para la artista: docs/art/03-iconos.md.
 */
export const ICONS = {
  // Recursos (barra superior, precios, recompensas)
  coins: '🪙',
  fossils: '🦴',
  amber: '🔶',
  huellas: '🐾',
  dna: '🧬',
  plants: '🌿',
  // Huevos por rareza (si faltan, el huevo se dibuja con código)
  'egg-common': '🥚',
  'egg-rare': '🥚',
  'egg-epic': '🥚',
  'egg-legendary': '🥚',
  'egg-mythic': '🥚',
  // Barra de navegación inferior
  'nav-map': '🗺️',
  'nav-dinos': '🦕',
  'nav-eggs': '🥚',
  'nav-shop': '🏪',
  'nav-missions': '📋',
  // Acciones y estados
  settings: '⚙️',
  ad: '📺',
  turbo: '⚡',
  timer: '⏳',
  tap: '👆',
  star: '⭐',
  'star-empty': '☆',
  lock: '🔒',
  check: '✅',
  // Plantas de la Casa-Museo (junto al nombre de cada planta)
  'station-hall': '🏛️',
  'station-lab': '🔬',
  'station-basement': '⛏️',
  // Productos de la tienda
  'shop-starter': '🎁',
  'shop-amber-small': '🔶',
  'shop-amber-medium': '💰',
  'shop-amber-large': '👑',
  'shop-double-income': '✖️',
  'shop-dino-pass': '🎟️',
} as const;

export type IconName = keyof typeof ICONS;
