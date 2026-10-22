# Diseño del juego y fórmulas

Todo el balance está en `src/data/` (`mine.ts`, `dinos.ts`, `eggs.ts`, `worlds.ts`, `shop.ts`).
El motor (`src/game/`) es TypeScript puro y no depende de React: se prueba con `npm test`.

## Bucle principal (Mundo 1)

En pantalla es la **Casa-Museo**: los *sótanos* son las galerías (`shaft-i`), el *laboratorio* con su
montacargas es la estación `elevator` y la *sala de exposición* es `museum`. Los nombres internos del
motor no cambian para no romper partidas guardadas.

```
Galerías (excavan fósiles) → Ascensor (sube fósiles) → Museo (vende por DinoCoins)
```

- **Sin manager**, cada estación hace **un ciclo por toque**.
- **Con un dino manager**, la estación trabaja sola, también offline.
- Cada manager tiene la habilidad **Turbo** (×2 a ×5 de velocidad según rareza, 30–90 s, recarga de 5 min).

### Galería `i` (0…9)

| Concepto | Fórmula (valores por defecto) |
|---|---|
| Producción (fósiles/s) | `1.5 · 6^i · nivel · 2^hitos` |
| Hitos ×2 | niveles 10, 25, 50, 100, 150, 200 (máx. 200) |
| Coste nivel → nivel+1 | `10 · 40^i · 1.12^(nivel-1)` |
| Coste de desbloqueo | `100 · 45^(i-1)` |
| Ciclo | `4 s · 1.5^i` (galería i: 4 s, 6 s, 9 s, 13.5 s…). La producción por segundo no cambia; las profundas dan más huesos por viaje |

### Ascensor y museo

| Concepto | Ascensor | Museo |
|---|---|---|
| Capacidad por ciclo | `25 · 1.06^(n-1) · n` | `30 · 1.06^(n-1) · n` |
| Duración del ciclo | `2 s + 0.6 s · galerías` | 4 s |
| Coste de mejora | `15 · 1.1^(n-1)` | `15 · 1.1^(n-1)` |

Comprar ×10 / ⭐ hito (los niveles justos hasta el siguiente ×2, solo sótanos) / MAX usa la serie geométrica `primero · (g^n − 1)/(g − 1)`.

### Valor de venta

`DinoCoins = fósiles · 1 · (1 + bonusColección%) · (1 + 0.1 · huellas) · (×2 si compró Ingresos ×2) · (×2 con boost de anuncio)`

## Offline

Se calcula analíticamente al volver (`src/game/offline.ts`):
`ventas = min(producción de galerías con manager, ritmo del ascensor, ritmo del museo) · tiempo`.
Tope de 2 h, más los minutos que den los dinos con bonus `offlineMinutes`. El boost ×2 solo
cuenta durante la parte del tiempo en que estaba activo. Al volver se ofrece ×2 viendo un anuncio.

## Prestigio — Huellas Antiguas

- `huellas = floor(sqrt(DinoCoins ganadas en la partida / 1e6))`
- Cada huella da +10 % de DinoCoins para siempre.
- Reinicia mina y monedas; conserva Ámbar, dinos, huevos, compras y metas cobradas.

## Huevos y colección

- Cada viaje del ascensor tiene un 2 % (+ bonus) de dar un huevo.
- Probabilidades (se muestran en la incubadora): Común 70 %, Raro 20 %, Épico 7 %, Legendario 2.5 %, Mítico 0.5 %.
- Incubación: 5 min / 30 min / 2 h / 6 h / 12 h. Acelerar cuesta 1 Ámbar por cada 6 min, o −30 min con un anuncio.
- 24 especies (8 comunes, 6 raras, 5 épicas, 3 legendarias, 2 míticas). Cada una da un bonus pasivo
  que crece con los duplicados (nivel máximo 10).

## Metas del mundo (estrellas)

Desbloquear 3, 6 y 10 galerías da ⭐ y una recompensa de Ámbar y un huevo. Aparece el modal "¡Nivel completado!".

## Monetización

Solo anuncios **con recompensa** (sin intersticiales):

| Anuncio | Recompensa |
|---|---|
| Boost | ×2 producción 4 h (acumulable hasta 12 h) |
| Bienvenida | ×2 ganancias offline |
| Incubadora | −30 min |
| Tienda | +5 Ámbar una vez al día |

Compras (IDs iguales en App Store Connect, Google Play y RevenueCat):

| ID | Tipo | Contenido |
|---|---|---|
| `starter_pack` | no consumible | 300 Ámbar + 2 huevos épicos |
| `amber_small` / `amber_medium` / `amber_large` | consumible | 100 / 550 / 1200 Ámbar |
| `double_income` | no consumible | DinoCoins ×2 permanente |
| `dino_pass` | no consumible | recompensas de anuncios sin anuncios |

> Nota: las compras se acreditan en el cliente. Antes de escalar conviene validar recibos
> en servidor (webhooks de RevenueCat) cuando exista backend.

## Números grandes

Se usan `number` de JavaScript (hasta ~1e308), suficiente para el Mundo 1. El formato
(`src/game/format.ts`) muestra K, M, B, T y después aa, ab, ac… Si en mundos futuros
la economía pasa de 1e300, migra a `break_infinity.js` dentro de `src/game/`.
