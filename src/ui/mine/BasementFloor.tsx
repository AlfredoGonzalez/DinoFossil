import { Pressable, StyleSheet, View } from 'react-native';
import { shaftRate } from '@/game/economy';
import { getModifiers } from '@/game/modifiers';
import { shaftStationId, stationSpeed } from '@/game/simulate';
import { useTranslation } from '@/i18n';
import { tapFeedback } from '@/services/feedback';
import { useGameStore } from '@/store/gameStore';
import { getArt } from '../art';
import { GameText } from '../GameText';
import { IconLabel } from '../IconLabel';
import { colors } from '../theme';
import { BASKET_WIDTH, BoneBasket } from './BoneBasket';
import { Digger } from './Digger';
import { DirtMound, MOUND_CUT, MOUND_WIDTH } from './DirtMound';
import { Floor, FLOOR_HEIGHT } from './Floor';
import { LevelSign } from './LevelSign';
import { BasementManager } from './BasementManager';
import { TapHint } from './TapHint';
import { hasWalkerSprites, Walker, WALKER_SIZE } from './Walker';

/** El dino escarba metido en la cara derecha del montón. */
const DIG_REACH = 30;
/** Hueco entre la bolsa y el montacargas (lo justo para el contador). */
const BAG_RIGHT = 4;
/** En reposo, el dino queda delante del borde izquierdo de la bolsa. */
const HOME_RIGHT = BAG_RIGHT + BASKET_WIDTH - 12;
/** Margen interior de la planta (Floor): el montón se recorta contra la pared, no contra él. */
const FLOOR_PADDING = 6;

/**
 * Un sótano de excavación (estación "shaft-i" del motor), de izquierda a derecha:
 * montón de tierra (con el letrero de nivel encima, al 25 % del ancho) · camino del dino · manager · dino en reposo ·
 * bolsa de huesos,
 * pegada al montacargas que se la lleva. Los sótanos no se numeran: el letrero "Sótanos"
 * va una sola vez, entre el laboratorio y el primero (BasementsSign).
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
  if (!shaft) return null;
  const idle = !manager && !shaft.running;
  // Cada sótano es un poco más oscuro que el anterior: se nota la profundidad.
  const shade = Math.min(index * 6, 40);

  return (
    <Floor art={getArt('museum/basement')} color={`rgb(${110 - shade}, ${72 - shade}, ${42 - shade / 2})`} floorColor="#3B2414" withLift>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`tap-${station}`}
        style={styles.scene}
        onPress={() => {
          if (!idle) return;
          tapFeedback();
          useGameStore.getState().tap(station);
        }}
      >
        <DirtMound style={styles.mound} />
        <View style={styles.manager}>
          <BasementManager station={station} onPick={onPickManager} />
        </View>
        <BoneBasket amount={shaft.deposit} style={styles.basket} />
        {hasWalkerSprites() ? (
          <Walker running={shaft.running} progress={shaft.progress} managed={!!manager} speed={speed} style={styles.walk} />
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
        <LevelSign station={station} level={shaft.level} rate={rate} onPress={onUpgrade} />
      </View>
    </Floor>
  );
}

/** Tablita "Sótanos" centrada sobre la unión entre el laboratorio y el primer sótano. */
export function BasementsSign() {
  const { t } = useTranslation();
  return (
    <View pointerEvents="none" style={styles.signRow}>
      <View style={styles.sign}>
        <IconLabel icon="station-basement" size={14}>
          <GameText size={12} weight="black" color={colors.textLight} outline>
            {t('mine.basements')}
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
  // A la izquierda del dino en reposo: siempre a la vista y tocable (el dino no captura toques).
  manager: { position: 'absolute', right: HOME_RIGHT + WALKER_SIZE - 6, bottom: 0 },
  walk: { position: 'absolute', left: MOUND_WIDTH - MOUND_CUT - FLOOR_PADDING - DIG_REACH, right: HOME_RIGHT, bottom: 0 },
  home: { position: 'absolute', right: HOME_RIGHT, bottom: 0 },
  // Manita centrada sobre la cabeza del dino en reposo; el globo "¡Toca!" queda a su izquierda.
  hint: { position: 'absolute', right: HOME_RIGHT + WALKER_SIZE / 2 - 14, bottom: WALKER_SIZE - 6 },
  signRow: { position: 'absolute', left: 0, right: 0, top: FLOOR_HEIGHT - 14, alignItems: 'center', zIndex: 2 },
  sign: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: colors.wood,
    borderWidth: 2,
    borderColor: colors.woodDark,
  },
});
