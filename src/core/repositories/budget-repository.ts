import type { SQLiteDatabase } from 'expo-sqlite';
import type { Budget } from '@core/models';
import { BaseRepository } from './base-repository';

export class BudgetRepository extends BaseRepository<Budget> {
  constructor(db: SQLiteDatabase) {
    super(db, 'budgets');
  }

  async getActive(): Promise<Budget[]> {
    return this.db.getAllAsync<Budget>(
      'SELECT * FROM budgets WHERE is_active = 1 AND deleted_at IS NULL ORDER BY created_at DESC'
    );
  }

  async getByCategory(categoryId: string): Promise<Budget | null> {
    return this.db.getFirstAsync<Budget>(
      'SELECT * FROM budgets WHERE category_id = ? AND is_active = 1 AND deleted_at IS NULL',
      [categoryId]
    );
  }

  async getSpentAmount(categoryId: string, startDate: string, endDate: string): Promise<number> {
    const result = await this.db.getFirstAsync<{ total: number }>(
      `SELECT COALESCE(SUM(amount), 0) as total FROM transactions
       WHERE category_id = ? AND type = 'expense' AND date >= ? AND date <= ? AND deleted_at IS NULL`,
      [categoryId, startDate, endDate]
    );
    return result?.total ?? 0;
  }
}
