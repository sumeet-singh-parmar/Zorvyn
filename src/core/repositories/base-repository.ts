import type { BaseModel } from '@core/models';
import type { IRepository } from './interfaces';
import type { SQLiteDatabase } from 'expo-sqlite';
import { generateUUID } from '@core/utils/uuid';
import { nowISO } from '@core/utils/date';

export abstract class BaseRepository<T extends BaseModel> implements IRepository<T> {
  constructor(
    protected db: SQLiteDatabase,
    protected tableName: string
  ) {}

  async getAll(): Promise<T[]> {
    return this.db.getAllAsync<T>(
      `SELECT * FROM ${this.tableName} WHERE deleted_at IS NULL ORDER BY created_at DESC`
    );
  }

  async getById(id: string): Promise<T | null> {
    return this.db.getFirstAsync<T>(
      `SELECT * FROM ${this.tableName} WHERE id = ? AND deleted_at IS NULL`,
      [id]
    );
  }

  async create(data: Omit<T, keyof BaseModel>): Promise<T> {
    const now = nowISO();
    const id = generateUUID();

    const record = {
      id,
      ...data,
      created_at: now,
      updated_at: now,
      deleted_at: null,
      sync_status: 'pending',
    } as unknown as T;

    const fields = Object.keys(record);
    const placeholders = fields.map(() => '?').join(', ');
    const values = fields.map((f) => (record as Record<string, unknown>)[f]);

    await this.db.runAsync(
      `INSERT INTO ${this.tableName} (${fields.join(', ')}) VALUES (${placeholders})`,
      values as (string | number | null)[]
    );

    return record;
  }

  async update(id: string, data: Partial<Omit<T, keyof BaseModel>>): Promise<T> {
    const now = nowISO();
    const fields = { ...data, updated_at: now, sync_status: 'pending' } as Record<string, unknown>;

    const setClauses = Object.keys(fields)
      .map((k) => `${k} = ?`)
      .join(', ');
    const values = [...Object.values(fields), id];

    await this.db.runAsync(
      `UPDATE ${this.tableName} SET ${setClauses} WHERE id = ? AND deleted_at IS NULL`,
      values as (string | number | null)[]
    );

    const updated = await this.getById(id);
    if (!updated) throw new Error(`${this.tableName} with id ${id} not found`);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const now = nowISO();
    await this.db.runAsync(
      `UPDATE ${this.tableName} SET deleted_at = ?, updated_at = ?, sync_status = 'pending' WHERE id = ? AND deleted_at IS NULL`,
      [now, now, id]
    );
  }
}
