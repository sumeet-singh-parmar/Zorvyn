const accent = require('./src/theme/accent');
const semantic = require('./src/theme/semantic');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000000',
      white: '#FFFFFF',
      gray: accent.gray,
      accent,
      income: semantic.income,
      expense: semantic.expense,
      transfer: semantic.transfer,
      red: { 50: '#FEF2F2', 100: '#FEE2E2', 300: '#FCA5A5', 400: '#F87171', 500: '#EF4444', 600: '#DC2626', 700: '#B91C1C', 800: '#991B1B', 900: '#7F1D1D' },
      green: { 50: '#ECFDF5', 100: '#D1FAE5', 300: '#6EE7B7', 500: '#10B981', 600: '#059669', 700: '#047857', 800: '#065F46', 900: '#064E3B' },
      emerald: { 50: '#ECFDF5', 100: '#D1FAE5', 300: '#6EE7B7', 400: '#34D399', 500: '#10B981', 600: '#059669', 700: '#047857', 800: '#065F46', 900: '#064E3B' },
      blue: { 50: '#EFF6FF', 100: '#DBEAFE', 400: '#60A5FA', 500: '#3B82F6', 600: '#2563EB', 700: '#1D4ED8' },
      amber: { 500: '#F59E0B', 600: '#D97706' },
      orange: { 100: '#FFEDD5', 500: '#F97316', 900: '#7C2D12' },
      purple: { 100: '#F3E8FF', 500: '#A855F7', 900: '#581C87' },
      violet: { 50: '#F5F3FF', 100: '#EDE9FE', 200: '#DDD6FE', 400: '#A78BFA', 500: '#8B5CF6', 600: '#7C3AED', 700: '#6D28D9', 800: '#5B21B6', 900: '#4C1D95' },
      yellow: { 500: '#EAB308' },
    },
    extend: {
      fontFamily: {
        nunito:        ['Nunito_400Regular'],
        'nunito-md':   ['Nunito_500Medium'],
        'nunito-sb':   ['Nunito_600SemiBold'],
        'nunito-b':    ['Nunito_700Bold'],
        'nunito-xb':   ['Nunito_800ExtraBold'],
        'nunito-black': ['Nunito_900Black'],
      },
    },
  },
  plugins: [],
};
