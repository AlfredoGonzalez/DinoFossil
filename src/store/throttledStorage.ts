import type { StateStorage } from 'zustand/middleware';
import { rawStorage } from './storage';

/**
 * El juego actualiza el estado 10 veces por segundo; escribir a disco en cada
 * cambio es innecesario. Guardamos como mucho cada `intervalMs` y forzamos el
 * guardado con `flushSave()` al pasar a segundo plano.
 */
const pending = new Map<string, string>();
let timer: ReturnType<typeof setTimeout> | null = null;

export function flushSave() {
  if (timer) clearTimeout(timer);
  timer = null;
  for (const [key, value] of pending) void rawStorage.setItem(key, value);
  pending.clear();
}

export function throttledStorage(intervalMs = 2000): StateStorage {
  return {
    getItem: (key) => pending.get(key) ?? rawStorage.getItem(key),
    setItem: (key, value) => {
      pending.set(key, value);
      if (!timer) timer = setTimeout(flushSave, intervalMs);
    },
    removeItem: (key) => {
      pending.delete(key);
      return rawStorage.removeItem(key);
    },
  };
}
