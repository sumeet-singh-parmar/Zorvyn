import { BaseModel } from './base';

export type BudgetPeriod = 'weekly' | 'monthly' | 'yearly';

export interface Budget extends BaseModel {
  category_id: string;
  amount: number;
  period: BudgetPeriod;
  currency_code: string;
  start_date: string;
  alert_threshold: number;
  is_active: number;
}
