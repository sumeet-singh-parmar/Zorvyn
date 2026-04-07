import React, { useMemo, useState } from 'react';
import { View, FlatList, Text, Pressable } from 'react-native';
import { useScreenTopPadding } from '@components/shared/edge-fade';
import { useGoals } from '../hooks/use-goals';
import { GoalCard } from '../components/goal-card';
import { GoalForm } from '../components/goal-form';
import { EmptyState } from '@components/feedback/empty-state';
import { LoadingState } from '@components/feedback/loading-state';
import { ErrorState } from '@components/feedback/error-state';
import { SectionHeader } from '@components/ui/section-header';
import { AmountInput } from '@components/shared/amount-input';
import { Button } from '@components/ui/button';
import { TrendingUp, Plus, Trash2, Pencil, ArrowLeft, Clock } from 'lucide-react-native';
import { CurrencyText } from '@components/shared/currency-text';
import { useGlobalSheet } from '@components/shared/global-sheet';
import { ContributionHistory } from '../components/contribution-history';
import { useRouter } from 'expo-router';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';
import type { Goal } from '@core/models';

function ContributeForm({ goalId, onSuccess, hook }: { goalId: string; onSuccess: () => void; hook: ReturnType<typeof useGoals> }) {
  const theme = useTheme();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleSave = async () => {
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) { setError('Enter a valid amount'); return; }
    setError('');
    await hook.addContributionMutation.mutateAsync({ goalId, amount: parsed });
    onSuccess();
  };

  return (
    <View style={{ gap: 20 }}>
      <View style={{ backgroundColor: theme.surfaceBg, borderRadius: 16, padding: 16 }}>
        <AmountInput value={amount} onChangeText={setAmount} />
      </View>
      {error ? <Text style={{ color: theme.expense, fontFamily: fonts.medium, fontSize: 13, textAlign: 'center' }}>{error}</Text> : null}
      <Button title="Add Contribution" onPress={handleSave} loading={hook.addContributionMutation.isPending} size="lg" />
    </View>
  );
}

