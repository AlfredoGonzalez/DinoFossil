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
} as const;

export type ArtKey = keyof typeof ART_SPECS;

export function getArt(key: ArtKey): ImageSourcePropType | undefined {
  return ART[key];
}

if (__DEV__) {
  const unknown = Object.keys(ART).filter((key) => !(key in ART_SPECS));
  if (unknown.length) console.warn(`[art] Archivos sin hueco asignado (revisa el nombre): ${unknown.join(', ')}`);
}
