import { useEffect, useRef, type ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useGameStore } from '@/store/gameStore';
import { useUiStore } from '@/store/uiStore';

/** Ids de las zonas que resalta el tutorial (ver TUTORIAL_TARGET en TutorialOverlay). */
export type TutorialTargetId =
  | 'shaft-dino'
  | 'shaft-bag'
  | 'shaft-level'
  | 'shaft-poster'
  | 'shaft-turbo'
  | 'lab-worker'
  | 'hall-host'
  | 'nav-incubator'
  | 'nav-dinos'
  | 'incubate-common'
  | 'speed-up'
  | 'hatch'
  | 'dino-trex';

/**
 * Mide en coordenadas de ventana la vista `ref` para el tutorial: al montarse, al cambiar de
 * tamaño y en cada paso (el scroll de la casa queda fijo mientras dura). Al desmontarse borra
 * la medida, para no resaltar algo de otra pantalla.
 */
function useTutorialTarget(id: TutorialTargetId) {
  const ref = useRef<View>(null);
  const step = useGameStore((s) => s.game.tutorialStep);

  const measure = () => {
    ref.current?.measureInWindow((x, y, width, height) => {
      if (width > 0) useUiStore.getState().setTutorialTarget(id, { x, y, width, height });
    });
  };

  useEffect(() => {
    // Tras el render del paso nuevo (y del scroll arriba).
    const timer = setTimeout(measure, 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  useEffect(() => () => useUiStore.getState().clearTutorialTarget(id), [id]);

  return { ref, measure };
}

/** Marca invisible (sin toques) sobre algo que el tutorial puede resaltar. */
export function TutorialAnchor({ id, style }: { id: TutorialTargetId; style: StyleProp<ViewStyle> }) {
  const { ref, measure } = useTutorialTarget(id);
  return <View ref={ref} pointerEvents="none" collapsable={false} style={style} onLayout={measure} />;
}

/** Envuelve un elemento (botón, pestaña…) para que el tutorial pueda resaltarlo. */
export function TutorialSpot({ id, style, children }: { id: TutorialTargetId; style?: StyleProp<ViewStyle>; children: ReactNode }) {
  const { ref, measure } = useTutorialTarget(id);
  return (
    <View ref={ref} collapsable={false} style={style} onLayout={measure}>
      {children}
    </View>
  );
}
