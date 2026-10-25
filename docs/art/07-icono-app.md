# Módulo 7 · Ícono de la app

El ícono que se ve en la pantalla de inicio del teléfono, en las tiendas y en la pestaña del
navegador. Sube los archivos a `assets/art/app-icon/` y Claude genera todas las versiones
(iOS, Android adaptativo, monocromo, splash y favicon).

## Archivos

| Archivo | Obligatorio | Tamaño | Contenido |
|---|---|---|---|
| `icon.png` | sí | **1024 × 1024** | El ícono completo: personaje + fondo, **cuadrado y sin transparencia**. Sin esquinas redondeadas (cada sistema las recorta a su forma). |
| `foreground.png` | recomendado | **1024 × 1024** | Solo el personaje/logo sobre **fondo transparente**, para el ícono adaptativo de Android. |
| `background.png` | opcional | **1024 × 1024** | Solo el fondo (cielo, color liso o patrón suave). Si falta, se usa un color liso. |

## Reglas

- **Zona segura**: lo importante (la cara del dino) dentro del **círculo central de ~66 %** del
  lienzo. Android recorta el ícono en círculo, gota o cuadrado según el teléfono.
- Formas grandes y legibles: a 48 px tiene que entenderse. Nada de texto pequeño (si lleva
  "DINO", que sea muy grande; mejor sin texto).
- Mismo estilo de fieltro que el resto del juego; contraste fuerte entre el dino y el fondo.

## Prompt sugerido

```
App icon for a cute idle game: the head and shoulders of a chubby plush T-Rex mascot made of
lime-green felt with a cream belly and visible stitched seams, big friendly eyes, holding a small
fossil bone, centered and filling about 65% of the canvas, on a soft sky-blue background with a
subtle felt texture. Square 1024×1024, no text, no rounded corners, no border, bold readable shapes.
[BIBLIA DE ESTILO]
```

Para `foreground.png`, el mismo prompt cambiando el fondo por *"on a transparent background"*
(o quitándolo con Photoroom, como con los demás recortes).

## Checklist

- [ ] `icon.png` 1024 × 1024, sin transparencia ni esquinas redondeadas.
- [ ] La cara del dino dentro del círculo central.
- [ ] Se entiende al verlo pequeñito (prueba reducirlo a 48 px).

## Entregado ✅

Se eligió la versión **sin texto** (el nombre ya aparece debajo del ícono en el teléfono y en la
tienda, y a tamaño pequeño las letras no se leen). Claude generó:
`assets/icon.png` (iOS/general), `assets/android-icon-foreground.png` (dino al 78 %, sin la nube),
`assets/android-icon-background.png` (cielo con la nube), `assets/android-icon-monochrome.png`
(temas de Android 13+) y `assets/favicon.png`. Los originales quedan en el historial de git.
