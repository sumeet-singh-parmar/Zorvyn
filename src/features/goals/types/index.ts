import type { Goal } from '@core/models';

export interface GoalWithProgress extends Goal {
  progress: number; // 0 to 1
  daysRemaining: number | null;
}
