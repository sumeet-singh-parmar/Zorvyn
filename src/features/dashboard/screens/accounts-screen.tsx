import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  useWindowDimensions,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { CreditCardAddIcon } from '@hugeicons/core-free-icons';
import { useGlobalSheet } from '@components/shared/global-sheet';
import { AddAccountForm } from '../components/add-account-form';
import { AccountCard } from '../components/account-card';
import { AccountStats } from '../components/account-stats';
import { AccountTransactionsList } from '../components/account-transactions-list';
import { AccountActionSheet } from '../components/account-action-sheet';
import { useDatabase } from '@core/providers/database-provider';
import { AccountRepository } from '@core/repositories/account-repository';
import { TransactionRepository } from '@core/repositories/transaction-repository';
import { queryKeys } from '@core/constants/query-keys';
import { useScreenTopPadding } from '@components/shared/edge-fade';
import { useTheme, useIsDark } from '@theme/use-theme';
import { useThemeStore } from '@stores/theme-store';
import { hslToHex } from '@theme/hsl';
import { fonts } from '@theme/fonts';
import { LoadingState } from '@components/feedback/loading-state';
import { startOfMonth, endOfMonth } from '@core/utils/date';
import { TYPE_COLORS } from '../constants';
import type { Account } from '@core/models';

/**
 * Lighten a hex color by ~20% lightness for use in light-mode card backgrounds.
 * Avoids importing the full HSL library inside the render path.
 */
function lightenHex(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }
  return hslToHex(Math.round(h), Math.round(s * 100), Math.round(l * 100) + 20);
}

export function AccountsScreen() {
  const theme = useTheme();
  const isDark = useIsDark();
  const { hue } = useThemeStore();
  const topPadding = useScreenTopPadding();
  const router = useRouter();
  const db = useDatabase();
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = screenWidth - 40;
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
      await db.runAsync(`UPDATE accounts SET deleted_at = datetime('now') WHERE id = ?`, [id]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
      closeSheet();
    },
  });

  const handleEditAccount = (account: Account) => {
    openSheet({
      title: 'Edit Account',
      content: <AddAccountForm onSuccess={closeSheet} editAccount={account} />,
      snapPoints: ['85%'],
    });
  };

  const handleDeleteAccount = (account: Account) => {
    openSheet({
      title: 'Delete Account?',
      content: (
        <View style={{ gap: 20 }}>
          <Text style={{ fontSize: 14, fontFamily: fonts.body, color: theme.textSecondary, lineHeight: 20 }}>
            Are you sure you want to delete "{account.name}"? Linked transactions will remain but won't be associated with any account.
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

  const handleCardPress = (account: Account) => {
    openSheet({
      title: account.name,
      content: (
        <AccountActionSheet
          isDefault={account.is_default === 1}
          canDelete={(accounts?.length ?? 0) > 1}
          onEdit={() => handleEditAccount(account)}
          onDelete={() => handleDeleteAccount(account)}
        />
      ),
      snapPoints: ['30%'],
    });
  };

  if (isLoading || !accounts) return <LoadingState />;

  const getCardColor = (account: Account, index: number) => {
    const baseColor = account.color ?? TYPE_COLORS[account.type] ?? hslToHex((hue + index * 50) % 360, 50, 50);
    return isDark ? baseColor : lightenHex(baseColor);
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = e.nativeEvent.contentOffset.x;
    const index = Math.round(offset / (cardWidth + 12));
    setActiveIndex(Math.max(0, Math.min(index, accounts.length - 1)));
  };

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
          {accounts.map((account, index) => (
            <AccountCard
              key={account.id}
              account={account}
              cardWidth={cardWidth}
              color={getCardColor(account, index)}
              onPress={() => handleCardPress(account)}
            />
          ))}
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

        {/* Active account: stats + transactions */}
        {activeAccount && (
          <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
            <AccountStats income={accountIncome} expense={accountExpense} />
            <AccountTransactionsList
              transactions={accountTransactions}
              accountName={activeAccount.name}
            />
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
