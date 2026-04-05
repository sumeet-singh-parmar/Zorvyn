import { BaseModel } from './base';

export interface GoalContribution extends BaseModel {
  goal_id: string;
  amount: number;
  account_id: string | null;
  notes: string | null;
}
