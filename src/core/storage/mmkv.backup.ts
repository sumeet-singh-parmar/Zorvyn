// ──────────────────────────────────────────────
// BACKUP: Original MMKV implementation
// To restore: rename this file to mmkv.ts and run `npm install react-native-mmkv`
// ──────────────────────────────────────────────

import { createMMKV } from 'react-native-mmkv';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import type { StateStorage } from 'zustand/middleware';

export const storage = createMMKV({
  id: 'zorvyn-storage',
});

// Zustand persist adapter
export const mmkvStateStorage: StateStorage = {
  getItem: (name: string) => storage.getString(name) ?? null,
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.remove(name),
};

// TanStack Query persister — keeps query cache across app restarts
export const queryPersister = createSyncStoragePersister({
  storage: {
    getItem: (key: string) => storage.getString(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => { storage.remove(key); },
  },
});
