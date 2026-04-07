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
    <View style={{ flexDirection: 'row', gap: 10 }}>
      {[
        { label: 'Income', color: theme.income, tint: theme.incomeTint, icon: TrendingUp, value: income, isCurrency: true, delay: 200 },
        { label: 'Expenses', color: theme.expense, tint: theme.expenseTint, icon: TrendingDown, value: expense, isCurrency: true, delay: 300 },
        { label: 'Savings', color: savingsRate >= 0 ? theme.income : theme.expense, tint: theme.tint, icon: Target, value: savingsRate, isCurrency: false, delay: 400 },
      ].map((card) => {
        const IconComp = card.icon;
        return (
          <Animated.View key={card.label} entering={FadeInUp.delay(card.delay).springify()} style={{ flex: 1 }}>
            <View style={{
              borderRadius: 16,
              padding: 14,
              backgroundColor: card.tint,
              borderWidth: 1,
              borderColor: card.color + '30',
              minHeight: 110,
            }}>
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: card.color + '25', alignItems: 'center', justifyContent: 'center' }}>
                <IconComp size={15} color={card.color} />
              </View>
              <Text style={{ fontSize: 11, fontFamily: fonts.medium, color: theme.textSecondary, marginTop: 10 }}>
                {card.label}
              </Text>
              {card.isCurrency ? (
                <CurrencyText
                  amount={card.value}
                  compact
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.7}
                  style={{ fontSize: 17, fontFamily: fonts.heading, color: card.color, marginTop: 2 }}
                />
              ) : (
                <Text style={{ fontSize: 17, fontFamily: fonts.heading, color: card.color, marginTop: 2 }}>
                  {card.value}%
                </Text>
              )}
            </View>
          </Animated.View>
        );
      })}
    </View>
  );
}
