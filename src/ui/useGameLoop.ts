import { useEffect } from 'react';
import { AppState } from 'react-native';
import i18n from '@/i18n';
import { successFeedback } from '@/services/feedback';
import { playSfx } from '@/services/audio';
import { useGameStore, useHydrated } from '@/store/gameStore';
import { flushSave } from '@/store/throttledStorage';
import { useUiStore } from '@/store/uiStore';

const TICK_MS = 100;
/** Si pasa más de esto entre ticks (app pausada), se trata como tiempo offline. */
const MAX_TICK_GAP_MS = 5000;

function resume() {
  const report = useGameStore.getState().resume();
  if (report) useUiStore.getState().setOfflineReport(report);
}

/** Bucle principal: simula la mina 10 veces por segundo y gestiona el tiempo offline. */
export function useGameLoop() {
  const hydrated = useHydrated();

  useEffect(() => {
    if (!hydrated) return;
    resume();
    let last = Date.now();

    const id = setInterval(() => {
      const now = Date.now();
      const gap = now - last;
      last = now;
      if (gap > MAX_TICK_GAP_MS) {
        resume();
        return;
      }
      const events = useGameStore.getState().tick(gap / 1000);
      for (const event of events) {
        if (event.type === 'eggFound') {
          useUiStore.getState().toast(i18n.t('incubator.eggFound', { rarity: i18n.t(`rarity.${event.rarity}`) }), '🥚');
          playSfx('egg');
          successFeedback();
        }
      }
    }, TICK_MS);

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        resume();
        last = Date.now();
      } else {
        flushSave();
      }
    });

    return () => {
      clearInterval(id);
      subscription.remove();
      flushSave();
    };
  }, [hydrated]);
}
