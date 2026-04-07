import type { Transaction, Category } from '@core/models';
import type { CategorySpending, MonthlyTrend } from '../types';

export type Period = 'week' | 'month' | 'year';

// ── Date range helpers ──

export function getPeriodDateRange(period: Period): { start: Date; end: Date; label: string } {
  const now = new Date();
  if (period === 'week') {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
    const fmt = (d: Date) => `${d.getDate()} ${d.toLocaleDateString('en', { month: 'short' })}`;
    return { start, end: now, label: `${fmt(start)} – ${fmt(now)}, ${now.getFullYear()}` };
  }
  if (period === 'month') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return { start, end: now, label: now.toLocaleDateString('en', { month: 'long', year: 'numeric' }) };
  }
  const start = new Date(now.getFullYear(), 0, 1);
  return { start, end: now, label: String(now.getFullYear()) };
}

export function filterByPeriod(transactions: Transaction[], period: Period): Transaction[] {
  const { start } = getPeriodDateRange(period);
  const startTime = start.getTime();
  return transactions.filter((t) => new Date(t.date).getTime() >= startTime);
}

export function getPreviousPeriodTransactions(transactions: Transaction[], period: Period): Transaction[] {
  const { start: currentStart } = getPeriodDateRange(period);
  const now = new Date();
  const duration = now.getTime() - currentStart.getTime();
  const prevEnd = new Date(currentStart.getTime() - 1);
  const prevStart = new Date(currentStart.getTime() - duration);
  return transactions.filter((t) => {
    const time = new Date(t.date).getTime();
    return time >= prevStart.getTime() && time <= prevEnd.getTime();
  });
}

// ── Category breakdown ──

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

  const sorted = Object.entries(grouped)
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

  // Group categories beyond top 6 into "Other"
  if (sorted.length > 6) {
    const top = sorted.slice(0, 6);
    const rest = sorted.slice(6);
    const otherAmount = rest.reduce((s, c) => s + c.amount, 0);
    top.push({
      categoryId: '__other__',
      categoryName: 'Other',
      icon: 'more-horizontal',
      color: '#AEB6BF',
      amount: otherAmount,
      percentage: Math.round((otherAmount / total) * 100),
    });
    return top;
  }

  return sorted;
}

// ── Monthly trend ──

export function getMonthlyTrend(transactions: Transaction[], months: number = 6): MonthlyTrend[] {
  const now = new Date();
  const result: MonthlyTrend[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const targetMonth = d.getMonth();
    const targetYear = d.getFullYear();
    const label = d.toLocaleDateString('en', { month: 'short' });

    const monthTxns = transactions.filter((t) => {
      const txDate = new Date(t.date);
      return txDate.getMonth() === targetMonth && txDate.getFullYear() === targetYear;
    });
    const income = monthTxns.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = monthTxns.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

    result.push({ month: label, income, expense });
  }

  return result;
}

// ── Top categories ──

export function getTopCategories(
  categoryBreakdown: CategorySpending[],
  limit: number = 5
): CategorySpending[] {
  return categoryBreakdown.slice(0, limit);
}

// ── Savings rate ──

export function getSavingsData(
  currentTransactions: Transaction[],
  previousTransactions: Transaction[]
): { rate: number; prevRate: number; income: number; expense: number } {
  const income = currentTransactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = currentTransactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const rate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0;

  const prevIncome = previousTransactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const prevExpense = previousTransactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const prevRate = prevIncome > 0 ? Math.round(((prevIncome - prevExpense) / prevIncome) * 100) : 0;

  return { rate, prevRate, income, expense };
}

// ── Spending by day of week ──

export function getSpendingByDay(transactions: Transaction[]): { day: string; amount: number }[] {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const totals = new Array(7).fill(0);
  const counts = new Array(7).fill(0);

  const expenses = transactions.filter((t) => t.type === 'expense');
  for (const tx of expenses) {
    const d = new Date(tx.date).getDay();
    totals[d] += tx.amount;
    counts[d]++;
  }

  // Reorder to start from Mon
  const reordered = [1, 2, 3, 4, 5, 6, 0];
  return reordered.map((i) => ({
    day: days[i],
    amount: counts[i] > 0 ? totals[i] / counts[i] : 0,
  }));
}

// ── Category trend (current vs previous period) ──

export function getCategoryTrends(
  currentBreakdown: CategorySpending[],
  previousTransactions: Transaction[],
  categories: Category[]
): Map<string, number> {
  const prevBreakdown = getCategoryBreakdown(previousTransactions, categories);
  const prevMap = new Map(prevBreakdown.map((c) => [c.categoryId, c.amount]));
  const trends = new Map<string, number>();

  for (const cat of currentBreakdown) {
    const prev = prevMap.get(cat.categoryId) ?? 0;
    if (prev > 0) {
      trends.set(cat.categoryId, Math.round(((cat.amount - prev) / prev) * 100));
    } else if (cat.amount > 0) {
      trends.set(cat.categoryId, 100); // new category
    }
  }

  return trends;
}
