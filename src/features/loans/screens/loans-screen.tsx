import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { ArrowLeft, Plus, HandCoins, Check, Trash2, Calendar, ChevronRight, ArrowUpRight, ArrowDownLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { SegmentedControl } from '@components/ui/segmented-control';
import { useLoans } from '../hooks/use-loans';
import { LoanForm } from '../components/loan-form';
import { EmptyState } from '@components/feedback/empty-state';
import { LoadingState } from '@components/feedback/loading-state';
import { ErrorState } from '@components/feedback/error-state';
import { CurrencyText } from '@components/shared/currency-text';
import { useGlobalSheet } from '@components/shared/global-sheet';
import { useScreenTopPadding } from '@components/shared/edge-fade';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';
import type { Loan, LoanType } from '../types';

type Tab = 'lending' | 'borrowing';

export function LoansScreen() {
  const theme = useTheme();
  const topPadding = useScreenTopPadding();
  const router = useRouter();
  const { allQuery, deleteMutation, markPaidMutation } = useLoans();
  const { openSheet, closeSheet } = useGlobalSheet();
  const [tab, setTab] = useState<Tab>('lending');

  if (allQuery.isLoading) return <LoadingState />;
  if (allQuery.isError) return <ErrorState onRetry={() => allQuery.refetch()} />;

  const allLoans = allQuery.data ?? [];
  const filtered = allLoans.filter(l => l.type === tab);
  const activeLending = allLoans.filter(l => l.type === 'lending' && l.status === 'active');
  const activeBorrowing = allLoans.filter(l => l.type === 'borrowing' && l.status === 'active');
  const totalLent = activeLending.reduce((s, l) => s + l.amount, 0);
  const totalBorrowed = activeBorrowing.reduce((s, l) => s + l.amount, 0);

  const handleOpenForm = (editLoan?: Loan) => {
    openSheet({
      title: editLoan ? 'Edit Loan' : 'Add Loan',
      content: <LoanForm onSuccess={closeSheet} editLoan={editLoan} />,
      snapPoints: ['80%'],
    });
  };

  const handleCardPress = (loan: Loan) => {
    const isOverdue = loan.due_date && new Date(loan.due_date) < new Date() && loan.status === 'active';
    openSheet({
      title: loan.person_name,
      content: (
        <View style={{ gap: 4 }}>
          {/* Edit */}
          <Pressable onPress={() => { openSheet({ title: 'Edit Loan', content: <LoanForm onSuccess={closeSheet} editLoan={loan} />, snapPoints: ['80%'] }); }} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, gap: 14 }}>
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: theme.tint, alignItems: 'center', justifyContent: 'center' }}>
                <ChevronRight size={18} color={theme.buttonBg} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontFamily: fonts.semibold, color: theme.textPrimary }}>Edit</Text>
              </View>
            </View>
          </Pressable>

          {/* Mark as Paid */}
          {loan.status === 'active' && (
            <Pressable onPress={() => { markPaidMutation.mutate(loan.id); closeSheet(); }} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, gap: 14, borderTopWidth: 1, borderTopColor: theme.border }}>
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: theme.incomeTint, alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={18} color={theme.income} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontFamily: fonts.semibold, color: theme.income }}>Mark as Paid</Text>
                </View>
              </View>
            </Pressable>
          )}

          {/* Delete */}
          <Pressable onPress={() => { deleteMutation.mutate(loan.id); closeSheet(); }} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, gap: 14, borderTopWidth: 1, borderTopColor: theme.border }}>
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: theme.expenseTint, alignItems: 'center', justifyContent: 'center' }}>
                <Trash2 size={18} color={theme.expense} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontFamily: fonts.semibold, color: theme.expense }}>Delete</Text>
              </View>
            </View>
          </Pressable>
        </View>
      ),
      snapPoints: ['35%'],
    });
  };

  const renderLoan = (loan: Loan) => {
    const isPaid = loan.status === 'paid';
    const isOverdue = loan.due_date && new Date(loan.due_date) < new Date() && !isPaid;
    const isLending = loan.type === 'lending';
    const typeColor = isLending ? theme.income : theme.expense;
    const typeTint = isLending ? theme.incomeTint : theme.expenseTint;
    const DirectionIcon = isLending ? ArrowUpRight : ArrowDownLeft;

    // Days until due
    const daysLeft = loan.due_date
      ? Math.ceil((new Date(loan.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : null;

    return (
      <View style={{ paddingHorizontal: 20, marginBottom: 10 }}>
        <Pressable onPress={() => handleCardPress(loan)} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
          <View style={{
            backgroundColor: theme.cardBg,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: isOverdue ? theme.expense + '40' : theme.border,
            padding: 18,
          }}>
            {/* Top: Direction icon + Name + Amount */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
              {/* Direction indicator */}
              <View style={{
                width: 46,
                height: 46,
                borderRadius: 14,
                backgroundColor: typeTint,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 14,
                borderLeftWidth: 3,
                borderLeftColor: typeColor,
              }}>
                <DirectionIcon size={20} color={typeColor} strokeWidth={2.5} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontFamily: fonts.heading, color: theme.textPrimary }} numberOfLines={1}>
                  {loan.person_name}
                </Text>
                <Text style={{ fontSize: 12, fontFamily: fonts.medium, color: theme.textMuted, marginTop: 2 }}>
                  {isLending ? 'You lent' : 'You owe'}
                </Text>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <CurrencyText
                  amount={loan.amount}
                  style={{ fontSize: 18, fontFamily: fonts.black, color: typeColor }}
                />
              </View>
            </View>

            {/* Bottom: Date + Status badges */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {loan.due_date && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: theme.surfaceBg, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 50 }}>
                  <Calendar size={12} color={isOverdue ? theme.expense : theme.textMuted} />
                  <Text style={{ fontSize: 12, fontFamily: fonts.medium, color: isOverdue ? theme.expense : theme.textMuted }}>
                    {daysLeft !== null && !isPaid
                      ? (isOverdue ? `${Math.abs(daysLeft)}d overdue` : daysLeft === 0 ? 'Due today' : `${daysLeft}d left`)
                      : new Date(loan.due_date).toLocaleDateString('en', { day: 'numeric', month: 'short' })
                    }
                  </Text>
                </View>
              )}
              {isPaid && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: theme.incomeTint, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 50 }}>
                  <Check size={12} color={theme.income} strokeWidth={2.5} />
                  <Text style={{ fontSize: 12, fontFamily: fonts.semibold, color: theme.income }}>Settled</Text>
                </View>
              )}
              {isOverdue && (
                <View style={{ backgroundColor: theme.expenseTint, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 50 }}>
                  <Text style={{ fontSize: 12, fontFamily: fonts.semibold, color: theme.expense }}>Overdue</Text>
                </View>
              )}
              {!isPaid && !isOverdue && daysLeft !== null && daysLeft <= 7 && (
                <View style={{ backgroundColor: theme.warning + '18', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 50 }}>
                  <Text style={{ fontSize: 12, fontFamily: fonts.semibold, color: theme.warning }}>Due soon</Text>
                </View>
              )}
            </View>

            {loan.notes ? (
              <Text style={{ fontSize: 13, fontFamily: fonts.body, color: theme.textSecondary, marginTop: 12 }} numberOfLines={1}>
                {loan.notes}
              </Text>
            ) : null}
          </View>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: topPadding, paddingBottom: 16 }}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, padding: 4 })}>
          <ArrowLeft size={24} color={theme.textPrimary} />
        </Pressable>
        <Text style={{ fontSize: 24, fontFamily: fonts.black, color: theme.textPrimary, marginLeft: 14 }}>
          Loans
        </Text>
      </View>

      {allLoans.length > 0 ? (
        <>
          {/* Summary */}
          <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginBottom: 16, gap: 12 }}>
            <View style={{ flex: 1, backgroundColor: theme.incomeTint, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: theme.income + '25' }}>
              <Text style={{ fontSize: 12, fontFamily: fonts.medium, color: theme.textMuted }}>You Lent</Text>
              <CurrencyText amount={totalLent} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6} style={{ fontSize: 20, fontFamily: fonts.black, color: theme.income, marginTop: 4 }} />
              <Text style={{ fontSize: 11, fontFamily: fonts.body, color: theme.textMuted, marginTop: 2 }}>{activeLending.length} active</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: theme.expenseTint, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: theme.expense + '25' }}>
              <Text style={{ fontSize: 12, fontFamily: fonts.medium, color: theme.textMuted }}>You Owe</Text>
              <CurrencyText amount={totalBorrowed} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6} style={{ fontSize: 20, fontFamily: fonts.black, color: theme.expense, marginTop: 4 }} />
              <Text style={{ fontSize: 11, fontFamily: fonts.body, color: theme.textMuted, marginTop: 2 }}>{activeBorrowing.length} active</Text>
            </View>
          </View>

          {/* Tabs */}
          <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
            <SegmentedControl
              options={['Lending', 'Borrowing']}
              selected={tab === 'lending' ? 'Lending' : 'Borrowing'}
              onSelect={(val) => setTab(val.toLowerCase() as Tab)}
            />
          </View>

          {/* List */}
          <FlatList
            data={filtered}
            keyExtractor={item => item.id}
            renderItem={({ item }) => renderLoan(item)}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: theme.textMuted }}>
                  No {tab === 'lending' ? 'lending' : 'borrowing'} records
                </Text>
              </View>
            }
          />
        </>
      ) : (
        <EmptyState
          icon="hand-coins"
          title="No loans yet"
          description="Track money you lend to friends or borrow from others."
          actionLabel="Add Loan"
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
