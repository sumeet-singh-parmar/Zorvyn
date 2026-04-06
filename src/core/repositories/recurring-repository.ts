import type { SQLiteDatabase } from 'expo-sqlite';
import type { RecurringRule, RecurringRuleWithCategory } from '@features/recurring/types';
import { BaseRepository } from './base-repository';

export class RecurringRepository extends BaseRepository<RecurringRule> {
  constructor(db: SQLiteDatabase) {
    super(db, 'recurring_rules');
  }

  async getAllWithCategory(): Promise<RecurringRuleWithCategory[]> {
    return this.db.getAllAsync<RecurringRuleWithCategory>(
      `SELECT r.*, c.name as category_name, c.icon as category_icon, c.color as category_color
       FROM recurring_rules r
       LEFT JOIN categories c ON r.category_id = c.id
       WHERE r.deleted_at IS NULL
       ORDER BY r.next_due_date ASC`
    );
  }

  async getActive(): Promise<RecurringRuleWithCategory[]> {
    return this.db.getAllAsync<RecurringRuleWithCategory>(
      `SELECT r.*, c.name as category_name, c.icon as category_icon, c.color as category_color
       FROM recurring_rules r
       LEFT JOIN categories c ON r.category_id = c.id
       WHERE r.deleted_at IS NULL AND r.is_active = 1
       ORDER BY r.next_due_date ASC`
    );
  }

  async getPaused(): Promise<RecurringRuleWithCategory[]> {
    return this.db.getAllAsync<RecurringRuleWithCategory>(
      `SELECT r.*, c.name as category_name, c.icon as category_icon, c.color as category_color
       FROM recurring_rules r
       LEFT JOIN categories c ON r.category_id = c.id
       WHERE r.deleted_at IS NULL AND r.is_active = 0
       ORDER BY r.next_due_date ASC`
    );
  }

  async getCount(): Promise<{ active: number; paused: number }> {
    const active = await this.db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM recurring_rules WHERE deleted_at IS NULL AND is_active = 1`
    );
    const paused = await this.db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM recurring_rules WHERE deleted_at IS NULL AND is_active = 0`
    );
    return { active: active?.count ?? 0, paused: paused?.count ?? 0 };
  }

  async toggleActive(id: string, isActive: boolean): Promise<void> {
    await this.db.runAsync(
      `UPDATE recurring_rules SET is_active = ?, updated_at = datetime('now') WHERE id = ?`,
      [isActive ? 1 : 0, id]
    );
  }
}
