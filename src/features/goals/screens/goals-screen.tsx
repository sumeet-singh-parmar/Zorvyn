import React, { useMemo } from 'react';
import { View, FlatList, Text, Pressable } from 'react-native';
import { useScreenTopPadding } from '@components/shared/edge-fade';
import { useGoals } from '../hooks/use-goals';
import { GoalCard } from '../components/goal-card';
import { GoalForm } from '../components/goal-form';
import { EmptyState } from '@components/feedback/empty-state';
import { LoadingState } from '@components/feedback/loading-state';
import { ErrorState } from '@components/feedback/error-state';
import { SectionHeader } from '@components/ui/section-header';
import { TrendingUp, Plus } from 'lucide-react-native';
import { CurrencyText } from '@components/shared/currency-text';
import { useGlobalSheet } from '@components/shared/global-sheet';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';

export function GoalsScreen() {
  const topPadding = useScreenTopPadding();
  const theme = useTheme();
  const { activeGoalsQuery, completedGoalsQuery, createGoalMutation } = useGoals();
  const { openSheet, closeSheet } = useGlobalSheet();

  const handleCreate = async (data: { name: string; targetAmount: number; deadline?: string; icon?: string; color?: string }) => {
    await createGoalMutation.mutateAsync(data);
    closeSheet();
  };

  const handleOpenForm = () => {
    openSheet({
      title: 'Create Goal',
      content: <GoalForm onSubmit={handleCreate} loading={createGoalMutation.isPending} />,
      snapPoints: ['80%'],
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
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: topPadding, paddingBottom: 16 }}>
        <Text style={{ fontSize: 28, fontFamily: fonts.black, color: theme.textPrimary }}>
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
                  <SectionHeader title="Active Goals" />
                )}
                {index === activeGoals.length && completedGoals.length > 0 && (
                  <SectionHeader title="Completed" />
                )}
                <View style={{ paddingHorizontal: 20 }}>
                  <GoalCard goal={item} onPress={() => {}} />
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
