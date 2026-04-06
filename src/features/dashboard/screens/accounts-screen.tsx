import React, { useMemo, useRef, useState } from 'react';
import { View, Text, ScrollView, Pressable, useWindowDimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Landmark, Banknote, Wallet, CreditCard, Star, TrendingUp, TrendingDown, Pencil, Trash2, ChevronRight } from 'lucide-react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { CreditCardAddIcon } from '@hugeicons/core-free-icons';
import { useGlobalSheet } from '@components/shared/global-sheet';
import { AddAccountForm } from '../components/add-account-form';
import { useDatabase } from '@core/providers/database-provider';
import { AccountRepository } from '@core/repositories/account-repository';
import { TransactionRepository } from '@core/repositories/transaction-repository';
import { queryKeys } from '@core/constants/query-keys';
import { CurrencyText } from '@components/shared/currency-text';
import { formatCurrency } from '@core/currency';
import { useScreenTopPadding } from '@components/shared/edge-fade';
import { useTheme, useIsDark } from '@theme/use-theme';
import { useThemeStore } from '@stores/theme-store';
import { hslToHex, hslToRgba } from '@theme/hsl';
import { fonts } from '@theme/fonts';
import { LoadingState } from '@components/feedback/loading-state';
import { startOfMonth, endOfMonth } from '@core/utils/date';
import type { Account, Transaction } from '@core/models';

const TYPE_ICONS: Record<string, typeof Landmark> = {
  bank: Landmark,
  cash: Banknote,
  wallet: Wallet,
  credit_card: CreditCard,
};

const TYPE_LABELS: Record<string, string> = {
  bank: 'Bank Account',
  cash: 'Cash',
  wallet: 'Wallet',
  credit_card: 'Credit Card',
};

// Default card colors by type
const TYPE_COLORS: Record<string, string> = {
  bank: '#314972',
  cash: '#38512B',
  wallet: '#6B5A3D',
  credit_card: '#4A3560',
};

