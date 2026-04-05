import { useColorScheme } from 'nativewind';
import { useThemeStore } from '@stores/theme-store';
import type { ThemePalette } from './hsl';

/**
 * Returns the active theme palette (dark or light) based on the current color scheme.
 *
 * Usage:
 *   const theme = useTheme();
 *   <View style={{ backgroundColor: theme.screenBg }}>
 *
 * For granular subscriptions (performance):
 *   const screenBg = useThemeValue('screenBg');
 */
export function useTheme(): ThemePalette {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const dark = useThemeStore((s) => s.darkPalette);
  const light = useThemeStore((s) => s.lightPalette);
  return isDark ? dark : light;
}

/** Select a single value from the active palette — minimal re-renders */
export function useThemeValue<K extends keyof ThemePalette>(key: K): ThemePalette[K] {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const darkVal = useThemeStore((s) => s.darkPalette[key]);
  const lightVal = useThemeStore((s) => s.lightPalette[key]);
  return isDark ? darkVal : lightVal;
}

/** Returns true if current mode is dark */
export function useIsDark(): boolean {
  const { colorScheme } = useColorScheme();
  return colorScheme === 'dark';
}
