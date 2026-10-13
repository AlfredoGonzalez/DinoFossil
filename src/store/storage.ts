import type { StateStorage } from 'zustand/middleware';

/** Web: localStorage. En nativo se usa storage.native.ts (MMKV). */
export const rawStorage: StateStorage = {
  getItem: (key) => (typeof localStorage === 'undefined' ? null : localStorage.getItem(key)),
  setItem: (key, value) => {
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
  },
  removeItem: (key) => {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
  },
};
