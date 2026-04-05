import { BaseModel } from './base';

export type AccountType = 'bank' | 'cash' | 'wallet' | 'credit_card';

export interface Account extends BaseModel {
  name: string;
  type: AccountType;
  balance: number;
  currency_code: string;
  icon: string | null;
  color: string | null;
  is_default: number;
  sort_order: number;
}
