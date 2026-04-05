import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDatabase } from '@core/providers/database-provider';
import { TransactionRepository } from '@core/repositories/transaction-repository';
import { AccountRepository } from '@core/repositories/account-repository';
import { CategoryRepository } from '@core/repositories/category-repository';
import { GoalRepository } from '@core/repositories/goal-repository';
import { queryKeys } from '@core/constants/query-keys';
import { startOfMonth, endOfMonth } from '@core/utils/date';
import type { CategoryBreakdownItem } from '../types';

export function useDashboardData() {
  const db = useDatabase();
  const accountRepo = useMemo(() => new AccountRepository(db), [db]);
  const transactionRepo = useMemo(() => new TransactionRepository(db), [db]);
  const categoryRepo = useMemo(() => new CategoryRepository(db), [db]);
  const goalRepo = useMemo(() => new GoalRepository(db), [db]);

  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  // Last month range
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthStart = startOfMonth(lastMonthDate);
  const lastMonthEnd = endOfMonth(lastMonthDate);

  const accountsQuery = useQuery({
    queryKey: queryKeys.accounts.all,
    queryFn: () => accountRepo.getAll(),
  });

  const transactionsQuery = useQuery({
    queryKey: queryKeys.transactions.byDateRange(monthStart, monthEnd),
    queryFn: () => transactionRepo.getByDateRange(monthStart, monthEnd),
  });

  const lastMonthTransactionsQuery = useQuery({
    queryKey: queryKeys.transactions.byDateRange(lastMonthStart, lastMonthEnd),
    queryFn: () => transactionRepo.getByDateRange(lastMonthStart, lastMonthEnd),
  });

  const categoriesQuery = useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => categoryRepo.getAll(),
  });

  const goalsQuery = useQuery({
    queryKey: queryKeys.goals.active,
    queryFn: () => goalRepo.getActive(),
  });

  const totalBalance = useMemo(
    () => (accountsQuery.data ?? []).reduce((sum, a) => sum + a.balance, 0),
    [accountsQuery.data]
  );

  const totalIncome = useMemo(
    () =>
      (transactionsQuery.data ?? [])
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0),
    [transactionsQuery.data]
  );

  const totalExpense = useMemo(
    () =>
      (transactionsQuery.data ?? [])
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0),
    [transactionsQuery.data]
  );

  const lastMonthIncome = useMemo(
    () =>
      (lastMonthTransactionsQuery.data ?? [])
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0),
    [lastMonthTransactionsQuery.data]
  );

  const lastMonthExpense = useMemo(
    () =>
      (lastMonthTransactionsQuery.data ?? [])
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0),
    [lastMonthTransactionsQuery.data]
  );

  const savingsRate = useMemo(() => {
    if (totalIncome === 0) return 0;
    return Math.round(((totalIncome - totalExpense) / totalIncome) * 100);
  }, [totalIncome, totalExpense]);

  const categoryBreakdown = useMemo((): CategoryBreakdownItem[] => {
    const transactions = transactionsQuery.data ?? [];
    const categories = categoriesQuery.data ?? [];
    const catMap = new Map(categories.map((c) => [c.id, c]));

    const expenses = transactions.filter((t) => t.type === 'expense');
    const total = expenses.reduce((sum, t) => sum + t.amount, 0);
    if (total === 0) return [];

    const grouped: Record<string, number> = {};
    for (const tx of expenses) {
      grouped[tx.category_id] = (grouped[tx.category_id] ?? 0) + tx.amount;
    }

    return Object.entries(grouped)
      .map(([catId, amount]) => {
        const cat = catMap.get(catId);
        return {
          categoryId: catId,
          categoryName: cat?.name ?? 'Other',
          color: cat?.color ?? '#AEB6BF',
          icon: cat?.icon ?? 'circle',
          amount,
          percentage: Math.round((amount / total) * 100),
        };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [transactionsQuery.data, categoriesQuery.data]);

  const recentTransactions = useMemo(
    () => (transactionsQuery.data ?? []).slice(0, 5),
    [transactionsQuery.data]
  );

  const isLoading =
    accountsQuery.isLoading ||
    transactionsQuery.isLoading ||
    categoriesQuery.isLoading;
  const isError =
    accountsQuery.isError ||
    transactionsQuery.isError ||
    categoriesQuery.isError;

  const refetchAll = async () => {
    await Promise.all([
      accountsQuery.refetch(),
      transactionsQuery.refetch(),
      categoriesQuery.refetch(),
      goalsQuery.refetch(),
    ]);
  };

  return {
    totalBalance,
    accounts: accountsQuery.data ?? [],
    totalIncome,
    totalExpense,
    lastMonthIncome,
    lastMonthExpense,
    savingsRate,
    categoryBreakdown,
    recentTransactions,
    categories: categoriesQuery.data ?? [],
    goals: goalsQuery.data ?? [],
    isLoading,
    isError,
    refetchAll,
  };
}
