import { BaseModel } from './base';

export type TransactionType = 'income' | 'expense' | 'transfer';

export interface Transaction extends BaseModel {
  amount: number;
  type: TransactionType;
  category_id: string;
  account_id: string;
  to_account_id: string | null;
  currency_code: string;
  date: string;
  notes: string | null;
  recurring_id: string | null;
  attachment_path: string | null;
  latitude: number | null;
  longitude: number | null;
}
