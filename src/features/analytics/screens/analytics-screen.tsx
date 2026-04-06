import React, { useState } from 'react';
import { View, ScrollView, Text, Pressable } from 'react-native';
import { useScreenTopPadding } from '@components/shared/edge-fade';
import { useAnalytics } from '../hooks/use-analytics';
import { CategoryBreakdownChart } from '../components/category-breakdown-chart';
import { MonthlyComparison } from '../components/monthly-comparison';
import { TopCategoriesList } from '../components/top-categories-list';
import { LoadingState } from '@components/feedback/loading-state';
import { ErrorState } from '@components/feedback/error-state';
import { EmptyState } from '@components/feedback/empty-state';
import { useTheme } from '@theme/use-theme';
import { useThemeStore } from '@stores/theme-store';
import { hslToRgba } from '@theme/hsl';
import { fonts } from '@theme/fonts';

type Period = 'week' | 'month' | 'year';

const PERIODS: { key: Period; label: string }[] = [
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
  { key: 'year', label: 'Year' },
];

export function AnalyticsScreen() {
  const topPadding = useScreenTopPadding();
  const theme = useTheme();
  const { hue, saturation } = useThemeStore();
  const [period, setPeriod] = useState<Period>('month');
  const { categoryBreakdown, monthlyTrend, topCategories, isLoading, isError, refetch } =
    useAnalytics();

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState onRetry={refetch} />;

  if (categoryBreakdown.length === 0 && monthlyTrend.every((m) => m.income === 0 && m.expense === 0)) {
    return (
      <EmptyState
        icon="bar-chart-2"
        title="No data yet"
        description="Start adding transactions to see your spending insights."
      />
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: topPadding, paddingBottom: 100 }}
      >
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
          <Text style={{ fontSize: 28, fontFamily: fonts.black, color: theme.textPrimary }}>
            Insights
          </Text>
        </View>

        {/* Period Pills */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginBottom: 24, gap: 10 }}>
          {PERIODS.map((p) => {
            const isActive = period === p.key;
            return (
              <Pressable
                key={p.key}
                onPress={() => setPeriod(p.key)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 50,
                  backgroundColor: isActive ? theme.buttonBg : theme.surfaceBg,
                  borderWidth: isActive ? 0 : 1,
                  borderColor: theme.border,
                }}
              >
                <Text style={{
                  fontFamily: isActive ? fonts.heading : fonts.medium,
                  fontSize: 14,
                  color: isActive ? theme.textOnAccent : theme.textSecondary,
                }}>
                  {p.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Quick Summary */}
        {monthlyTrend.length > 0 && (
          <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginBottom: 24, gap: 12 }}>
            <View style={{
              flex: 1,
              backgroundColor: theme.cardBg,
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: theme.border,
            }}>
              <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: theme.textMuted }}>Total Income</Text>
              <Text style={{ fontFamily: fonts.black, fontSize: 20, color: theme.income, marginTop: 4 }}>
                {monthlyTrend.reduce((s, m) => s + m.income, 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
              </Text>
            </View>
            <View style={{
              flex: 1,
              backgroundColor: theme.cardBg,
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: theme.border,
            }}>
              <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: theme.textMuted }}>Total Expense</Text>
              <Text style={{ fontFamily: fonts.black, fontSize: 20, color: theme.expense, marginTop: 4 }}>
                {monthlyTrend.reduce((s, m) => s + m.expense, 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
              </Text>
            </View>
          </View>
        )}

        {/* Analytics Cards */}
        <View style={{ paddingHorizontal: 20, gap: 16 }}>
          <CategoryBreakdownChart data={categoryBreakdown} />
          <MonthlyComparison data={monthlyTrend} />
          <TopCategoriesList data={topCategories} />
        </View>
      </ScrollView>
    </View>
  );
}
