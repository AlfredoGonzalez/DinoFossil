import type { ImageSourcePropType } from 'react-native';
import { ART } from './art.generated';
import { DINOS } from '@/data/dinos';
import { ICONS, type IconName } from './iconNames';

/**
 * Huecos de arte final. Cada clave corresponde a un archivo en
 * assets/art/<clave>.(png|webp|jpg). Si el archivo no existe, la pantalla
 * usa su placeholder de código. Especificaciones completas: docs/art/.
 */
export const ART_SPECS = {
  'loading/background': { size: '1290×2796', format: 'jpg/webp opaco', desc: 'Fondo de la pantalla de carga' },
  'loading/logo': { size: '1200×750', format: 'png transparente', desc: 'Logo DINO FOSSIL TYCOON (carga e inicio)' },
  // Módulo 2 · Casa-Museo (docs/art/02-casa-museo.md).
  'museum/sky': { size: '1290×2796', format: 'jpg/webp opaco', desc: 'Paisaje detrás de la casa (si falta: loading/background)' },
  'museum/roof': { size: '1290×430', format: 'png/webp transparente', desc: 'Tejado y fachada superior, con cartel vacío' },
  'museum/hall': { size: '1290×480', format: 'jpg/webp opaco', desc: 'Interior de la sala de exposición' },
  'museum/lab': { size: '1290×480', format: 'jpg/webp opaco', desc: 'Interior del laboratorio' },
  'museum/basement': { size: '1290×480', format: 'jpg/webp opaco', desc: 'Interior de un sótano (se repite en cada uno)' },
  'museum/foundation': { size: '1290×360', format: 'jpg/webp opaco', desc: 'Cimientos y roca bajo el último sótano' },
  'museum/crate': { size: '256×256', format: 'png/webp transparente', desc: 'Caja de fósiles del montacargas' },
  'museum/wanted-poster': { size: '≈300×380', format: 'png/webp transparente', desc: 'Cartel "Se busca" vacío del manager, con clavo' },
  'museum/crate-empty': { size: '≈256×256', format: 'png/webp transparente', desc: 'Caja del montacargas vacía (baja)' },
  'museum/crate-full': { size: '≈256×256', format: 'png/webp transparente', desc: 'Caja del montacargas llena de huesos (sube)' },
  'museum/visitor': { size: '512×512', format: 'png/webp transparente', desc: 'Visitante que pasea por la sala' },
  // Módulo 4 · Sótanos (docs/art/04-sotanos.md).
  'museum/basket': { size: '≈365×420', format: 'png/webp transparente', desc: 'Bolsa de huesos de cada sótano' },
  'museum/dirt-mound': { size: '≈640×478', format: 'png/webp transparente', desc: 'Montón de tierra donde escarba el dino (cara hacia la derecha)' },
  // Hojas de sprites: cuadrícula de fotogramas (configuración en src/ui/spriteSheets.ts).
  'sprites/digger/idle': { size: '1280×1280 (5×5 de 256)', format: 'png/webp transparente', desc: 'Excavador en espera' },
  'sprites/digger/walk': { size: '1280×1280 (5×5 de 256)', format: 'png/webp transparente', desc: 'Excavador caminando (mira a la derecha)' },
  'sprites/digger/dig': { size: '1280×1280 (5×5 de 256)', format: 'png/webp transparente', desc: 'Excavador escarbando (mira a la derecha)' },
  'sprites/digger/carry': { size: '1280×1280 (5×5 de 256)', format: 'png/webp transparente', desc: 'Excavador caminando con tierra y huesos' },
  'sprites/visitors/a': { size: '1280×1280 (5×5 de 256)', format: 'png/webp transparente', desc: 'Visitante caminando (mira a la derecha)' },
  'sprites/visitors/b': { size: '1280×1280 (5×5 de 256)', format: 'png/webp transparente', desc: 'Visitante caminando (mira a la derecha)' },
  'sprites/visitors/c': { size: '1280×1280 (5×5 de 256)', format: 'png/webp transparente', desc: 'Visitante caminando (mira a la derecha)' },
} as const;

/**
 * Iconos: assets/art/icons/<nombre> (lista en src/ui/iconNames.ts).
 * Retratos de dinos: assets/art/dinos/<id> (ids en src/data/dinos.ts; ficha en docs/art/05-retratos.md).
 */
export type ArtKey = keyof typeof ART_SPECS | `icons/${IconName}` | `dinos/${string}`;

export function getArt(key: ArtKey): ImageSourcePropType | undefined {
  return ART[key];
}

if (__DEV__) {
  const known = [...Object.keys(ICONS).map((name) => `icons/${name}`), ...DINOS.map((d) => `dinos/${d.id}`)];
  const unknown = Object.keys(ART).filter((key) => !(key in ART_SPECS) && !known.includes(key));
  if (unknown.length) console.warn(`[art] Archivos sin hueco asignado (revisa el nombre): ${unknown.join(', ')}`);
}
