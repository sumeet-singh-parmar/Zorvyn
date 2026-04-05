export type SyncStatus = 'pending' | 'synced' | 'conflict';

export interface BaseModel {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  sync_status: SyncStatus;
}

export interface CreateInput<T extends BaseModel> {
  data: Omit<T, keyof BaseModel>;
}

export interface UpdateInput<T extends BaseModel> {
  id: string;
  data: Partial<Omit<T, keyof BaseModel>>;
}
