import type { ImageSourcePropType } from 'react-native';
import { getArt, type ArtKey } from './art';

/**
 * Cómo leer cada hoja de sprites. Formato pedido a la artista (docs/art/sprites.md):
 * cuadrícula de fotogramas cuadrados, de izquierda a derecha y de arriba abajo,
 * personaje mirando a la derecha (el regreso se dibuja en espejo).
 */
export interface SheetLayout {
  cols: number;
  rows: number;
  frames: number;
  fps: number;
}

export const SHEET_LAYOUTS: Partial<Record<ArtKey, SheetLayout>> = {
  'sprites/digger/idle': { cols: 5, rows: 5, frames: 25, fps: 10 },
  'sprites/digger/walk': { cols: 5, rows: 5, frames: 25, fps: 16 },
};

export interface Sheet extends SheetLayout {
  source: ImageSourcePropType;
}

/** Hoja lista para animar, o undefined si el archivo aún no existe. */
export function getSheet(key: ArtKey): Sheet | undefined {
  const source = getArt(key);
  const layout = SHEET_LAYOUTS[key];
  return source && layout ? { source, ...layout } : undefined;
}
