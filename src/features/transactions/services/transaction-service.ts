import type { Transaction, Category } from '@core/models';
import type { TransactionWithCategory, TransactionSection } from '../types';

function getSectionKey(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const txDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (txDay.getTime() === today.getTime()) return 'Today';
  if (txDay.getTime() === yesterday.getTime()) return 'Yesterday';

  // Same week
  const dayOfWeek = now.getDay() || 7; // Mon=1
  const weekStart = new Date(today.getTime() - (dayOfWeek - 1) * 86400000);
  if (txDay >= weekStart) return 'This Week';

  // Last week
  const lastWeekStart = new Date(weekStart.getTime() - 7 * 86400000);
  if (txDay >= lastWeekStart) return 'Last Week';

  // Same year — show month name
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString('en', { month: 'long' });
  }

  // Different year — show month + year
  return date.toLocaleDateString('en', { month: 'long', year: 'numeric' });
}

export function groupTransactionsByDate(
  transactions: Transaction[],
  categories: Category[]
): TransactionSection[] {
  const catMap = new Map(categories.map((c) => [c.id, c]));
  const sectionsMap = new Map<string, TransactionWithCategory[]>();
  const sectionOrder: string[] = [];

  for (const tx of transactions) {
    const category = catMap.get(tx.category_id);
    const withCat: TransactionWithCategory = { ...tx, category };
    const key = getSectionKey(new Date(tx.date));

    if (!sectionsMap.has(key)) {
      sectionsMap.set(key, []);
      sectionOrder.push(key);
    }
    sectionsMap.get(key)!.push(withCat);
  }

  return sectionOrder
    .map((title) => ({ title, data: sectionsMap.get(title)! }))
    .filter((s) => s.data.length > 0);
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
