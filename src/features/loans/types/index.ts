import type { BaseModel } from '@core/models/base';

export type LoanType = 'lending' | 'borrowing';
export type LoanStatus = 'active' | 'paid';

export interface Loan extends BaseModel {
  person_name: string;
  amount: number;
  type: LoanType;
  date: string;
  due_date: string | null;
  notes: string | null;
  status: LoanStatus;
}
