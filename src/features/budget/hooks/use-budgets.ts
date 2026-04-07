import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDatabase } from '@core/providers/database-provider';
import { BudgetRepository } from '@core/repositories/budget-repository';
import { CategoryRepository } from '@core/repositories/category-repository';
import { queryKeys } from '@core/constants/query-keys';
import { startOfMonth, endOfMonth } from '@core/utils/date';
import type { BudgetWithProgress } from '../types';
import type { BudgetPeriod } from '@core/models';
import { useCurrencyStore } from '@stores/currency-store';

export function useBudgets() {
  const db = useDatabase();
  const queryClient = useQueryClient();
  const budgetRepo = useMemo(() => new BudgetRepository(db), [db]);
  const categoryRepo = useMemo(() => new CategoryRepository(db), [db]);
  const currencyCode = useCurrencyStore((s) => s.currencyCode);

  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const budgetsQuery = useQuery({
    queryKey: queryKeys.budgets.active,
    queryFn: async (): Promise<BudgetWithProgress[]> => {
      const budgets = await budgetRepo.getActive();
      const categories = await categoryRepo.getAll();
      const catMap = new Map(categories.map((c) => [c.id, c]));

      const results: BudgetWithProgress[] = [];
      for (const budget of budgets) {
        const spent = await budgetRepo.getSpentAmount(budget.category_id, monthStart, monthEnd);
        const remaining = Math.max(0, budget.amount - spent);
        const progress = budget.amount > 0 ? spent / budget.amount : 0;

        results.push({
          ...budget,
          category: catMap.get(budget.category_id),
          spent,
          remaining,
          progress,
        });
      }

      return results;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: { categoryId: string; amount: number; period: BudgetPeriod }) =>
      budgetRepo.create({
        category_id: data.categoryId,
        amount: data.amount,
        period: data.period,
        currency_code: currencyCode,
        start_date: monthStart,
        alert_threshold: 0.8,
        is_active: 1,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; categoryId: string; amount: number; period: BudgetPeriod }) =>
      budgetRepo.update(data.id, {
        category_id: data.categoryId,
        amount: data.amount,
        period: data.period,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => budgetRepo.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });

  return { budgetsQuery, createMutation, updateMutation, deleteMutation };
}
