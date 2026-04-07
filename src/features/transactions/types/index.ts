import type { Transaction, Category } from '@core/models';

export interface TransactionWithCategory extends Transaction {
  category?: Category;
}

export interface TransactionSection {
  title: string;
  data: TransactionWithCategory[];
}
