import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useDatabase } from '@core/providers/database-provider';
import { TransactionRepository } from '@core/repositories/transaction-repository';
import { CategoryRepository } from '@core/repositories/category-repository';
import { AccountRepository } from '@core/repositories/account-repository';
import { queryKeys } from '@core/constants/query-keys';
import { CategoryIcon } from '@components/shared/category-icon';
import { CurrencyText } from '@components/shared/currency-text';
import { Button } from '@components/ui/button';
import { LoadingState } from '@components/feedback/loading-state';
import { ErrorState } from '@components/feedback/error-state';
import { showConfirmDialog } from '@components/shared/confirm-dialog';
import { ArrowLeft, Calendar, Wallet, Tag, FileText, Coins, Trash2, ChevronRight } from 'lucide-react-native';
import { formatDate } from '@core/utils/date';
import { useScreenTopPadding } from '@components/shared/edge-fade';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';

export function TransactionDetailScreen() {
  const theme = useTheme();
  const topPadding = useScreenTopPadding();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const db = useDatabase();
  const queryClient = useQueryClient();

  const transactionRepo = useMemo(() => new TransactionRepository(db), [db]);
  const categoryRepo = useMemo(() => new CategoryRepository(db), [db]);
  const accountRepo = useMemo(() => new AccountRepository(db), [db]);

  const txQuery = useQuery({
    queryKey: queryKeys.transactions.byId(id!),
    queryFn: () => transactionRepo.getById(id!),
    enabled: !!id,
  });

  const categoriesQuery = useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => categoryRepo.getAll(),
  });

  const accountsQuery = useQuery({
    queryKey: queryKeys.accounts.all,
    queryFn: () => accountRepo.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const tx = await transactionRepo.getById(id!);
      if (tx) {
        if (tx.type === 'income') {
          await accountRepo.updateBalance(tx.account_id, -tx.amount);
        } else if (tx.type === 'expense') {
          await accountRepo.updateBalance(tx.account_id, tx.amount);
        } else if (tx.type === 'transfer') {
          await accountRepo.updateBalance(tx.account_id, tx.amount);
          if (tx.to_account_id) {
            await accountRepo.updateBalance(tx.to_account_id, -tx.amount);
          }
        }
      }
      await transactionRepo.delete(id!);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
      router.back();
    },
  });

  if (txQuery.isLoading) return <LoadingState />;
  if (txQuery.isError || !txQuery.data) return <ErrorState message="Transaction not found" />;

  const tx = txQuery.data;
  const category = categoriesQuery.data?.find((c) => c.id === tx.category_id);
  const account = accountsQuery.data?.find((a) => a.id === tx.account_id);

  const typeColor: Record<string, string> = {
    income: theme.income,
    expense: theme.expense,
    transfer: theme.transfer,
  };
  const accentColor = typeColor[tx.type] ?? theme.accent500;

  const handleDelete = () => {
    showConfirmDialog({
      title: 'Delete Transaction',
      message: 'Are you sure? This cannot be undone.',
      confirmLabel: 'Delete',
      destructive: true,
      onConfirm: () => deleteMutation.mutate(),
    });
  };

  const details = [
    { icon: Tag, label: 'Category', value: category?.name ?? 'Uncategorized' },
    { icon: Wallet, label: 'Account', value: account?.name ?? 'Unknown' },
    { icon: Calendar, label: 'Date', value: formatDate(tx.date) },
    { icon: Coins, label: 'Currency', value: tx.currency_code },
    ...(tx.notes ? [{ icon: FileText, label: 'Notes', value: tx.notes }] : []),
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.screenBg }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: topPadding, paddingHorizontal: 20, paddingBottom: 16 }}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, padding: 4 })}>
          <ArrowLeft size={24} color={theme.textPrimary} />
        </Pressable>
        <View style={{ flex: 1 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Hero */}
        <View style={{ alignItems: 'center', paddingVertical: 24, paddingHorizontal: 20 }}>
          {/* Category icon circle */}
          <View style={{
            width: 72,
            height: 72,
            borderRadius: 24,
            backgroundColor: accentColor + '18',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
          }}>
            <CategoryIcon
              iconName={category?.icon ?? 'circle'}
              color={category?.color ?? accentColor}
              size="lg"
            />
          </View>

          {/* Type badge */}
          <View style={{
            backgroundColor: accentColor + '18',
            paddingHorizontal: 16,
            paddingVertical: 6,
            borderRadius: 50,
            marginBottom: 12,
          }}>
            <Text style={{ fontSize: 12, fontFamily: fonts.heading, color: accentColor, textTransform: 'uppercase', letterSpacing: 1.5 }}>
              {tx.type}
            </Text>
          </View>

          {/* Amount */}
          <CurrencyText
            amount={tx.amount}
            type={tx.type}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.5}
            style={{ fontSize: 42, fontFamily: fonts.black }}
          />
        </View>

        {/* Details card */}
        <View style={{ marginHorizontal: 20, backgroundColor: theme.cardBg, borderRadius: 20, borderWidth: 1, borderColor: theme.border, overflow: 'hidden' }}>
          {details.map((item, i) => {
            const IconComp = item.icon;
            return (
              <View
                key={item.label}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 16,
                  paddingVertical: 16,
                  borderTopWidth: i > 0 ? 1 : 0,
                  borderTopColor: theme.border,
                }}
              >
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: theme.tint, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                  <IconComp size={16} color={theme.buttonBg} />
                </View>
                <Text style={{ flex: 1, fontSize: 14, fontFamily: fonts.medium, color: theme.textSecondary }}>
                  {item.label}
                </Text>
                <Text style={{ fontSize: 14, fontFamily: fonts.semibold, color: theme.textPrimary, maxWidth: '50%', textAlign: 'right' }} numberOfLines={2}>
                  {item.value}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Delete */}
        <View style={{ marginHorizontal: 20, marginTop: 24 }}>
          <Pressable onPress={handleDelete} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: theme.expenseTint,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: theme.expense + '25',
              paddingHorizontal: 16,
              paddingVertical: 14,
            }}>
              <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: theme.expense + '20', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <Trash2 size={18} color={theme.expense} />
              </View>
              <Text style={{ flex: 1, fontSize: 15, fontFamily: fonts.semibold, color: theme.expense }}>
                Delete Transaction
              </Text>
              <ChevronRight size={18} color={theme.expense} />
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
