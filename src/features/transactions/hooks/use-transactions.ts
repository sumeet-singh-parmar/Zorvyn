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
      if (dateRange) return transactionRepo.getByDateRange(dateRange.start, dateRange.end);
      if (selectedAccountId) return transactionRepo.getByAccount(selectedAccountId);
      if (selectedCategoryId) return transactionRepo.getByCategory(selectedCategoryId);
      if (selectedType) return transactionRepo.getByType(selectedType);
      return transactionRepo.getAll();
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
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets.active });
    },
  });

  return { transactionsQuery, categoriesQuery, deleteMutation };
}
