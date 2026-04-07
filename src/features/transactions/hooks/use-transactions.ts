import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useDatabase } from '@core/providers/database-provider';
import { TransactionRepository } from '@core/repositories/transaction-repository';
import { AccountRepository } from '@core/repositories/account-repository';
import { CategoryRepository } from '@core/repositories/category-repository';
import { queryKeys } from '@core/constants/query-keys';
import { useFiltersStore } from '@stores/filters-store';

export function useTransactions() {
  const db = useDatabase();
  const queryClient = useQueryClient();
  const transactionRepo = useMemo(() => new TransactionRepository(db), [db]);
  const accountRepo = useMemo(() => new AccountRepository(db), [db]);
  const categoryRepo = useMemo(() => new CategoryRepository(db), [db]);
  const { dateRange, selectedAccountId, selectedCategoryId, selectedType } = useFiltersStore();

  const transactionsQuery = useQuery({
    queryKey: [
      ...queryKeys.transactions.all,
      dateRange?.start,
      dateRange?.end,
      selectedAccountId,
      selectedCategoryId,
      selectedType,
    ],
    queryFn: async () => {
      // Fetch all, filter in JS for combined filters, sort newest first
      let results = await transactionRepo.getAll();
      results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      if (selectedType) {
        results = results.filter((t) => t.type === selectedType);
      }
      if (dateRange) {
        const startTime = new Date(dateRange.start).getTime();
        const endTime = new Date(dateRange.end).getTime();
        results = results.filter((t) => {
          const txTime = new Date(t.date).getTime();
          return txTime >= startTime && txTime <= endTime;
        });
      }
      if (selectedAccountId) {
        results = results.filter((t) => t.account_id === selectedAccountId);
      }
      if (selectedCategoryId) {
        results = results.filter((t) => t.category_id === selectedCategoryId);
      }

      return results;
    },
    placeholderData: keepPreviousData,
  });

  const categoriesQuery = useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => categoryRepo.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // Fetch the transaction before deleting to reverse the balance
      const tx = await transactionRepo.getById(id);
      if (tx) {
        if (tx.type === 'income') {
          await accountRepo.updateBalance(tx.account_id, -tx.amount);
        } else if (tx.type === 'expense') {
          await accountRepo.updateBalance(tx.account_id, tx.amount);
        } else if (tx.type === 'transfer') {
          await accountRepo.updateBalance(tx.account_id, tx.amount);
          if (tx.to_account_id) {
            await accountRepo.updateBalance(tx.to_account_id, -tx.amount);
          }
        }
      }
      await transactionRepo.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });

  return { transactionsQuery, categoriesQuery, deleteMutation };
}
