import type { BudgetWithProgress } from '../types';

// Static semantic colors -- these are fixed (not accent-derived) so safe to import statically
const INCOME_COLOR = '#00C48C';
const EXPENSE_COLOR = '#FF6B6B';
const WARNING_COLOR = '#FDCB6E';

export function calculateSpendingVelocity(
  spent: number,
  limit: number,
  daysElapsed: number,
  totalDays: number
): 'on_track' | 'warning' | 'over_budget' {
  if (spent >= limit) return 'over_budget';
  const expectedSpend = (daysElapsed / totalDays) * limit;
  if (spent > expectedSpend * 1.2) return 'warning';
  return 'on_track';
}

export function getBudgetStatusColor(progress: number): string {
  if (progress >= 0.9) return EXPENSE_COLOR;
  if (progress >= 0.7) return WARNING_COLOR;
  return INCOME_COLOR;
}

export function getBudgetStatusLabel(progress: number): string {
  if (progress >= 1) return 'Over Budget';
  if (progress >= 0.9) return 'Almost There';
  if (progress >= 0.7) return 'Be Careful';
  return 'On Track';
}

export function sortBudgetsByUrgency(budgets: BudgetWithProgress[]): BudgetWithProgress[] {
  return [...budgets].sort((a, b) => b.progress - a.progress);
}
