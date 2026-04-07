import React from 'react';
import { View, Text } from 'react-native';
import { TrendingUp, TrendingDown, CreditCard } from 'lucide-react-native';
import { CurrencyText } from '@components/shared/currency-text';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';
import type { Transaction } from '@core/models';

interface AccountTransactionsListProps {
  transactions: Transaction[];
  accountName: string;
}

/**
 * "Recent for {account name}" list of the last 5 transactions for the active account.
 * Shows an empty state when there are none.
 */
export function AccountTransactionsList({ transactions, accountName }: AccountTransactionsListProps) {
  const theme = useTheme();

  if (transactions.length === 0) {
    return (
      <View style={{ marginTop: 24, alignItems: 'center', paddingVertical: 40, backgroundColor: theme.cardBg, borderRadius: 20, borderWidth: 1, borderColor: theme.border }}>
        <View style={{ width: 64, height: 64, borderRadius: 16, backgroundColor: theme.surfaceBg, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <CreditCard size={28} color={theme.textMuted} />
        </View>
        <Text style={{ fontSize: 15, fontFamily: fonts.semibold, color: theme.textPrimary }}>
          No transactions yet
        </Text>
        <Text style={{ fontSize: 12, fontFamily: fonts.body, color: theme.textMuted, marginTop: 4 }}>
          Add a transaction to see it here
        </Text>
      </View>
    );
  }

  return (
    <View style={{ marginTop: 24 }}>
      <Text style={{ fontSize: 16, fontFamily: fonts.heading, color: theme.textPrimary, marginBottom: 12 }}>
        Recent for {accountName}
      </Text>
      <View style={{ backgroundColor: theme.cardBg, borderRadius: 16, borderWidth: 1, borderColor: theme.border, overflow: 'hidden' }}>
        {transactions.slice(0, 5).map((tx, i) => (
          <View
            key={tx.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingVertical: 14,
              borderTopWidth: i > 0 ? 1 : 0,
              borderTopColor: theme.border,
            }}
          >
            <View style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: tx.type === 'income' ? theme.incomeTint : theme.expenseTint,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}>
              {tx.type === 'income' ? (
                <TrendingUp size={16} color={theme.income} />
              ) : (
                <TrendingDown size={16} color={theme.expense} />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontFamily: fonts.semibold, color: theme.textPrimary }}>
                {tx.notes || tx.type}
              </Text>
              <Text style={{ fontSize: 12, fontFamily: fonts.body, color: theme.textMuted, marginTop: 2 }}>
                {tx.date.split('T')[0]}
              </Text>
            </View>
            <CurrencyText
              amount={tx.amount}
              type={tx.type}
              style={{ fontSize: 14, fontFamily: fonts.heading }}
            />
          </View>
        ))}
      </View>
    </View>
  );
}
