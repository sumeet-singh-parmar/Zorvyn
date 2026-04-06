import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDatabase } from '@core/providers/database-provider';
import { RecurringRepository } from '@core/repositories/recurring-repository';
import { CategoryRepository } from '@core/repositories/category-repository';
import { queryKeys } from '@core/constants/query-keys';

export function useRecurring() {
  const db = useDatabase();
  const queryClient = useQueryClient();
  const repo = useMemo(() => new RecurringRepository(db), [db]);
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

  return {
    allQuery,
    categoriesQuery,
    countQuery,
    createMutation,
    deleteMutation,
    toggleMutation,
  };
}
