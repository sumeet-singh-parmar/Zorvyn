import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDatabase } from '@core/providers/database-provider';
import { GoalRepository } from '@core/repositories/goal-repository';
import { GoalContributionRepository } from '@core/repositories/goal-contribution-repository';
import { queryKeys } from '@core/constants/query-keys';
import { useCurrencyStore } from '@stores/currency-store';
import { daysRemaining } from '@core/utils/date';

export function useGoals() {
  const db = useDatabase();
  const queryClient = useQueryClient();
  const goalRepo = useMemo(() => new GoalRepository(db), [db]);
  const contributionRepo = useMemo(() => new GoalContributionRepository(db), [db]);
  const currencyCode = useCurrencyStore((s) => s.currencyCode);

  const activeGoalsQuery = useQuery({
    queryKey: queryKeys.goals.active,
    queryFn: () => goalRepo.getActive(),
  });

  const completedGoalsQuery = useQuery({
    queryKey: queryKeys.goals.completed,
    queryFn: () => goalRepo.getCompleted(),
  });

  const createGoalMutation = useMutation({
    mutationFn: (data: { name: string; targetAmount: number; deadline?: string; icon?: string; color?: string }) =>
      goalRepo.create({
        name: data.name,
        target_amount: data.targetAmount,
        current_amount: 0,
        currency_code: currencyCode,
        deadline: data.deadline ?? null,
        icon: data.icon ?? null,
        color: data.color ?? null,
        is_completed: 0,
        completed_at: null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.active });
    },
  });

  const addContributionMutation = useMutation({
    mutationFn: async (data: { goalId: string; amount: number; accountId?: string; notes?: string }) => {
      await contributionRepo.create({
        goal_id: data.goalId,
        amount: data.amount,
        account_id: data.accountId ?? null,
        notes: data.notes ?? null,
      });
      // Update goal's current_amount
      const total = await contributionRepo.getTotalByGoal(data.goalId);
      const goal = await goalRepo.getById(data.goalId);
      if (goal) {
        await goalRepo.update(data.goalId, { current_amount: total } as any);
        if (total >= goal.target_amount) {
          await goalRepo.markCompleted(data.goalId);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.active });
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.completed });
    },
  });

  const deleteGoalMutation = useMutation({
    mutationFn: (id: string) => goalRepo.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.active });
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.completed });
    },
  });

  return {
    activeGoalsQuery,
    completedGoalsQuery,
    createGoalMutation,
    addContributionMutation,
    deleteGoalMutation,
  };
}
