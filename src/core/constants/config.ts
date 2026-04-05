export const APP_CONFIG = {
  name: 'Zorvyn',
  version: '1.0.0',
  defaultCurrency: 'INR',
  defaultDateFormat: 'DD/MM/YYYY' as const,
  defaultFirstDayOfWeek: 1, // Monday
  defaultTheme: 'system' as const,
  db: {
    name: 'zorvyn.db',
  },
  query: {
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  },
} as const;
