export const queryKeys = {
  transactions: {
    all: ['transactions'] as const,
    byId: (id: string) => ['transactions', id] as const,
    byDateRange: (start: string, end: string) => ['transactions', 'range', start, end] as const,
    byAccount: (accountId: string) => ['transactions', 'account', accountId] as const,
    byCategory: (categoryId: string) => ['transactions', 'category', categoryId] as const,
    byType: (type: string) => ['transactions', 'type', type] as const,
    search: (query: string) => ['transactions', 'search', query] as const,
    totals: (startDate?: string, endDate?: string) => ['transactions', 'totals', startDate, endDate] as const,
  },
  accounts: {
    all: ['accounts'] as const,
    byId: (id: string) => ['accounts', id] as const,
    default: ['accounts', 'default'] as const,
  },
  categories: {
    all: ['categories'] as const,
    byType: (type: string) => ['categories', 'type', type] as const,
  },
  budgets: {
    all: ['budgets'] as const,
    active: ['budgets', 'active'] as const,
    byCategory: (categoryId: string) => ['budgets', 'category', categoryId] as const,
    progress: (budgetId: string) => ['budgets', 'progress', budgetId] as const,
  },
  goals: {
    all: ['goals'] as const,
    active: ['goals', 'active'] as const,
    completed: ['goals', 'completed'] as const,
    byId: (id: string) => ['goals', id] as const,
    contributions: (goalId: string) => ['goals', 'contributions', goalId] as const,
  },
  userPreferences: {
    current: ['userPreferences'] as const,
  },
  analytics: {
    categoryBreakdown: (start: string, end: string) => ['analytics', 'categories', start, end] as const,
    weeklyTrend: ['analytics', 'weekly'] as const,
    monthlyComparison: ['analytics', 'monthly'] as const,
  },
} as const;
