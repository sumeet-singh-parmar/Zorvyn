import type { BaseModel } from '@core/models';

export interface IRepository<T extends BaseModel> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(data: Omit<T, keyof BaseModel>): Promise<T>;
  update(id: string, data: Partial<Omit<T, keyof BaseModel>>): Promise<T>;
  delete(id: string): Promise<void>;
}

export interface IDataSource<T extends BaseModel> {
  findAll(options?: QueryOptions): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  insert(item: T): Promise<T>;
  update(id: string, fields: Partial<T>): Promise<T>;
  softDelete(id: string): Promise<void>;
}

export interface QueryOptions {
  where?: Record<string, unknown>;
  orderBy?: string;
  order?: 'ASC' | 'DESC';
  limit?: number;
  offset?: number;
  includeDeleted?: boolean;
}
