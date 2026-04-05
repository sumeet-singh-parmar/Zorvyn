/**
 * Centralized font families.
 * To re-font the entire app, swap these values and update
 * the useFonts() call in _layout.tsx to load the new font assets.
 */
export const fonts = {
  /** Body text, labels, captions */
  body: 'Nunito_400Regular',

  /** Medium emphasis (buttons, labels) */
  medium: 'Nunito_500Medium',

  /** Semi-bold (card titles, tab labels) */
  semibold: 'Nunito_600SemiBold',

  /** Bold headings */
  heading: 'Nunito_700Bold',

  /** Extra-bold for large display text */
  extrabold: 'Nunito_800ExtraBold',

  /** Black -- heaviest Nunito weight */
  black: 'Nunito_900Black',

  /** Amount/currency numbers — swap this to try different fonts */
  amount: 'Nunito_700Bold',

  /** Hero balance big number — swap this to try different fonts */
  amountBlack: 'Nunito_900Black',

  /** Code, account numbers */
  mono: 'Courier New',
} as const;
