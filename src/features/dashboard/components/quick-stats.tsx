import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { CurrencyText } from '@components/shared/currency-text';
import { TrendingUp, TrendingDown, Target } from 'lucide-react-native';

const accent = require('@theme/accent');
const semantic = require('@theme/semantic');

interface QuickStatsProps {
  income: number;
  expense: number;
  savingsRate: number;
}

export function QuickStats({ income, expense, savingsRate }: QuickStatsProps) {
  return (
    <View className="flex-row gap-3">
      {/* Income Card */}
      <Animated.View entering={FadeInUp.delay(200).springify()} className="flex-1">
        <View
          className="rounded-2xl p-4 overflow-hidden"
          style={{
            backgroundColor: semantic.income.tint,
            borderWidth: 1,
            borderColor: semantic.income.light + '30',
          }}
        >
          <View className="flex-row items-center mb-2">
            <View
              className="rounded-full p-2"
              style={{ backgroundColor: semantic.income.light + '30' }}
            >
              <TrendingUp size={16} color={semantic.income.DEFAULT} />
            </View>
          </View>
          <Text className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-2">
            Income
          </Text>
          <CurrencyText
            amount={income}
            compact
            className="text-lg font-bold mt-1"
            style={{ color: semantic.income.DEFAULT }}
          />
        </View>
      </Animated.View>

      {/* Expenses Card */}
      <Animated.View entering={FadeInUp.delay(300).springify()} className="flex-1">
        <View
          className="rounded-2xl p-4 overflow-hidden"
          style={{
            backgroundColor: semantic.expense.tint,
            borderWidth: 1,
            borderColor: semantic.expense.light + '30',
          }}
        >
          <View className="flex-row items-center mb-2">
            <View
              className="rounded-full p-2"
              style={{ backgroundColor: semantic.expense.light + '30' }}
            >
              <TrendingDown size={16} color={semantic.expense.DEFAULT} />
            </View>
          </View>
          <Text className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-2">
            Expenses
          </Text>
          <CurrencyText
            amount={expense}
            compact
            className="text-lg font-bold mt-1"
            style={{ color: semantic.expense.DEFAULT }}
          />
        </View>
      </Animated.View>

      {/* Savings Rate Card */}
      <Animated.View entering={FadeInUp.delay(400).springify()} className="flex-1">
        <View
          className="rounded-2xl p-4 overflow-hidden"
          style={{
            backgroundColor: accent.tint,
            borderWidth: 1,
            borderColor: accent.ring,
          }}
        >
          <View className="flex-row items-center mb-2">
            <View
              className="rounded-full p-2"
              style={{ backgroundColor: accent.ring }}
            >
              <Target size={16} color={accent[500]} />
            </View>
          </View>
          <Text className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-2">
            Savings Rate
          </Text>
          <Text
            className="text-lg font-bold mt-1"
            style={{ color: savingsRate >= 0 ? semantic.income.DEFAULT : semantic.expense.DEFAULT }}
          >
            {savingsRate}%
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}
