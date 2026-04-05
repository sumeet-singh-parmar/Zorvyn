import type { SQLiteDatabase } from 'expo-sqlite';
import type { Goal } from '@core/models';
import { BaseRepository } from './base-repository';

export class GoalRepository extends BaseRepository<Goal> {
  constructor(db: SQLiteDatabase) {
    super(db, 'goals');
  }

  async getActive(): Promise<Goal[]> {
    return this.db.getAllAsync<Goal>(
      'SELECT * FROM goals WHERE is_completed = 0 AND deleted_at IS NULL ORDER BY created_at DESC'
    );
  }

  async getCompleted(): Promise<Goal[]> {
    return this.db.getAllAsync<Goal>(
      'SELECT * FROM goals WHERE is_completed = 1 AND deleted_at IS NULL ORDER BY completed_at DESC'
    );
  }

  async markCompleted(id: string): Promise<void> {
    const now = new Date().toISOString();
    await this.db.runAsync(
      `UPDATE goals SET is_completed = 1, completed_at = ?, updated_at = ?, sync_status = 'pending' WHERE id = ?`,
      [now, now, id]
    );
  }
}
