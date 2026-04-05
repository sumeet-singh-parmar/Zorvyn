import { BaseModel } from './base';

export interface Tag extends BaseModel {
  name: string;
  color: string | null;
}

export interface TransactionTag {
  transaction_id: string;
  tag_id: string;
}
