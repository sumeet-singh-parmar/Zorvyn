import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Trash2, Pause, Play, Calendar, Check } from 'lucide-react-native';
import { CategoryIcon } from '@components/shared/category-icon';
import { CurrencyText } from '@components/shared/currency-text';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';
import type { RecurringRuleWithCategory } from '../types';

interface RecurringCardProps {
  item: RecurringRuleWithCategory;
  onPress: () => void;
  onDelete: () => void;
  onToggle: () => void;
  onPayNow?: () => void;
}

const FREQ_LABELS: Record<string, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
};

export function RecurringCard({ item, onPress, onDelete, onToggle, onPayNow }: RecurringCardProps) {
  const theme = useTheme();
  const isPaused = item.is_active === 0;
  const now = new Date();
  const dueDate = new Date(item.next_due_date);
  const isOverdue = dueDate < now && !isPaused;
  const isIncome = item.type === 'income';
  const typeColor = isIncome ? theme.income : theme.expense;

  // Days until next due
  const daysUntil = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isDueSoon = !isOverdue && !isPaused && daysUntil >= 0 && daysUntil <= 3;
  const isPaidAhead = !isOverdue && !isPaused && daysUntil > 3;

  return (
    <Swipeable
      renderRightActions={() => (
        <View style={{ flexDirection: 'row', gap: 2 }}>
          <Pressable onPress={onToggle} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
            <View style={{ backgroundColor: theme.tint, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, borderRadius: 12, height: '100%' }}>
              {isPaused ? <Play size={18} color={theme.income} /> : <Pause size={18} color={theme.warning} />}
            </View>
          </Pressable>
          <Pressable onPress={onDelete} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
            <View style={{ backgroundColor: theme.expenseTint, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, borderRadius: 12, height: '100%' }}>
              <Trash2 size={18} color={theme.expense} />
            </View>
          </Pressable>
        </View>
      )}
    >
      <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
        <View style={{
          backgroundColor: theme.cardBg,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: isOverdue ? theme.expense + '40' : theme.border,
          padding: 16,
          marginBottom: 10,
        }}>
          {/* Top row: icon + details + amount */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* Icon with type-colored accent */}
            <View style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              backgroundColor: (item.category_color ?? typeColor) + '18',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
              opacity: isPaused ? 0.5 : 1,
              borderLeftWidth: 3,
              borderLeftColor: typeColor,
            }}>
              <CategoryIcon
                iconName={item.category_icon ?? 'repeat'}
                color={item.category_color ?? typeColor}
                size="sm"
              />
            </View>

            {/* Details */}
            <View style={{ flex: 1, opacity: isPaused ? 0.5 : 1 }}>
              <Text style={{ fontSize: 15, fontFamily: fonts.semibold, color: theme.textPrimary }} numberOfLines={1}>
                {item.notes || item.category_name || 'Recurring'}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 6 }}>
                {/* Type badge */}
                <View style={{ backgroundColor: typeColor + '18', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 }}>
                  <Text style={{ fontSize: 10, fontFamily: fonts.heading, color: typeColor, textTransform: 'uppercase' }}>
                    {item.type}
                  </Text>
                </View>
                <Text style={{ fontSize: 12, fontFamily: fonts.medium, color: theme.textMuted }}>
                  {FREQ_LABELS[item.frequency] ?? item.frequency}
                </Text>
                <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: theme.textMuted, opacity: 0.4 }} />
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                  <Calendar size={11} color={isOverdue ? theme.expense : theme.textMuted} />
                  <Text style={{ fontSize: 12, fontFamily: fonts.body, color: isOverdue ? theme.expense : theme.textMuted }}>
                    {item.next_due_date?.split('T')[0] ?? 'No date'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Amount + Status */}
            <View style={{ alignItems: 'flex-end' }}>
              <CurrencyText
                amount={item.amount}
                type={item.type}
                style={{ fontSize: 15, fontFamily: fonts.heading }}
              />
              {isPaused && (
                <View style={{ backgroundColor: theme.warning + '20', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 50, marginTop: 4 }}>
                  <Text style={{ fontSize: 10, fontFamily: fonts.semibold, color: theme.warning }}>Paused</Text>
                </View>
              )}
              {isOverdue && (
                <View style={{ backgroundColor: theme.expenseTint, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 50, marginTop: 4 }}>
                  <Text style={{ fontSize: 10, fontFamily: fonts.semibold, color: theme.expense }}>Overdue</Text>
                </View>
              )}
              {isDueSoon && (
                <View style={{ backgroundColor: theme.warning + '20', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 50, marginTop: 4 }}>
                  <Text style={{ fontSize: 10, fontFamily: fonts.semibold, color: theme.warning }}>
                    {daysUntil === 0 ? 'Due today' : daysUntil === 1 ? 'Due tomorrow' : `In ${daysUntil} days`}
                  </Text>
                </View>
              )}
              {isPaidAhead && (
                <View style={{ backgroundColor: theme.incomeTint, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 50, marginTop: 4 }}>
                  <Text style={{ fontSize: 10, fontFamily: fonts.semibold, color: theme.income }}>On Track</Text>
                </View>
              )}
            </View>
          </View>

          {/* Pay Now button — inside the card */}
          {isOverdue && onPayNow && (
            <Pressable onPress={onPayNow} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                marginTop: 14,
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: theme.incomeTint,
              }}>
                <Check size={16} color={theme.income} strokeWidth={2.5} />
                <Text style={{ fontSize: 14, fontFamily: fonts.heading, color: theme.income }}>Pay Now</Text>
              </View>
            </Pressable>
          )}
        </View>
      </Pressable>
    </Swipeable>
  );
}
