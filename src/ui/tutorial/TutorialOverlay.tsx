import { usePathname } from 'expo-router';
import { useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Ellipse, Path } from 'react-native-svg';
import { currentTutorialStep, TUTORIAL_KIND, type TutorialStep } from '@/game/tutorial';
import { useTranslation } from '@/i18n';
import { tapFeedback } from '@/services/feedback';
import { useGameStore } from '@/store/gameStore';
import { useUiStore, type Rect } from '@/store/uiStore';
import { GameText } from '../GameText';
import { colors, radius } from '../theme';
import type { TutorialTargetId } from './TutorialAnchor';

/** Qué resalta cada paso (los `wait` e `inline` no llevan círculo; "eggFound" y "done", tampoco). */
const TUTORIAL_TARGET: Partial<Record<TutorialStep, TutorialTargetId>> = {
  dig: 'shaft-dino',
  bag: 'shaft-bag',
  lift: 'lab-worker',
  collect: 'hall-host',
  upgrade: 'shaft-level',
  eggDig: 'shaft-dino',
  goEggs: 'nav-incubator',
  incubate: 'incubate-common',
  speedUp: 'speed-up',
  hatch: 'hatch',
  goDinos: 'nav-dinos',
  openDino: 'dino-trex',
  manager: 'shaft-poster',
  turbo: 'shaft-turbo',
};
/** Pantallas del juego donde corre el tutorial (no en la carga ni en Ajustes). */
const GAME_ROUTES = ['/mine', '/incubator', '/collection'];
/** Hueco alrededor de lo resaltado: círculo si es casi cuadrado, óvalo si es alargado. */
function holeFor(target: Rect, root: Rect) {
  const cx = target.x - root.x + target.width / 2;
  const cy = target.y - root.y + target.height / 2;
  const rx = target.width / 2 + 14;
  const ry = target.height / 2 + 14;
  if (Math.max(rx, ry) / Math.min(rx, ry) < 1.5) {
    const r = Math.max(target.width, target.height) / 2 + 12;
    return { cx, cy, rx: r, ry: r };
  }
  // Óvalo algo mayor que el botón (las esquinas redondeadas quedan casi dentro).
  return { cx, cy, rx: (target.width / 2) * 1.2 + 10, ry: (target.height / 2) * 1.35 + 8 };
}

const DIM = 'rgba(20, 12, 4, 0.6)';
const BUBBLE_W = 250;
const GAP = 14;

/**
 * Capa del tutorial, encima de todas las pantallas del juego (va en el layout raíz): oscurece la pantalla y deja un círculo despejado sobre
 * lo que hay que tocar, con un globito de texto corto. Fuera del círculo no se puede tocar nada
 * (cuatro bloques alrededor); dentro, el toque llega al juego. En los pasos de "toca para
 * seguir" toda la pantalla avanza; en los de espera no se puede tocar nada (deja ver la
 * animación). Botón "Saltar" arriba a la derecha.
 */