export function AccountsScreen() {
  const theme = useTheme();
  const { hue, saturation } = useThemeStore();
  const topPadding = useScreenTopPadding();
  const router = useRouter();
  const db = useDatabase();
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = screenWidth - 40; // 20px padding each side
  const [activeIndex, setActiveIndex] = useState(0);
  const { openSheet, closeSheet } = useGlobalSheet();
  const queryClient = useQueryClient();

  const accountRepo = useMemo(() => new AccountRepository(db), [db]);
  const transactionRepo = useMemo(() => new TransactionRepository(db), [db]);

  const { data: accounts, isLoading } = useQuery({
    queryKey: queryKeys.accounts.all,
    queryFn: () => accountRepo.getAll(),
  });

  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const { data: transactions } = useQuery({
    queryKey: queryKeys.transactions.byDateRange(monthStart, monthEnd),
    queryFn: () => transactionRepo.getByDateRange(monthStart, monthEnd),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('[Zorvyn] 🗑️ Deleting account:', id);
      await db.runAsync(`UPDATE accounts SET deleted_at = datetime('now') WHERE id = ?`, [id]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
      closeSheet();
    },
  });

  const handleCardPress = (account: Account) => {
    const isDefault = account.is_default === 1;

    const handleEdit = () => {
      openSheet({
        title: 'Edit Account',
        content: <AddAccountForm onSuccess={closeSheet} editAccount={account} />,
        snapPoints: ['85%'],
      });
    };

    const handleDelete = () => {
      openSheet({
        title: 'Delete Account?',
        content: (
          <View style={{ gap: 20 }}>
            <Text style={{ fontSize: 14, fontFamily: fonts.body, color: theme.textSecondary, lineHeight: 20 }}>
              Are you sure you want to delete "{account.name}"? All transactions linked to this account will remain but won't be associated with any account.
            </Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1, borderRadius: 50, overflow: 'hidden', backgroundColor: theme.surfaceBg, borderWidth: 1, borderColor: theme.border }}>
                <Pressable onPress={() => closeSheet()} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
                  <View style={{ paddingVertical: 14, alignItems: 'center' }}>
                    <Text style={{ fontFamily: fonts.semibold, fontSize: 15, color: theme.textPrimary }}>Cancel</Text>
                  </View>
                </Pressable>
              </View>
              <View style={{ flex: 1, borderRadius: 50, overflow: 'hidden', backgroundColor: theme.expenseTint, borderWidth: 1, borderColor: theme.expense + '25' }}>
                <Pressable onPress={() => deleteMutation.mutate(account.id)} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
                  <View style={{ paddingVertical: 14, alignItems: 'center' }}>
                    <Text style={{ fontFamily: fonts.semibold, fontSize: 15, color: theme.expense }}>Delete</Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </View>
        ),
        snapPoints: ['32%'],
      });
    };

    openSheet({
      title: account.name,
      content: (
        <View style={{ gap: 4 }}>
          {/* Edit */}
          <Pressable onPress={handleEdit} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, gap: 14 }}>
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: theme.tint, alignItems: 'center', justifyContent: 'center' }}>
                <Pencil size={18} color={theme.buttonBg} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontFamily: fonts.semibold, color: theme.textPrimary }}>Edit Account</Text>
                <Text style={{ fontSize: 12, fontFamily: fonts.body, color: theme.textMuted, marginTop: 2 }}>Change name, color, or balance</Text>
              </View>
              <ChevronRight size={18} color={theme.textMuted} />
            </View>
          </Pressable>

          {/* Delete -- only if not default AND more than 1 account */}
          {!isDefault && (accounts?.length ?? 0) > 1 && (
            <Pressable onPress={handleDelete} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, gap: 14, borderTopWidth: 1, borderTopColor: theme.border }}>
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: theme.expenseTint, alignItems: 'center', justifyContent: 'center' }}>
                  <Trash2 size={18} color={theme.expense} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontFamily: fonts.semibold, color: theme.expense }}>Delete Account</Text>
                  <Text style={{ fontSize: 12, fontFamily: fonts.body, color: theme.textMuted, marginTop: 2 }}>This cannot be undone</Text>
                </View>
                <ChevronRight size={18} color={theme.textMuted} />
              </View>
            </Pressable>
          )}

          {(isDefault || (accounts?.length ?? 0) <= 1) && (
            <View style={{ paddingVertical: 12, paddingHorizontal: 4, borderTopWidth: 1, borderTopColor: theme.border }}>
              <Text style={{ fontSize: 13, fontFamily: fonts.body, color: theme.textMuted, textAlign: 'center' }}>
                {isDefault ? 'Default account cannot be deleted' : 'At least one account is required'}
              </Text>
            </View>
          )}
        </View>
      ),
      snapPoints: ['30%'],
    });
  };

  if (isLoading || !accounts) return <LoadingState />;

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  const isDark = useIsDark();

  const lightenHex = (hex: string): string => {
    // Parse hex to RGB, convert to HSL, bump lightness
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
      else if (max === g) h = ((b - r) / d + 2) * 60;
      else h = ((r - g) / d + 4) * 60;
    }
    return hslToHex(Math.round(h), Math.round(s * 100), Math.round(l * 100) + 20);
  };

  const getCardColor = (account: Account, index: number) => {
    const baseColor = account.color ?? TYPE_COLORS[account.type] ?? hslToHex((hue + index * 50) % 360, 50, 50);
    return isDark ? baseColor : lightenHex(baseColor);
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = e.nativeEvent.contentOffset.x;
    const index = Math.round(offset / (cardWidth + 12));
    setActiveIndex(Math.max(0, Math.min(index, accounts.length - 1)));
  };

  // Get transactions for the active account
  const activeAccount = accounts[activeIndex];
  const accountTransactions = (transactions ?? []).filter(
    (t) => t.account_id === activeAccount?.id
  );
  const accountIncome = accountTransactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);
  const accountExpense = accountTransactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);

  return (
    <View style={{ flex: 1, backgroundColor: theme.screenBg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: topPadding, paddingBottom: 100 }}>

        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 20 }}>
          <Pressable onPress={() => router.back()} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, padding: 4 })}>
            <ArrowLeft size={24} color={theme.textPrimary} />
          </Pressable>
          <Text style={{ fontSize: 24, fontFamily: fonts.black, color: theme.textPrimary, marginLeft: 14 }}>
            Accounts
          </Text>
        </View>

        {/* Card Carousel */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={cardWidth + 12}
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {accounts.map((account, index) => {
            const color = getCardColor(account, index);
            const IconComp = TYPE_ICONS[account.type] ?? Wallet;

            return (
              <Pressable
                key={account.id}
                onPress={() => handleCardPress(account)}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.95 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                })}
              >
                <View style={{
                  width: cardWidth,
                  height: 220,
                  borderRadius: 20,
                  backgroundColor: color,
                  borderWidth: 1.5,
                  borderColor: 'rgba(255,255,255,0.15)',
                  padding: 22,
                  justifyContent: 'space-between',
                  overflow: 'hidden',
                }}>
                {/* Decorative circles */}
                <View style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.1)' }} />
                <View style={{ position: 'absolute', bottom: -30, left: -30, width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.06)' }} />

                {/* Top: Type + Icon */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View>
                    <Text style={{ fontSize: 16, fontFamily: fonts.heading, color: 'rgba(255,255,255,0.9)' }}>
                      {TYPE_LABELS[account.type] ?? account.type}
                    </Text>
                    <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
                      {account.name}
                    </Text>
                  </View>
                  <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                    <IconComp size={20} color="rgba(255,255,255,0.9)" />
                  </View>
                </View>

                {/* Bottom: Balance */}
                <View>
                  {account.is_default === 1 && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                      <Star size={10} color="rgba(255,255,255,0.7)" fill="rgba(255,255,255,0.7)" />
                      <Text style={{ fontSize: 10, fontFamily: fonts.semibold, color: 'rgba(255,255,255,0.7)' }}>Default</Text>
                    </View>
                  )}
                  <Text style={{ fontSize: 12, fontFamily: fonts.medium, color: 'rgba(255,255,255,0.6)' }}>
                    Total balance
                  </Text>
                  <CurrencyText
                    amount={account.balance}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.5}
                    style={{ fontSize: 28, fontFamily: fonts.black, color: '#FFFFFF', marginTop: 2 }}
                  />
                </View>
              </View>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Page Dots */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16, gap: 6 }}>
          {accounts.map((_, i) => (
            <View
              key={i}
              style={{
                width: activeIndex === i ? 20 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: activeIndex === i ? theme.buttonBg : theme.border,
              }}
            />
          ))}
        </View>

        {/* Income / Expense for active account */}
        {activeAccount && (
          <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {/* Income */}
              <View style={{ flex: 1, backgroundColor: theme.incomeTint, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: theme.income + '25' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <TrendingUp size={14} color={theme.income} />
                  <Text style={{ fontSize: 12, fontFamily: fonts.medium, color: theme.textSecondary }}>Income</Text>
                </View>
                <CurrencyText
                  amount={accountIncome}
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
                  amount={accountExpense}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.6}
                  style={{ fontSize: 18, fontFamily: fonts.heading, color: theme.expense }}
                />
              </View>
            </View>

            {/* Recent transactions for this account */}
            {accountTransactions.length > 0 && (
              <View style={{ marginTop: 24 }}>
                <Text style={{ fontSize: 16, fontFamily: fonts.heading, color: theme.textPrimary, marginBottom: 12 }}>
                  Recent for {activeAccount.name}
                </Text>
                <View style={{ backgroundColor: theme.cardBg, borderRadius: 16, borderWidth: 1, borderColor: theme.border, overflow: 'hidden' }}>
                  {accountTransactions.slice(0, 5).map((tx, i) => (
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
            )}

            {accountTransactions.length === 0 && (
              <View style={{ marginTop: 24, alignItems: 'center', paddingVertical: 40, backgroundColor: theme.cardBg, borderRadius: 20, borderWidth: 1, borderColor: theme.border }}>
                <View style={{ width: 64, height: 64, borderRadius: 16, backgroundColor: theme.surfaceBg, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <CreditCard size={28} color={theme.textMuted} />
                </View>
                <Text style={{ fontSize: 16, fontFamily: fonts.heading, color: theme.textPrimary }}>
                  No transactions found for {activeAccount.name}
                </Text>
                <Text style={{ fontSize: 13, fontFamily: fonts.body, color: theme.textMuted, marginTop: 6 }}>
                  Please add transactions to this account
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Floating add button */}
      <View style={{ position: 'absolute', bottom: 50, right: 20 }}>
        <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: theme.accent200, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 8 }}>
          <Pressable
            onPress={() => openSheet({
              title: 'Add Account',
              content: <AddAccountForm onSuccess={closeSheet} />,
              snapPoints: ['85%'],
            })}
            style={({ pressed }) => ({ width: 56, height: 56, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.8 : 1 })}
          >
            <HugeiconsIcon icon={CreditCardAddIcon} size={24} color={theme.textOnAccent} strokeWidth={2} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
