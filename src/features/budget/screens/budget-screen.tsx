import React, { useState, useMemo } from 'react';
import { View, FlatList, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { useBudgets } from '../hooks/use-budgets';

const accent = require('@theme/accent');
import { BudgetCard } from '../components/budget-card';
import { BudgetForm } from '../components/budget-form';
import { FAB } from '@components/ui/fab';
import { Modal } from '@components/ui/modal';
import { EmptyState } from '@components/feedback/empty-state';
import { LoadingState } from '@components/feedback/loading-state';
import { ErrorState } from '@components/feedback/error-state';
import { sortBudgetsByUrgency } from '../services/budget-service';
import { useQuery } from '@tanstack/react-query';
import { useDatabase } from '@core/providers/database-provider';
import { CategoryRepository } from '@core/repositories/category-repository';
import { queryKeys } from '@core/constants/query-keys';
import { X, PieChart } from 'lucide-react-native';
import { CurrencyText } from '@components/shared/currency-text';
import type { BudgetPeriod } from '@core/models';

export function BudgetScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { budgetsQuery, createMutation } = useBudgets();
  const [showForm, setShowForm] = useState(false);
  const db = useDatabase();
  const categoryRepo = useMemo(() => new CategoryRepository(db), [db]);

  const categoriesQuery = useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => categoryRepo.getAll(),
  });

  const sorted = useMemo(
    () => sortBudgetsByUrgency(budgetsQuery.data ?? []),
    [budgetsQuery.data]
  );

  const budgetStats = useMemo(() => {
    const totalBudgeted = sorted.reduce((sum, b) => sum + b.amount, 0);
    const totalSpent = sorted.reduce((sum, b) => sum + b.spent, 0);
    return { totalBudgeted, totalSpent };
  }, [sorted]);

  const handleCreate = async (categoryId: string, amount: number, period: BudgetPeriod) => {
    await createMutation.mutateAsync({ categoryId, amount, period });
    setShowForm(false);
  };

  if (budgetsQuery.isLoading) return <LoadingState />;
  if (budgetsQuery.isError) return <ErrorState onRetry={() => budgetsQuery.refetch()} />;

  const hasAnyBudgets = sorted.length > 0;

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: isDark ? accent.screenBg : accent.screenBgLight }}>
      {/* Header */}
      <View className="px-4 py-4 flex-row items-center justify-between">
        <Text className="text-3xl font-bold text-gray-900 dark:text-gray-200">Budgets</Text>
        <Pressable className="p-2 rounded-full active:bg-gray-100 dark:active:bg-gray-800">
          <X size={24} color="#6B7280" />
        </Pressable>
      </View>

      {hasAnyBudgets ? (
        <>
          {/* Overview Card */}
          <View className="mx-4 mb-6 bg-blue-500 rounded-3xl p-6 shadow-lg">
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <Text className="text-white text-sm font-medium opacity-90 mb-1">This Month</Text>
                <View className="flex-row items-baseline gap-2 mb-4">
                  <CurrencyText
                    amount={budgetStats.totalSpent}
                    className="text-3xl font-bold text-white"
                  />
                  <Text className="text-white/70 text-sm font-medium">
                    of <CurrencyText
                      amount={budgetStats.totalBudgeted}
                      className="text-sm font-semibold text-white"
                    />
                  </Text>
                </View>
              </View>
              <View className="w-16 h-16 bg-white/20 rounded-2xl items-center justify-center">
                <PieChart size={32} color="white" />
              </View>
            </View>
            <View className="bg-white/20 h-2 rounded-full overflow-hidden mt-2">
              <View
                className="h-full bg-white rounded-full"
                style={{
                  width: `${budgetStats.totalBudgeted > 0 ? Math.min(100, (budgetStats.totalSpent / budgetStats.totalBudgeted) * 100) : 0}%`,
                }}
              />
            </View>
          </View>

          {/* Budgets List */}
          <FlatList
            data={sorted}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className="px-4">
                <BudgetCard budget={item} onPress={() => {}} />
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
          />
        </>
      ) : (
        <EmptyState
          icon="target"
          title="No budgets yet"
          description="Set spending limits for your categories to stay on track and control expenses."
          actionLabel="Create Budget"
          onAction={() => setShowForm(true)}
        />
      )}

      <FAB onPress={() => setShowForm(true)} />

      <Modal visible={showForm} onClose={() => setShowForm(false)} title="Create Budget">
        <BudgetForm
          categories={categoriesQuery.data ?? []}
          onSubmit={handleCreate}
          loading={createMutation.isPending}
        />
      </Modal>
    </SafeAreaView>
  );
}
