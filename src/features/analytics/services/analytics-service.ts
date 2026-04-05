import type { Transaction, Category } from '@core/models';
import type { CategorySpending, MonthlyTrend } from '../types';

export function getCategoryBreakdown(
  transactions: Transaction[],
  categories: Category[]
): CategorySpending[] {
  const catMap = new Map(categories.map((c) => [c.id, c]));
  const expenses = transactions.filter((t) => t.type === 'expense');
  const total = expenses.reduce((sum, t) => sum + t.amount, 0);
  if (total === 0) return [];

  const grouped: Record<string, number> = {};
  for (const tx of expenses) {
    grouped[tx.category_id] = (grouped[tx.category_id] ?? 0) + tx.amount;
  }

  return Object.entries(grouped)
    .map(([catId, amount]) => {
      const cat = catMap.get(catId);
      return {
        categoryId: catId,
        categoryName: cat?.name ?? 'Other',
        icon: cat?.icon ?? 'circle',
        color: cat?.color ?? '#AEB6BF',
        amount,
        percentage: Math.round((amount / total) * 100),
      };
    })
    .sort((a, b) => b.amount - a.amount);
}

export function getMonthlyTrend(transactions: Transaction[], months: number = 6): MonthlyTrend[] {
  const now = new Date();
  const result: MonthlyTrend[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStr = d.toISOString().slice(0, 7); // YYYY-MM
    const label = d.toLocaleDateString('en', { month: 'short' });

    const monthTxns = transactions.filter((t) => t.date.startsWith(monthStr));
    const income = monthTxns.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = monthTxns.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

    result.push({ month: label, income, expense });
  }

  return result;
}

export function getMonthlyPercentageChange(monthlyTrend: MonthlyTrend[], type: 'income' | 'expense') {
  if (monthlyTrend.length < 2) return 0;

  const current = monthlyTrend[monthlyTrend.length - 1][type];
  const previous = monthlyTrend[monthlyTrend.length - 2][type];

  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
}

export function getTopCategories(
  categoryBreakdown: CategorySpending[],
  limit: number = 5
): CategorySpending[] {
  return categoryBreakdown.slice(0, limit);
}
