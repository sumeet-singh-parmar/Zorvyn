import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Trash2 } from 'lucide-react-native';
import { CategoryIcon } from '@components/shared/category-icon';
import { CurrencyText } from '@components/shared/currency-text';
import { formatTime } from '@core/utils/date';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';
import type { TransactionWithCategory } from '../types';

interface TransactionCardProps {
  transaction: TransactionWithCategory;
  onPress: () => void;
  onDelete: () => void;
}

export function TransactionCard({ transaction, onPress, onDelete }: TransactionCardProps) {
  const theme = useTheme();
  const { category } = transaction;

  const typeColor: Record<string, string> = {
    income: theme.income,
    expense: theme.expense,
    transfer: theme.transfer,
  };
  const accentColor = typeColor[transaction.type] ?? theme.textMuted;

  return (
    <Swipeable
      renderRightActions={() => (
        <View style={{ backgroundColor: theme.expense, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24, borderRadius: 16, marginRight: 16 }}>
          <Trash2 size={18} color={theme.textOnAccent} />
          <Text style={{ color: theme.textOnAccent, fontSize: 11, fontFamily: fonts.semibold, marginTop: 4 }}>Delete</Text>
        </View>
      )}
      onSwipeableOpen={(direction) => {
        if (direction === 'right') onDelete();
      }}
    >
      <View style={{ marginHorizontal: 16, marginBottom: 6, borderRadius: 16, backgroundColor: theme.cardBg, borderWidth: 1, borderColor: theme.border, overflow: 'hidden' }}>
        <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 14, paddingRight: 16, paddingVertical: 14 }}>
            {/* Accent bar */}
            <View style={{ width: 3, height: 30, borderRadius: 2, backgroundColor: accentColor, marginRight: 12 }} />

            {/* Category Icon */}
            <CategoryIcon iconName={category?.icon ?? 'circle'} color={category?.color ?? theme.textMuted} size="md" />

            {/* Details */}
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text numberOfLines={1} style={{ fontSize: 15, fontFamily: fonts.semibold, color: theme.textPrimary }}>
                {transaction.notes || (category?.name ?? 'Uncategorized')}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                <Text style={{ fontSize: 13, fontFamily: fonts.body, color: theme.textMuted }}>
                  {category?.name ?? 'Uncategorized'}
                </Text>
                <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: theme.textMuted, marginHorizontal: 6, opacity: 0.5 }} />
                <Text style={{ fontSize: 13, fontFamily: fonts.body, color: theme.textMuted }}>
                  {formatTime(transaction.date)}
                </Text>
              </View>
            </View>

            {/* Amount */}
            <CurrencyText
              amount={transaction.amount}
              type={transaction.type}
              style={{ fontSize: 15, fontFamily: fonts.heading }}
            />
          </View>
        </Pressable>
      </View>
    </Swipeable>
  );
}
