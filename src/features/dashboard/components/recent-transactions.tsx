import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { CategoryIcon } from '@components/shared/category-icon';
import { CurrencyText } from '@components/shared/currency-text';
import { getRelativeTime } from '@core/utils/date';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';
import type { Transaction, Category } from '@core/models';

interface RecentTransactionsProps {
  transactions: Transaction[];
  categories: Category[];
  onSeeAll: () => void;
  onPress: (id: string) => void;
}

export function RecentTransactions({
  transactions,
  categories,
  onSeeAll,
  onPress,
}: RecentTransactionsProps) {
  const theme = useTheme();
  const catMap = new Map(categories.map((c) => [c.id, c]));

  if (transactions.length === 0) {
    return (
      <View
        className="rounded-2xl p-4"
        style={{ backgroundColor: theme.cardBg }}
      >
        <Text style={{ fontSize: 16, fontFamily: fonts.semibold, color: theme.textPrimary, marginBottom: 16 }}>
          Recent Transactions
        </Text>
        <View className="items-center py-6">
          <Text style={{ fontSize: 14, fontFamily: fonts.body, color: theme.textMuted }}>No transactions yet</Text>
        </View>
      </View>
    );
  }

  return (
    <View
      className="rounded-2xl p-4 overflow-hidden"
      style={{ backgroundColor: theme.cardBg, borderWidth: 1, borderColor: theme.border }}
    >
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <Text style={{ fontSize: 16, fontFamily: fonts.heading, color: theme.textPrimary }}>
          Recent
        </Text>
        <Pressable
          onPress={onSeeAll}
          className="px-3 py-1.5 rounded-full"
          style={{ backgroundColor: theme.tint }}
        >
          <Text style={{ fontSize: 14, fontFamily: fonts.semibold, color: theme.accent500 }}>See All</Text>
        </Pressable>
      </View>

      {/* Transactions List */}
      <View>
        {transactions.map((tx, i) => {
          const cat = catMap.get(tx.category_id);
          const isIncome = tx.type === 'income';

          return (
            <Pressable
              key={tx.id}
              onPress={() => onPress(tx.id)}
              className="flex-row items-center"
              style={{
                paddingVertical: 14,
                borderTopWidth: i > 0 ? 1 : 0,
                borderTopColor: theme.border,
              }}
            >
              {/* Icon Badge */}
              <View
                className="rounded-full p-2.5 mr-3"
                style={{
                  backgroundColor: cat?.color ? `${cat.color}15` : theme.surfaceBg,
                }}
              >
                <CategoryIcon
                  iconName={cat?.icon ?? 'circle'}
                  color={cat?.color ?? theme.textMuted}
                  size="sm"
                />
              </View>

              {/* Transaction Details */}
              <View className="flex-1">
                <Text style={{ fontSize: 14, fontFamily: fonts.semibold, color: theme.textPrimary }}>
                  {cat?.name ?? 'Uncategorized'}
                </Text>
                {tx.notes && (
                  <Text style={{ fontSize: 12, fontFamily: fonts.body, color: theme.textSecondary, marginTop: 2 }} numberOfLines={1}>
                    {tx.notes}
                  </Text>
                )}
              </View>

              {/* Amount and Time */}
              <View className="items-end ml-3">
                <CurrencyText
                  amount={tx.amount}
                  type={tx.type}
                  className="text-sm"
                  style={{
                    color: isIncome ? theme.income : theme.expense,
                    fontFamily: fonts.heading,
                  }}
                />
                <Text style={{ fontSize: 12, fontFamily: fonts.body, color: theme.textMuted, marginTop: 2 }}>
                  {getRelativeTime(tx.date)}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
