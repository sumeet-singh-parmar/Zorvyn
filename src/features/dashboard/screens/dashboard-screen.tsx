import React, { useState } from 'react';
import { View, ScrollView, RefreshControl, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useDashboardData } from '../hooks/use-dashboard-data';
import { BalanceCard } from '../components/balance-card';
import { QuickStats } from '../components/quick-stats';
import { SpendingChart } from '../components/spending-chart';
import { RecentTransactions } from '../components/recent-transactions';
import { SavingsProgress } from '../components/savings-progress';
import { ErrorState } from '@components/feedback/error-state';
import { LoadingState } from '@components/feedback/loading-state';
import { useScreenTopPadding } from '@components/shared/edge-fade';
import { useGlobalSheet } from '@components/shared/global-sheet';
import { GoalForm } from '@features/goals/components/goal-form';
import { useGoals } from '@features/goals/hooks/use-goals';
import { useTheme } from '@theme/use-theme';
import { OverviewCard } from '@components/ui/overview-card';
import { fonts } from '@theme/fonts';
import { formatCompactCurrency } from '@core/currency';
import { useCurrencyStore } from '@stores/currency-store';
import {
  MoneyBag02Icon,
  ChartHistogramIcon,
  Invoice02Icon,
  CreditCardIcon,
} from '@hugeicons/core-free-icons';

export function DashboardScreen() {
  const router = useRouter();
  const theme = useTheme();
  const topPadding = useScreenTopPadding();
  const currencyCode = useCurrencyStore((s) => s.currencyCode);
  const {
    totalBalance,
    totalIncome,
    totalExpense,
    lastMonthIncome,
    lastMonthExpense,
    savingsRate,
    categoryBreakdown,
    recentTransactions,
    categories,
    goals,
    budgetCount,
    budgetProgress,
    recurringCount,
    loanCount,
    accountCount,
    isLoading,
    isError,
    refetchAll,
  } = useDashboardData();
  const [refreshing, setRefreshing] = useState(false);
  const { openSheet, closeSheet } = useGlobalSheet();
  const { createGoalMutation } = useGoals();

  const handleAddGoal = () => {
    openSheet({
      title: 'Create Goal',
      content: (
        <GoalForm
          onSubmit={async (data) => {
            await createGoalMutation.mutateAsync(data);
            closeSheet();
          }}
          loading={createGoalMutation.isPending}
        />
      ),
      snapPoints: ['80%'],
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchAll();
    setRefreshing(false);
  };

  if (isError) return <ErrorState onRetry={refetchAll} />;
  if (isLoading) return <LoadingState />;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: topPadding, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.accent500} />
        }
      >
        {/* Header */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 24 }}>
          <Text style={{ fontFamily: fonts.black, fontSize: 24, color: theme.textPrimary, marginLeft: 5 }}>
            {greeting}
          </Text>
        </View>

        {/* Balance Card */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <BalanceCard
            totalBalance={totalBalance}
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            lastMonthIncome={lastMonthIncome}
            lastMonthExpense={lastMonthExpense}
            onPress={() => router.push('/accounts')}
          />
        </View>

        {/* Quick Stats */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <QuickStats income={totalIncome} expense={totalExpense} savingsRate={savingsRate} />
        </View>

        {/* Spending Chart */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <SpendingChart data={categoryBreakdown} onSeeAll={() => router.push('/(tabs)/analytics')} />
        </View>

        {/* Recent Transactions */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <RecentTransactions
            transactions={recentTransactions}
            categories={categories}
            onSeeAll={() => router.push('/(tabs)/transactions')}
            onPress={(id) => router.push(`/transaction/${id}`)}
          />
        </View>

        {/* Savings Goals */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <SavingsProgress
            goals={goals}
            onPress={() => router.push('/goal')}
            onAddGoal={handleAddGoal}
            onSeeAll={() => router.push('/goal')}
          />
        </View>

        {/* Overview */}
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: 18, color: theme.textPrimary, marginBottom: 12 }}>
            Overview
          </Text>
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
            <OverviewCard
              icon={MoneyBag02Icon}
              title="Budgets"
              stat={String(budgetCount)}
              statLabel="Budgets"
              progress={budgetProgress}
              onPress={() => router.push('/budget')}
            />
            <OverviewCard
              icon={ChartHistogramIcon}
              title="Accounts"
              stat={String(accountCount)}
              statLabel="Accounts"
              secondaryStat={formatCompactCurrency(totalBalance, currencyCode)}
              secondaryLabel="Total"
              onPress={() => router.push('/accounts')}
            />
          </View>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <OverviewCard
              icon={Invoice02Icon}
              title="Recurring"
              stat={String(recurringCount.active)}
              statLabel="Active"
              secondaryStat={String(recurringCount.paused)}
              secondaryLabel="Paused"
              onPress={() => router.push('/recurring')}
            />
            <OverviewCard
              icon={CreditCardIcon}
              title="Loans"
              stat={String(loanCount.lending)}
              statLabel="Lending"
              secondaryStat={String(loanCount.borrowing)}
              secondaryLabel="Borrowing"
              onPress={() => router.push('/loans')}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
