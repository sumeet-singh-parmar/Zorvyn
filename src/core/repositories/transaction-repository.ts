import type { SQLiteDatabase } from 'expo-sqlite';
import type { Transaction } from '@core/models';
import { BaseRepository } from './base-repository';

export class TransactionRepository extends BaseRepository<Transaction> {
  constructor(db: SQLiteDatabase) {
    super(db, 'transactions');
  }

  async getByDateRange(startDate: string, endDate: string): Promise<Transaction[]> {
    return this.db.getAllAsync<Transaction>(
      `SELECT * FROM transactions WHERE date >= ? AND date <= ? AND deleted_at IS NULL ORDER BY date DESC`,
      [startDate, endDate]
    );
  }

  async getByAccount(accountId: string): Promise<Transaction[]> {
    return this.db.getAllAsync<Transaction>(
      `SELECT * FROM transactions WHERE account_id = ? AND deleted_at IS NULL ORDER BY date DESC`,
      [accountId]
    );
  }

  async getByCategory(categoryId: string): Promise<Transaction[]> {
    return this.db.getAllAsync<Transaction>(
      `SELECT * FROM transactions WHERE category_id = ? AND deleted_at IS NULL ORDER BY date DESC`,
      [categoryId]
    );
  }

  async getByType(type: Transaction['type']): Promise<Transaction[]> {
    return this.db.getAllAsync<Transaction>(
      `SELECT * FROM transactions WHERE type = ? AND deleted_at IS NULL ORDER BY date DESC`,
      [type]
    );
  }

  async getTotalByType(
    type: Transaction['type'],
    startDate?: string,
    endDate?: string
  ): Promise<number> {
    let query = `SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = ? AND deleted_at IS NULL`;
    const params: (string | number)[] = [type];

    if (startDate) {
      query += ' AND date >= ?';
      params.push(startDate);
    }
    if (endDate) {
      query += ' AND date <= ?';
      params.push(endDate);
    }

    const result = await this.db.getFirstAsync<{ total: number }>(query, params);
    return result?.total ?? 0;
  }

  async create(data: Omit<Transaction, keyof import('@core/models').BaseModel>): Promise<Transaction> {
    const record = await super.create(data);

    // Sync FTS index
    if (data.notes) {
      await this.db.runAsync(
        `INSERT INTO transactions_fts(rowid, notes)
         SELECT rowid, notes FROM transactions WHERE id = ?`,
        [record.id]
      );
    }

    return record;
  }

  async update(
    id: string,
    data: Partial<Omit<Transaction, keyof import('@core/models').BaseModel>>
  ): Promise<Transaction> {
    const record = await super.update(id, data);

    // Sync FTS index
    if ('notes' in data) {
      await this.db.runAsync(
        `DELETE FROM transactions_fts WHERE rowid = (SELECT rowid FROM transactions WHERE id = ?)`,
        [id]
      );
      if (record.notes) {
        await this.db.runAsync(
          `INSERT INTO transactions_fts(rowid, notes)
           SELECT rowid, notes FROM transactions WHERE id = ?`,
          [id]
        );
      }
    }

    return record;
  }

  async delete(id: string): Promise<void> {
    // Remove from FTS before soft delete
    await this.db.runAsync(
      `DELETE FROM transactions_fts WHERE rowid = (SELECT rowid FROM transactions WHERE id = ?)`,
      [id]
    );
    await super.delete(id);
  }
}
