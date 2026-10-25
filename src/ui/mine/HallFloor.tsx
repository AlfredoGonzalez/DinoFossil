import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { MINE_BALANCE } from '@/data/mine';
import { carrierCapacity } from '@/game/economy';
import { formatNumber } from '@/game/format';
import { getModifiers } from '@/game/modifiers';
import { useTranslation } from '@/i18n';
import { playSfx } from '@/services/audio';
import { tapFeedback } from '@/services/feedback';
import { useGameStore } from '@/store/gameStore';
import { getArt } from '../art';
import { GameText } from '../GameText';
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
import { LevelSign } from './LevelSign';

const VISITOR_SHEETS = ['sprites/visitors/a', 'sprites/visitors/b', 'sprites/visitors/c'] as const;
const VISITOR_SIZE = 52;
/** Cuadro del manager en el poste del pabellón. */
const POSTER_HEIGHT = 40;
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
 * que esperan en taquilla y cada visita cobra una parte (más con más nivel). Distribución (el fondo
 * museum/hall se escala con el ancho, así que las posiciones van en % del ancho):
 * - sobre el pasto, al ~18 %, la taquilla con el pterodáctilo (HallHost), que vuela a cada toque;
 * - arriba, junto a su cabeza, el dinero en taquilla y, durante la venta, su barra;
 * - el cuadro del manager, con su clavo, en el poste izquierdo del pabellón (~46 %);
 * - arriba a la derecha, sobre el cielo, la tablita de nivel (como en las demás plantas);
 * - los visitantes pasean por delante de todo el piso.
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
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="tap-museum"
        style={styles.scene}
        onPress={() => {
          tapFeedback();
          playSfx('tap');
          // El pterodáctilo vuela con cada toque (si ya vuela, termina su vuelo); la venta
          // solo empieza si la taquilla estaba libre.
          setFlights((n) => n + 1);
          if (idle) useGameStore.getState().tap('museum');
        }}
      >
        {turbo ? <TurboGlow /> : null}
        {/* Cuadro del manager colgado del poste izquierdo del pabellón (donde el fondo trae su cartel WANTED). */}
        <View style={styles.poster}>
          <WantedPoster station="museum" active={turbo} onPick={onPickManager} height={POSTER_HEIGHT} />
        </View>
        {withHost ? (
          <HallHost flights={flights} managed={!!manager} hint={idle} style={styles.host} />
        ) : (
          <View style={styles.status}>
            <StationStatus idle={idle} progress={station.progress} color={colors.gold} />
          </View>
        )}
        {/* El dinero que espera en taquilla y, durante la venta, su avance. */}
        <View pointerEvents="none" style={styles.till}>
          <View style={styles.stock}>
            <ResourceIcon kind="coins" size={14} />
            <GameText size={12} weight="black" color={colors.text}>
              {formatNumber(waiting)}
            </GameText>
          </View>
          {withHost && station.running ? <ProgressBar value={station.progress} height={6} color={colors.gold} /> : null}
        </View>
        {/* Los visitantes cruzan todo el piso, por delante. */}
        <View pointerEvents="none" style={styles.walkway} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
          {/* Siempre hay alguien paseando: si solo saliera durante la venta, desaparecería a media sala. */}
          {width > 0 ? <Visitor width={width} /> : null}
        </View>
      </Pressable>
      <View style={styles.level}>
        <LevelSign
          station="museum"
          level={station.level}
          detail={t('mine.perCycle', { value: formatNumber(capacity * coinValue) })}
          post={false}
          onPress={onUpgrade}
        />
      </View>
    </Floor>
  );
}

const styles = StyleSheet.create({
  scene: { flex: 1, alignSelf: 'stretch' },
  // La taquilla, sobre el pasto, entre los árboles y el pabellón (como en el boceto).
  host: { position: 'absolute', left: '18%', bottom: 12 },
  status: { position: 'absolute', left: 8, right: 8, bottom: 6 },
  // Junto a la cabeza del pterodáctilo.
  till: { position: 'absolute', left: '18%', marginLeft: HALL_HOST_WIDTH + 2, top: 6, width: 84, gap: 3 },
  stock: { flexDirection: 'row', alignSelf: 'flex-start', alignItems: 'center', gap: 2, backgroundColor: 'rgba(255,255,255,0.75)', borderRadius: 8, paddingHorizontal: 5 },
  // Centrado en el cartel WANTED del fondo (al 45.7 % del ancho del arte y 53 % de su alto).
  poster: { position: 'absolute', left: '45.5%', top: 44, width: 0, alignItems: 'center' },
  // Por el sendero del fondo.
  walkway: { position: 'absolute', left: -6, right: -6, bottom: 4, height: VISITOR_SIZE },
  visitor: { position: 'absolute', bottom: 0, left: 0 },
  visitorArt: { width: 30, height: 30 },
  // Arriba a la derecha, sobre el cielo: deja ver el cartel EXIT del fondo.
  level: { position: 'absolute', right: 8, top: 4 },
});
