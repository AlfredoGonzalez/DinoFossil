import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { shaftCycleSeconds, shaftRate } from '@/game/economy';
import { formatNumber } from '@/game/format';
import { getModifiers } from '@/game/modifiers';
import { shaftStationId, stationSpeed } from '@/game/simulate';
import { tapFeedback } from '@/services/feedback';
import { useGameStore } from '@/store/gameStore';
import { getArt } from '../art';
import { GameText } from '../GameText';
import { IconLabel } from '../IconLabel';
import type { IconName } from '../iconNames';
import { colors } from '../theme';
import { BASKET_WIDTH, BoneBasket } from './BoneBasket';
import { Digger } from './Digger';
import { DirtMound, MOUND_CUT, MOUND_WIDTH } from './DirtMound';
import { Floor, LIFT_WIDTH } from './Floor';
import { LevelSign } from './LevelSign';
import { TurboGlow, useTurboActive } from './TurboGlow';
import { WantedPoster } from './WantedPoster';
import { TapHint } from './TapHint';
import { hasWalkerSprites, Walker, WALKER_SIZE } from './Walker';

/** El dino escarba metido en la cara derecha del montón. */
const DIG_REACH = 30;
/** Alto del cuadro del manager colgado de la viga. */
const POSTER_HEIGHT = 48;
/** Hueco entre la bolsa y el montacargas (lo justo para el contador). */
const BAG_RIGHT = 4;
/** En reposo, el dino queda delante del borde izquierdo de la bolsa. */
const HOME_RIGHT = BAG_RIGHT + BASKET_WIDTH - 12;
/** Margen interior de la planta (Floor): el montón se recorta contra la pared, no contra él. */
const FLOOR_PADDING = 6;

/**
 * Centro del cuadro del manager, en coordenadas de la escena: al 50 % del ancho de la planta,
 * entre los dos postes del fondo. La escena empieza 6 pt dentro de la planta y deja a la derecha
 * el montacargas (LIFT_WIDTH + 6), así que la planta mide la escena + 12 + LIFT_WIDTH.
 */
function posterCenter(sceneWidth: number): number {
  return (sceneWidth + 2 * FLOOR_PADDING + LIFT_WIDTH) / 2 - FLOOR_PADDING;
}

