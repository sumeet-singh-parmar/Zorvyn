import React, { useState } from 'react';
import { View, ScrollView, Text, Pressable } from 'react-native';
import { useScreenTopPadding } from '@components/shared/edge-fade';
import { useAnalytics } from '../hooks/use-analytics';
import { CategoryBreakdownChart } from '../components/category-breakdown-chart';
import { MonthlyComparison } from '../components/monthly-comparison';
import { TopCategoriesList } from '../components/top-categories-list';
import { SavingsRateCard } from '../components/savings-rate-card';
import { BudgetVsActual } from '../components/budget-vs-actual';
import { RecurringProjection } from '../components/recurring-projection';
import { SpendingByDay } from '../components/spending-by-day';
import { DateTimeInput } from '@components/shared/date-time-input';
import { LoadingState } from '@components/feedback/loading-state';
import { ErrorState } from '@components/feedback/error-state';
import { EmptyState } from '@components/feedback/empty-state';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { FilterHorizontalIcon } from '@hugeicons/core-free-icons';
import { X } from 'lucide-react-native';
import { useTheme } from '@theme/use-theme';
import { useCurrencyStore } from '@stores/currency-store';
import { formatCurrency } from '@core/currency';
import { fonts } from '@theme/fonts';
import type { Period } from '../hooks/use-analytics';

const PERIODS: { key: Period; label: string }[] = [
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
  { key: 'year', label: 'Year' },
];

export function AnalyticsScreen() {
  const topPadding = useScreenTopPadding();
  const theme = useTheme();
  const currencyCode = useCurrencyStore((s) => s.currencyCode);
  const [period, setPeriod] = useState<Period>('month');
  const [customRange, setCustomRange] = useState<{ from: Date; to: Date } | null>(null);
  const [showCustom, setShowCustom] = useState(false);
  const {
    dateRangeLabel,
    categoryBreakdown,
    monthlyTrend,
    topCategories,
    categoryTrends,
    savings,
    spendingByDay,
    budgets,
    recurringData,
    isLoading,
    isError,
    refetch,
  } = useAnalytics(period, customRange ? { start: customRange.from, end: customRange.to } : undefined);

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState onRetry={refetch} />;

  const isEmpty = categoryBreakdown.length === 0 && monthlyTrend.every((m) => m.income === 0 && m.expense === 0);

  if (isEmpty) {
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

        {/* Period Pills + Custom Filter */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginBottom: 14, gap: 8, alignItems: 'center' }}>
          {PERIODS.map((p) => {
            const isActive = period === p.key && !customRange;
            return (
              <Pressable
                key={p.key}
                onPress={() => { setPeriod(p.key); setCustomRange(null); setShowCustom(false); }}
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              >
                <View style={{
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  borderRadius: 50,
                  backgroundColor: isActive ? theme.buttonBg : theme.surfaceBg,
                  borderWidth: isActive ? 0 : 1,
                  borderColor: theme.border,
                }}>
                  <Text style={{
                    fontFamily: isActive ? fonts.heading : fonts.medium,
                    fontSize: 14,
                    color: isActive ? theme.textOnAccent : theme.textSecondary,
                  }}>
                    {p.label}
                  </Text>
                </View>
              </Pressable>
            );
          })}

          {/* Custom filter button */}
          <Pressable onPress={() => setShowCustom(!showCustom)} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1, marginLeft: 'auto' })}>
            <View style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              backgroundColor: customRange ? theme.tint : theme.surfaceBg,
              borderWidth: 1,
              borderColor: customRange ? theme.buttonBg : theme.border,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <HugeiconsIcon icon={FilterHorizontalIcon} size={18} color={customRange ? theme.buttonBg : theme.textMuted} strokeWidth={1.8} />
              {customRange && (
                <View style={{ position: 'absolute', top: -3, right: -3, width: 10, height: 10, borderRadius: 5, backgroundColor: theme.buttonBg }} />
              )}
            </View>
          </Pressable>
        </View>

        {/* Custom Date Range Picker */}
        {showCustom && (
          <View style={{ marginHorizontal: 20, marginBottom: 16, padding: 16, backgroundColor: theme.cardBg, borderRadius: 16, borderWidth: 1, borderColor: theme.border, gap: 12 }}>
            <Text style={{ fontSize: 13, fontFamily: fonts.heading, color: theme.textPrimary }}>Custom Range</Text>
            <DateTimeInput
              value={customRange?.from ?? new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)}
              onChange={(d) => setCustomRange({ from: d, to: customRange?.to ?? new Date() })}
              mode="date"
              label="From"
            />
            <DateTimeInput
              value={customRange?.to ?? new Date()}
              onChange={(d) => setCustomRange({ from: customRange?.from ?? new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1), to: d })}
              mode="date"
              label="To"
            />
            {customRange && (
              <Pressable onPress={() => { setCustomRange(null); setShowCustom(false); }} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8 }}>
                  <X size={14} color={theme.expense} />
                  <Text style={{ fontSize: 13, fontFamily: fonts.semibold, color: theme.expense }}>Clear custom range</Text>
                </View>
              </Pressable>
            )}
          </View>
        )}

        {/* Date Range Label */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: theme.textMuted }}>
            {customRange
              ? `${customRange.from.getDate()} ${customRange.from.toLocaleDateString('en', { month: 'short' })} – ${customRange.to.getDate()} ${customRange.to.toLocaleDateString('en', { month: 'short', year: 'numeric' })}`
              : dateRangeLabel
            }
          </Text>
        </View>

        {/* Quick Summary */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20, gap: 12 }}>
          <View style={{
            flex: 1,
            backgroundColor: theme.cardBg,
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: theme.border,
          }}>
            <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: theme.textMuted }}>Income</Text>
            <Text style={{ fontFamily: fonts.black, fontSize: 20, color: theme.income, marginTop: 4 }}>
              {formatCurrency(savings.income, currencyCode)}
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
            <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: theme.textMuted }}>Expenses</Text>
            <Text style={{ fontFamily: fonts.black, fontSize: 20, color: theme.expense, marginTop: 4 }}>
              {formatCurrency(savings.expense, currencyCode)}
            </Text>
          </View>
        </View>

        {/* All Widgets */}
        <View style={{ paddingHorizontal: 20, gap: 20 }}>
          {/* Savings Rate */}
          <SavingsRateCard
            rate={savings.rate}
            prevRate={savings.prevRate}
            income={savings.income}
            expense={savings.expense}
          />

          {/* Category Breakdown */}
          <CategoryBreakdownChart data={categoryBreakdown} />

          {/* Budget vs Actual */}
          <BudgetVsActual budgets={budgets} />

          {/* Monthly Comparison */}
          <MonthlyComparison data={monthlyTrend} period={period} />

          {/* Spending by Day */}
          <SpendingByDay data={spendingByDay} />

          {/* Recurring Projection */}
          <RecurringProjection
            monthlyTotal={recurringData.monthlyTotal}
            items={recurringData.items}
            activeCount={recurringData.activeCount}
          />

          {/* Top Categories */}
          <TopCategoriesList data={topCategories} trends={categoryTrends} />
        </View>
      </ScrollView>
    </View>
  );
}
