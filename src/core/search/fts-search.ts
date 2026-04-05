import type { SQLiteDatabase } from 'expo-sqlite';
import type { Transaction } from '@core/models';
import type { ISearchEngine, SearchResult, SearchOptions } from './interfaces';

export class FTSSearchEngine implements ISearchEngine<Transaction> {
  constructor(private db: SQLiteDatabase) {}

  async search(query: string, options?: SearchOptions): Promise<SearchResult<Transaction>[]> {
    if (!query.trim()) return [];

    const limit = options?.limit ?? 50;
    // Append * for prefix matching: "coff" matches "coffee"
    const ftsQuery = query.trim().split(/\s+/).map(w => `${w}*`).join(' ');

    const results = await this.db.getAllAsync<Transaction & { rank: number }>(
      `SELECT t.*, fts.rank
       FROM transactions_fts fts
       JOIN transactions t ON t.rowid = fts.rowid
       WHERE transactions_fts MATCH ? AND t.deleted_at IS NULL
       ORDER BY fts.rank
       LIMIT ?`,
      [ftsQuery, limit]
    );

    return results.map((row) => ({
      item: row,
      score: Math.abs(row.rank),
    }));
  }

  // FTS5 index is kept in sync by the TransactionRepository on create/update/delete.
  // These methods exist for interface compliance and future fuzzy engine compatibility.
  async index(): Promise<void> {}
  async update(): Promise<void> {}
  async remove(): Promise<void> {}
}
