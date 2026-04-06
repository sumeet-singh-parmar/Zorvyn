import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStore } from '@stores/theme-store';
import { useIsDark } from '@theme/use-theme';
import { hslToRgba } from '@theme/hsl';

/**
 * Global gradient overlays for status bar (top) and tab bar (bottom).
 * Place ONCE at the top level -- every screen gets them automatically.
 * Both are absolute positioned and pass through touches.
 */
export function EdgeFade() {
  const isDark = useIsDark();
  const { hue, saturation } = useThemeStore();
  const insets = useSafeAreaInsets();

  const topHeight = insets.top + 20;
  const bottomHeight = 40;

  // Build gradient colors from the screen bg
  const solid = isDark
    ? hslToRgba(hue, saturation * 0.4, 7, 1)
    : hslToRgba(hue, saturation * 0.08, 97, 1);
  const mid = isDark
    ? hslToRgba(hue, saturation * 0.4, 7, 0.8)
    : hslToRgba(hue, saturation * 0.08, 97, 0.8);
  const end = isDark
    ? hslToRgba(hue, saturation * 0.4, 7, 0)
    : hslToRgba(hue, saturation * 0.08, 97, 0);

  return (
    <>
      {/* Top gradient -- status bar fade */}
      <LinearGradient
        colors={[solid, mid, end]}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: topHeight,
          zIndex: 10,
        }}
        pointerEvents="none"
      />

      {/* Bottom gradient -- inverted, tab bar fade */}
      <LinearGradient
        colors={[end, mid, solid]}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: bottomHeight,
          zIndex: 10,
        }}
        pointerEvents="none"
      />
    </>
  );
}

/**
 * Hook: returns the top content padding so ScrollViews start below the gradient.
 */
export function useScreenTopPadding(extra: number = 16): number {
  const insets = useSafeAreaInsets();
  return insets.top + extra;
}
