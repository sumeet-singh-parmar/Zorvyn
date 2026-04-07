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
      const goal = await goalRepo.getById(data.goalId);
      if (!goal) throw new Error('Goal not found');

      // Cap contribution at remaining amount
      const remaining = goal.target_amount - goal.current_amount;
      if (remaining <= 0) throw new Error('Goal already completed');
      const cappedAmount = Math.min(data.amount, remaining);

      await contributionRepo.create({
        goal_id: data.goalId,
        amount: cappedAmount,
        account_id: data.accountId ?? null,
        notes: data.notes ?? null,
      });
      // Update goal's current_amount
      const total = await contributionRepo.getTotalByGoal(data.goalId);
      if (goal) {
        await goalRepo.update(data.goalId, { current_amount: total });
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

  const updateGoalMutation = useMutation({
    mutationFn: async (data: { id: string; name: string; targetAmount: number; deadline?: string; icon?: string; color?: string }) => {
      const goal = await goalRepo.getById(data.id);
      await goalRepo.update(data.id, {
        name: data.name,
        target_amount: data.targetAmount,
        deadline: data.deadline ?? null,
        icon: data.icon ?? null,
        color: data.color ?? null,
      });
      // If target was increased above current amount, un-complete the goal
      if (goal && goal.is_completed && data.targetAmount > goal.current_amount) {
        await db.runAsync(
          `UPDATE goals SET is_completed = 0, completed_at = NULL, updated_at = datetime('now') WHERE id = ?`,
          [data.id]
        );
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
    updateGoalMutation,
    addContributionMutation,
    deleteGoalMutation,
  };
}
