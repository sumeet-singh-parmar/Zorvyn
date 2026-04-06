import type { BaseModel } from '@core/models/base';

export type RecurringFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface RecurringRule extends BaseModel {
  amount: number;
  type: 'income' | 'expense';
  category_id: string;
  account_id: string;
  currency_code: string;
  frequency: RecurringFrequency;
  interval_count: number;
  next_due_date: string;
  end_date: string | null;
  notes: string | null;
  is_active: number;
}

export interface RecurringRuleWithCategory extends RecurringRule {
  category_name?: string;
  category_icon?: string;
  category_color?: string;
}
