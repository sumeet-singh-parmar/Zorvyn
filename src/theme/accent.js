/**
 * STATIC FALLBACK — used by legacy components not yet migrated to useTheme().
 * These values match the brown preset defaults from theme-store.ts.
 * Will be removed once all components use useTheme().
 */
const { generateDarkPalette } = require('./hsl');
const palette = generateDarkPalette(25, 55, 45);

module.exports = {
  50: palette.accent50,
  100: palette.accent100,
  200: palette.accent200,
  300: palette.accent300,
  400: palette.accent400,
  500: palette.accent500,
  600: palette.accent600,
  700: palette.accent700,
  800: palette.accent800,
  900: palette.accent900,

  screenBg: palette.screenBg,
  screenBgLight: '#FFF8F4',
  cardDark: palette.cardBg,
  cardLight: '#FFFFFF',
  surfaceDark: palette.surfaceBg,
  surfaceLight: '#F9F5F2',
  textOnCard: palette.textOnAccent,
  textOnCardSub: palette.textSecondary,

  tabBarBg: palette.tabBarBg,
  tabInactive: palette.tabInactiveIcon,
  tabActiveBg: palette.tabActiveBg,

  gradientStart: palette.gradientStart,
  gradientMid: palette.accent500,
  gradientEnd: palette.gradientEnd,
  disabledStart: palette.accent200,
  disabledEnd: palette.accent300,

  gray: {
    50:  '#FAF8F6',
    100: '#E8DDD8',
    200: '#CFC1BC',
    300: '#B8AAA4',
    400: '#A0928C',
    500: '#877A74',
    600: '#6B5F5A',
    700: '#4A4340',
    800: '#332C28',
    900: '#1E1915',
    950: '#150F0D',
  },

  DEFAULT: palette.accent500,
  focus: palette.accent400,
  shadow: palette.shadow,
  tint: palette.tint,
  ring: palette.ring,
};
