import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Card } from '@components/ui/card';
import { CategoryIcon } from '@components/shared/category-icon';
import { ProgressBar } from '@components/ui/progress-bar';
import { CurrencyText } from '@components/shared/currency-text';
import { getBudgetStatusLabel, getBudgetStatusColor } from '../services/budget-service';
import { AlertTriangle } from 'lucide-react-native';
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
  const isOverBudget = budget.progress >= 1;
  const overAmount = budget.spent - budget.amount;

  const barColor = useMemo(() => {
    if (budget.progress < 0.7) return theme.income;
    if (budget.progress < 0.9) return theme.warning;
    return theme.expense;
  }, [budget.progress, theme]);

  return (
    <Card
      onPress={onPress}
      className="mb-4 rounded-3xl overflow-hidden shadow-sm active:shadow-md active:scale-98"
      style={{
        backgroundColor: theme.cardBg,
        borderWidth: isOverBudget ? 1 : 0,
        borderColor: isOverBudget ? theme.expense + '40' : undefined,
      }}
    >
      <View className="p-5">
        {/* Header Row */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <View style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: categoryColor + '15',
            }}>
              <CategoryIcon
                iconName={budget.category?.icon ?? 'circle'}
                color={categoryColor}
                size="md"
              />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ fontSize: 16, fontFamily: fonts.heading, color: theme.textPrimary }}>
                {budget.category?.name ?? 'Unknown'}
              </Text>
              <Text style={{ fontSize: 12, fontFamily: fonts.medium, color: theme.textSecondary, marginTop: 4, textTransform: 'capitalize' }}>
                {budget.period}
              </Text>
            </View>
          </View>

          {/* Status Badge */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 50,
            backgroundColor: statusColor + '15',
          }}>
            <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: statusColor }} />
            <Text style={{ fontSize: 12, fontFamily: fonts.heading, color: statusColor }}>
              {statusLabel}
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <ProgressBar
          progress={Math.min(budget.progress, 1)}
          color={barColor}
          height={10}
          className="mb-4 rounded-full overflow-hidden"
        />

        {/* Amount Info */}
        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
          <View>
            <Text style={{ fontSize: 12, fontFamily: fonts.body, color: theme.textSecondary, marginBottom: 4 }}>Spent</Text>
            <CurrencyText
              amount={budget.spent}
              style={{ fontSize: 18, color: isOverBudget ? theme.expense : theme.textPrimary, fontFamily: fonts.heading }}
            />
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 12, fontFamily: fonts.body, color: theme.textSecondary, marginBottom: 4 }}>Limit</Text>
            <CurrencyText
              amount={budget.amount}
              style={{ fontSize: 16, color: theme.textPrimary, fontFamily: fonts.semibold }}
            />
          </View>
        </View>

        {/* Over Budget Warning */}
        {isOverBudget ? (
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            backgroundColor: theme.expenseTint,
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 12,
            borderWidth: 1,
            borderColor: theme.expense + '25',
          }}>
            <AlertTriangle size={18} color={theme.expense} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontFamily: fonts.heading, color: theme.expense }}>
                Over budget by
              </Text>
              <CurrencyText
                amount={overAmount}
                style={{ fontSize: 16, fontFamily: fonts.black, color: theme.expense, marginTop: 2 }}
              />
            </View>
            <Text style={{ fontSize: 22, fontFamily: fonts.black, color: theme.expense }}>
              {progressPercentage}%
            </Text>
          </View>
        ) : (
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: theme.surfaceBg,
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 10,
          }}>
            <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: theme.textSecondary }}>Remaining</Text>
            <CurrencyText
              amount={budget.remaining}
              style={{ fontSize: 15, color: theme.income, fontFamily: fonts.heading }}
            />
          </View>
        )}
      </View>
    </Card>
  );
}
