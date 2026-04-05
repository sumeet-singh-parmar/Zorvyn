import { useEffect } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import { colorScheme as nwColorScheme } from 'nativewind';
import { useAppStore } from '@stores/app-store';

/**
 * Syncs the Zustand theme preference with NativeWind's color scheme.
 * Must be rendered inside the component tree (after fonts are loaded).
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useAppStore((s) => s.theme);
  const deviceScheme = useDeviceColorScheme();

  useEffect(() => {
    if (theme === 'system') {
      nwColorScheme.set(deviceScheme ?? 'light');
    } else {
      nwColorScheme.set(theme);
    }
  }, [theme, deviceScheme]);

  return <>{children}</>;
}
