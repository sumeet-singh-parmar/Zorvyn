import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Card } from '@components/ui/card';
import { CategoryIcon } from '@components/shared/category-icon';
import { ProgressBar } from '@components/ui/progress-bar';
import { CurrencyText } from '@components/shared/currency-text';
import { getBudgetStatusLabel, getBudgetStatusColor } from '../services/budget-service';
import type { BudgetWithProgress } from '../types';

const accent = require('@theme/accent');
const semantic = require('@theme/semantic');

interface BudgetCardProps {
  budget: BudgetWithProgress;
  onPress: () => void;
}

export function BudgetCard({ budget, onPress }: BudgetCardProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const statusLabel = getBudgetStatusLabel(budget.progress);
  const statusColor = getBudgetStatusColor(budget.progress);

  const categoryColor = budget.category?.color ?? '#9CA3AF';
  const progressPercentage = Math.round(budget.progress * 100);

  // Determine progress bar color based on budget utilization
  const barColor = useMemo(() => {
    if (budget.progress < 0.7) return semantic.income.DEFAULT; // Green - under budget
    if (budget.progress < 0.9) return semantic.warning[500]; // Amber - approaching limit
    return semantic.expense.DEFAULT; // Red - over limit
  }, [budget.progress]);

  return (
    <Card
      onPress={onPress}
      className="mb-4 rounded-3xl overflow-hidden shadow-sm active:shadow-md active:scale-98"
      style={{ backgroundColor: isDark ? accent.cardDark : accent.cardLight }}
    >
      <View className="p-5">
        {/* Header Row */}
        <View className="flex-row items-start justify-between mb-4">
          <View className="flex-row items-center flex-1">
            <View
              className="w-12 h-12 rounded-2xl items-center justify-center"
              style={{ backgroundColor: categoryColor + '15' }}
            >
              <CategoryIcon
                iconName={budget.category?.icon ?? 'circle'}
                color={categoryColor}
                size="md"
              />
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-base font-bold text-gray-900 dark:text-gray-200">
                {budget.category?.name ?? 'Unknown'}
              </Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1 capitalize">
                {budget.period}
              </Text>
            </View>
          </View>

          {/* Status Badge */}
          <View
            className="px-3 py-1.5 rounded-full flex-row items-center gap-1"
            style={{
              backgroundColor: statusColor + '15',
            }}
          >
            <View
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: statusColor }}
            />
            <Text
              className="text-xs font-bold"
              style={{ color: statusColor }}
            >
              {progressPercentage}%
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <ProgressBar
          progress={budget.progress}
          color={barColor}
          height={10}
          className="mb-4 rounded-full overflow-hidden"
        />

        {/* Amount Info */}
        <View className="flex-row items-baseline justify-between mb-3">
          <View>
            <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1">Spent</Text>
            <CurrencyText
              amount={budget.spent}
              className="text-lg font-bold text-gray-900 dark:text-gray-200"
            />
          </View>
          <Text className="text-sm text-gray-400 dark:text-gray-600">
            of <CurrencyText
              amount={budget.amount}
              className="font-semibold text-gray-700 dark:text-gray-300"
            />
          </Text>
        </View>

        {/* Remaining Info */}
        <View className="bg-gray-50 dark:bg-gray-700 rounded-xl px-3 py-2 flex-row items-center justify-between">
          <Text className="text-xs text-gray-500 dark:text-gray-400 font-medium">Remaining</Text>
          <CurrencyText
            amount={budget.remaining}
            className="text-sm font-bold"
            style={{ color: budget.remaining > 0 ? semantic.income.DEFAULT : semantic.expense.DEFAULT }}
          />
        </View>
      </View>
    </Card>
  );
}
