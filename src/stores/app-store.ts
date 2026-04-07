import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStateStorage } from '@core/storage/mmkv';
import type { ThemeMode } from '@core/models';

interface AppState {
  theme: ThemeMode;
  onboardingCompleted: boolean;
  setTheme: (theme: ThemeMode) => void;
  setOnboardingCompleted: (completed: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'system',
      onboardingCompleted: false,
      setTheme: (theme) => set({ theme }),
      setOnboardingCompleted: (completed) => set({ onboardingCompleted: completed }),
    }),
    {
      name: 'app-store',
      storage: createJSONStorage(() => mmkvStateStorage),
      version: 1,
      migrate: (persisted: unknown, version: number) => {
        const state = persisted as Record<string, unknown>;
        if (version === 0) {
          return { ...state, theme: 'system' } as AppState;
        }
        return state as unknown as AppState;
      },
    }
  )
);
