import type { SQLiteDatabase } from 'expo-sqlite';
import type { Account } from '@core/models';
import { BaseRepository } from './base-repository';

export class AccountRepository extends BaseRepository<Account> {
  constructor(db: SQLiteDatabase) {
    super(db, 'accounts');
  }

  async getAll(): Promise<Account[]> {
    return this.db.getAllAsync<Account>(
      'SELECT * FROM accounts WHERE deleted_at IS NULL ORDER BY sort_order ASC'
    );
  }

  async getDefault(): Promise<Account | null> {
    return this.db.getFirstAsync<Account>(
      'SELECT * FROM accounts WHERE is_default = 1 AND deleted_at IS NULL'
    );
  }

  async updateBalance(id: string, amount: number): Promise<void> {
    await this.db.runAsync(
      `UPDATE accounts SET balance = balance + ?, updated_at = datetime('now'), sync_status = 'pending' WHERE id = ?`,
      [amount, id]
    );
  }

  async recalculateBalance(id: string): Promise<number> {
    const income = await this.db.getFirstAsync<{ total: number }>(
      `SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE account_id = ? AND type = 'income' AND deleted_at IS NULL`,
      [id]
    );
    const expense = await this.db.getFirstAsync<{ total: number }>(
      `SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE account_id = ? AND type = 'expense' AND deleted_at IS NULL`,
      [id]
    );
    const transfersIn = await this.db.getFirstAsync<{ total: number }>(
      `SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE to_account_id = ? AND type = 'transfer' AND deleted_at IS NULL`,
      [id]
    );
    const transfersOut = await this.db.getFirstAsync<{ total: number }>(
      `SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE account_id = ? AND type = 'transfer' AND deleted_at IS NULL`,
      [id]
    );

    const balance =
      (income?.total ?? 0) -
      (expense?.total ?? 0) +
      (transfersIn?.total ?? 0) -
      (transfersOut?.total ?? 0);

    await this.db.runAsync('UPDATE accounts SET balance = ? WHERE id = ?', [balance, id]);
    return balance;
  }
}
