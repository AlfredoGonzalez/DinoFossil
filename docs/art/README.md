# Arte por módulos

Cada módulo tiene su ficha con los archivos exactos, tamaños y reglas. La biblia de estilo
común y los prompts generales están en [`../ART_GUIDE.md`](../ART_GUIDE.md).

| # | Módulo | Ficha | Estado |
|---|---|---|---|
| 1 | Pantalla de carga (y logo de inicio) | [01-carga.md](01-carga.md) | listo para recibir arte |

## Reglas para todos los módulos

- **Color:** sRGB.
- **Recortes** (personajes, logo, iconos): PNG-24 con transparencia, sin sombra en el suelo.
- **Fondos opacos:** JPG o WebP, calidad ~85.
- **Resolución:** a @3x (lo que se indica en cada ficha ya está a @3x).
- **Sin texto dentro de las imágenes**, salvo el logo: los textos del juego se traducen (es/en) y van en código.
- **Peso:** fondos ≤ 600 KB, recortes ≤ 300 KB. Comprímelos con TinyPNG/Squoosh si se pasan.
- **Nombres:** exactamente los de la ficha, en minúsculas. Si la extensión cambia (p. ej. `.webp` en vez de `.jpg`), no pasa nada.

## Cómo entregar los archivos

1. **Desde GitHub (sin instalar nada):** en el repo, entra en la carpeta `assets/art/<módulo>/`
   → **Add file → Upload files** → arrastra las imágenes → **Commit changes**.
   La web de GitHub Pages se vuelve a publicar sola en 2–3 minutos.
2. **Por el chat con Claude:** adjunta las imágenes y pide "colócalas en el módulo X".

Si la carpeta aún no existe en GitHub, escribe la ruta en el nombre del archivo al subirlo
o pídele a Claude que la cree.
