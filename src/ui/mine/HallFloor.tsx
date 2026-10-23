import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { MINE_BALANCE } from '@/data/mine';
import { carrierCapacity } from '@/game/economy';
import { formatNumber } from '@/game/format';
import { getModifiers } from '@/game/modifiers';
import { useTranslation } from '@/i18n';
import { tapFeedback } from '@/services/feedback';
import { useGameStore } from '@/store/gameStore';
import { getArt } from '../art';
import { GameText } from '../GameText';
import { IconLabel } from '../IconLabel';
import { ResourceIcon } from '../Icons';
import { ProgressBar } from '../ProgressBar';
import { getSheet } from '../spriteSheets';
import { SpriteSheet } from '../SpriteSheet';
import { colors } from '../theme';
import { Floor } from './Floor';
import { HALL_HOST_WIDTH, HallHost, hasHallHostSprites } from './HallHost';
import { TurboGlow, useTurboActive } from './TurboGlow';
import { WantedPoster } from './WantedPoster';
import { StationStatus } from './StationStatus';
import { UpgradeChip } from './UpgradeChip';

const VISITOR_SHEETS = ['sprites/visitors/a', 'sprites/visitors/b', 'sprites/visitors/c'] as const;
const VISITOR_SIZE = 52;
const LAP_MS = 9000;

/** Fracción de la vuelta que tarda en aparecer (al entrar) y en desvanecerse (al llegar a la derecha). */
const FADE = 0.12;

/**
 * Visitante que cruza todo el piso de la sala de izquierda a derecha: aparece poco a poco
 * (de transparente a sólido), camina y, al acercarse a la derecha, se desvanece. En cada vuelta entra uno de los
 * visitantes animados al azar (sprites/visitors/a|b|c); si no hay ninguno, el arte fijo
 * museum/visitor o un emoji.
 */
function Visitor({ width }: { width: number }) {
  const x = useSharedValue(0);
  const [lap, setLap] = useState({ n: 0, pick: 0 });
  const sheets = VISITOR_SHEETS.map((key) => getSheet(key)).filter((sheet) => sheet !== undefined);
  const sheet = sheets.length ? sheets[lap.pick % sheets.length] : undefined;

  useEffect(() => {
    x.value = 0;
    x.value = withTiming(1, { duration: LAP_MS, easing: Easing.linear });
    // Al terminar la vuelta entra otro visitante, elegido al azar.
    const id = setTimeout(() => setLap((l) => ({ n: l.n + 1, pick: Math.floor(Math.random() * VISITOR_SHEETS.length) })), LAP_MS);
    return () => clearTimeout(id);
  }, [lap.n, x]);

  const style = useAnimatedStyle(() => ({
    opacity: interpolate(x.value, [0, FADE, 1 - FADE, 1], [0, 1, 1, 0]),
    transform: [{ translateX: x.value * (width - VISITOR_SIZE) }],
  }));
  const art = getArt('museum/visitor');
  return (
    <Animated.View pointerEvents="none" style={[styles.visitor, style]}>
      {sheet ? (
        <SpriteSheet sheet={sheet} size={VISITOR_SIZE} />
      ) : art ? (
        <Image source={art} style={styles.visitorArt} resizeMode="contain" />
      ) : (
        <GameText size={22}>🧒</GameText>
      )}
    </Animated.View>
  );
}

/**
 * Planta alta: la sala de exposición al aire libre (estación "museum" del motor). Los fósiles
 * limpios se convierten aquí en dinero de entradas y recuerdos: el contador muestra las monedas
 * que esperan en taquilla y cada visita cobra una parte (más con más nivel). De izquierda a
 * derecha: visitantes paseando · cuadro del manager en su tripié · taquilla con el pterodáctilo
 * (HallHost), que vuela a cada toque · columna del nivel.
 */
