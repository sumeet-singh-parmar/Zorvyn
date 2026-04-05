import { BaseModel } from './base';

export interface Goal extends BaseModel {
  name: string;
  target_amount: number;
  current_amount: number;
  currency_code: string;
  deadline: string | null;
  icon: string | null;
  color: string | null;
  is_completed: number;
  completed_at: string | null;
}
