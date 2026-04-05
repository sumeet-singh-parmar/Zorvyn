// Base Spacing Scale (4px unit system)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,

  // Screen Padding
  screenPaddingX: 16,
  screenPaddingY: 16,
  screenPadding: 16,

  // Card Padding
  cardPaddingX: 16,
  cardPaddingY: 16,
  cardPadding: 16,
  cardPaddingLarge: 24,

  // Section Spacing
  sectionGap: 24,
  sectionGapSmall: 16,
  sectionGapLarge: 32,

  // Component Spacing
  componentGap: 12,
  componentGapSmall: 8,
  componentGapLarge: 16,

  // Icon Sizes
  iconXs: 16,
  iconSm: 20,
  iconMd: 24,
  iconLg: 32,
  iconXl: 48,
  icon2xl: 64,

  // Touch Target Minimum (accessibility)
  touchTarget: 48,
  touchTargetCompact: 44,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,

  // Semantic Border Radius
  button: 12,
  card: 16,
  input: 12,
  modal: 20,
  image: 16,
} as const;