/** Tiempo de escarbado que falta (la ida y la vuelta duran ~1.3 s cada una sin Turbo). */
function digLeft(progress: number, cycleSeconds: number, speed: number): string {
  const walkFrac = Math.min(1 / 3, 4 / 3 / cycleSeconds);
  const left = Math.ceil(Math.max(0, 1 - walkFrac - progress) * (cycleSeconds / speed));
  // Formato de reloj compacto para que quepa en el anillo: 45 · 4:05 · 1h05.
  if (left < 60) return String(left);
  if (left < 3600) return `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
  return `${Math.floor(left / 3600)}h${String(Math.floor((left % 3600) / 60)).padStart(2, '0')}`;
}

/**
 * Un sótano de excavación (estación "shaft-i" del motor), de izquierda a derecha:
 * montón de tierra (con el letrero de nivel encima, al 25 % del ancho) · camino del dino (con el
 * cartel "Se busca" del manager en la pared) · dino en reposo · bolsa de huesos, pegada al
 * montacargas que se la lleva. Con el Turbo activo, el piso brilla y el cartel se balancea.
 * Los sótanos no se numeran: la tablita "Sótanos" (FloorSign) va una sola vez, sobre el primero.
 */
export function BasementFloor({ index, onUpgrade, onPickManager }: { index: number; onUpgrade: () => void; onPickManager: () => void }) {
  const station = shaftStationId(index);
  const shaft = useGameStore((s) => s.game.mine.shafts[index]);
  const manager = useGameStore((s) => s.game.managers[station]);
  const rate = useGameStore((s) => {
    const sh = s.game.mine.shafts[index];
    const now = Date.now();
    return sh ? shaftRate(index, sh.level) * getModifiers(s.game, now).shaftSpeed * stationSpeed(s.game, station, now) : 0;
  });
  const speed = useGameStore((s) => stationSpeed(s.game, station, Date.now()));
  const turbo = useTurboActive(station);
  const [sceneWidth, setSceneWidth] = useState(0);
  if (!shaft) return null;
  const cycleSeconds = shaftCycleSeconds(index);
  const idle = !manager && !shaft.running;
  // Cada sótano es un poco más oscuro que el anterior: se nota la profundidad.
  const shade = Math.min(index * 6, 40);

  return (
    <Floor art={getArt('museum/basement')} color={`rgb(${110 - shade}, ${72 - shade}, ${42 - shade / 2})`} floorColor="#3B2414" withLift>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`tap-${station}`}
        style={styles.scene}
        onLayout={(e) => setSceneWidth(e.nativeEvent.layout.width)}
        onPress={() => {
          if (!idle) return;
          tapFeedback();
          useGameStore.getState().tap(station);
        }}
      >
        {turbo ? <TurboGlow /> : null}
        {/* En la pared, detrás del camino del dino (el dino no captura toques). */}
        <View style={[styles.poster, { left: posterCenter(sceneWidth) }]}>
          <WantedPoster station={station} active={turbo} onPick={onPickManager} height={POSTER_HEIGHT} />
        </View>
        <DirtMound style={styles.mound} />
        <BoneBasket amount={shaft.deposit} style={styles.basket} />
        {hasWalkerSprites() ? (
          <Walker
            running={shaft.running}
            progress={shaft.progress}
            managed={!!manager}
            speed={speed}
            cycleSeconds={cycleSeconds}
            timerLabel={digLeft(shaft.progress, cycleSeconds, speed)}
            style={styles.walk}
          />
        ) : (
          <View style={styles.home}>
            <Digger dinoId={manager} running={shaft.running} />
          </View>
        )}
        {idle ? <TapHint style={styles.hint} /> : null}
      </Pressable>
      {/* Fuera de la escena: se centra en el 25 % del ancho de la planta, a medio camino entre
          la pared y la tablita "Sótanos" (que va al centro), dejando ver el hueso del montón. */}
      <View style={styles.level}>
        <LevelSign station={station} level={shaft.level} detail={`${formatNumber(rate)}/s`} onPress={onUpgrade} />
      </View>
    </Floor>
  );
}

/** Tablita con el nombre de un grupo de plantas, centrada sobre la unión entre dos plantas. */
export function FloorSign({ icon, label, top }: { icon: IconName; label: string; top: number }) {
  return (
    <View pointerEvents="none" style={[styles.signRow, { top }]}>
      <View style={styles.sign}>
        <IconLabel icon={icon} size={14}>
          <GameText size={12} weight="black" color={colors.textLight} outline>
            {label}
          </GameText>
        </IconLabel>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scene: { flex: 1, alignSelf: 'stretch' },
  mound: { position: 'absolute', left: -(MOUND_CUT + FLOOR_PADDING), bottom: 0 },
  // Ancho 0 y centrado: el letrero queda centrado justo sobre el 25 %.
  level: { position: 'absolute', left: '25%', top: 2, width: 0, alignItems: 'center' },
  basket: { position: 'absolute', right: BAG_RIGHT, bottom: 0 },
  // Cuadro del manager con el clavo sobre la viga horizontal del fondo (el centro lo da posterCenter).
  poster: { position: 'absolute', top: 26, width: 0, alignItems: 'center' },
  walk: { position: 'absolute', left: MOUND_WIDTH - MOUND_CUT - FLOOR_PADDING - DIG_REACH, right: HOME_RIGHT, bottom: 0 },
  home: { position: 'absolute', right: HOME_RIGHT, bottom: 0 },
  // Manita centrada sobre la cabeza del dino en reposo.
  hint: { position: 'absolute', right: HOME_RIGHT + WALKER_SIZE / 2 - 14, bottom: WALKER_SIZE - 6 },
  signRow: { position: 'absolute', left: 0, right: 0, alignItems: 'center', zIndex: 2 },
  sign: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: colors.wood,
    borderWidth: 2,
    borderColor: colors.woodDark,
  },
});
