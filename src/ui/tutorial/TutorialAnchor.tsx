import { useEffect, useRef } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useGameStore } from '@/store/gameStore';
import { useUiStore } from '@/store/uiStore';

/** Ids de las zonas que resalta el tutorial (ver TUTORIAL_TARGET en TutorialOverlay). */
export type TutorialTargetId = 'shaft-dino' | 'shaft-bag' | 'shaft-level' | 'shaft-poster' | 'lab-worker' | 'hall-host';

/**
 * Marca invisible (sin toques) sobre algo que el tutorial puede resaltar. Se mide en coordenadas
 * de ventana al montarse, al cambiar de tamaño y en cada paso del tutorial (el scroll queda fijo
 * mientras dura, así que la medida no se mueve).
 */
export function TutorialAnchor({ id, style }: { id: TutorialTargetId; style: StyleProp<ViewStyle> }) {
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

  return <View ref={ref} pointerEvents="none" collapsable={false} style={style} onLayout={measure} />;
}
