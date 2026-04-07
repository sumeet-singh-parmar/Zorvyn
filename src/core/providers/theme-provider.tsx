import { useEffect } from 'react';
import { colorScheme as nwColorScheme } from 'nativewind';
import { useAppStore } from '@stores/app-store';

// Don't force any value at module level — let NativeWind follow the system by default.

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useAppStore((s) => s.theme);

  useEffect(() => {
    if (theme === 'system') {
      // Passing undefined lets NativeWind track the system theme natively
      nwColorScheme.set(undefined!);
    } else {
      nwColorScheme.set(theme);
    }
  }, [theme]);

  return <>{children}</>;
}
