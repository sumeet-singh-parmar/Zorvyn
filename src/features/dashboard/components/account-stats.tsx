import React from 'react';
import { View, Text } from 'react-native';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import { CurrencyText } from '@components/shared/currency-text';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';

interface AccountStatsProps {
  income: number;
  expense: number;
}

/**
 * Income / Expense summary cards for the currently active account.
 * Shows month-to-date totals from the account's transactions.
 */
export function AccountStats({ income, expense }: AccountStatsProps) {
  const theme = useTheme();

  return (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      {/* Income */}
      <View style={{ flex: 1, backgroundColor: theme.incomeTint, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: theme.income + '25' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <TrendingUp size={14} color={theme.income} />
          <Text style={{ fontSize: 12, fontFamily: fonts.medium, color: theme.textSecondary }}>Income</Text>
        </View>
        <CurrencyText
          amount={income}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.6}
          style={{ fontSize: 18, fontFamily: fonts.heading, color: theme.income }}
        />
      </View>

      {/* Expense */}
      <View style={{ flex: 1, backgroundColor: theme.expenseTint, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: theme.expense + '25' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <TrendingDown size={14} color={theme.expense} />
          <Text style={{ fontSize: 12, fontFamily: fonts.medium, color: theme.textSecondary }}>Expense</Text>
        </View>
        <CurrencyText
          amount={expense}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.6}
          style={{ fontSize: 18, fontFamily: fonts.heading, color: theme.expense }}
        />
      </View>
    </View>
  );
}
