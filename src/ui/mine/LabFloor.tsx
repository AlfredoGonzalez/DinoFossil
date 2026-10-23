import { Pressable, StyleSheet, View } from 'react-native';
import { carrierCapacity, elevatorTripSeconds } from '@/game/economy';
import { formatNumber } from '@/game/format';
import { getModifiers } from '@/game/modifiers';
import { stationSpeed } from '@/game/simulate';
import { useTranslation } from '@/i18n';
import { tapFeedback } from '@/services/feedback';
import { useGameStore } from '@/store/gameStore';
import { getArt } from '../art';
import { ProgressBar } from '../ProgressBar';
import { colors } from '../theme';
import { Digger } from './Digger';
import { Floor, FLOOR_SCENE_HEIGHT } from './Floor';
import { hasLabWorkerSprites, LAB_WORKER_SIZE, LabWorker } from './LabWorker';
import { LevelSign } from './LevelSign';
import { TapHint } from './TapHint';
import { TurboGlow, useTurboActive } from './TurboGlow';
import { WantedPoster } from './WantedPoster';

const POSTER_HEIGHT = 48;

/**
 * Planta del laboratorio. En el motor es la estación "elevator": sube la caja de los sótanos
 * por el montacargas y deja los huesos limpios para la sala. De izquierda a derecha: letrero de
 * nivel · cuadro del manager colgado de la viga · el laboratorista, a la derecha
 * junto al montacargas, que sube la caja tirando de la cuerda de la polea (LabWorker).
 * Su nombre va en la tablita "Laboratorio" sobre la unión con la sala (FloorSign).
 */
export function LabFloor({ onUpgrade, onPickManager }: { onUpgrade: () => void; onPickManager: () => void }) {
  const { t } = useTranslation();
  const station = useGameStore((s) => s.game.mine.elevator);
  const manager = useGameStore((s) => s.game.managers.elevator);
  const capacity = useGameStore((s) => carrierCapacity('elevator', s.game.mine.elevator.level) * getModifiers(s.game, Date.now()).elevatorCapacity);
  const idle = !manager && !station.running;
  const turbo = useTurboActive('elevator');
  const shafts = useGameStore((s) => s.game.mine.shafts.length);
  const speed = useGameStore((s) => stationSpeed(s.game, 'elevator', Date.now()));

  return (
    <Floor art={getArt('museum/lab')} color="#D3EAF0" floorColor="#6FB553" withLift>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="tap-elevator"
        style={styles.scene}
        onPress={() => {
          if (!idle) return;
          tapFeedback();
          useGameStore.getState().tap('elevator');
        }}
      >
        {turbo ? <TurboGlow /> : null}
        <View style={styles.level}>
          <LevelSign
            station="elevator"
            level={station.level}
            detail={t('mine.perTrip', { value: formatNumber(capacity) })}
            post={false}
            onPress={onUpgrade}
          />
        </View>
        <View style={styles.poster}>
          <WantedPoster station="elevator" active={turbo} onPick={onPickManager} height={POSTER_HEIGHT} />
        </View>
        {hasLabWorkerSprites() ? (
          <View style={styles.labWorker}>
            <LabWorker
              running={station.running}
              progress={station.progress}
              managed={!!manager}
              cycleMs={(elevatorTripSeconds(shafts) * 1000) / speed}
              sceneHeight={FLOOR_SCENE_HEIGHT}
            />
            {idle ? <TapHint style={styles.workerHint} /> : null}
          </View>
        ) : (
          <View style={styles.worker}>
            {idle ? <TapHint style={styles.hint} /> : null}
            <Digger dinoId={manager} running={station.running} tool="🖌️" />
          </View>
        )}
        {station.running && !hasLabWorkerSprites() ? (
          <View style={styles.progress}>
            <ProgressBar value={station.progress} height={6} color={colors.blue} />
          </View>
        ) : null}
      </Pressable>
    </Floor>
  );
}

const styles = StyleSheet.create({
  scene: { flex: 1, alignSelf: 'stretch' },
  level: { position: 'absolute', left: 0, top: 4 },
  // Junto al letrero, fuera del camino del laboratorista, con el clavo sobre la viga horizontal del fondo.
  poster: { position: 'absolute', left: 110, top: 26, width: 0, alignItems: 'center' },
  worker: { position: 'absolute', right: 0, bottom: 2, alignItems: 'center' },
  hint: { marginBottom: -4 },
  labWorker: { position: 'absolute', right: 0, bottom: 2 },
  // Manita sobre la cabeza del laboratorista en su sitio (casi rozando la viga del techo).
  workerHint: { position: 'absolute', right: LAB_WORKER_SIZE * 0.4 - 14, bottom: LAB_WORKER_SIZE * 0.82 },
  progress: { position: 'absolute', left: '30%', right: '30%', bottom: 4 },
});
