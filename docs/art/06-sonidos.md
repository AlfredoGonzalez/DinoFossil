# Módulo 6 · Sonidos básicos

Sube cada sonido a `assets/sfx/` con el **nombre exacto** de la tabla. El juego lo detecta solo
(no hay que tocar código) y se respeta el interruptor "Sonido" de Ajustes. Si falta un archivo,
ese momento simplemente queda en silencio.

## Formato

- **MP3** (o M4A / WAV / OGG), mono, 44.1 kHz.
- **Cortos**: 0.1–0.8 s (el despegue hasta ~1.2 s). Sin silencio al principio: debe sonar en el
  instante del toque.
- Volumen parejo entre todos (normalízalos a ~-14 LUFS o "a oído" con el mismo nivel).
- ≤ 50 KB cada uno.
- Tono: **tierno y suave**, de juego infantil de fieltro. Nada metálico ni agresivo.

## Lista (prioridad del MVP)

| Archivo | Cuándo suena | Qué buscar |
|---|---|---|
| `tap.mp3` | Al tocar un sótano o la sala | "pop", "soft click", "bubble pop" corto |
| `coins.mp3` | Cada cobro en la taquilla | "coin", "coins jingle" suave (2–3 monedas) |
| `upgrade.mp3` | Al subir de nivel o abrir un sótano | "level up", "power up" corto y alegre |
| `fly.mp3` | El pterodáctilo despega | "wing flap", "flutter" (2–3 aleteos) |
| `lift.mp3` | El laboratorista sube la caja | "rope pull", "wooden creak", "pulley" |
| `egg.mp3` | Aparece un huevo en los sótanos | "sparkle", "twinkle", "magic chime" |
| `hatch.mp3` | Nace un dino en la incubadora | "egg crack" + "cute chirp" |
| `prestige.mp3` | Prestigio (huellas) | "fanfare" corta, "achievement" |

## Dónde conseguirlos (gratis y aptos para un juego comercial)

1. **Kenney.nl → Assets → Audio** (licencia CC0, sin atribución). Los paquetes *Interface Sounds*,
   *UI Audio*, *Impact Sounds* y *Casino Audio* (monedas) cubren casi toda la lista.
2. **Pixabay → Sound Effects** (licencia de Pixabay: uso comercial sin atribución). Busca en inglés:
   "coin", "pop", "wing flap", "level up", "egg crack".
3. **Freesound.org**: filtra por licencia **Creative Commons 0**. Las demás licencias (p. ej. CC-BY)
   piden poner el crédito del autor; anótalo si usas alguno.
4. **Generados con IA** (p. ej. ElevenLabs Sound Effects): escribe "short cute soft pop sound for a
   kids game" y descarga el MP3. Revisa que su plan permita uso comercial.

Evita sonidos de webs que no digan claramente su licencia.

## Checklist

- [ ] Nombres exactos de la tabla, en minúsculas, dentro de `assets/sfx/`.
- [ ] Sin silencio inicial y con volumen parecido entre ellos.
- [ ] Licencia comercial (CC0, Pixabay o anotado el crédito).
