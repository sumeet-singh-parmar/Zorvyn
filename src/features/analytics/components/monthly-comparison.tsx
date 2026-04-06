import React from 'react';
import { View, Text } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import { Card } from '@components/ui/card';
import { CurrencyText } from '@components/shared/currency-text';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';
import type { MonthlyTrend } from '../types';

interface MonthlyComparisonProps {
  data: MonthlyTrend[];
}

export function MonthlyComparison({ data }: MonthlyComparisonProps) {
  const theme = useTheme();

  if (data.length === 0) return null;

  // Get current and last month
  const currentMonth = data[data.length - 1];
  const lastMonth = data[data.length - 2] || currentMonth;

  const expenseChange = currentMonth.expense - lastMonth.expense;
  const expensePercent = lastMonth.expense > 0 ? Math.round((expenseChange / lastMonth.expense) * 100) : 0;
  const incomeChange = currentMonth.income - lastMonth.income;
  const incomePercent = lastMonth.income > 0 ? Math.round((incomeChange / lastMonth.income) * 100) : 0;

  const barData = data.flatMap((item) => [
    {
      value: item.income,
      label: item.month,
      frontColor: theme.income,
      spacing: 2,
    },
    {
      value: item.expense,
      frontColor: theme.expense,
      spacing: 16,
    },
  ]);

  return (
    <Card className="overflow-hidden" style={{ backgroundColor: theme.cardBg }}>
      {/* Header */}
      <View className="px-5 py-4" style={{ borderBottomWidth: 1, borderBottomColor: theme.border }}>
        <Text style={{ fontSize: 18, fontFamily: fonts.semibold, color: theme.textPrimary }}>
          Monthly Overview
        </Text>
      </View>

      {/* Quick Stats */}
      <View className="px-5 py-5 flex-row gap-3">
        {/* Income Card */}
        <View
          className="flex-1 rounded-lg p-4"
          style={{ backgroundColor: theme.incomeTint, borderWidth: 1, borderColor: theme.income + '30' }}
        >
          <Text style={{ fontSize: 12, fontFamily: fonts.medium, color: theme.income, marginBottom: 4 }}>
            This Month Income
          </Text>
          <View className="flex-row items-baseline gap-2 mb-2">
            <CurrencyText amount={currentMonth.income} className="text-xl" style={{ color: theme.income, fontFamily: fonts.heading }} />
            <View className="flex-row items-center gap-1">
              {incomeChange >= 0 ? (
                <TrendingUp size={14} color={theme.income} />
              ) : (
                <TrendingDown size={14} color={theme.income} />
              )}
              <Text style={{ fontSize: 12, fontFamily: fonts.semibold, color: theme.income }}>
                {Math.abs(incomePercent)}%
              </Text>
            </View>
          </View>
          <Text style={{ fontSize: 12, fontFamily: fonts.body, color: theme.textSecondary }}>
            vs last month
          </Text>
        </View>

        {/* Expense Card */}
        <View
          className="flex-1 rounded-lg p-4"
          style={{ backgroundColor: theme.expenseTint, borderWidth: 1, borderColor: theme.expense + '30' }}
        >
          <Text style={{ fontSize: 12, fontFamily: fonts.medium, color: theme.expense, marginBottom: 4 }}>
            This Month Expenses
          </Text>
          <View className="flex-row items-baseline gap-2 mb-2">
            <CurrencyText amount={currentMonth.expense} className="text-xl" style={{ color: theme.expense, fontFamily: fonts.heading }} />
            <View className="flex-row items-center gap-1">
              {expenseChange >= 0 ? (
                <TrendingUp size={14} color={theme.expense} />
              ) : (
                <TrendingDown size={14} color={theme.expense} />
              )}
              <Text style={{ fontSize: 12, fontFamily: fonts.semibold, color: theme.expense }}>
                {Math.abs(expensePercent)}%
              </Text>
            </View>
          </View>
          <Text style={{ fontSize: 12, fontFamily: fonts.body, color: theme.textSecondary }}>
            vs last month
          </Text>
        </View>
      </View>

      {/* Chart Header Legend */}
      <View className="px-5 py-3 flex-row gap-4" style={{ borderTopWidth: 1, borderTopColor: theme.border }}>
        <View className="flex-row items-center gap-2">
          <View className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.income }} />
          <Text style={{ fontSize: 12, fontFamily: fonts.medium, color: theme.textSecondary }}>Income</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <View className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.expense }} />
          <Text style={{ fontSize: 12, fontFamily: fonts.medium, color: theme.textSecondary }}>Expenses</Text>
        </View>
      </View>

      {/* Chart */}
      <View className="px-5 py-4">
        <BarChart
          data={barData}
          barWidth={12}
          barBorderRadius={6}
          noOfSections={4}
          yAxisThickness={0}
          xAxisThickness={0}
          isAnimated
          animationDuration={600}
          height={180}
          xAxisLabelTextStyle={{ color: theme.tabInactiveIcon, fontSize: 11 }}
          yAxisTextStyle={{ color: theme.tabInactiveIcon, fontSize: 10 }}
        />
      </View>
    </Card>
  );
}
