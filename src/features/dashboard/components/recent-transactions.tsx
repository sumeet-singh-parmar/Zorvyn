import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { CategoryIcon } from '@components/shared/category-icon';
import { CurrencyText } from '@components/shared/currency-text';
import { getRelativeTime } from '@core/utils/date';
import type { Transaction, Category } from '@core/models';

import { useColorScheme } from 'nativewind';

const semantic = require('@theme/semantic');
const accent = require('@theme/accent');

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
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const catMap = new Map(categories.map((c) => [c.id, c]));

  if (transactions.length === 0) {
    return (
      <View
        className="rounded-2xl p-4"
        style={{ backgroundColor: isDark ? accent.cardDark : accent[50] }}
      >
        <Text className="text-base font-semibold text-gray-900 dark:text-gray-200 mb-4">
          Recent Transactions
        </Text>
        <View className="items-center py-6">
          <Text className="text-sm text-gray-400">No transactions yet</Text>
        </View>
      </View>
    );
  }

  return (
    <View
      className="rounded-2xl p-4 overflow-hidden"
      style={{ backgroundColor: isDark ? accent.cardDark : accent.cardLight, borderWidth: 1, borderColor: isDark ? accent[800] : accent[100] }}
    >
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-base font-bold text-gray-900 dark:text-gray-200">
          Recent
        </Text>
        <Pressable
          onPress={onSeeAll}
          className="px-3 py-1.5 rounded-full"
          style={{ backgroundColor: accent.tint }}
        >
          <Text className="text-sm text-accent-600 font-semibold">See All</Text>
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
              className={`flex-row items-center py-3.5 ${
                i > 0 ? 'border-t border-gray-100 dark:border-gray-800' : ''
              }`}
            >
              {/* Icon Badge */}
              <View
                className="rounded-full p-2.5 mr-3"
                style={{
                  backgroundColor: cat?.color ? `${cat.color}15` : (isDark ? accent.surfaceDark : accent.surfaceLight),
                }}
              >
                <CategoryIcon
                  iconName={cat?.icon ?? 'circle'}
                  color={cat?.color ?? '#9CA3AF'}
                  size="sm"
                />
              </View>

              {/* Transaction Details */}
              <View className="flex-1">
                <Text className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                  {cat?.name ?? 'Uncategorized'}
                </Text>
                {tx.notes && (
                  <Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5" numberOfLines={1}>
                    {tx.notes}
                  </Text>
                )}
              </View>

              {/* Amount and Time */}
              <View className="items-end ml-3">
                <CurrencyText
                  amount={tx.amount}
                  type={tx.type}
                  className="text-sm font-bold"
                  style={{
                    color: isIncome ? semantic.income.DEFAULT : semantic.expense.DEFAULT,
                  }}
                />
                <Text className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
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
