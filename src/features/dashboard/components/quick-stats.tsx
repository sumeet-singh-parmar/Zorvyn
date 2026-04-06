import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { CurrencyText } from '@components/shared/currency-text';
import { TrendingUp, TrendingDown, Target } from 'lucide-react-native';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';

interface QuickStatsProps {
  income: number;
  expense: number;
  savingsRate: number;
}

export function QuickStats({ income, expense, savingsRate }: QuickStatsProps) {
  const theme = useTheme();

  return (
    <View className="flex-row gap-3">
      {/* Income Card */}
      <Animated.View entering={FadeInUp.delay(200).springify()} className="flex-1">
        <View
          className="rounded-2xl p-4 overflow-hidden"
          style={{
            backgroundColor: theme.incomeTint,
            borderWidth: 1,
            borderColor: theme.income + '30',
          }}
        >
          <View className="flex-row items-center mb-2">
            <View
              className="rounded-full p-2"
              style={{ backgroundColor: theme.income + '30' }}
            >
              <TrendingUp size={16} color={theme.income} />
            </View>
          </View>
          <Text style={{ fontSize: 12, fontFamily: fonts.medium, color: theme.textSecondary, marginTop: 8 }}>
            Income
          </Text>
          <CurrencyText
            amount={income}
            compact
            className="text-lg mt-1"
            style={{ color: theme.income, fontFamily: fonts.heading }}
          />
        </View>
      </Animated.View>

      {/* Expenses Card */}
      <Animated.View entering={FadeInUp.delay(300).springify()} className="flex-1">
        <View
          className="rounded-2xl p-4 overflow-hidden"
          style={{
            backgroundColor: theme.expenseTint,
            borderWidth: 1,
            borderColor: theme.expense + '30',
          }}
        >
          <View className="flex-row items-center mb-2">
            <View
              className="rounded-full p-2"
              style={{ backgroundColor: theme.expense + '30' }}
            >
              <TrendingDown size={16} color={theme.expense} />
            </View>
          </View>
          <Text style={{ fontSize: 12, fontFamily: fonts.medium, color: theme.textSecondary, marginTop: 8 }}>
            Expenses
          </Text>
          <CurrencyText
            amount={expense}
            compact
            className="text-lg mt-1"
            style={{ color: theme.expense, fontFamily: fonts.heading }}
          />
        </View>
      </Animated.View>

      {/* Savings Rate Card */}
      <Animated.View entering={FadeInUp.delay(400).springify()} className="flex-1">
        <View
          className="rounded-2xl p-4 overflow-hidden"
          style={{
            backgroundColor: theme.tint,
            borderWidth: 1,
            borderColor: theme.ring,
          }}
        >
          <View className="flex-row items-center mb-2">
            <View
              className="rounded-full p-2"
              style={{ backgroundColor: theme.ring }}
            >
              <Target size={16} color={theme.accent500} />
            </View>
          </View>
          <Text style={{ fontSize: 12, fontFamily: fonts.medium, color: theme.textSecondary, marginTop: 8 }}>
            Savings Rate
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontFamily: fonts.heading,
              marginTop: 4,
              color: savingsRate >= 0 ? theme.income : theme.expense,
            }}
          >
            {savingsRate}%
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}
