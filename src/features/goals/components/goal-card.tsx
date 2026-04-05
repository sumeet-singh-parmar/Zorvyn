import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Card } from '@components/ui/card';
import { ProgressBar } from '@components/ui/progress-bar';
import { CurrencyText } from '@components/shared/currency-text';
import { Target, Check } from 'lucide-react-native';
import { daysRemaining } from '@core/utils/date';
import type { Goal } from '@core/models';

const accent = require('@theme/accent');
const semantic = require('@theme/semantic');

interface GoalCardProps {
  goal: Goal;
  onPress: () => void;
}

export function GoalCard({ goal, onPress }: GoalCardProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const progress = goal.target_amount > 0 ? goal.current_amount / goal.target_amount : 0;
  const remaining = goal.deadline ? daysRemaining(goal.deadline) : null;
  const color = goal.color ?? accent[500];
  const isCompleted = progress >= 1;
  const percentage = Math.round(progress * 100);

  return (
    <Card onPress={onPress} className="mb-4 rounded-3xl overflow-hidden shadow-sm active:shadow-md active:scale-98" style={{ backgroundColor: isDark ? accent.cardDark : accent.cardLight }}>
      <View className="p-5">
        {/* Header Row */}
        <View className="flex-row items-start justify-between mb-4">
          <View className="flex-row items-center flex-1 mr-3">
            <View
              className="w-14 h-14 rounded-2xl items-center justify-center"
              style={{ backgroundColor: color + '15' }}
            >
              {(goal.icon ?? 'target') === 'target' && <Target size={24} color={color} />}
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-base font-bold text-gray-900 dark:text-gray-200 leading-tight">
                {goal.name}
              </Text>
              {remaining !== null && (
                <Text className={`text-xs font-medium mt-1 ${remaining > 0 ? 'text-gray-600 dark:text-gray-400' : 'text-amber-600'}`}>
                  {remaining > 0 ? `${remaining} days left` : 'Deadline passed'}
                </Text>
              )}
            </View>
          </View>

          {/* Percentage Badge */}
          {!isCompleted && (
            <View className="bg-accent-100 dark:bg-accent-900/40 px-3 py-1 rounded-full">
              <Text className="text-sm font-bold text-accent-600 dark:text-accent-400">
                {percentage}%
              </Text>
            </View>
          )}
          {isCompleted && (
            <View className="bg-green-100 dark:bg-green-900/40 px-3 py-1.5 rounded-full flex-row items-center gap-1">
              <Check size={14} color={semantic.income.DEFAULT} />
              <Text className="text-xs font-bold text-green-600 dark:text-green-400">
                Complete
              </Text>
            </View>
          )}
        </View>

        {/* Progress Bar */}
        <ProgressBar
          progress={progress}
          color={isCompleted ? semantic.income.DEFAULT : color}
          height={10}
          className="mb-4 rounded-full overflow-hidden"
        />

        {/* Amount Info */}
        <View className="flex-row items-baseline justify-between mb-4">
          <View>
            <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1">Saved</Text>
            <CurrencyText
              amount={goal.current_amount}
              className="text-xl font-bold"
              style={{ color: isCompleted ? semantic.income.DEFAULT : color }}
            />
          </View>
          <Text className="text-sm text-gray-400 dark:text-gray-600">
            of <CurrencyText
              amount={goal.target_amount}
              className="font-semibold text-gray-700 dark:text-gray-300"
            />
          </Text>
        </View>

        {/* Contribute Button */}
        <Pressable
          className="bg-accent-500 py-3 rounded-2xl items-center active:opacity-80"
          onPress={() => {}}
        >
          <Text className="text-white font-semibold text-sm">Contribute</Text>
        </Pressable>
      </View>
    </Card>
  );
}
