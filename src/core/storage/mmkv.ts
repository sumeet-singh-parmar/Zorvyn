import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StateStorage } from 'zustand/middleware';

// ──────────────────────────────────────────────
// NOTE: This file originally used react-native-mmkv for high-performance
// synchronous storage. It has been temporarily swapped to AsyncStorage
// so the app can run in Expo Go without a dev build.
//
// To restore: copy mmkv.backup.ts over this file and run `npm install react-native-mmkv`
// ──────────────────────────────────────────────

// Zustand persist adapter — Zustand's persist middleware handles async storage natively
export const mmkvStateStorage: StateStorage = {
  getItem: async (name: string) => {
    const value = await AsyncStorage.getItem(name);
    return value ?? null;
  },
  setItem: async (name: string, value: string) => {
    await AsyncStorage.setItem(name, value);
  },
  removeItem: async (name: string) => {
    await AsyncStorage.removeItem(name);
  },
};

// TanStack Query persister — using async persister instead of sync
// Since AsyncStorage is async, we use the async persister from TanStack
export { mmkvStateStorage as asyncStorage };
