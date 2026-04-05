import React from 'react';
import { View, Text } from 'react-native';
import { useColorScheme } from 'nativewind';
import { BarChart } from 'react-native-gifted-charts';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import { Card } from '@components/ui/card';
import { CurrencyText } from '@components/shared/currency-text';
import type { MonthlyTrend } from '../types';

const accent = require('@theme/accent');
const semantic = require('@theme/semantic');

interface MonthlyComparisonProps {
  data: MonthlyTrend[];
}

export function MonthlyComparison({ data }: MonthlyComparisonProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

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
      frontColor: semantic.income.DEFAULT,
      spacing: 2,
    },
    {
      value: item.expense,
      frontColor: semantic.expense.DEFAULT,
      spacing: 16,
    },
  ]);

  return (
    <Card className="overflow-hidden" style={{ backgroundColor: isDark ? accent.cardDark : accent.cardLight }}>
      {/* Header */}
      <View className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-200">
          Monthly Overview
        </Text>
      </View>

      {/* Quick Stats */}
      <View className="px-5 py-5 flex-row gap-3">
        {/* Income Card */}
        <View className="flex-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 border border-emerald-100 dark:border-emerald-800">
          <Text className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">
            This Month Income
          </Text>
          <View className="flex-row items-baseline gap-2 mb-2">
            <CurrencyText amount={currentMonth.income} className="text-xl font-bold text-emerald-700 dark:text-emerald-300" />
            <View className="flex-row items-center gap-1">
              {incomeChange >= 0 ? (
                <TrendingUp size={14} color={semantic.income.DEFAULT} />
              ) : (
                <TrendingDown size={14} color={semantic.income.DEFAULT} />
              )}
              <Text className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {Math.abs(incomePercent)}%
              </Text>
            </View>
          </View>
          <Text className="text-xs text-gray-600 dark:text-gray-400">
            vs last month
          </Text>
        </View>

        {/* Expense Card */}
        <View className="flex-1 bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-100 dark:border-red-800">
          <Text className="text-xs font-medium text-red-600 dark:text-red-400 mb-1">
            This Month Expenses
          </Text>
          <View className="flex-row items-baseline gap-2 mb-2">
            <CurrencyText amount={currentMonth.expense} className="text-xl font-bold text-red-700 dark:text-red-300" />
            <View className="flex-row items-center gap-1">
              {expenseChange >= 0 ? (
                <TrendingUp size={14} color={semantic.expense.DEFAULT} />
              ) : (
                <TrendingDown size={14} color={semantic.expense.DEFAULT} />
              )}
              <Text className="text-xs font-semibold text-red-600 dark:text-red-400">
                {Math.abs(expensePercent)}%
              </Text>
            </View>
          </View>
          <Text className="text-xs text-gray-600 dark:text-gray-400">
            vs last month
          </Text>
        </View>
      </View>

      {/* Chart Header Legend */}
      <View className="px-5 py-3 flex-row gap-4 border-t border-gray-100 dark:border-gray-700">
        <View className="flex-row items-center gap-2">
          <View className="w-3 h-3 rounded-full bg-emerald-500" />
          <Text className="text-xs font-medium text-gray-600 dark:text-gray-400">Income</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <View className="w-3 h-3 rounded-full bg-red-500" />
          <Text className="text-xs font-medium text-gray-600 dark:text-gray-400">Expenses</Text>
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
          xAxisLabelTextStyle={{ color: accent.tabInactive, fontSize: 11 }}
          yAxisTextStyle={{ color: accent.tabInactive, fontSize: 10 }}
        />
      </View>
    </Card>
  );
}
