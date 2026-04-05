import React, { useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { useAnalytics } from '../hooks/use-analytics';
import { CategoryBreakdownChart } from '../components/category-breakdown-chart';
import { MonthlyComparison } from '../components/monthly-comparison';
import { TopCategoriesList } from '../components/top-categories-list';
import { LoadingState } from '@components/feedback/loading-state';
import { ErrorState } from '@components/feedback/error-state';
import { EmptyState } from '@components/feedback/empty-state';
import { SegmentedControl } from '@components/ui/segmented-control';

const accent = require('@theme/accent');

type Period = 'week' | 'month' | 'year';

export function AnalyticsScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
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
    <SafeAreaView className="flex-1" style={{ backgroundColor: isDark ? accent.screenBg : accent.screenBgLight }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View className="px-5 pt-2 pb-6">
          <Text className="text-3xl font-bold text-gray-900 dark:text-gray-200">Insights</Text>
        </View>

        {/* Period Selector */}
        <View className="px-5 pb-6">
          <SegmentedControl
            options={['This Week', 'This Month', 'This Year']}
            selected={period === 'week' ? 'This Week' : period === 'month' ? 'This Month' : 'This Year'}
            onSelect={(value) => {
              const map: Record<string, Period> = {
                'This Week': 'week',
                'This Month': 'month',
                'This Year': 'year',
              };
              setPeriod(map[value] ?? 'month');
            }}
          />
        </View>

        {/* Analytics Cards */}
        <View className="gap-4 px-5">
          <CategoryBreakdownChart data={categoryBreakdown} />
          <MonthlyComparison data={monthlyTrend} />
          <TopCategoriesList data={topCategories} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
