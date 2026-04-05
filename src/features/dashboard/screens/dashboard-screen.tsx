import React, { useState } from 'react';
import { View, ScrollView, RefreshControl, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useDashboardData } from '../hooks/use-dashboard-data';
import { BalanceCard } from '../components/balance-card';
import { QuickStats } from '../components/quick-stats';
import { SpendingChart } from '../components/spending-chart';
import { RecentTransactions } from '../components/recent-transactions';
import { SavingsProgress } from '../components/savings-progress';
import { ErrorState } from '@components/feedback/error-state';
import { LoadingState } from '@components/feedback/loading-state';
import { useColorScheme } from 'nativewind';

const accent = require('@theme/accent');

export function DashboardScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const {
    totalBalance,
    accounts,
    totalIncome,
    totalExpense,
    savingsRate,
    categoryBreakdown,
    recentTransactions,
    categories,
    goals,
    isLoading,
    isError,
    refetchAll,
  } = useDashboardData();
  const [refreshing, setRefreshing] = useState(false);

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
    <SafeAreaView className="flex-1" style={{ backgroundColor: isDark ? accent.screenBg : accent.screenBgLight }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={accent[500]} />
        }
        scrollIndicatorInsets={{ right: 1 }}
      >
        {/* Header */}
        <View className="px-4 pt-2 pb-6">
          <Text className="text-2xl font-bold text-gray-900 dark:text-gray-200">
            {greeting}
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Welcome back to Zorvyn
          </Text>
        </View>

        {/* Balance Card - Hero Element */}
        <View className="px-4 mb-6">
          <BalanceCard totalBalance={totalBalance} totalIncome={totalIncome} totalExpense={totalExpense} />
        </View>

        {/* Quick Stats */}
        <View className="px-4 mb-6">
          <QuickStats income={totalIncome} expense={totalExpense} savingsRate={savingsRate} />
        </View>

        {/* Spending Chart */}
        <View className="px-4 mb-6">
          <SpendingChart data={categoryBreakdown} onSeeAll={() => router.push('/(tabs)/analytics')} />
        </View>

        {/* Recent Transactions */}
        <View className="px-4 mb-6">
          <RecentTransactions
            transactions={recentTransactions}
            categories={categories}
            onSeeAll={() => router.push('/(tabs)/transactions')}
            onPress={(id) => router.push(`/transaction/${id}`)}
          />
        </View>

        {/* Savings Goals */}
        <View className="px-4 mb-24">
          <SavingsProgress goals={goals} onPress={(id) => router.push(`/goal/${id}`)} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
