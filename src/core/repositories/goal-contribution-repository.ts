import type { SQLiteDatabase } from 'expo-sqlite';
import type { GoalContribution } from '@core/models';
import { BaseRepository } from './base-repository';

export class GoalContributionRepository extends BaseRepository<GoalContribution> {
  constructor(db: SQLiteDatabase) {
    super(db, 'goal_contributions');
  }

  async getByGoal(goalId: string): Promise<GoalContribution[]> {
    return this.db.getAllAsync<GoalContribution>(
      'SELECT * FROM goal_contributions WHERE goal_id = ? AND deleted_at IS NULL ORDER BY created_at DESC',
      [goalId]
    );
  }

  async getTotalByGoal(goalId: string): Promise<number> {
    const result = await this.db.getFirstAsync<{ total: number }>(
      'SELECT COALESCE(SUM(amount), 0) as total FROM goal_contributions WHERE goal_id = ? AND deleted_at IS NULL',
      [goalId]
    );
    return result?.total ?? 0;
  }
}
