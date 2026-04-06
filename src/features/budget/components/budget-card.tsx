import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Card } from '@components/ui/card';
import { CategoryIcon } from '@components/shared/category-icon';
import { ProgressBar } from '@components/ui/progress-bar';
import { CurrencyText } from '@components/shared/currency-text';
import { getBudgetStatusLabel, getBudgetStatusColor } from '../services/budget-service';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';
import type { BudgetWithProgress } from '../types';

interface BudgetCardProps {
  budget: BudgetWithProgress;
  onPress: () => void;
}

export function BudgetCard({ budget, onPress }: BudgetCardProps) {
  const theme = useTheme();
  const statusLabel = getBudgetStatusLabel(budget.progress);
  const statusColor = getBudgetStatusColor(budget.progress);

  const categoryColor = budget.category?.color ?? theme.textMuted;
  const progressPercentage = Math.round(budget.progress * 100);

  // Determine progress bar color based on budget utilization
  const barColor = useMemo(() => {
    if (budget.progress < 0.7) return theme.income; // Green - under budget
    if (budget.progress < 0.9) return theme.warning; // Amber - approaching limit
    return theme.expense; // Red - over limit
  }, [budget.progress, theme]);

  return (
    <Card
      onPress={onPress}
      className="mb-4 rounded-3xl overflow-hidden shadow-sm active:shadow-md active:scale-98"
      style={{ backgroundColor: theme.cardBg }}
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
              <Text style={{ fontSize: 16, fontFamily: fonts.heading, color: theme.textPrimary }}>
                {budget.category?.name ?? 'Unknown'}
              </Text>
              <Text style={{ fontSize: 12, fontFamily: fonts.medium, color: theme.textSecondary, marginTop: 4, textTransform: 'capitalize' }}>
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
              style={{ fontSize: 12, fontFamily: fonts.heading, color: statusColor }}
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
            <Text style={{ fontSize: 12, fontFamily: fonts.body, color: theme.textSecondary, marginBottom: 4 }}>Spent</Text>
            <CurrencyText
              amount={budget.spent}
              className="text-lg"
              style={{ color: theme.textPrimary, fontFamily: fonts.heading }}
            />
          </View>
          <Text style={{ fontSize: 14, fontFamily: fonts.body, color: theme.textMuted }}>
            of <CurrencyText
              amount={budget.amount}
              style={{ color: theme.textPrimary, fontFamily: fonts.semibold }}
            />
          </Text>
        </View>

        {/* Remaining Info */}
        <View className="rounded-xl px-3 py-2 flex-row items-center justify-between" style={{ backgroundColor: theme.surfaceBg }}>
          <Text style={{ fontSize: 12, fontFamily: fonts.medium, color: theme.textSecondary }}>Remaining</Text>
          <CurrencyText
            amount={budget.remaining}
            className="text-sm"
            style={{ color: budget.remaining > 0 ? theme.income : theme.expense, fontFamily: fonts.heading }}
          />
        </View>
      </View>
    </Card>
  );
}
