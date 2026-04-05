import type { Budget, Category } from '@core/models';

export interface BudgetWithProgress extends Budget {
  category?: Category;
  spent: number;
  remaining: number;
  progress: number; // 0 to 1
}
