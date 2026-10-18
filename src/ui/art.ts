import type { ImageSourcePropType } from 'react-native';
import { ART } from './art.generated';

/**
 * Huecos de arte final. Cada clave corresponde a un archivo en
 * assets/art/<clave>.(png|webp|jpg). Si el archivo no existe, la pantalla
 * usa su placeholder de código. Especificaciones completas: docs/art/.
 */
export const ART_SPECS = {
  'loading/background': { size: '1290×2796', format: 'jpg/webp opaco', desc: 'Fondo de la pantalla de carga' },
  'loading/logo': { size: '1200×750', format: 'png transparente', desc: 'Logo DINO FOSSIL TYCOON (carga e inicio)' },
  'loading/mascot': { size: '1024×1024', format: 'png transparente', desc: 'T-Rex mascota de cuerpo entero' },
  // Módulo 2 · Casa-Museo (docs/art/02-casa-museo.md).
  'museum/sky': { size: '1290×2796', format: 'jpg/webp opaco', desc: 'Paisaje detrás de la casa (si falta: loading/background)' },
  'museum/roof': { size: '1290×430', format: 'png/webp transparente', desc: 'Tejado y fachada superior, con cartel vacío' },
  'museum/hall': { size: '1290×480', format: 'jpg/webp opaco', desc: 'Interior de la sala de exposición' },
  'museum/lab': { size: '1290×480', format: 'jpg/webp opaco', desc: 'Interior del laboratorio' },
  'museum/basement': { size: '1290×480', format: 'jpg/webp opaco', desc: 'Interior de un sótano (se repite en cada uno)' },
  'museum/foundation': { size: '1290×360', format: 'jpg/webp opaco', desc: 'Cimientos y roca bajo el último sótano' },
  'museum/crate': { size: '256×256', format: 'png/webp transparente', desc: 'Caja de fósiles del montacargas' },
  'museum/visitor': { size: '512×512', format: 'png/webp transparente', desc: 'Visitante que pasea por la sala' },
  // Iconos compartidos (cabecera y barra de la mina, ajustes…).
  'ui/icon-settings': { size: '384×384', format: 'png/webp transparente', desc: 'Icono de Ajustes' },
  'ui/icon-goals': { size: '384×384', format: 'png/webp transparente', desc: 'Icono de Logros/Misiones' },
  'ui/icon-shop': { size: '384×384', format: 'png/webp transparente', desc: 'Icono de Tienda' },
  'ui/icon-news': { size: '384×384', format: 'png/webp transparente', desc: 'Icono de Noticias' },
} as const;

export type ArtKey = keyof typeof ART_SPECS;

export function getArt(key: ArtKey): ImageSourcePropType | undefined {
  return ART[key];
}

if (__DEV__) {
  const unknown = Object.keys(ART).filter((key) => !(key in ART_SPECS));
  if (unknown.length) console.warn(`[art] Archivos sin hueco asignado (revisa el nombre): ${unknown.join(', ')}`);
}
