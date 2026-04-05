import { fonts } from './fonts';

export const typography = {
  // Display Sizes (Hero/Large Headlines)
  display: {
    fontSize: 48,
    fontFamily: fonts.extrabold,
    lineHeight: 56,
    letterSpacing: -0.5,
  },
  displaySmall: {
    fontSize: 40,
    fontFamily: fonts.extrabold,
    lineHeight: 48,
    letterSpacing: -0.5,
  },

  // Heading Hierarchy
  h1: {
    fontSize: 32,
    fontFamily: fonts.heading,
    lineHeight: 40,
    letterSpacing: -0.3,
  },
  h2: {
    fontSize: 28,
    fontFamily: fonts.heading,
    lineHeight: 36,
    letterSpacing: -0.2,
  },
  h3: {
    fontSize: 22,
    fontFamily: fonts.semibold,
    lineHeight: 28,
    letterSpacing: 0,
  },
  h4: {
    fontSize: 18,
    fontFamily: fonts.semibold,
    lineHeight: 24,
    letterSpacing: 0,
  },
  h5: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    lineHeight: 22,
    letterSpacing: 0,
  },

  // Body Text
  body: {
    fontSize: 16,
    fontFamily: fonts.body,
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  bodyMedium: {
    fontSize: 15,
    fontFamily: fonts.body,
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  bodySmall: {
    fontSize: 14,
    fontFamily: fonts.body,
    lineHeight: 20,
    letterSpacing: 0.2,
  },

  // Caption & Small Text
  caption: {
    fontSize: 13,
    fontFamily: fonts.body,
    lineHeight: 18,
    letterSpacing: 0.1,
  },
  captionSmall: {
    fontSize: 12,
    fontFamily: fonts.body,
    lineHeight: 16,
    letterSpacing: 0.1,
  },

  // Labels & Interactive
  label: {
    fontSize: 14,
    fontFamily: fonts.medium,
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  labelSmall: {
    fontSize: 13,
    fontFamily: fonts.medium,
    lineHeight: 18,
    letterSpacing: 0.1,
  },
  labelLarge: {
    fontSize: 15,
    fontFamily: fonts.medium,
    lineHeight: 22,
    letterSpacing: 0.2,
  },

  // Amount Display (Financial Focus)
  amount: {
    fontSize: 24,
    fontFamily: fonts.heading,
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  amountLarge: {
    fontSize: 32,
    fontFamily: fonts.extrabold,
    lineHeight: 40,
    letterSpacing: -0.3,
  },
  amountExtraLarge: {
    fontSize: 48,
    fontFamily: fonts.extrabold,
    lineHeight: 56,
    letterSpacing: -0.5,
  },
  amountSmall: {
    fontSize: 18,
    fontFamily: fonts.semibold,
    lineHeight: 24,
    letterSpacing: 0,
  },

  // Monospace (for codes, amounts, addresses)
  mono: {
    fontSize: 14,
    fontFamily: fonts.mono,
    lineHeight: 20,
    letterSpacing: 0,
  },
  monoSmall: {
    fontSize: 12,
    fontFamily: fonts.mono,
    lineHeight: 16,
    letterSpacing: 0,
  },

  // Button Text
  button: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  buttonSmall: {
    fontSize: 14,
    fontFamily: fonts.semibold,
    lineHeight: 18,
    letterSpacing: 0.2,
  },
} as const;
