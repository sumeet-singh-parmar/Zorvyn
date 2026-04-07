import React from 'react';
import { View, Text } from 'react-native';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';

interface SavingsRateCardProps {
  rate: number;
  prevRate: number;
  income: number;
  expense: number;
}

export function SavingsRateCard({ rate, prevRate, income, expense }: SavingsRateCardProps) {
  const theme = useTheme();
  const isPositive = rate >= 0;
  const color = isPositive ? theme.income : theme.expense;
  const tint = isPositive ? theme.incomeTint : theme.expenseTint;
  const diff = rate - prevRate;

  if (income === 0 && expense === 0) return null;

  return (
    <View style={{
      backgroundColor: theme.cardBg,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    }}>
      {/* Big rate circle */}
      <View style={{
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: tint,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: color + '30',
      }}>
        <Text style={{ fontSize: 22, fontFamily: fonts.black, color }}>
          {Math.abs(rate)}%
        </Text>
      </View>

      {/* Details */}
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontFamily: fonts.heading, color: theme.textPrimary, marginBottom: 4 }}>
          Savings Rate
        </Text>
        <Text style={{ fontSize: 13, fontFamily: fonts.body, color: theme.textSecondary, lineHeight: 18 }}>
          {isPositive
            ? `You saved ${rate}% of your income`
            : `You overspent by ${Math.abs(rate)}%`}
        </Text>

        {/* Trend vs previous period */}
        {prevRate !== 0 && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 }}>
            {diff >= 0
              ? <TrendingUp size={14} color={theme.income} />
              : <TrendingDown size={14} color={theme.expense} />
            }
            <Text style={{
              fontSize: 12,
              fontFamily: fonts.semibold,
              color: diff >= 0 ? theme.income : theme.expense,
            }}>
              {diff >= 0 ? '+' : ''}{diff}% vs last period
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
