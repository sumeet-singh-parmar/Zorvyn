import React, { useMemo } from 'react';
import { View, FlatList, Text, Pressable } from 'react-native';
import { useScreenTopPadding } from '@components/shared/edge-fade';
import { useBudgets } from '../hooks/use-budgets';
import { BudgetCard } from '../components/budget-card';
import { BudgetForm } from '../components/budget-form';
import { EmptyState } from '@components/feedback/empty-state';
import { LoadingState } from '@components/feedback/loading-state';
import { ErrorState } from '@components/feedback/error-state';
import { sortBudgetsByUrgency } from '../services/budget-service';
import { useQuery } from '@tanstack/react-query';
import { useDatabase } from '@core/providers/database-provider';
import { CategoryRepository } from '@core/repositories/category-repository';
import { queryKeys } from '@core/constants/query-keys';
import { PieChart, Plus } from 'lucide-react-native';
import { CurrencyText } from '@components/shared/currency-text';
import { useGlobalSheet } from '@components/shared/global-sheet';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';
import type { BudgetPeriod } from '@core/models';

export function BudgetScreen() {
  const topPadding = useScreenTopPadding();
  const theme = useTheme();
  const { budgetsQuery, createMutation } = useBudgets();
  const { openSheet, closeSheet } = useGlobalSheet();
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
    closeSheet();
  };

  const handleOpenForm = () => {
    openSheet({
      title: 'Create Budget',
      content: (
        <BudgetForm
          categories={categoriesQuery.data ?? []}
          onSubmit={handleCreate}
          loading={createMutation.isPending}
        />
      ),
      snapPoints: ['75%'],
    });
  };

  if (budgetsQuery.isLoading) return <LoadingState />;
  if (budgetsQuery.isError) return <ErrorState onRetry={() => budgetsQuery.refetch()} />;

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: topPadding, paddingBottom: 16 }}>
        <Text style={{ fontSize: 28, fontFamily: fonts.black, color: theme.textPrimary }}>
          Budgets
        </Text>
      </View>

      {sorted.length > 0 ? (
        <>
          {/* Overview Card */}
          <View style={{ marginHorizontal: 20, marginBottom: 20, borderRadius: 24, padding: 22, backgroundColor: theme.buttonBg }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: theme.textOnAccent, opacity: 0.8, marginBottom: 4 }}>This Month</Text>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginBottom: 12 }}>
                  <CurrencyText
                    amount={budgetStats.totalSpent}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.5}
                    style={{ fontSize: 28, fontFamily: fonts.black, color: theme.textOnAccent }}
                  />
                  <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: theme.textOnAccent, opacity: 0.6 }}>
                    of
                  </Text>
                  <CurrencyText
                    amount={budgetStats.totalBudgeted}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.5}
                    style={{ fontSize: 14, fontFamily: fonts.semibold, color: theme.textOnAccent }}
                  />
                </View>
              </View>
              <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                <PieChart size={24} color={theme.textOnAccent} />
              </View>
            </View>
            {/* Progress bar */}
            <View style={{ height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.2)', overflow: 'hidden' }}>
              <View style={{
                height: 6,
                borderRadius: 3,
                backgroundColor: theme.textOnAccent,
                width: `${budgetStats.totalBudgeted > 0 ? Math.min(100, (budgetStats.totalSpent / budgetStats.totalBudgeted) * 100) : 0}%`,
              }} />
            </View>
          </View>

          {/* List */}
          <FlatList
            data={sorted}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={{ paddingHorizontal: 20 }}>
                <BudgetCard budget={item} onPress={() => {}} />
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          />
        </>
      ) : (
        <EmptyState
          icon="target"
          title="No budgets yet"
          description="Set spending limits for your categories to stay on track."
          actionLabel="Create Budget"
          onAction={handleOpenForm}
        />
      )}

      {/* Floating + button */}
      <View style={{ position: 'absolute', bottom: 100, right: 20 }}>
        <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: theme.accent200, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 8 }}>
          <Pressable onPress={handleOpenForm} style={({ pressed }) => ({ width: 56, height: 56, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.8 : 1 })}>
            <Plus size={24} color={theme.textOnAccent} strokeWidth={2.5} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
