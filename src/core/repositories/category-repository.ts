import type { SQLiteDatabase } from 'expo-sqlite';
import type { Category, CategoryType } from '@core/models';
import { BaseRepository } from './base-repository';

export class CategoryRepository extends BaseRepository<Category> {
  constructor(db: SQLiteDatabase) {
    super(db, 'categories');
  }

  async getAll(): Promise<Category[]> {
    return this.db.getAllAsync<Category>(
      'SELECT * FROM categories WHERE deleted_at IS NULL ORDER BY sort_order ASC'
    );
  }

  async getByType(type: CategoryType): Promise<Category[]> {
    return this.db.getAllAsync<Category>(
      `SELECT * FROM categories WHERE (type = ? OR type = 'both') AND deleted_at IS NULL ORDER BY sort_order ASC`,
      [type]
    );
  }

  async getChildren(parentId: string): Promise<Category[]> {
    return this.db.getAllAsync<Category>(
      'SELECT * FROM categories WHERE parent_id = ? AND deleted_at IS NULL ORDER BY sort_order ASC',
      [parentId]
    );
  }
}
