import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDatabase } from '@core/providers/database-provider';
import { TransactionRepository } from '@core/repositories/transaction-repository';
import { CategoryRepository } from '@core/repositories/category-repository';
import { queryKeys } from '@core/constants/query-keys';
import { getCategoryBreakdown, getMonthlyTrend, getTopCategories } from '../services/analytics-service';

export function useAnalytics() {
  const db = useDatabase();
  const transactionRepo = useMemo(() => new TransactionRepository(db), [db]);
  const categoryRepo = useMemo(() => new CategoryRepository(db), [db]);

  const transactionsQuery = useQuery({
    queryKey: queryKeys.transactions.all,
    queryFn: () => transactionRepo.getAll(),
  });

  const categoriesQuery = useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => categoryRepo.getAll(),
  });

  const categoryBreakdown = useMemo(
    () => getCategoryBreakdown(transactionsQuery.data ?? [], categoriesQuery.data ?? []),
    [transactionsQuery.data, categoriesQuery.data]
  );

  const monthlyTrend = useMemo(
    () => getMonthlyTrend(transactionsQuery.data ?? []),
    [transactionsQuery.data]
  );

  const topCategories = useMemo(
    () => getTopCategories(categoryBreakdown),
    [categoryBreakdown]
  );

  const isLoading = transactionsQuery.isLoading || categoriesQuery.isLoading;
  const isError = transactionsQuery.isError || categoriesQuery.isError;

  const refetch = () => {
    transactionsQuery.refetch();
    categoriesQuery.refetch();
  };

  return { categoryBreakdown, monthlyTrend, topCategories, isLoading, isError, refetch };
}
