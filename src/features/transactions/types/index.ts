import type { Transaction, Category } from '@core/models';

export interface TransactionWithCategory extends Transaction {
  category?: Category;
}

export type DateSection = 'Today' | 'Yesterday' | 'This Week' | 'Earlier';

export interface TransactionSection {
  title: DateSection;
  data: TransactionWithCategory[];
}
