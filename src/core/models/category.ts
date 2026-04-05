import { BaseModel } from './base';

export type CategoryType = 'income' | 'expense' | 'both';

export interface Category extends BaseModel {
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
  parent_id: string | null;
  sort_order: number;
  is_default: number;
}
