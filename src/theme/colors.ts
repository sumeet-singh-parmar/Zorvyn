// eslint-disable-next-line @typescript-eslint/no-var-requires
const accent = require('./accent') as Record<string, string>;

// Semantic Colors
const incomeGreen = '#00C48C';
const expenseRed = '#FF6B6B';
const transferBlue = '#4DA6FF';

// Neutral Gray Scale (Modern, Warm-tinted)
const neutral = {
  50: '#FAFBFC',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
  500: '#6B7280',
  600: '#4B5563',
  700: '#374151',
  800: '#1F2937',
  900: '#111827',
} as const;

export const colors = {
  // Accent Palette (single source of truth: accent.js)
  accent,
  primary: accent.DEFAULT,
  primaryLight: accent[300],
  primaryDark: accent[700],

  // Gradient Palette (derived from accent)
  primaryGradientStart: accent.gradientStart,
  primaryGradientEnd: accent.gradientEnd,
  primaryGradientLightStart: accent.disabledStart,
  primaryGradientLightEnd: accent.disabledEnd,

  // Success Semantic
  success: incomeGreen,
  successLight: '#00D9A3',
  successGradientStart: '#00D9A3',
  successGradientEnd: '#00B88A',

  // Warning Semantic
  warning: '#FDCB6E',
  warningDark: '#E17055',
  warningGradientStart: '#FFD97D',
  warningGradientEnd: '#F4AE4E',

  // Error Semantic
  error: expenseRed,
  errorLight: '#FF8585',
  errorGradientStart: '#FF7F7F',
  errorGradientEnd: '#FF5252',

  // Transaction Colors (Semantic)
  income: incomeGreen,
  incomeLight: '#B3F5E5',
  incomeTint: 'rgba(0, 196, 140, 0.08)',

  expense: expenseRed,
  expenseLight: '#FFB5B5',
  expenseTint: 'rgba(255, 107, 107, 0.08)',

  transfer: transferBlue,
  transferLight: '#90D5FF',
  transferTint: 'rgba(77, 166, 255, 0.08)',

  // Background & Surfaces
  background: '#F8F9FA',
  backgroundDark: '#0F1117',
  backgroundSecondary: '#F0F2F5',
  backgroundSecondaryDark: '#161B22',

  surface: '#FFFFFF',
  surfaceDark: '#1C1F26',
  surfaceSecondary: '#F9FAFB',
  surfaceSecondaryDark: '#22272E',

  // Card Palette
  card: '#FFFFFF',
  cardDark: '#1C1F26',

  // Balance Card Gradient (derived from accent)
  balanceCardStart: accent.gradientStart,
  balanceCardEnd: accent.gradientEnd,

  // Text Colors
  text: '#111827',
  textDark: '#F3F4F6',
  textSecondary: '#6B7280',
  textSecondaryDark: '#9CA3AF',
  textTertiary: '#9CA3AF',
  textTertiaryDark: '#6B7280',

  // Border & Dividers
  border: '#E5E7EB',
  borderDark: '#30363D',
  borderLight: '#F3F4F6',
  borderLightDark: '#21262D',

  // Neutral Scale
  neutral,

  // Overlay
  overlayLight: 'rgba(255, 255, 255, 0.8)',
  overlayDark: 'rgba(15, 17, 23, 0.8)',

  // Utility
  disabled: '#D1D5DB',
  disabledDark: '#4B5563',
  disabledText: '#9CA3AF',
  disabledTextDark: '#6B7280',

  // Focus & Interactive States (derived from accent)
  focus: accent.focus,
  focusRing: accent.ring,
} as const;
