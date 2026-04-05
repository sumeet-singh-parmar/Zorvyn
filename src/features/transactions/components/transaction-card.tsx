import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Swipeable } from 'react-native-gesture-handler';
import { Trash2 } from 'lucide-react-native';
import { CategoryIcon } from '@components/shared/category-icon';
import { CurrencyText } from '@components/shared/currency-text';
import { getRelativeTime } from '@core/utils/date';
import type { TransactionWithCategory } from '../types';

const accentTheme = require('@theme/accent');
const semantic = require('@theme/semantic');

interface TransactionCardProps {
  transaction: TransactionWithCategory;
  onPress: () => void;
  onDelete: () => void;
}

const TYPE_ACCENT: Record<string, string> = {
  income: semantic.income[600],
  expense: semantic.expense[600],
  transfer: semantic.transfer[600],
};

function DeleteAction() {
  return (
    <View className="bg-red-500 justify-center items-center px-6 rounded-2xl mr-4">
      <Trash2 size={18} color="#FFFFFF" />
      <Text className="text-white text-xs font-semibold mt-1">Delete</Text>
    </View>
  );
}

export function TransactionCard({
  transaction,
  onPress,
  onDelete,
}: TransactionCardProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { category } = transaction;
  const accent = TYPE_ACCENT[transaction.type] ?? '#6B7280';

  return (
    <Swipeable
      renderRightActions={() => <DeleteAction />}
      onSwipeableOpen={(direction) => {
        if (direction === 'right') onDelete();
      }}
    >
      <Pressable
        onPress={onPress}
        className="flex-row items-center mx-4 mb-1.5 rounded-2xl active:bg-gray-50 dark:active:bg-gray-800 border border-gray-100 dark:border-gray-800"
        style={{
          backgroundColor: isDark ? accentTheme.cardDark : accentTheme.cardLight,
          paddingLeft: 14,
          paddingRight: 16,
          paddingVertical: 14,
        }}
      >
        {/* Type accent bar */}
        <View
          style={{
            width: 3,
            height: 30,
            borderRadius: 2,
            backgroundColor: accent,
            marginRight: 12,
          }}
        />

        {/* Category Icon */}
        <CategoryIcon
          iconName={category?.icon ?? 'circle'}
          color={category?.color ?? '#9CA3AF'}
          size="md"
        />

        {/* Details */}
        <View className="flex-1 ml-3">
          <Text
            numberOfLines={1}
            className="text-[15px] font-semibold text-gray-800 dark:text-gray-200"
          >
            {transaction.notes || (category?.name ?? 'Uncategorized')}
          </Text>
          <View className="flex-row items-center mt-0.5">
            <Text className="text-[13px] text-gray-400 dark:text-gray-500">
              {category?.name ?? 'Uncategorized'}
            </Text>
            <View className="w-[3px] h-[3px] rounded-full bg-gray-300 dark:bg-gray-600 mx-1.5" />
            <Text className="text-[13px] text-gray-400 dark:text-gray-500">
              {getRelativeTime(transaction.date)}
            </Text>
          </View>
        </View>

        {/* Amount */}
        <CurrencyText
          amount={transaction.amount}
          type={transaction.type}
          className="text-[15px] font-bold"
        />
      </Pressable>
    </Swipeable>
  );
}
