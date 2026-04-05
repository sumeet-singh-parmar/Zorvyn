import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStateStorage } from '@core/storage/mmkv';
import {
  generateDarkPalette,
  generateLightPalette,
  type ThemePalette,
} from '@theme/hsl';

/** Accent presets — each is [hue, saturation, lightness] */
export const ACCENT_PRESETS = {
  brown:  [17, 98, 80] as [number, number, number],
  blue:   [215, 65, 50] as [number, number, number],
  green:  [155, 55, 42] as [number, number, number],
  purple: [270, 55, 50] as [number, number, number],
  teal:   [180, 50, 42] as [number, number, number],
  red:    [0, 60, 48] as [number, number, number],
} as const;

export type PresetName = keyof typeof ACCENT_PRESETS;

interface ThemeState {
  hue: number;
  saturation: number;
  lightness: number;
  activePreset: PresetName | null;

  // Cached palettes (recomputed on accent change)
  darkPalette: ThemePalette;
  lightPalette: ThemePalette;

  // Actions
  setAccent: (h: number, s: number, l: number) => void;
  setPreset: (name: PresetName) => void;
}

const DEFAULT: [number, number, number] = ACCENT_PRESETS.brown;

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      hue: DEFAULT[0],
      saturation: DEFAULT[1],
      lightness: DEFAULT[2],
      activePreset: 'brown',
      darkPalette: generateDarkPalette(...DEFAULT),
      lightPalette: generateLightPalette(...DEFAULT),

      setAccent: (h, s, l) =>
        set({
          hue: h,
          saturation: s,
          lightness: l,
          activePreset: null,
          darkPalette: generateDarkPalette(h, s, l),
          lightPalette: generateLightPalette(h, s, l),
        }),

      setPreset: (name) => {
        const [h, s, l] = ACCENT_PRESETS[name];
        set({
          hue: h,
          saturation: s,
          lightness: l,
          activePreset: name,
          darkPalette: generateDarkPalette(h, s, l),
          lightPalette: generateLightPalette(h, s, l),
        });
      },
    }),
    {
      name: 'theme-store',
      storage: createJSONStorage(() => mmkvStateStorage),
      // Only persist HSL values, recompute palettes on hydration
      partialize: (state) => ({
        hue: state.hue,
        saturation: state.saturation,
        lightness: state.lightness,
        activePreset: state.activePreset,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.darkPalette = generateDarkPalette(state.hue, state.saturation, state.lightness);
          state.lightPalette = generateLightPalette(state.hue, state.saturation, state.lightness);
        }
      },
    }
  )
);
