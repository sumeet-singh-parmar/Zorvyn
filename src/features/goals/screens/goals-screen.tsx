import React, { useState, useMemo } from 'react';
import { View, FlatList, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { useGoals } from '../hooks/use-goals';

const accent = require('@theme/accent');
import { GoalCard } from '../components/goal-card';
import { GoalForm } from '../components/goal-form';
import { FAB } from '@components/ui/fab';
import { Modal } from '@components/ui/modal';
import { EmptyState } from '@components/feedback/empty-state';
import { LoadingState } from '@components/feedback/loading-state';
import { ErrorState } from '@components/feedback/error-state';
import { SectionHeader } from '@components/ui/section-header';
import { X, TrendingUp } from 'lucide-react-native';
import { CurrencyText } from '@components/shared/currency-text';

export function GoalsScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { activeGoalsQuery, completedGoalsQuery, createGoalMutation } = useGoals();
  const [showForm, setShowForm] = useState(false);

  const handleCreate = async (data: { name: string; targetAmount: number; deadline?: string; icon?: string; color?: string }) => {
    await createGoalMutation.mutateAsync(data);
    setShowForm(false);
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
    <SafeAreaView className="flex-1" style={{ backgroundColor: isDark ? accent.screenBg : accent.screenBgLight }}>
      {/* Header */}
      <View className="px-4 py-4 flex-row items-center justify-between">
        <Text className="text-3xl font-bold text-gray-900 dark:text-gray-200">Savings Goals</Text>
        <Pressable className="p-2 rounded-full active:bg-gray-100 dark:active:bg-gray-800">
          <X size={24} color="#6B7280" />
        </Pressable>
      </View>

      {hasAnyGoals ? (
        <>
          {/* Summary Card */}
          <View className="mx-4 mb-6 bg-accent-500 rounded-3xl p-6 shadow-lg">
            <View className="flex-row items-baseline justify-between">
              <View>
                <Text className="text-white text-sm font-medium opacity-90 mb-1">Total Saved</Text>
                <View className="flex-row items-baseline gap-1">
                  <CurrencyText
                    amount={totalSaved}
                    className="text-4xl font-bold text-white"
                  />
                </View>
              </View>
              <View className="w-16 h-16 bg-white/20 rounded-2xl items-center justify-center">
                <TrendingUp size={32} color="white" />
              </View>
            </View>
            <Text className="text-white text-xs font-medium mt-4 opacity-80">
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
                  <SectionHeader title="Active Goals" className="px-4 mb-3" />
                )}
                {index === activeGoals.length && completedGoals.length > 0 && (
                  <SectionHeader title="Completed" className="px-4 mt-6 mb-3" />
                )}
                <View className="px-4">
                  <GoalCard goal={item} onPress={() => {}} />
                </View>
              </>
            )}
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
          />
        </>
      ) : (
        <EmptyState
          icon="target"
          title="Start your savings journey"
          description="Set a goal and watch your progress grow as you save towards it."
          actionLabel="Create Goal"
          onAction={() => setShowForm(true)}
        />
      )}

      <FAB onPress={() => setShowForm(true)} />

      <Modal visible={showForm} onClose={() => setShowForm(false)} title="Create Goal">
        <GoalForm onSubmit={handleCreate} loading={createGoalMutation.isPending} />
      </Modal>
    </SafeAreaView>
  );
}
