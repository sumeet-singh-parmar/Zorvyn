import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useColorScheme } from 'nativewind';
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
import { Card } from '@components/ui/card';
import { LoadingState } from '@components/feedback/loading-state';
import { ErrorState } from '@components/feedback/error-state';
import { showConfirmDialog } from '@components/shared/confirm-dialog';
import { ArrowLeft } from 'lucide-react-native';
import { formatDate } from '@core/utils/date';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const accent = require('@theme/accent');

export function TransactionDetailScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const db = useDatabase();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();

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

  const handleDelete = () => {
    showConfirmDialog({
      title: 'Delete Transaction',
      message: 'Are you sure? This cannot be undone.',
      confirmLabel: 'Delete',
      destructive: true,
      onConfirm: () => deleteMutation.mutate(),
    });
  };

  return (
    <View className="flex-1" style={{ paddingTop: insets.top, backgroundColor: isDark ? accent.screenBg : accent.screenBgLight }}>
      {/* Clean Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <Pressable onPress={() => router.back()} className="p-2 -ml-2">
          <ArrowLeft size={28} color="#6B7280" />
        </Pressable>
        <Text className="text-xl font-bold text-gray-900 dark:text-gray-200">
          Transaction Details
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Amount Hero Section */}
        <View className="items-center py-8">
          <View className="bg-gray-100 dark:bg-gray-900 rounded-full p-6 mb-4">
            <CategoryIcon
              iconName={category?.icon ?? 'circle'}
              color={category?.color ?? '#9CA3AF'}
              size="lg"
            />
          </View>
          <Text className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            {tx.type}
          </Text>
          <CurrencyText
            amount={tx.amount}
            type={tx.type}
            className="text-5xl font-bold"
          />
        </View>

        {/* Details Card */}
        <Card className="mb-6 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
          <DetailRow label="Category" value={category?.name ?? 'Uncategorized'} />
          <DetailRow label="Account" value={account?.name ?? 'Unknown'} />
          <DetailRow label="Date" value={formatDate(tx.date)} />
          <DetailRow label="Currency" value={tx.currency_code} />
          {tx.notes && <DetailRow label="Notes" value={tx.notes} />}
        </Card>

        {/* Delete Button */}
        <Button
          title="Delete Transaction"
          onPress={handleDelete}
          variant="danger"
          loading={deleteMutation.isPending}
          className="mb-8 rounded-xl"
        />
      </ScrollView>
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <Text className="text-sm text-gray-500 dark:text-gray-400">{label}</Text>
      <Text className="text-sm font-medium text-gray-900 dark:text-gray-200">{value}</Text>
    </View>
  );
}
