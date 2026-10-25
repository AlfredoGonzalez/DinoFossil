import { create } from 'zustand';
import type { Rarity } from '@/game/types';

export interface Toast {
  id: number;
  text: string;
  icon?: string;
}

export interface OfflineReport {
  coins: number;
  seconds: number;
  capped: boolean;
}

export interface HatchReveal {
  dinoId: string;
  level: number;
  duplicate: boolean;
}

/** Rectángulo en coordenadas de ventana. */
export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface UiStore {
  toasts: Toast[];
  offlineReport: OfflineReport | null;
  hatchReveal: HatchReveal | null;
  fakeAdPlaying: boolean;
  lastEgg: Rarity | null;
  /** Modo prueba (oculto: 7 toques a la versión en Ajustes). Permite desbloquear dinos. */
  testMode: boolean;
  /** Zonas que el tutorial puede resaltar, medidas en pantalla (ver TutorialAnchor). */
  tutorialTargets: Partial<Record<string, Rect>>;
  setTutorialTarget: (id: string, rect: Rect) => void;
  clearTutorialTarget: (id: string) => void;
  toast: (text: string, icon?: string) => void;
  dismissToast: (id: number) => void;
  setOfflineReport: (report: OfflineReport | null) => void;
  setHatchReveal: (reveal: HatchReveal | null) => void;
  setFakeAdPlaying: (playing: boolean) => void;
  setTestMode: (on: boolean) => void;
}

let nextId = 1;

/** Estado efímero de interfaz (no se guarda). */
export const useUiStore = create<UiStore>((set, get) => ({
  toasts: [],
  offlineReport: null,
  hatchReveal: null,
  fakeAdPlaying: false,
  lastEgg: null,
  testMode: false,
  tutorialTargets: {},
  setTutorialTarget: (id, rect) => set({ tutorialTargets: { ...get().tutorialTargets, [id]: rect } }),
  clearTutorialTarget: (id) => {
    const { [id]: _gone, ...rest } = get().tutorialTargets;
    set({ tutorialTargets: rest });
  },
  setTestMode: (testMode) => set({ testMode }),
  toast: (text, icon) => {
    const id = nextId++;
    set({ toasts: [...get().toasts.slice(-2), { id, text, icon }] });
    setTimeout(() => get().dismissToast(id), 2600);
  },
  dismissToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
  setOfflineReport: (offlineReport) => set({ offlineReport }),
  setHatchReveal: (hatchReveal) => set({ hatchReveal }),
  setFakeAdPlaying: (fakeAdPlaying) => set({ fakeAdPlaying }),
}));