export function HallFloor({ onUpgrade, onPickManager }: { onUpgrade: () => void; onPickManager: () => void }) {
  const { t } = useTranslation();
  const [width, setWidth] = useState(0);
  const [flights, setFlights] = useState(0);
  const station = useGameStore((s) => s.game.mine.museum);
  const manager = useGameStore((s) => s.game.managers.museum);
  const coinValue = useGameStore((s) => MINE_BALANCE.coinsPerFossil * getModifiers(s.game, Date.now()).coinValue);
  const waiting = useGameStore((s) => s.game.mine.surface) * coinValue;
  const capacity = useGameStore((s) => carrierCapacity('museum', s.game.mine.museum.level) * getModifiers(s.game, Date.now()).museumCapacity);
  const idle = !manager && !station.running;
  const turbo = useTurboActive('museum');
  const withHost = hasHallHostSprites();

  return (
    <Floor art={getArt('museum/hall')} color="#BFE3A8" floorColor="#A4693B">
      {turbo ? <TurboGlow /> : null}
      {/* Capa del ancho de todo el piso (también por delante de la columna del nivel). */}
      <View pointerEvents="none" style={styles.walkway} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
        {/* Siempre hay alguien paseando: si solo saliera durante la venta, desaparecería a media sala. */}
        {width > 0 ? <Visitor width={width} /> : null}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="tap-museum"
        style={styles.body}
        onPress={() => {
          tapFeedback();
          // El pterodáctilo vuela con cada toque (si ya vuela, termina su vuelo); la venta
          // solo empieza si la taquilla estaba libre.
          setFlights((n) => n + 1);
          if (idle) useGameStore.getState().tap('museum');
        }}
      >
        {/* Arriba: el dinero que espera en taquilla. */}
        <View style={styles.titleRow}>
          <View style={styles.stock}>
            <ResourceIcon kind="coins" size={14} />
            <GameText size={12} weight="black" color={colors.text}>
              {formatNumber(waiting)}
            </GameText>
          </View>
        </View>
        {withHost ? (
          <HallHost flights={flights} managed={!!manager} hint={idle} style={styles.host} />
        ) : null}
        {/* Cuadro del manager sobre un tripié, en el suelo, junto a la taquilla. */}
        <View style={[styles.easel, withHost && styles.easelBesideDesk]}>
          <WantedPoster station="museum" variant="easel" active={turbo} onPick={onPickManager} height={60} />
        </View>
        {withHost ? (
          station.running ? (
            <View style={styles.progress}>
              <ProgressBar value={station.progress} height={8} color={colors.gold} />
            </View>
          ) : null
        ) : (
          <StationStatus idle={idle} progress={station.progress} color={colors.gold} />
        )}
      </Pressable>
      <View style={styles.side}>
        <UpgradeChip station="museum" level={station.level} onPress={onUpgrade} />
        <IconLabel icon="coins" size={12}>
          <GameText size={10} weight="black" color={colors.textLight} outline center>
            {t('mine.perCycle', { value: formatNumber(capacity * coinValue) })}
          </GameText>
        </IconLabel>
      </View>
    </Floor>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, height: '86%', justifyContent: 'space-between', paddingVertical: 4, paddingLeft: 6 },
  // A la izquierda: a la derecha asoma la cabeza del pterodáctilo.
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
  stock: { flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 8, paddingHorizontal: 5 },
  // Taquilla pegada a la columna del nivel; el cuerpo mide el 86 % del piso, centrado.
  host: { position: 'absolute', right: 0, bottom: -6, zIndex: 1 },
  walkway: { position: 'absolute', left: 0, right: 0, bottom: 4, height: VISITOR_SIZE, zIndex: 1 },
  visitor: { position: 'absolute', bottom: 0, left: 0 },
  easel: { position: 'absolute', right: 0, bottom: 0 },
  easelBesideDesk: { right: HALL_HOST_WIDTH + 2 },
  // La barra de la venta, a la izquierda de la taquilla.
  progress: { marginRight: HALL_HOST_WIDTH + 40 },
  visitorArt: { width: 30, height: 30 },
  side: { alignItems: 'center', gap: 3, width: 70 },
});
