import React from 'react';
import { View, Text } from 'react-native';
import { useColorScheme } from 'nativewind';
import { PieChart } from 'react-native-gifted-charts';
import { Card } from '@components/ui/card';
import { CategoryIcon } from '@components/shared/category-icon';
import { CurrencyText } from '@components/shared/currency-text';
import type { CategorySpending } from '../types';

const accent = require('@theme/accent');

interface CategoryBreakdownChartProps {
  data: CategorySpending[];
}

export function CategoryBreakdownChart({ data }: CategoryBreakdownChartProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  if (data.length === 0) {
    return (
      <Card className="overflow-hidden" style={{ backgroundColor: isDark ? accent.cardDark : accent.cardLight }}>
        <View className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-200">
            Spending by Category
          </Text>
        </View>
        <View className="items-center py-12">
          <Text className="text-sm text-gray-400 dark:text-gray-500">No spending data yet</Text>
        </View>
      </Card>
    );
  }

  const pieData = data.slice(0, 6).map((item) => ({
    value: item.amount,
    color: item.color,
  }));

  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card className="overflow-hidden" style={{ backgroundColor: isDark ? accent.cardDark : accent.cardLight }}>
      {/* Header */}
      <View className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-200">
          Spending by Category
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Total: <CurrencyText amount={total} className="text-gray-900 dark:text-gray-200 font-semibold" />
        </Text>
      </View>

      {/* Chart */}
      <View className="items-center py-8">
        <PieChart
          data={pieData}
          donut
          innerRadius={50}
          radius={75}
          isAnimated
          animationDuration={800}
          focusOnPress
        />
      </View>

      {/* Legend */}
      <View className="px-5 pb-5 gap-3 max-h-56">
        {data.map((item) => (
          <View key={item.categoryId} className="flex-row items-center">
            {/* Color dot */}
            <View
              className="w-3 h-3 rounded-full mr-3"
              style={{ backgroundColor: item.color }}
            />

            {/* Category info */}
            <Text className="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100">
              {item.categoryName}
            </Text>

            {/* Amount */}
            <View className="flex-row items-baseline gap-2">
              <CurrencyText amount={item.amount} className="text-sm font-semibold text-gray-900 dark:text-gray-200" />
              <Text className="text-xs font-medium text-gray-500 dark:text-gray-400 w-8 text-right">
                {item.percentage}%
              </Text>
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
}
