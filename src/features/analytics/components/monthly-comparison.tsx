import React, { useMemo } from 'react';
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
  period?: 'week' | 'month' | 'year';
}

function formatYAxis(val: number): string {
  if (val >= 100_000) return `${(val / 100_000).toFixed(1)}L`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(0)}K`;
  return String(val);
}

export function MonthlyComparison({ data, period = 'month' }: MonthlyComparisonProps) {
  const theme = useTheme();

  // Only show months that have any data
  const activeData = useMemo(() => {
    const withData = data.filter((m) => m.income > 0 || m.expense > 0);
    // Always show at least the last 3 months for context
    return withData.length > 0 ? (withData.length < 3 ? data.slice(-3) : withData) : data.slice(-3);
  }, [data]);

  if (data.length === 0) return null;

  const currentMonth = data[data.length - 1];
  const lastMonth = data[data.length - 2] || currentMonth;

  const expenseChange = currentMonth.expense - lastMonth.expense;
  const expensePercent = lastMonth.expense > 0 ? Math.round((expenseChange / lastMonth.expense) * 100) : 0;
  const incomeChange = currentMonth.income - lastMonth.income;
  const incomePercent = lastMonth.income > 0 ? Math.round((incomeChange / lastMonth.income) * 100) : 0;

  const maxVal = Math.max(...activeData.flatMap((m) => [m.income, m.expense]), 1);

  const barData = activeData.flatMap((item) => [
    {
      value: item.income,
      label: item.month,
      frontColor: theme.income,
      spacing: 4,
      labelTextStyle: { color: theme.textMuted, fontSize: 12, fontFamily: fonts.medium },
    },
    {
      value: item.expense,
      frontColor: theme.expense,
      spacing: 20,
    },
  ]);

  return (
    <Card className="overflow-hidden" style={{ backgroundColor: theme.cardBg }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: theme.border }}>
        <Text style={{ fontSize: 18, fontFamily: fonts.semibold, color: theme.textPrimary }}>
          Monthly Overview
        </Text>
      </View>

      {/* Quick Stats */}
      <View style={{ paddingHorizontal: 20, paddingVertical: 20, flexDirection: 'row', gap: 12 }}>
        {/* Income Card */}
        <View style={{ flex: 1, borderRadius: 12, padding: 16, backgroundColor: theme.incomeTint, borderWidth: 1, borderColor: theme.income + '30' }}>
          <Text style={{ fontSize: 12, fontFamily: fonts.medium, color: theme.income, marginBottom: 6 }}>
            {period === 'week' ? 'This Week' : period === 'year' ? 'This Year' : 'This Month'}
          </Text>
          <CurrencyText amount={currentMonth.income} style={{ fontSize: 18, color: theme.income, fontFamily: fonts.heading, marginBottom: 6 }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            {incomeChange >= 0 ? <TrendingUp size={12} color={theme.income} /> : <TrendingDown size={12} color={theme.income} />}
            <Text style={{ fontSize: 11, fontFamily: fonts.semibold, color: theme.income }}>{Math.abs(incomePercent)}%</Text>
            <Text style={{ fontSize: 11, fontFamily: fonts.body, color: theme.textMuted }}>vs last</Text>
          </View>
        </View>

        {/* Expense Card */}
        <View style={{ flex: 1, borderRadius: 12, padding: 16, backgroundColor: theme.expenseTint, borderWidth: 1, borderColor: theme.expense + '30' }}>
          <Text style={{ fontSize: 12, fontFamily: fonts.medium, color: theme.expense, marginBottom: 6 }}>
            {period === 'week' ? 'This Week' : period === 'year' ? 'This Year' : 'This Month'}
          </Text>
          <CurrencyText amount={currentMonth.expense} style={{ fontSize: 18, color: theme.expense, fontFamily: fonts.heading, marginBottom: 6 }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            {expenseChange >= 0 ? <TrendingUp size={12} color={theme.expense} /> : <TrendingDown size={12} color={theme.expense} />}
            <Text style={{ fontSize: 11, fontFamily: fonts.semibold, color: theme.expense }}>{Math.abs(expensePercent)}%</Text>
            <Text style={{ fontSize: 11, fontFamily: fonts.body, color: theme.textMuted }}>vs last</Text>
          </View>
        </View>
      </View>

      {/* Legend */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 12, gap: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: theme.income }} />
          <Text style={{ fontSize: 12, fontFamily: fonts.medium, color: theme.textSecondary }}>Income</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: theme.expense }} />
          <Text style={{ fontSize: 12, fontFamily: fonts.medium, color: theme.textSecondary }}>Expenses</Text>
        </View>
      </View>

      {/* Chart */}
      <View style={{ paddingHorizontal: 12, paddingBottom: 20 }}>
        <BarChart
          data={barData}
          barWidth={20}
          barBorderRadius={6}
          noOfSections={4}
          maxValue={maxVal * 1.15}
          yAxisThickness={0}
          xAxisThickness={0}
          hideRules
          isAnimated
          animationDuration={500}
          height={160}
          initialSpacing={14}
          spacing={20}
          formatYLabel={(val) => formatYAxis(Number(val))}
          yAxisTextStyle={{ color: theme.textMuted, fontSize: 10, fontFamily: fonts.body }}
          xAxisLabelTextStyle={{ color: theme.textMuted, fontSize: 12, fontFamily: fonts.medium }}
        />
      </View>
    </Card>
  );
}
