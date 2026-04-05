import { useState, useMemo, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDatabase } from '@core/providers/database-provider';
import { TransactionRepository } from '@core/repositories/transaction-repository';
import { AccountRepository } from '@core/repositories/account-repository';
import { CategoryRepository } from '@core/repositories/category-repository';
import { queryKeys } from '@core/constants/query-keys';
import { useCurrencyStore } from '@stores/currency-store';
import type { TransactionType } from '@core/models';

export function useTransactionForm() {
  const db = useDatabase();
  const queryClient = useQueryClient();
  const transactionRepo = useMemo(() => new TransactionRepository(db), [db]);
  const accountRepo = useMemo(() => new AccountRepository(db), [db]);
  const categoryRepo = useMemo(() => new CategoryRepository(db), [db]);
  const currencyCode = useCurrencyStore((s) => s.currencyCode);

  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [categoryId, setCategoryId] = useState('');
  const [accountId, setAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const accountsQuery = useQuery({
    queryKey: queryKeys.accounts.all,
    queryFn: () => accountRepo.getAll(),
  });

  const categoriesQuery = useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => categoryRepo.getAll(),
  });

  const filteredCategories = useMemo(() => {
    if (!categoriesQuery.data) return [];
    if (type === 'transfer') return [];
    return categoriesQuery.data.filter(
      (c) => c.type === type || c.type === 'both'
    );
  }, [categoriesQuery.data, type]);

  const createMutation = useMutation({
    mutationFn: async () => {
      const parsedAmount = parseFloat(amount);
      if (!parsedAmount || parsedAmount <= 0) throw new Error('Invalid amount');
      if (type !== 'transfer' && !categoryId) throw new Error('Select a category');
      if (!accountId) throw new Error('Select an account');

      const record = await transactionRepo.create({
        amount: parsedAmount,
        type,
        category_id: categoryId || 'uncategorized',
        account_id: accountId,
        to_account_id: type === 'transfer' ? toAccountId || null : null,
        currency_code: currencyCode,
        date: new Date(date).toISOString(),
        notes: notes.trim() || null,
        recurring_id: null,
        attachment_path: null,
        latitude: null,
        longitude: null,
      });

      // Update account balance
      if (type === 'income') {
        await accountRepo.updateBalance(accountId, parsedAmount);
      } else if (type === 'expense') {
        await accountRepo.updateBalance(accountId, -parsedAmount);
      } else if (type === 'transfer') {
        await accountRepo.updateBalance(accountId, -parsedAmount);
        if (toAccountId) {
          await accountRepo.updateBalance(toAccountId, parsedAmount);
        }
      }

      return record;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets.active });
    },
  });

  const reset = () => {
    setAmount('');
    setType('expense');
    setCategoryId('');
    setAccountId('');
    setToAccountId('');
    setDate(new Date().toISOString().split('T')[0]);
    setNotes('');
  };

  const accounts = accountsQuery.data ?? [];

  // Pre-select default account (in useEffect to avoid infinite re-render loop)
  useEffect(() => {
    if (!accountId && accounts.length > 0) {
      const defaultAcc = accounts.find((a) => a.is_default) ?? accounts[0];
      setAccountId(defaultAcc.id);
    }
  }, [accounts, accountId]);

  return {
    amount, setAmount,
    type, setType,
    categoryId, setCategoryId,
    accountId, setAccountId,
    toAccountId, setToAccountId,
    date, setDate,
    notes, setNotes,
    accounts,
    filteredCategories,
    createMutation,
    reset,
  };
}