export function TutorialOverlay() {
  const { t } = useTranslation();
  const step = useGameStore((s) => currentTutorialStep(s.game));
  const targets = useUiStore((s) => s.tutorialTargets);
  const rootRef = useRef<View>(null);
  const [root, setRoot] = useState<Rect | null>(null);
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  if (!step || TUTORIAL_KIND[step] === 'inline' || !GAME_ROUTES.includes(pathname)) return null;
  const isWait = TUTORIAL_KIND[step] === 'wait';
  const targetId = TUTORIAL_TARGET[step];
  const target = targetId ? targets[targetId] : undefined;
  if (targetId && !target) return null;
  const isContinue = TUTORIAL_KIND[step] === 'continue';

  const measureRoot = () => rootRef.current?.measureInWindow((x, y, width, height) => setRoot({ x, y, width, height }));

  const W = root?.width ?? 0;
  const H = root?.height ?? 0;
  // Hueco en coordenadas de la capa: un círculo, o un óvalo si lo resaltado es ancho (un botón largo).
  const hole = target && root ? holeFor(target, root) : null;
  const dimPath = hole
    ? `M0 0 H${W} V${H} H0 Z M${hole.cx - hole.rx} ${hole.cy} a${hole.rx} ${hole.ry} 0 1 0 ${hole.rx * 2} 0 a${hole.rx} ${hole.ry} 0 1 0 ${-hole.rx * 2} 0 Z`
    : `M0 0 H${W} V${H} H0 Z`;

  // Globito arriba o abajo del círculo, según dónde haya más sitio.
  const below = hole ? hole.cy < H / 2 : true;
  const bubbleLeft = Math.min(Math.max(12, (hole?.cx ?? W / 2) - BUBBLE_W / 2), Math.max(12, W - BUBBLE_W - 12));
  const bubblePos = hole ? (below ? { top: hole.cy + hole.ry + GAP } : { bottom: H - (hole.cy - hole.ry) + GAP }) : { top: H / 2 - 40 };

  const next = () => {
    tapFeedback();
    useGameStore.getState().continueTutorial();
  };

  return (
    <View ref={rootRef} pointerEvents="box-none" style={StyleSheet.absoluteFill} onLayout={measureRoot}>
      {root ? (
        <>
          {isWait ? <View style={StyleSheet.absoluteFill} /> : null}
          {isWait ? null : (
            <Svg pointerEvents="none" width={W} height={H} style={StyleSheet.absoluteFill}>
              <Path d={dimPath} fill={DIM} fillRule="evenodd" />
              {hole ? <Ellipse cx={hole.cx} cy={hole.cy} rx={hole.rx} ry={hole.ry} stroke="#FFF3D6" strokeWidth={3} strokeDasharray="8 6" fill="none" /> : null}
            </Svg>
          )}
          {isWait ? null : isContinue ? (
            <Pressable accessibilityRole="button" accessibilityLabel="tutorial-continue" style={StyleSheet.absoluteFill} onPress={next} />
          ) : hole ? (
            // Bloquea todo menos el cuadrado del círculo.
            <>
              <View
                style={[
                  styles.block,
                  {
                    left: 0,
                    right: 0,
                    top: 0,
                    height: Math.max(0, hole.cy - hole.ry),
                  },
                ]}
              />
              <View style={[styles.block, { left: 0, right: 0, top: hole.cy + hole.ry, bottom: 0 }]} />
              <View
                style={[
                  styles.block,
                  {
                    left: 0,
                    width: Math.max(0, hole.cx - hole.rx),
                    top: hole.cy - hole.ry,
                    height: hole.ry * 2,
                  },
                ]}
              />
              <View
                style={[
                  styles.block,
                  {
                    left: hole.cx + hole.rx,
                    right: 0,
                    top: hole.cy - hole.ry,
                    height: hole.ry * 2,
                  },
                ]}
              />
            </>
          ) : null}
          {isWait ? null : (
            <View pointerEvents="none" style={[styles.bubble, { left: bubbleLeft }, bubblePos]}>
              <GameText size={14} weight="black" center>
                {t(`tutorial.${step}`)}
              </GameText>
              {isContinue ? (
                <GameText size={11} weight="bold" color={colors.woodDark} center>
                  {t('tutorial.tapToContinue')}
                </GameText>
              ) : null}
            </View>
          )}
          <Pressable accessibilityRole="button" accessibilityLabel="tutorial-skip" style={[styles.skip, { top: insets.top + 8 }]} onPress={() => useGameStore.getState().skipTutorial()}>
            <GameText size={12} weight="black" color={colors.textLight} outline>
              {t('tutorial.skip')}
            </GameText>
          </Pressable>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  // Capta el toque y no hace nada: fuera del círculo no se juega durante el paso.
  block: { position: 'absolute' },
  bubble: {
    position: 'absolute',
    width: BUBBLE_W,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 2,
    borderRadius: radius.md,
    backgroundColor: colors.parchment,
    borderWidth: 3,
    borderColor: colors.woodDark,
  },
  skip: {
    position: 'absolute',
    top: 8,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
});
