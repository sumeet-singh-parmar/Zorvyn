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
    }
  )
);
