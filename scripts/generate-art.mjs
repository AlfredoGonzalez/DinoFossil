// Genera src/ui/art.generated.ts a partir de las imágenes de assets/art/.
// Metro solo admite require() con rutas fijas, así que cada imagen necesita
// su línea; este script las escribe para que añadir arte sea solo soltar archivos.
// Se ejecuta solo en postinstall, start, web, test, typecheck y export.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const artDir = path.join(root, 'assets/art');
const outFile = path.join(root, 'src/ui/art.generated.ts');
// Orden de preferencia si una pieza existe en varios formatos.
const EXTENSIONS = ['.png', '.webp', '.jpg', '.jpeg'];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const byKey = new Map();
for (const file of walk(artDir)) {
  const ext = path.extname(file).toLowerCase();
  if (!EXTENSIONS.includes(ext)) continue;
  const key = path.relative(artDir, file).slice(0, -ext.length).split(path.sep).join('/').toLowerCase();
  const previous = byKey.get(key);
  if (previous) {
    const keep = EXTENSIONS.indexOf(path.extname(previous).toLowerCase()) <= EXTENSIONS.indexOf(ext) ? previous : file;
    console.warn(`[art] "${key}" existe en varios formatos; se usa ${path.relative(root, keep)}`);
    byKey.set(key, keep);
  } else {
    byKey.set(key, file);
  }
}

// Avisos de peso: los recortes deberían pesar ≤ 300 KB y los fondos ≤ 600 KB (docs/art/README.md).
for (const [key, file] of byKey) {
  const kb = Math.round(fs.statSync(file).size / 1024);
  const limit = key.endsWith('background') ? 600 : 300;
  if (kb > limit) console.warn(`[art] "${key}" pesa ${kb} KB (recomendado ≤ ${limit} KB). Comprímelo con squoosh.app o TinyPNG.`);
}

const entries = [...byKey.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([key, file]) => {
    const rel = path.relative(path.dirname(outFile), file).split(path.sep).join('/');
    return `  '${key}': require('${rel}'),`;
  });

const content = `// Archivo generado por scripts/generate-art.mjs. No lo edites a mano.
import type { ImageSourcePropType } from 'react-native';

export const ART: Partial<Record<string, ImageSourcePropType>> = ${entries.length ? `{\n${entries.join('\n')}\n}` : '{}'};
`;

if (!fs.existsSync(outFile) || fs.readFileSync(outFile, 'utf8') !== content) fs.writeFileSync(outFile, content);
console.log(`[art] ${byKey.size} imagen(es) registradas en src/ui/art.generated.ts`);
