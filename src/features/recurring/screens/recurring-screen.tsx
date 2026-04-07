import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { ArrowLeft, Plus, Repeat, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useRecurring } from '../hooks/use-recurring';
import { RecurringCard } from '../components/recurring-card';
import { RecurringForm } from '../components/recurring-form';
import { EmptyState } from '@components/feedback/empty-state';
import { LoadingState } from '@components/feedback/loading-state';
import { ErrorState } from '@components/feedback/error-state';
import { CurrencyText } from '@components/shared/currency-text';
import { useGlobalSheet } from '@components/shared/global-sheet';
import { useScreenTopPadding } from '@components/shared/edge-fade';
import { getMonthlyEquivalent } from '@core/utils/recurring';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { RepeatIcon } from '@hugeicons/core-free-icons';
import type { RecurringRuleWithCategory } from '../types';

type Filter = 'all' | 'active' | 'paused';

export function RecurringScreen() {
  const theme = useTheme();
  const topPadding = useScreenTopPadding();
  const router = useRouter();
  const { allQuery, deleteMutation, toggleMutation, payNowMutation } = useRecurring();
  const { openSheet, closeSheet } = useGlobalSheet();
  const [filter, setFilter] = useState<Filter>('all');

  if (allQuery.isLoading) return <LoadingState />;
  if (allQuery.isError) return <ErrorState onRetry={() => allQuery.refetch()} />;

  const allItems = allQuery.data ?? [];

  const filtered = filter === 'all'
    ? allItems
    : filter === 'active'
      ? allItems.filter(r => r.is_active === 1)
      : allItems.filter(r => r.is_active === 0);

  const activeCount = allItems.filter(r => r.is_active === 1).length;
  const pausedCount = allItems.filter(r => r.is_active === 0).length;

  const activeItems = allItems.filter(r => r.is_active === 1);
  const monthlyExpense = activeItems.filter(r => r.type === 'expense').reduce((s, r) => s + getMonthlyEquivalent(r.amount, r.frequency), 0);
  const monthlyIncome = activeItems.filter(r => r.type === 'income').reduce((s, r) => s + getMonthlyEquivalent(r.amount, r.frequency), 0);
  const expenseCount = activeItems.filter(r => r.type === 'expense').length;
  const incomeCount = activeItems.filter(r => r.type === 'income').length;

  const handleOpenForm = (editItem?: RecurringRuleWithCategory) => {
    openSheet({
      title: editItem ? 'Edit Recurring' : 'Add Recurring',
      content: <RecurringForm onSuccess={closeSheet} editItem={editItem} />,
      snapPoints: ['90%'],
    });
  };

  const handleDelete = (id: string) => {
    openSheet({
      title: 'Delete Recurring?',
      content: (
        <View style={{ gap: 20 }}>
          <Text style={{ fontSize: 14, fontFamily: fonts.body, color: theme.textSecondary, lineHeight: 20 }}>
            This will permanently remove this recurring charge. Any past transactions won't be affected.
          </Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1, borderRadius: 50, overflow: 'hidden', backgroundColor: theme.surfaceBg, borderWidth: 1, borderColor: theme.border }}>
              <Pressable onPress={closeSheet} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
                <View style={{ paddingVertical: 14, alignItems: 'center' }}>
                  <Text style={{ fontFamily: fonts.semibold, fontSize: 15, color: theme.textPrimary }}>Cancel</Text>
                </View>
              </Pressable>
            </View>
            <View style={{ flex: 1, borderRadius: 50, overflow: 'hidden', backgroundColor: theme.expenseTint, borderWidth: 1, borderColor: theme.expense + '25' }}>
              <Pressable onPress={() => { deleteMutation.mutate(id); closeSheet(); }} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
                <View style={{ paddingVertical: 14, alignItems: 'center' }}>
                  <Text style={{ fontFamily: fonts.semibold, fontSize: 15, color: theme.expense }}>Delete</Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      ),
      snapPoints: ['30%'],
    });
  };

  const FILTERS: { key: Filter; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: allItems.length },
    { key: 'active', label: 'Active', count: activeCount },
    { key: 'paused', label: 'Paused', count: pausedCount },
  ];

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: topPadding, paddingBottom: 16 }}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, padding: 4 })}>
          <ArrowLeft size={24} color={theme.textPrimary} />
        </Pressable>
        <Text style={{ fontSize: 24, fontFamily: fonts.black, color: theme.textPrimary, marginLeft: 14 }}>
          Recurring
        </Text>
      </View>

      {allItems.length > 0 ? (
        <>
          {/* Next Upcoming */}
          {(() => {
            const upcoming = activeItems
              .filter(r => new Date(r.next_due_date) >= new Date())
              .sort((a, b) => new Date(a.next_due_date).getTime() - new Date(b.next_due_date).getTime())[0];
            if (!upcoming) return null;
            const dueDate = new Date(upcoming.next_due_date);
            const now = new Date();
            const days = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            const dueLabel = days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `In ${days} days`;
            return (
              <View style={{ marginHorizontal: 20, marginBottom: 16, backgroundColor: theme.buttonBg, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 18, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <View style={{ width: 46, height: 46, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                  <Repeat size={20} color={theme.textOnAccent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, fontFamily: fonts.medium, color: theme.textOnAccent, opacity: 0.7 }}>Next up · {dueLabel}</Text>
                  <Text style={{ fontSize: 17, fontFamily: fonts.heading, color: theme.textOnAccent, marginTop: 3 }}>
                    {upcoming.notes || upcoming.category_name || 'Recurring'}
                  </Text>
                </View>
                <CurrencyText
                  amount={upcoming.amount}
                  type={upcoming.type}
                  style={{ fontSize: 18, fontFamily: fonts.black, color: theme.textOnAccent }}
                />
              </View>
            );
          })()}

          {/* Summary — Expense & Income side by side */}
          <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginBottom: 16, gap: 12 }}>
            <View style={{ flex: 1, backgroundColor: theme.expenseTint, borderRadius: 20, padding: 18, borderWidth: 1, borderColor: theme.expense + '25' }}>
              <Text style={{ fontSize: 12, fontFamily: fonts.medium, color: theme.textMuted }}>Monthly Expenses</Text>
              <CurrencyText
                amount={monthlyExpense}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.5}
                style={{ fontSize: 22, fontFamily: fonts.black, color: theme.expense, marginTop: 6 }}
              />
              <Text style={{ fontSize: 11, fontFamily: fonts.body, color: theme.textMuted, marginTop: 4 }}>{expenseCount} active</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: theme.incomeTint, borderRadius: 20, padding: 18, borderWidth: 1, borderColor: theme.income + '25' }}>
              <Text style={{ fontSize: 12, fontFamily: fonts.medium, color: theme.textMuted }}>Monthly Income</Text>
              <CurrencyText
                amount={monthlyIncome}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.5}
                style={{ fontSize: 22, fontFamily: fonts.black, color: theme.income, marginTop: 6 }}
              />
              <Text style={{ fontSize: 11, fontFamily: fonts.body, color: theme.textMuted, marginTop: 4 }}>{incomeCount} active</Text>
            </View>
          </View>

          {/* Net recurring */}
          {monthlyIncome > 0 && monthlyExpense > 0 && (
            <View style={{ marginHorizontal: 20, marginBottom: 16, backgroundColor: theme.cardBg, borderRadius: 16, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 18, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: theme.textSecondary }}>Net Monthly</Text>
              <CurrencyText
                amount={monthlyIncome - monthlyExpense}
                style={{ fontSize: 17, fontFamily: fonts.black, color: monthlyIncome >= monthlyExpense ? theme.income : theme.expense }}
              />
            </View>
          )}

          {/* Section divider */}
          <Text style={{ fontSize: 16, fontFamily: fonts.heading, color: theme.textPrimary, paddingHorizontal: 20, marginTop: 8, marginBottom: 14 }}>
            All Charges
          </Text>

          {/* Filter Pills */}
          <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginBottom: 16, gap: 10 }}>
            {FILTERS.map(f => {
              const sel = filter === f.key;
              return (
                <Pressable key={f.key} onPress={() => setFilter(f.key)} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                    paddingVertical: 12,
                    paddingHorizontal: 18,
                    borderRadius: 50,
                    backgroundColor: sel ? theme.buttonBg : theme.surfaceBg,
                    borderWidth: sel ? 0 : 1,
                    borderColor: theme.border,
                  }}>
                    <Text style={{ fontSize: 15, fontFamily: sel ? fonts.heading : fonts.medium, color: sel ? theme.textOnAccent : theme.textPrimary }}>
                      {f.label}
                    </Text>
                    <View style={{
                      width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center',
                      backgroundColor: sel ? 'rgba(255,255,255,0.2)' : theme.border,
                    }}>
                      <Text style={{ fontSize: 11, fontFamily: fonts.heading, color: sel ? theme.textOnAccent : theme.textMuted }}>{f.count}</Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* List */}
          <FlatList
            data={filtered}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={{ paddingHorizontal: 20 }}>
                <RecurringCard
                  item={item}
                  onPress={() => handleOpenForm(item)}
                  onDelete={() => handleDelete(item.id)}
                  onToggle={() => toggleMutation.mutate({ id: item.id, isActive: item.is_active === 0 })}
                  onPayNow={() => payNowMutation.mutate(item)}
                />
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          />
        </>
      ) : (
        <EmptyState
          icon="repeat"
          title="No recurring charges"
          description="Add recurring bills, subscriptions, or income to track them automatically."
          actionLabel="Add Recurring"
          onAction={() => handleOpenForm()}
        />
      )}

      {/* Floating + */}
      <View style={{ position: 'absolute', bottom: 40, right: 20 }}>
        <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: theme.accent200, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 8 }}>
          <Pressable onPress={() => handleOpenForm()} style={({ pressed }) => ({ width: 56, height: 56, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.8 : 1 })}>
            <Plus size={24} color={theme.textOnAccent} strokeWidth={2.5} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
