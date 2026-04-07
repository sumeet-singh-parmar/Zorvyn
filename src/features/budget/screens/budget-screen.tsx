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
import { PieChart, Plus, Pencil, Trash2 } from 'lucide-react-native';
import { CurrencyText } from '@components/shared/currency-text';
import { useGlobalSheet } from '@components/shared/global-sheet';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';
import type { BudgetPeriod } from '@core/models';
import type { BudgetWithProgress } from '../types';

export function BudgetScreen() {
  const topPadding = useScreenTopPadding();
  const theme = useTheme();
  const { budgetsQuery, createMutation, updateMutation, deleteMutation } = useBudgets();
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
    const overCount = sorted.filter((b) => b.progress >= 1).length;
    const warningCount = sorted.filter((b) => b.progress >= 0.7 && b.progress < 1).length;
    const onTrackCount = sorted.filter((b) => b.progress < 0.7).length;
    return { totalBudgeted, totalSpent, overCount, warningCount, onTrackCount, total: sorted.length };
  }, [sorted]);

  const handleCreate = async (categoryId: string, amount: number, period: BudgetPeriod) => {
    await createMutation.mutateAsync({ categoryId, amount, period });
    closeSheet();
  };

  const handleUpdate = async (budgetId: string, categoryId: string, amount: number, period: BudgetPeriod) => {
    await updateMutation.mutateAsync({ id: budgetId, categoryId, amount, period });
    closeSheet();
  };

  const handleOpenForm = (editBudget?: BudgetWithProgress) => {
    openSheet({
      title: editBudget ? 'Edit Budget' : 'Create Budget',
      content: (
        <BudgetForm
          categories={categoriesQuery.data ?? []}
          editBudget={editBudget}
          onSubmit={editBudget
            ? (catId, amt, per) => handleUpdate(editBudget.id, catId, amt, per)
            : handleCreate
          }
          loading={editBudget ? updateMutation.isPending : createMutation.isPending}
        />
      ),
      snapPoints: ['75%'],
    });
  };

  const handleCardPress = (budget: BudgetWithProgress) => {
    openSheet({
      title: budget.category?.name ?? 'Budget',
      content: (
        <View style={{ gap: 4 }}>
          {/* Edit */}
          <Pressable onPress={() => handleOpenForm(budget)} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, gap: 14 }}>
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: theme.tint, alignItems: 'center', justifyContent: 'center' }}>
                <Pencil size={18} color={theme.buttonBg} />
              </View>
              <Text style={{ flex: 1, fontSize: 16, fontFamily: fonts.semibold, color: theme.textPrimary }}>Edit</Text>
            </View>
          </Pressable>

          {/* Delete */}
          <Pressable onPress={() => { deleteMutation.mutate(budget.id); closeSheet(); }} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, gap: 14, borderTopWidth: 1, borderTopColor: theme.border }}>
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: theme.expenseTint, alignItems: 'center', justifyContent: 'center' }}>
                <Trash2 size={18} color={theme.expense} />
              </View>
              <Text style={{ flex: 1, fontSize: 16, fontFamily: fonts.semibold, color: theme.expense }}>Delete</Text>
            </View>
          </Pressable>
        </View>
      ),
      snapPoints: ['30%'],
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
          {(() => {
            const pct = budgetStats.totalBudgeted > 0 ? Math.round((budgetStats.totalSpent / budgetStats.totalBudgeted) * 100) : 0;
            const hasOver = budgetStats.overCount > 0;
            const bgColor = hasOver ? theme.expense : theme.buttonBg;
            return (
              <View style={{ marginHorizontal: 20, marginBottom: 20, borderRadius: 24, padding: 22, backgroundColor: bgColor }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: theme.textOnAccent, opacity: 0.8, marginBottom: 4 }}>
                      {hasOver ? `${budgetStats.overCount} Over Budget` : 'This Month'}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
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
                <View style={{ height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.2)', overflow: 'hidden', marginBottom: 14 }}>
                  <View style={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: theme.textOnAccent,
                    width: `${Math.min(100, pct)}%`,
                  }} />
                </View>

                {/* Status breakdown pills */}
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {budgetStats.onTrackCount > 0 && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 50 }}>
                      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: theme.income }} />
                      <Text style={{ fontSize: 11, fontFamily: fonts.semibold, color: theme.textOnAccent }}>{budgetStats.onTrackCount} On Track</Text>
                    </View>
                  )}
                  {budgetStats.warningCount > 0 && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 50 }}>
                      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: theme.warning }} />
                      <Text style={{ fontSize: 11, fontFamily: fonts.semibold, color: theme.textOnAccent }}>{budgetStats.warningCount} Warning</Text>
                    </View>
                  )}
                  {budgetStats.overCount > 0 && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 50 }}>
                      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFFFFF' }} />
                      <Text style={{ fontSize: 11, fontFamily: fonts.semibold, color: theme.textOnAccent }}>{budgetStats.overCount} Over</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })()}

          {/* List */}
          <FlatList
            data={sorted}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={{ paddingHorizontal: 20 }}>
                <BudgetCard budget={item} onPress={() => handleCardPress(item)} />
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
          onAction={() => handleOpenForm()}
        />
      )}

      {/* Floating + button */}
      <View style={{ position: 'absolute', bottom: 40, right: 20 }}>
        <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: theme.accent200, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 8 }}>
          <Pressable onPress={() => handleOpenForm()} style={({ pressed }) => ({ width: 56, height: 56, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.8 : 1 })}>
            <Plus size={24} color={theme.textOnAccent} strokeWidth={2.5} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
