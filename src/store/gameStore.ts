import { useSyncExternalStore } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { ProductId } from '@/data/shop';
import {
  activateAbility,
  addDino,
  applyAdBoost,
  applyOfflineProgress,
  applyPurchase,
  assignManager,
  buyEggWithAmber,
  buyUpgrade,
  claimDailyAmber,
  claimGoal,
  completeTutorialStep,
  continueTutorial,
  createInitialState,
  doPrestige,
  finishWithAmber,
  hatch,
  migrateSave,
  restorePurchases,
  skipIncubation,
  skipTutorial,
  startIncubation,
  syncTutorial,
  tutorialHatchDino,
  tapStation,
  tick,
  unlockShaft,
  type BuyAmount,
  type GameEvent,
  type GameState,
  type Rarity,
  type Settings,
  type StationId,
  type TutorialStep,
} from '@/game';
import { throttledStorage } from './throttledStorage';

/** Menos de este tiempo fuera no muestra el modal de bienvenida. */
const MIN_OFFLINE_REPORT_SECONDS = 60;

interface GameStore {
  game: GameState;
  /** Avanza la simulación. Devuelve los eventos para que la UI los muestre. */
  tick: (dt: number) => GameEvent[];
  /** Aplica las ganancias offline (al abrir la app o volver de segundo plano). */
  resume: () => { coins: number; seconds: number; capped: boolean } | null;
  tap: (station: StationId) => void;
  upgrade: (station: StationId, amount: BuyAmount) => boolean;
  unlockShaft: () => boolean;
  assignManager: (station: StationId, dinoId: string | null) => void;
  activateAbility: (station: StationId) => boolean;
  prestige: () => boolean;
  startIncubation: (rarity: Rarity) => boolean;
  hatch: () => { dinoId: string; level: number; duplicate: boolean } | null;
  skipIncubation: (seconds: number) => void;
  finishWithAmber: () => boolean;
  claimGoal: (goalId: string) => boolean;
  addCoins: (coins: number) => void;
  /** Solo modo prueba: añade una copia del dino a la colección. */
  grantDino: (dinoId: string) => void;
  adBoost: () => void;
  dailyAmber: () => boolean;
  buyEgg: (rarity: Rarity) => boolean;
  grantPurchase: (productId: ProductId) => void;
  restorePurchases: (owned: ProductId[]) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  resetProgress: () => void;
  /** Tutorial: avanza los pasos cumplidos, sigue tras un paso de "toca para seguir" o lo salta. */
  syncTutorial: () => void;
  continueTutorial: () => void;
  completeTutorialStep: (step: TutorialStep) => void;
  skipTutorial: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => {
      /** Aplica una acción del motor; si devuelve null, la acción no era válida. */
      const apply = (next: GameState | null): boolean => {
        if (!next) return false;
        set({ game: next });
        return true;
      };

      return {
        game: createInitialState(Date.now()),

        tick: (dt) => {
          const result = tick(get().game, dt, Date.now());
          set({ game: result.state });
          return result.events;
        },

        resume: () => {
          const result = applyOfflineProgress(get().game, Date.now());
          set({ game: result.state });
          if (result.awaySeconds < MIN_OFFLINE_REPORT_SECONDS || result.coins <= 0) return null;
          return { coins: result.coins, seconds: result.seconds, capped: result.awaySeconds > result.seconds };
        },

        tap: (station) => apply(tapStation(get().game, station)),
        upgrade: (station, amount) => apply(buyUpgrade(get().game, station, amount, Date.now())),
        unlockShaft: () => apply(unlockShaft(get().game)),
        assignManager: (station, dinoId) => apply(assignManager(get().game, station, dinoId)),
        activateAbility: (station) => apply(activateAbility(get().game, station, Date.now())),
        prestige: () => apply(doPrestige(get().game)),
        startIncubation: (rarity) => apply(startIncubation(get().game, rarity, Date.now())),

        hatch: () => {
          const before = get().game;
          const result = hatch(before, Date.now(), Math.random, tutorialHatchDino(before));
          if (!result) return null;
          set({ game: result.state });
          const owned = result.state.dinos[result.dinoId];
          return { dinoId: result.dinoId, level: owned?.level ?? 1, duplicate: !!before.dinos[result.dinoId] };
        },

        skipIncubation: (seconds) => apply(skipIncubation(get().game, seconds)),
        finishWithAmber: () => apply(finishWithAmber(get().game, Date.now())),
        claimGoal: (goalId) => apply(claimGoal(get().game, goalId)),

        addCoins: (coins) => {
          const game = get().game;
          set({
            game: {
              ...game,
              coins: game.coins + coins,
              runEarnings: game.runEarnings + coins,
              lifetimeEarnings: game.lifetimeEarnings + coins,
            },
          });
        },

        grantDino: (dinoId) => apply(addDino(get().game, dinoId)),

        adBoost: () => apply(applyAdBoost(get().game, Date.now())),
        dailyAmber: () => apply(claimDailyAmber(get().game, Date.now())),
        buyEgg: (rarity) => apply(buyEggWithAmber(get().game, rarity)),
        grantPurchase: (productId) => apply(applyPurchase(get().game, productId)),
        restorePurchases: (owned) => apply(restorePurchases(get().game, owned)),

        updateSettings: (settings) => {
          const game = get().game;
          set({ game: { ...game, settings: { ...game.settings, ...settings } } });
        },

        syncTutorial: () => void apply(syncTutorial(get().game, Date.now())),
        continueTutorial: () => void apply(continueTutorial(get().game, Date.now())),
        completeTutorialStep: (step) => void apply(completeTutorialStep(get().game, step, Date.now())),
        skipTutorial: () => void apply(skipTutorial(get().game)),

        resetProgress: () => {
          const settings = get().game.settings;
          set({ game: { ...createInitialState(Date.now()), settings } });
        },
      };
    },
    {
      name: 'dino-fossil-tycoon',
      storage: createJSONStorage(() => throttledStorage()),
      partialize: (store) => ({ game: store.game }),
      merge: (persisted, current) => {
        const saved = (persisted as { game?: unknown } | undefined)?.game;
        return { ...current, game: saved ? migrateSave(saved, Date.now()) : current.game };
      },
    },
  ),
);

/** true cuando la partida guardada ya se cargó del almacenamiento. */
export function useHydrated(): boolean {
  const { onFinishHydration, hasHydrated } = useGameStore.persist;
  return useSyncExternalStore((onChange) => onFinishHydration(onChange), hasHydrated, hasHydrated);
}
