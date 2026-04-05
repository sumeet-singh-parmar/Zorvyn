import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { CurrencyText } from '@components/shared/currency-text';
import { PieChart as PieChartIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import type { CategoryBreakdownItem } from '../types';

const accent = require('@theme/accent');

interface SpendingChartProps {
  data: CategoryBreakdownItem[];
  onSeeAll: () => void;
}

export function SpendingChart({ data, onSeeAll }: SpendingChartProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const cardBg = isDark ? accent.cardDark : accent.cardLight;
  const cardBorder = isDark ? accent[800] : accent[100];

  if (data.length === 0) {
    return (
      <View
        className="rounded-2xl p-4 items-center"
        style={{ backgroundColor: cardBg, borderWidth: 1, borderColor: cardBorder }}
      >
        <PieChartIcon size={32} color={isDark ? accent[400] : accent[600]} />
        <Text className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-3">
          No spending this month
        </Text>
        <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
          Start tracking expenses to see your spending breakdown
        </Text>
      </View>
    );
  }

  const total = data.reduce((sum, d) => sum + d.amount, 0);

  const pieData = data.slice(0, 6).map((item) => ({
    value: item.amount,
    color: item.color,
    text: `${item.percentage}%`,
  }));

  return (
    <View
      className="rounded-2xl p-4 overflow-hidden"
      style={{ backgroundColor: cardBg, borderWidth: 1, borderColor: cardBorder }}
    >
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-base font-bold text-gray-900 dark:text-gray-200">
          Spending Breakdown
        </Text>
        <Pressable
          onPress={onSeeAll}
          className="px-3 py-1.5 rounded-full"
          style={{ backgroundColor: accent.tint }}
        >
          <Text style={{ fontSize: 14, fontWeight: '600', color: accent[500] }}>See All</Text>
        </Pressable>
      </View>

      {/* Chart */}
      <View className="items-center my-4">
        <PieChart
          data={pieData}
          donut
          innerRadius={50}
          radius={80}
          isAnimated
          animationDuration={800}
          centerLabelComponent={() => (
            <View className="items-center">
              <Text className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Total Spent
              </Text>
              <CurrencyText
                amount={total}
                compact
                className="text-base font-bold mt-1 text-gray-800 dark:text-gray-100"
              />
            </View>
          )}
        />
      </View>

      {/* Legend */}
      <View style={{ marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: isDark ? accent[800] : accent[100] }}>
        {data.slice(0, 5).map((item) => (
          <View key={item.categoryId} className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center flex-1">
              <View
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: item.color }}
              />
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1">
                {item.categoryName}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                {item.percentage}%
              </Text>
              <CurrencyText
                amount={item.amount}
                compact
                className="text-xs text-gray-500 dark:text-gray-400"
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
