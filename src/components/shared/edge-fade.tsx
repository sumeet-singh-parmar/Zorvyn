import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRootNavigationState, useSegments } from 'expo-router';
import { useThemeStore } from '@stores/theme-store';
import { useIsDark } from '@theme/use-theme';
import { hslToRgba } from '@theme/hsl';

/**
 * Global gradient overlays for status bar (top) and tab bar (bottom).
 * Place ONCE at the top level -- every screen gets them automatically.
 * Bottom gradient only shows on tab screens (where the tab bar is).
 */
export function EdgeFade() {
  const isDark = useIsDark();
  const { hue, saturation } = useThemeStore();
  const insets = useSafeAreaInsets();
  const segments = useSegments();

  const topHeight = insets.top + 20;
  const bottomHeight = 40;

  // Only show bottom gradient on tab screens
  const showBottom = segments[0] === '(tabs)';

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

      {/* Bottom gradient -- only on tab screens where the tab bar lives */}
      {showBottom && (
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
      )}
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
