import { Pressable, StyleSheet, View } from 'react-native';
import { carrierCapacity } from '@/game/economy';
import { formatNumber } from '@/game/format';
import { getModifiers } from '@/game/modifiers';
import { useTranslation } from '@/i18n';
import { tapFeedback } from '@/services/feedback';
import { useGameStore } from '@/store/gameStore';
import { getArt } from '../art';
import { GameText } from '../GameText';
import { GameIcon } from '../GameIcon';
import { colors } from '../theme';
import { Digger } from './Digger';
import { Floor } from './Floor';
import { TurboGlow, useTurboActive } from './TurboGlow';
import { WantedPoster } from './WantedPoster';
import { StationStatus } from './StationStatus';
import { UpgradeChip } from './UpgradeChip';

/**
 * Planta del laboratorio. En el motor es la estación "elevator": recoge los fósiles
 * de los sótanos con el montacargas y los deja limpios para la sala. Su nombre va en la
 * tablita "Laboratorio" sobre la unión con la sala (FloorSign, en la pantalla de la mina).
 */
export function LabFloor({ onUpgrade, onPickManager }: { onUpgrade: () => void; onPickManager: () => void }) {
  const { t } = useTranslation();
  const station = useGameStore((s) => s.game.mine.elevator);
  const manager = useGameStore((s) => s.game.managers.elevator);
  const capacity = useGameStore((s) => carrierCapacity('elevator', s.game.mine.elevator.level) * getModifiers(s.game, Date.now()).elevatorCapacity);
  const idle = !manager && !station.running;
  const turbo = useTurboActive('elevator');

  return (
    <Floor art={getArt('museum/lab')} color="#D3EAF0" floorColor="#6FB553" withLift>
      {turbo ? <TurboGlow /> : null}
      <WantedPoster station="elevator" active={turbo} onPick={onPickManager} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="tap-elevator"
        style={styles.body}
        onPress={() => {
          if (!idle) return;
          tapFeedback();
          useGameStore.getState().tap('elevator');
        }}
      >
        <View style={styles.bench}>
          <Digger dinoId={manager} running={station.running} tool="🖌️" />
          <GameIcon name="fossils" size={22} />
        </View>
        <StationStatus idle={idle} progress={station.progress} color={colors.blue} />
      </Pressable>
      <View style={styles.side}>
        <UpgradeChip station="elevator" level={station.level} onPress={onUpgrade} />
        <GameText size={10} weight="black" color={colors.textLight} outline center>
          {t('mine.perTrip', { value: formatNumber(capacity) })}
        </GameText>
      </View>
    </Floor>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, height: '86%', justifyContent: 'flex-end', gap: 6, paddingVertical: 4 },
  bench: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  side: { alignItems: 'center', gap: 3, width: 70 },
});
