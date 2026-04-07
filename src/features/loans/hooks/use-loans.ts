import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDatabase } from '@core/providers/database-provider';
import { LoanRepository } from '@core/repositories/loan-repository';

export function useLoans() {
  const db = useDatabase();
  const queryClient = useQueryClient();
  const repo = useMemo(() => new LoanRepository(db), [db]);

  const allQuery = useQuery({
    queryKey: ['loans', 'all'],
    queryFn: () => repo.getAll(),
  });

  const countQuery = useQuery({
    queryKey: ['loans', 'count'],
    queryFn: () => repo.getCount(),
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<import('../types').Loan, keyof import('@core/models/base').BaseModel>) => repo.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => repo.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
    },
  });

  const markPaidMutation = useMutation({
    mutationFn: (id: string) => repo.markPaid(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
    },
  });

  return { allQuery, countQuery, createMutation, deleteMutation, markPaidMutation };
}
