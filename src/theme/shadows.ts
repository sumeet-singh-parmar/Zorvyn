import type { ViewStyle } from 'react-native';

const accent = require('./accent');

/**
 * Centralized shadow presets.
 * Every component should use one of these instead of
 * hand-rolling shadowColor / offset / opacity / radius.
 */
export const shadows: Record<string, ViewStyle> = {
  /** Subtle lift — cards, list items */
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },

  /** Medium lift — elevated cards, popovers */
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },

  /** Heavy lift — modals, floating elements */
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },

  /** Accent glow — primary buttons, FAB */
  accent: {
    shadowColor: accent.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },

  /** Accent glow lighter — chips, small interactive elements */
  accentSm: {
    shadowColor: accent.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },

  /** No shadow */
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
} as const;
