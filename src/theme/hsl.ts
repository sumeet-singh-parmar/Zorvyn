/**
 * HSL color math — pure functions, no dependencies.
 * All theme colors derive from a single (H, S, L) accent value.
 */

/** Convert HSL (0-360, 0-100, 0-100) to hex string */
export function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/** Convert HSL to rgba string */
export function hslToRgba(h: number, s: number, l: number, a: number): string {
  const hex = hslToHex(h, s, l);
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/** Clamp a number between min and max */
function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export interface ThemePalette {
  // Accent scale
  accent50: string;
  accent100: string;
  accent200: string;
  accent300: string;
  accent400: string;
  accent500: string;
  accent600: string;
  accent700: string;
  accent800: string;
  accent900: string;

  // Surfaces
  screenBg: string;
  cardBg: string;
  surfaceBg: string;
  elevatedBg: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textOnAccent: string;

  // Borders
  border: string;
  borderStrong: string;

  // Tab bar
  tabBarBg: string;
  tabActiveBg: string;
  tabActiveIcon: string;
  tabInactiveIcon: string;

  // Accent utilities
  tint: string;
  ring: string;
  shadow: string;

  // Button
  buttonBg: string;

  // Gradient
  gradientStart: string;
  gradientEnd: string;

  // Semantic (fixed, not accent-derived)
  income: string;
  incomeTint: string;
  expense: string;
  expenseTint: string;
  transfer: string;
  transferTint: string;
  warning: string;
}

/**
 * Generate a complete dark theme palette from a single HSL accent color.
 */
export function generateDarkPalette(h: number, s: number, l: number): ThemePalette {
  const H = h;
  const S = s;

  return {
    // Accent scale: same hue, varying lightness
    accent50:  hslToHex(H, S * 0.3, 95),
    accent100: hslToHex(H, S * 0.4, 88),
    accent200: hslToHex(H, S * 0.7, 72),   // hero card bg
    accent300: hslToHex(H, S * 0.85, l + 3),
    accent400: hslToHex(H, S, clamp(l + 8, 0, 100)),
    accent500: hslToHex(H, S, l),            // primary
    accent600: hslToHex(H, S, clamp(l - 10, 0, 100)),
    accent700: hslToHex(H, S * 0.9, clamp(l - 20, 0, 100)),
    accent800: hslToHex(H, S * 0.8, clamp(l - 30, 0, 100)),
    accent900: hslToHex(H, S * 0.7, clamp(l - 38, 0, 100)),

    // Dark surfaces: same hue, very low saturation, low lightness
    screenBg:    hslToHex(H, S * 0.4, 7),
    cardBg:      hslToHex(H, S * 0.18, 12),
    surfaceBg:   hslToHex(H, S * 0.15, 16),
    elevatedBg:  hslToHex(H, S * 0.12, 20),

    // Text: warm tinted whites
    textPrimary:   hslToHex(H, S * 0.1, 82),
    textSecondary: hslToHex(H, S * 0.08, 62),
    textMuted:     hslToHex(H, S * 0.06, 42),
    textOnAccent:  l > 55
      ? hslToHex(H, S * 0.5, clamp(l - 50, 5, 30))
      : hslToHex(H, S * 0.15, 95),

    // Borders
    border:       hslToHex(H, S * 0.1, 18),
    borderStrong: hslToHex(H, S * 0.12, 25),

    // Tab bar
    tabBarBg:       hslToHex(H, S * 0.15, 20),
    tabActiveBg:    hslToRgba(H, S * 0.1, 80, 0.1),
    tabActiveIcon:  hslToHex(H, S * 0.7, 72), // same as accent200
    tabInactiveIcon: hslToHex(H, S * 0.1, 62),

    // Button -- same as accent500 in dark mode
    buttonBg: hslToHex(H, S, l),

    // Utilities
    tint:   hslToRgba(H, S, l, 0.08),
    ring:   hslToRgba(H, S, l, 0.12),
    shadow: hslToHex(H, S * 0.5, clamp(l - 15, 0, 100)),

    // Gradient
    gradientStart: hslToHex(H, S, clamp(l + 8, 0, 100)),
    gradientEnd:   hslToHex(H, S, clamp(l - 10, 0, 100)),

    // Semantic (fixed)
    income:       '#00C48C',
    incomeTint:   'rgba(0, 196, 140, 0.1)',
    expense:      '#FF6B6B',
    expenseTint:  'rgba(255, 107, 107, 0.1)',
    transfer:     '#4DA6FF',
    transferTint: 'rgba(77, 166, 255, 0.1)',
    warning:      '#FDCB6E',
  };
}

/**
 * Generate a complete light theme palette from a single HSL accent color.
 */
export function generateLightPalette(h: number, s: number, l: number): ThemePalette {
  const H = h;
  const S = s;

  return {
    // Accent scale: same as dark
    accent50:  hslToHex(H, S * 0.3, 95),
    accent100: hslToHex(H, S * 0.4, 88),
    accent200: hslToHex(H, S * 0.7, 72),
    accent300: hslToHex(H, S * 0.85, 58),
    accent400: hslToHex(H, S, clamp(l + 8, 0, 100)),
    accent500: hslToHex(H, S, l),
    accent600: hslToHex(H, S, clamp(l - 10, 0, 100)),
    accent700: hslToHex(H, S * 0.9, clamp(l - 20, 0, 100)),
    accent800: hslToHex(H, S * 0.8, clamp(l - 30, 0, 100)),
    accent900: hslToHex(H, S * 0.7, clamp(l - 38, 0, 100)),

    // Light surfaces: white + subtle tints
    screenBg:    '#FFFFFF',
    cardBg:      '#FFFFFF',
    surfaceBg:   hslToHex(H, S * 0.12, 97),
    elevatedBg:  hslToHex(H, S * 0.1, 94),

    // Text: warm dark tones
    textPrimary:   hslToHex(H, S * 0.1, 12),
    textSecondary: hslToHex(H, S * 0.08, 40),
    textMuted:     hslToHex(H, S * 0.06, 58),
    textOnAccent:  l > 55
      ? hslToHex(H, S * 0.5, clamp(l - 50, 5, 30))
      : hslToHex(H, S * 0.15, 95),

    // Borders
    border:       hslToHex(H, S * 0.08, 90),
    borderStrong: hslToHex(H, S * 0.1, 82),

    // Tab bar (light mode can have dark pill too or accent-tinted)
    tabBarBg:       hslToHex(H, S * 0.05, 96),
    tabActiveBg:    hslToRgba(H, S, l, 0.1),
    tabActiveIcon:  hslToHex(H, S, l),
    tabInactiveIcon: hslToHex(H, S * 0.08, 55),

    // Button -- darker variant for light mode so it has contrast on white
    buttonBg: hslToHex(H, S, l - 10),

    // Utilities
    tint:   hslToRgba(H, S, l, 0.06),
    ring:   hslToRgba(H, S, l, 0.1),
    shadow: hslToHex(H, S * 0.3, 30),

    // Gradient
    gradientStart: hslToHex(H, S, clamp(l + 8, 0, 100)),
    gradientEnd:   hslToHex(H, S, clamp(l - 10, 0, 100)),

    // Semantic (fixed)
    income:       '#00C48C',
    incomeTint:   'rgba(0, 196, 140, 0.08)',
    expense:      '#FF6B6B',
    expenseTint:  'rgba(255, 107, 107, 0.08)',
    transfer:     '#4DA6FF',
    transferTint: 'rgba(77, 166, 255, 0.08)',
    warning:      '#FDCB6E',
  };
}
