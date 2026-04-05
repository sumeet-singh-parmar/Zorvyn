export interface CategoryBreakdownItem {
  categoryId: string;
  categoryName: string;
  color: string;
  icon: string;
  amount: number;
  percentage: number;
}

export interface QuickStatsData {
  totalIncome: number;
  totalExpense: number;
  savingsRate: number;
}
