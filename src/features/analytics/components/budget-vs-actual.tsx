import React from 'react';
import { View, Text } from 'react-native';
import { CurrencyText } from '@components/shared/currency-text';
import { CategoryIcon } from '@components/shared/category-icon';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';

interface BudgetItem {
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  spent: number;
  limit: number;
  progress: number;
}

interface BudgetVsActualProps {
  budgets: BudgetItem[];
}

export function BudgetVsActual({ budgets }: BudgetVsActualProps) {
  const theme = useTheme();

  if (budgets.length === 0) return null;

  const overCount = budgets.filter((b) => b.progress >= 1).length;
  const onTrackCount = budgets.filter((b) => b.progress < 0.7).length;
  const warningCount = budgets.length - overCount - onTrackCount;

  return (
    <View style={{
      backgroundColor: theme.cardBg,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.border,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 17, fontFamily: fonts.heading, color: theme.textPrimary }}>
          Budget Tracking
        </Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {onTrackCount > 0 && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: theme.incomeTint, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 50 }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: theme.income }} />
              <Text style={{ fontSize: 11, fontFamily: fonts.semibold, color: theme.income }}>{onTrackCount}</Text>
            </View>
          )}
          {warningCount > 0 && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: theme.warning + '18', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 50 }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: theme.warning }} />
              <Text style={{ fontSize: 11, fontFamily: fonts.semibold, color: theme.warning }}>{warningCount}</Text>
            </View>
          )}
          {overCount > 0 && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: theme.expenseTint, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 50 }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: theme.expense }} />
              <Text style={{ fontSize: 11, fontFamily: fonts.semibold, color: theme.expense }}>{overCount}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Budget bars */}
      {budgets.map((b, i) => {
        const barColor = b.progress < 0.7 ? theme.income : b.progress < 0.9 ? theme.warning : theme.expense;
        const isOver = b.progress >= 1;
        return (
          <View
            key={i}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 14,
              borderTopWidth: 1,
              borderTopColor: theme.border,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <CategoryIcon iconName={b.categoryIcon} color={b.categoryColor} size="sm" />
              <Text style={{ flex: 1, marginLeft: 10, fontSize: 14, fontFamily: fonts.semibold, color: theme.textPrimary }}>
                {b.categoryName}
              </Text>
              <CurrencyText
                amount={b.spent}
                style={{ fontSize: 13, fontFamily: fonts.heading, color: isOver ? theme.expense : theme.textPrimary }}
              />
              <Text style={{ fontSize: 12, fontFamily: fonts.body, color: theme.textMuted }}> / </Text>
              <CurrencyText
                amount={b.limit}
                style={{ fontSize: 12, fontFamily: fonts.body, color: theme.textMuted }}
              />
            </View>
            {/* Bar */}
            <View style={{ height: 6, borderRadius: 3, backgroundColor: theme.surfaceBg, overflow: 'hidden' }}>
              <View style={{
                height: 6,
                borderRadius: 3,
                backgroundColor: barColor,
                width: `${Math.min(100, b.progress * 100)}%`,
              }} />
            </View>
          </View>
        );
      })}
    </View>
  );
}
