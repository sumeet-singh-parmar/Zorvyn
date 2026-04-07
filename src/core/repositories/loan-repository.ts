import type { SQLiteDatabase } from 'expo-sqlite';
import type { Loan } from '@features/loans/types';
import { BaseRepository } from './base-repository';

export class LoanRepository extends BaseRepository<Loan> {
  constructor(db: SQLiteDatabase) {
    super(db, 'loans');
  }

  async getLending(): Promise<Loan[]> {
    return this.db.getAllAsync<Loan>(
      `SELECT * FROM loans WHERE type = 'lending' AND deleted_at IS NULL ORDER BY date DESC`
    );
  }

  async getBorrowing(): Promise<Loan[]> {
    return this.db.getAllAsync<Loan>(
      `SELECT * FROM loans WHERE type = 'borrowing' AND deleted_at IS NULL ORDER BY date DESC`
    );
  }

  async getActive(): Promise<Loan[]> {
    return this.db.getAllAsync<Loan>(
      `SELECT * FROM loans WHERE status = 'active' AND deleted_at IS NULL ORDER BY date DESC`
    );
  }

  async getCount(): Promise<{ lending: number; borrowing: number }> {
    const lending = await this.db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM loans WHERE type = 'lending' AND status = 'active' AND deleted_at IS NULL`
    );
    const borrowing = await this.db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM loans WHERE type = 'borrowing' AND status = 'active' AND deleted_at IS NULL`
    );
    return { lending: lending?.count ?? 0, borrowing: borrowing?.count ?? 0 };
  }

  async markPaid(id: string): Promise<void> {
    await this.db.runAsync(
      `UPDATE loans SET status = 'paid', updated_at = datetime('now') WHERE id = ?`,
      [id]
    );
  }
}
