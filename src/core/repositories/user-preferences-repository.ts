import type { SQLiteDatabase } from 'expo-sqlite';
import type { UserPreferences } from '@core/models';
import { BaseRepository } from './base-repository';

export class UserPreferencesRepository extends BaseRepository<UserPreferences> {
  constructor(db: SQLiteDatabase) {
    super(db, 'user_preferences');
  }

  async get(): Promise<UserPreferences | null> {
    return this.db.getFirstAsync<UserPreferences>(
      'SELECT * FROM user_preferences WHERE deleted_at IS NULL LIMIT 1'
    );
  }

  async updatePreferences(data: Partial<Omit<UserPreferences, keyof import('@core/models').BaseModel>>): Promise<UserPreferences> {
    const current = await this.get();
    if (!current) throw new Error('User preferences not found — run seed first');
    return this.update(current.id, data);
  }
}
