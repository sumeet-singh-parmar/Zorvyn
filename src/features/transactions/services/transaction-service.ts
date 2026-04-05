import type { Transaction, Category } from '@core/models';
import type { TransactionWithCategory, TransactionSection, DateSection } from '../types';
import { startOfDay, startOfWeek } from '@core/utils/date';

export function groupTransactionsByDate(
  transactions: Transaction[],
  categories: Category[]
): TransactionSection[] {
  const catMap = new Map(categories.map((c) => [c.id, c]));
  const today = startOfDay();
  const yesterday = startOfDay(new Date(Date.now() - 86400000));
  const weekStart = startOfWeek();

  const sections: Record<DateSection, TransactionWithCategory[]> = {
    Today: [],
    Yesterday: [],
    'This Week': [],
    Earlier: [],
  };

  for (const tx of transactions) {
    const category = catMap.get(tx.category_id);
    const withCat: TransactionWithCategory = { ...tx, category };

    if (tx.date >= today) sections['Today'].push(withCat);
    else if (tx.date >= yesterday) sections['Yesterday'].push(withCat);
    else if (tx.date >= weekStart) sections['This Week'].push(withCat);
    else sections['Earlier'].push(withCat);
  }

  return (Object.entries(sections) as [DateSection, TransactionWithCategory[]][])
    .filter(([, data]) => data.length > 0)
    .map(([title, data]) => ({ title, data }));
}

export function filterTransactionsBySearch(
  transactions: TransactionWithCategory[],
  query: string
): TransactionWithCategory[] {
  if (!query.trim()) return transactions;
  const lower = query.toLowerCase();
  return transactions.filter(
    (tx) =>
      tx.category?.name.toLowerCase().includes(lower) ||
      tx.notes?.toLowerCase().includes(lower)
  );
}