export function GoalsScreen() {
  const topPadding = useScreenTopPadding();
  const theme = useTheme();
  const router = useRouter();
  const goalsHook = useGoals();
  const { activeGoalsQuery, completedGoalsQuery, createGoalMutation, updateGoalMutation, deleteGoalMutation } = goalsHook;
  const { openSheet, closeSheet } = useGlobalSheet();

  const handleCreate = async (data: { name: string; targetAmount: number; deadline?: string; icon?: string; color?: string }) => {
    await createGoalMutation.mutateAsync(data);
    closeSheet();
  };

  const handleUpdate = async (goalId: string, data: { name: string; targetAmount: number; deadline?: string; icon?: string; color?: string }) => {
    await updateGoalMutation.mutateAsync({ id: goalId, ...data });
    closeSheet();
  };

  const handleOpenForm = (editGoal?: Goal) => {
    openSheet({
      title: editGoal ? 'Edit Goal' : 'Create Goal',
      content: (
        <GoalForm
          editGoal={editGoal}
          onSubmit={editGoal
            ? (data) => handleUpdate(editGoal.id, data)
            : handleCreate
          }
          loading={editGoal ? updateGoalMutation.isPending : createGoalMutation.isPending}
        />
      ),
      snapPoints: ['80%'],
    });
  };

  const handleContribute = (goal: Goal) => {
    openSheet({
      title: `Contribute to ${goal.name}`,
      content: <ContributeForm goalId={goal.id} onSuccess={closeSheet} hook={goalsHook} />,
      snapPoints: ['40%'],
    });
  };

  const handleCardPress = (goal: Goal) => {
    openSheet({
      title: goal.name,
      content: (
        <View style={{ gap: 4 }}>
          {/* Edit */}
          <Pressable onPress={() => handleOpenForm(goal)} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, gap: 14 }}>
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: theme.tint, alignItems: 'center', justifyContent: 'center' }}>
                <Pencil size={18} color={theme.buttonBg} />
              </View>
              <Text style={{ flex: 1, fontSize: 16, fontFamily: fonts.semibold, color: theme.textPrimary }}>Edit</Text>
            </View>
          </Pressable>

          {/* Contribute */}
          {!goal.is_completed && (
            <Pressable onPress={() => handleContribute(goal)} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, gap: 14, borderTopWidth: 1, borderTopColor: theme.border }}>
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: theme.incomeTint, alignItems: 'center', justifyContent: 'center' }}>
                  <Plus size={18} color={theme.income} />
                </View>
                <Text style={{ flex: 1, fontSize: 16, fontFamily: fonts.semibold, color: theme.income }}>Contribute</Text>
              </View>
            </Pressable>
          )}

          {/* History */}
          <Pressable onPress={() => {
            openSheet({
              title: `${goal.name} — History`,
              content: <ContributionHistory goalId={goal.id} goalColor={goal.color ?? theme.accent500} />,
              snapPoints: ['60%'],
            });
          }} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, gap: 14, borderTopWidth: 1, borderTopColor: theme.border }}>
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: theme.surfaceBg, alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={18} color={theme.textSecondary} />
              </View>
              <Text style={{ flex: 1, fontSize: 16, fontFamily: fonts.semibold, color: theme.textPrimary }}>History</Text>
            </View>
          </Pressable>

          {/* Delete */}
          <Pressable onPress={() => { deleteGoalMutation.mutate(goal.id); closeSheet(); }} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, gap: 14, borderTopWidth: 1, borderTopColor: theme.border }}>
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: theme.expenseTint, alignItems: 'center', justifyContent: 'center' }}>
                <Trash2 size={18} color={theme.expense} />
              </View>
              <Text style={{ flex: 1, fontSize: 16, fontFamily: fonts.semibold, color: theme.expense }}>Delete</Text>
            </View>
          </Pressable>
        </View>
      ),
      snapPoints: ['50%'],
    });
  };

  if (activeGoalsQuery.isLoading) return <LoadingState />;
  if (activeGoalsQuery.isError) return <ErrorState onRetry={() => activeGoalsQuery.refetch()} />;

  const activeGoals = activeGoalsQuery.data ?? [];
  const completedGoals = completedGoalsQuery.data ?? [];

  const totalSaved = useMemo(
    () => [...activeGoals, ...completedGoals].reduce((sum, goal) => sum + goal.current_amount, 0),
    [activeGoals, completedGoals]
  );

  const hasAnyGoals = activeGoals.length > 0 || completedGoals.length > 0;

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: topPadding, paddingBottom: 16 }}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, padding: 4 })}>
          <ArrowLeft size={24} color={theme.textPrimary} />
        </Pressable>
        <Text style={{ fontSize: 24, fontFamily: fonts.black, color: theme.textPrimary, marginLeft: 14 }}>
          Savings Goals
        </Text>
      </View>

      {hasAnyGoals ? (
        <>
          {/* Summary Card */}
          <View style={{ marginHorizontal: 20, marginBottom: 20, borderRadius: 24, padding: 22, backgroundColor: theme.buttonBg }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: theme.textOnAccent, opacity: 0.8, marginBottom: 4 }}>Total Saved</Text>
                <CurrencyText
                  amount={totalSaved}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.5}
                  style={{ fontSize: 32, fontFamily: fonts.black, color: theme.textOnAccent }}
                />
              </View>
              <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={24} color={theme.textOnAccent} />
              </View>
            </View>
            <Text style={{ fontSize: 12, fontFamily: fonts.medium, color: theme.textOnAccent, opacity: 0.7, marginTop: 12 }}>
              {activeGoals.length} active · {completedGoals.length} completed
            </Text>
          </View>

          {/* Goals List */}
          <FlatList
            data={[...activeGoals, ...completedGoals]}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <>
                {index === 0 && activeGoals.length > 0 && (
                  <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
                    <SectionHeader title="Active Goals" />
                  </View>
                )}
                {index === activeGoals.length && completedGoals.length > 0 && (
                  <View style={{ paddingHorizontal: 20, marginTop: 8, marginBottom: 12 }}>
                    <SectionHeader title="Completed" />
                  </View>
                )}
                <View style={{ paddingHorizontal: 20 }}>
                  <GoalCard goal={item} onPress={() => handleCardPress(item)} onContribute={() => handleContribute(item)} />
                </View>
              </>
            )}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          />
        </>
      ) : (
        <EmptyState
          icon="target"
          title="Start your savings journey"
          description="Set a goal and watch your progress grow as you save towards it."
          actionLabel="Create Goal"
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
