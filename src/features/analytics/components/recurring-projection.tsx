import React from 'react';
import { View, Text } from 'react-native';
import { Repeat } from 'lucide-react-native';
import { CurrencyText } from '@components/shared/currency-text';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';

interface RecurringItem {
  name: string;
  amount: number;
  frequency: string;
  type: 'income' | 'expense';
}

interface RecurringProjectionProps {
  monthlyTotal: number;
  items: RecurringItem[];
  activeCount: number;
}

const FREQ_LABELS: Record<string, string> = {
  daily: '/day',
  weekly: '/wk',
  monthly: '/mo',
  yearly: '/yr',
};

export function RecurringProjection({ monthlyTotal, items, activeCount }: RecurringProjectionProps) {
  const theme = useTheme();

  if (activeCount === 0) return null;

  return (
    <View style={{
      backgroundColor: theme.cardBg,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.border,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 17, fontFamily: fonts.heading, color: theme.textPrimary }}>
            Recurring Expenses
          </Text>
          <View style={{ backgroundColor: theme.tint, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 50 }}>
            <Text style={{ fontSize: 11, fontFamily: fonts.semibold, color: theme.buttonBg }}>{activeCount} active</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 8 }}>
          <CurrencyText
            amount={monthlyTotal}
            style={{ fontSize: 24, fontFamily: fonts.black, color: theme.textPrimary }}
          />
          <Text style={{ fontSize: 13, fontFamily: fonts.body, color: theme.textMuted }}>/month projected</Text>
        </View>
      </View>

      {/* Top 3 items */}
      {items.slice(0, 3).map((item, i) => (
        <View
          key={i}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderTopWidth: 1,
            borderTopColor: theme.border,
          }}
        >
          <View style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: (item.type === 'expense' ? theme.expenseTint : theme.incomeTint),
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}>
            <Repeat size={16} color={item.type === 'expense' ? theme.expense : theme.income} />
          </View>
          <Text style={{ flex: 1, fontSize: 14, fontFamily: fonts.medium, color: theme.textPrimary }} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={{ alignItems: 'flex-end' }}>
            <CurrencyText
              amount={item.amount}
              style={{ fontSize: 14, fontFamily: fonts.heading, color: item.type === 'expense' ? theme.expense : theme.income }}
            />
            <Text style={{ fontSize: 11, fontFamily: fonts.body, color: theme.textMuted }}>
              {FREQ_LABELS[item.frequency] ?? item.frequency}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
