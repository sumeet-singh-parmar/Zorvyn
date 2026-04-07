import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDatabase } from '@core/providers/database-provider';
import { RecurringRepository } from '@core/repositories/recurring-repository';
import { TransactionRepository } from '@core/repositories/transaction-repository';
import { AccountRepository } from '@core/repositories/account-repository';
import { CategoryRepository } from '@core/repositories/category-repository';
import { queryKeys } from '@core/constants/query-keys';
import type { RecurringRuleWithCategory, RecurringFrequency } from '../types';

function advanceDueDate(current: string, frequency: RecurringFrequency): string {
  const d = new Date(current);
  if (frequency === 'daily') d.setDate(d.getDate() + 1);
  else if (frequency === 'weekly') d.setDate(d.getDate() + 7);
  else if (frequency === 'monthly') d.setMonth(d.getMonth() + 1);
  else if (frequency === 'yearly') d.setFullYear(d.getFullYear() + 1);
  return d.toISOString();
}

export function useRecurring() {
  const db = useDatabase();
  const queryClient = useQueryClient();
  const repo = useMemo(() => new RecurringRepository(db), [db]);
  const transactionRepo = useMemo(() => new TransactionRepository(db), [db]);
  const accountRepo = useMemo(() => new AccountRepository(db), [db]);
  const categoryRepo = useMemo(() => new CategoryRepository(db), [db]);

  const allQuery = useQuery({
    queryKey: ['recurring', 'all'],
    queryFn: () => repo.getAllWithCategory(),
  });

  const categoriesQuery = useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => categoryRepo.getAll(),
  });

  const countQuery = useQuery({
    queryKey: ['recurring', 'count'],
    queryFn: () => repo.getCount(),
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<import('../types').RecurringRule, keyof import('@core/models/base').BaseModel>) => repo.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => repo.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring'] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => repo.toggleActive(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring'] });
    },
  });

  const payNowMutation = useMutation({
    mutationFn: async (rule: RecurringRuleWithCategory) => {
      // 1. Create a transaction
      await transactionRepo.create({
        amount: rule.amount,
        type: rule.type,
        category_id: rule.category_id,
        account_id: rule.account_id,
        to_account_id: null,
        currency_code: rule.currency_code,
        date: new Date().toISOString(),
        notes: rule.notes ? `${rule.notes} (recurring)` : 'Recurring payment',
        recurring_id: rule.id,
        attachment_path: null,
        latitude: null,
        longitude: null,
      });

      // 2. Update account balance
      if (rule.type === 'expense') {
        await accountRepo.updateBalance(rule.account_id, -rule.amount);
      } else {
        await accountRepo.updateBalance(rule.account_id, rule.amount);
      }

      // 3. Advance the next_due_date
      const nextDate = advanceDueDate(rule.next_due_date, rule.frequency);
      await db.runAsync(
        `UPDATE recurring_rules SET next_due_date = ?, updated_at = datetime('now') WHERE id = ?`,
        [nextDate, rule.id]
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
    },
  });

  return {
    allQuery,
    categoriesQuery,
    countQuery,
    createMutation,
    deleteMutation,
    toggleMutation,
    payNowMutation,
  };
}
