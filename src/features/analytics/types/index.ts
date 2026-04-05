export interface CategorySpending {
  categoryId: string;
  categoryName: string;
  icon: string;
  color: string;
  amount: number;
  percentage: number;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expense: number;
}

export interface WeeklyComparison {
  label: string;
  thisWeek: number;
  lastWeek: number;
}
