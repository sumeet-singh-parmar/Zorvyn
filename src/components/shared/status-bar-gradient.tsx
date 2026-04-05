import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@theme/use-theme';
import { useThemeStore } from '@stores/theme-store';
import { useIsDark } from '@theme/use-theme';
import { hslToRgba } from '@theme/hsl';

// Renders a gradient overlay at the top of the screen so status bar
// text is readable. Place as the LAST child in your screen View.
export function StatusBarGradient() {
  const theme = useTheme();
  const isDark = useIsDark();
  const { hue, saturation } = useThemeStore();
  const insets = useSafeAreaInsets();
  const height = insets.top + 20;

  // Build rgba versions for proper gradient transparency
  const solid = isDark
    ? hslToRgba(hue, saturation * 0.2, 7, 1)
    : 'rgba(255, 255, 255, 1)';
  const mid = isDark
    ? hslToRgba(hue, saturation * 0.2, 7, 0.8)
    : 'rgba(255, 255, 255, 0.8)';
  const end = isDark
    ? hslToRgba(hue, saturation * 0.2, 7, 0)
    : 'rgba(255, 255, 255, 0)';

  return (
    <LinearGradient
      colors={[solid, mid, end]}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height,
        zIndex: 10,
      }}
      pointerEvents="none"
    />
  );
}
