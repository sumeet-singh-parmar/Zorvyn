import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDatabase } from '@core/providers/database-provider';
import { TransactionRepository } from '@core/repositories/transaction-repository';
import { CategoryRepository } from '@core/repositories/category-repository';
import { BudgetRepository } from '@core/repositories/budget-repository';
import { RecurringRepository } from '@core/repositories/recurring-repository';
import { queryKeys } from '@core/constants/query-keys';
import { startOfMonth, endOfMonth } from '@core/utils/date';
import { getMonthlyEquivalent } from '@core/utils/recurring';
import {
  getCategoryBreakdown,
  getMonthlyTrend,
  getTopCategories,
  filterByPeriod,
  getPreviousPeriodTransactions,
  getSavingsData,
  getSpendingByDay,
  getCategoryTrends,
  getPeriodDateRange,
} from '../services/analytics-service';

export type Period = 'week' | 'month' | 'year';

export function useAnalytics(period: Period = 'month', customRange?: { start: Date; end: Date }) {
  const db = useDatabase();
  const transactionRepo = useMemo(() => new TransactionRepository(db), [db]);
  const categoryRepo = useMemo(() => new CategoryRepository(db), [db]);
  const budgetRepo = useMemo(() => new BudgetRepository(db), [db]);
  const recurringRepo = useMemo(() => new RecurringRepository(db), [db]);

  const transactionsQuery = useQuery({
    queryKey: queryKeys.transactions.all,
    queryFn: () => transactionRepo.getAll(),
  });

  const categoriesQuery = useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => categoryRepo.getAll(),
  });

  const budgetsQuery = useQuery({
    queryKey: ['budgets', 'analytics'],
    queryFn: async () => {
      const now = new Date();
      const ms = startOfMonth(now);
      const me = endOfMonth(now);
      const [budgets, cats] = await Promise.all([
        budgetRepo.getActive(),
        categoryRepo.getAll(),
      ]);
      const catMap = new Map(cats.map((c) => [c.id, c]));
      const result = [];
      for (const b of budgets) {
        const spent = await budgetRepo.getSpentAmount(b.category_id, ms, me);
        const cat = catMap.get(b.category_id);
        result.push({
          categoryName: cat?.name ?? 'Unknown',
          categoryIcon: cat?.icon ?? 'circle',
          categoryColor: cat?.color ?? '#AEB6BF',
          spent,
          limit: b.amount,
          progress: b.amount > 0 ? spent / b.amount : 0,
        });
      }
      return result;
    },
  });

  const recurringQuery = useQuery({
    queryKey: ['recurring', 'analytics'],
    queryFn: () => recurringRepo.getAllWithCategory(),
  });

  // Date range label
  const dateRangeLabel = useMemo(() => getPeriodDateRange(period).label, [period]);

  // Filtered transactions for current period or custom range
  const allTxns = transactionsQuery.data ?? [];
  const filteredTransactions = useMemo(() => {
    if (customRange) {
      const startTime = customRange.start.getTime();
      const endTime = customRange.end.getTime();
      return allTxns.filter((t) => {
        const txTime = new Date(t.date).getTime();
        return txTime >= startTime && txTime <= endTime;
      });
    }
    return filterByPeriod(allTxns, period);
  }, [allTxns, period, customRange]);

  const previousTransactions = useMemo(
    () => customRange ? [] : getPreviousPeriodTransactions(allTxns, period),
    [allTxns, period, customRange]
  );

  // Category breakdown
  const categoryBreakdown = useMemo(
    () => getCategoryBreakdown(filteredTransactions, categoriesQuery.data ?? []),
    [filteredTransactions, categoriesQuery.data]
  );

  // Monthly trend (always full range for the bar chart)
  const monthlyTrend = useMemo(
    () => getMonthlyTrend(allTxns, period === 'year' ? 12 : 6),
    [allTxns, period]
  );

  // Top categories
  const topCategories = useMemo(
    () => getTopCategories(categoryBreakdown),
    [categoryBreakdown]
  );

  // Category trends (% change vs previous period)
  const categoryTrends = useMemo(
    () => getCategoryTrends(categoryBreakdown, previousTransactions, categoriesQuery.data ?? []),
    [categoryBreakdown, previousTransactions, categoriesQuery.data]
  );

  // Savings data
  const savings = useMemo(
    () => getSavingsData(filteredTransactions, previousTransactions),
    [filteredTransactions, previousTransactions]
  );

  // Spending by day of week
  const spendingByDay = useMemo(
    () => getSpendingByDay(filteredTransactions),
    [filteredTransactions]
  );

  // Recurring projection
  const recurringData = useMemo(() => {
    const items = (recurringQuery.data ?? []).filter((r) => r.is_active === 1);
    const monthlyTotal = items
      .filter((r) => r.type === 'expense')
      .reduce((sum, r) => sum + getMonthlyEquivalent(r.amount, r.frequency), 0);
    return {
      monthlyTotal,
      items: items
        .filter((r) => r.type === 'expense')
        .sort((a, b) => b.amount - a.amount)
        .map((r) => ({ name: r.notes || r.category_name || 'Recurring', amount: r.amount, frequency: r.frequency, type: r.type as 'income' | 'expense' })),
      activeCount: items.length,
    };
  }, [recurringQuery.data]);

  const isLoading = transactionsQuery.isLoading || categoriesQuery.isLoading;
  const isError = transactionsQuery.isError || categoriesQuery.isError;

  const refetch = () => {
    transactionsQuery.refetch();
    categoriesQuery.refetch();
    budgetsQuery.refetch();
    recurringQuery.refetch();
  };

  return {
    dateRangeLabel,
    categoryBreakdown,
    monthlyTrend,
    topCategories,
    categoryTrends,
    savings,
    spendingByDay,
    budgets: budgetsQuery.data ?? [],
    recurringData,
    period,
    isLoading,
    isError,
    refetch,
  };
}
