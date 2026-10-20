import { Pressable, StyleSheet, View } from 'react-native';
import { shaftRate } from '@/game/economy';
import { formatNumber } from '@/game/format';
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
import { DirtMound, MOUND_WIDTH } from './DirtMound';
import { Floor } from './Floor';
import { ManagerSlot } from './ManagerSlot';
import { TapHint } from './TapHint';
import { UpgradeChip } from './UpgradeChip';
import { hasWalkerSprites, Walker, WALKER_SIZE } from './Walker';

/** El dino escarba metido un poco en el montón y descansa tapando el borde izquierdo de la canasta. */
const DIG_REACH = 34;
const BASKET_OVERLAP = 30;
const HOME_RIGHT = BASKET_WIDTH - BASKET_OVERLAP;

/**
 * Un sótano de excavación (estación "shaft-i" del motor), de izquierda a derecha:
 * montón de tierra · camino del dino · canasta de huesos (con el manager encima) · nivel.
 * Solo el primero lleva el letrero "Sótanos"; los demás no se numeran.
 */
export function BasementFloor({ index, onUpgrade, onPickManager }: { index: number; onUpgrade: () => void; onPickManager: () => void }) {
  const { t } = useTranslation();
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
        <BoneBasket amount={shaft.deposit} style={styles.basket} />
        {hasWalkerSprites() ? (
          <Walker running={shaft.running} progress={shaft.progress} managed={!!manager} speed={speed} style={styles.walk} />
        ) : (
          <View style={styles.home}>
            <Digger dinoId={manager} running={shaft.running} />
          </View>
        )}
        {index === 0 ? (
          <View pointerEvents="none" style={styles.sign}>
            <IconLabel icon="station-basement" size={14}>
              <GameText size={12} weight="black" color={colors.textLight} outline>
                {t('mine.basements')}
              </GameText>
            </IconLabel>
          </View>
        ) : null}
        <View style={styles.manager}>
          <ManagerSlot station={station} onPick={onPickManager} size={40} row />
        </View>
        {idle ? <TapHint style={styles.hint} /> : null}
      </Pressable>
      <View style={styles.side}>
        <UpgradeChip station={station} level={shaft.level} onPress={onUpgrade} />
        <GameText size={10} color={colors.textLight} weight="black" outline center>
          {formatNumber(rate)}/s
        </GameText>
      </View>
    </Floor>
  );
}

const styles = StyleSheet.create({
  scene: { flex: 1, alignSelf: 'stretch' },
  mound: { position: 'absolute', left: 0, bottom: 0 },
  basket: { position: 'absolute', right: 0, bottom: 0 },
  walk: { position: 'absolute', left: MOUND_WIDTH - DIG_REACH, right: HOME_RIGHT, bottom: 0 },
  home: { position: 'absolute', right: HOME_RIGHT, bottom: 0 },
  sign: {
    position: 'absolute',
    top: 4,
    left: 0,
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: 8,
    backgroundColor: colors.wood,
    borderWidth: 2,
    borderColor: colors.woodDark,
  },
  manager: { position: 'absolute', top: 0, right: 0 },
  // Manita centrada sobre la cabeza del dino en reposo; el globo "¡Toca!" queda a su izquierda.
  hint: { position: 'absolute', right: HOME_RIGHT + WALKER_SIZE / 2 - 14, bottom: WALKER_SIZE - 6 },
  side: { alignItems: 'center', gap: 3, width: 70 },
});
