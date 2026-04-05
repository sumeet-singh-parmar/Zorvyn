import React from 'react';
import { View, Text } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Card } from '@components/ui/card';
import { CategoryIcon } from '@components/shared/category-icon';
import { CurrencyText } from '@components/shared/currency-text';
import { ProgressBar } from '@components/ui/progress-bar';
import type { CategorySpending } from '../types';

const accent = require('@theme/accent');

interface TopCategoriesListProps {
  data: CategorySpending[];
}

const getRankColor = (index: number): string => {
  switch (index) {
    case 0:
      return '#F59E0B';
    case 1:
      return '#A0AEC0';
    case 2:
      return '#D97706';
    default:
      return '#9CA3AF';
  }
};

const getRankLabel = (index: number): string => {
  switch (index) {
    case 0:
      return '🥇';
    case 1:
      return '🥈';
    case 2:
      return '🥉';
    default:
      return `${index + 1}.`;
  }
};

export function TopCategoriesList({ data }: TopCategoriesListProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  if (data.length === 0) return null;

  const maxAmount = data[0]?.amount || 1;

  return (
    <Card className="overflow-hidden" style={{ backgroundColor: isDark ? accent.cardDark : accent.cardLight }}>
      {/* Header */}
      <View className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-200">
          Top Spending
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Your top {Math.min(data.length, 5)} categories
        </Text>
      </View>

      {/* List */}
      <View className="divide-y divide-gray-100 dark:divide-gray-700">
        {data.slice(0, 5).map((item, index) => {
          const progress = item.amount / maxAmount;
          const isTop = index === 0;

          return (
            <View
              key={item.categoryId}
              className={`px-5 py-4 ${isTop ? 'bg-amber-50 dark:bg-amber-900/10' : ''}`}
            >
              {/* Top row: Rank, Icon, Category Name, Amount */}
              <View className="flex-row items-center gap-3 mb-2">
                {/* Rank Badge */}
                <View className="w-8 h-8 rounded-full items-center justify-center" style={{
                  backgroundColor: index < 3 ? getRankColor(index) + '20' : '#f3f4f6',
                  borderWidth: 1,
                  borderColor: index < 3 ? getRankColor(index) : '#e5e7eb',
                }}>
                  <Text className="text-sm font-bold" style={{ color: getRankColor(index) }}>
                    {getRankLabel(index)}
                  </Text>
                </View>

                {/* Category Icon & Name */}
                <View className="flex-1 gap-0">
                  <View className="flex-row items-center gap-2">
                    <CategoryIcon iconName={item.icon} color={item.color} size="sm" />
                    <Text className={`flex-1 font-semibold ${isTop ? 'text-base' : 'text-sm'} text-gray-900 dark:text-gray-200`}>
                      {item.categoryName}
                    </Text>
                  </View>
                </View>

                {/* Amount */}
                <View className="items-end">
                  <CurrencyText
                    amount={item.amount}
                    className={`font-bold ${isTop ? 'text-base' : 'text-sm'} text-gray-900 dark:text-gray-200`}
                  />
                  <Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {item.percentage}%
                  </Text>
                </View>
              </View>

              {/* Progress bar */}
              <View className="ml-11">
                <ProgressBar
                  progress={progress}
                  color={item.color}
                  height={6}
                  animated={true}
                />
              </View>
            </View>
          );
        })}
      </View>
    </Card>
  );
}
