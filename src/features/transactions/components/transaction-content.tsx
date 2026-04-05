import React, { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { useTransactions } from '../hooks/use-transactions';
import { TransactionList } from './transaction-list';
import { EmptyState } from '@components/feedback/empty-state';
import { LoadingState } from '@components/feedback/loading-state';
import { ErrorState } from '@components/feedback/error-state';
import { showConfirmDialog } from '@components/shared/confirm-dialog';
import {
  groupTransactionsByDate,
  filterTransactionsBySearch,
} from '../services/transaction-service';

interface TransactionContentProps {
  searchQuery: string;
}

export function TransactionContent({ searchQuery }: TransactionContentProps) {
  const router = useRouter();
  const { transactionsQuery, categoriesQuery, deleteMutation } = useTransactions();
  const [refreshing, setRefreshing] = useState(false);

  const sections = useMemo(() => {
    if (!transactionsQuery.data || !categoriesQuery.data) return [];
    const grouped = groupTransactionsByDate(
      transactionsQuery.data,
      categoriesQuery.data
    );
    if (!searchQuery.trim()) return grouped;
    return grouped
      .map((section) => ({
        ...section,
        data: filterTransactionsBySearch(section.data, searchQuery),
      }))
      .filter((section) => section.data.length > 0);
  }, [transactionsQuery.data, categoriesQuery.data, searchQuery]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await transactionsQuery.refetch();
    setRefreshing(false);
  };

  const handleDelete = (id: string) => {
    showConfirmDialog({
      title: 'Delete Transaction',
      message: 'Are you sure? This cannot be undone.',
      confirmLabel: 'Delete',
      destructive: true,
      onConfirm: () => deleteMutation.mutate(id),
    });
  };

  if (transactionsQuery.isLoading) return <LoadingState />;
  if (transactionsQuery.isError)
    return <ErrorState onRetry={() => transactionsQuery.refetch()} />;

  if (sections.length === 0) {
    return (
      <EmptyState
        icon="file-text"
        title={searchQuery ? 'No results' : 'No transactions yet'}
        description={
          searchQuery
            ? 'Try adjusting your search or filters'
            : 'Tap + to add your first transaction'
        }
        actionLabel={searchQuery ? undefined : 'Add Transaction'}
        onAction={
          searchQuery ? undefined : () => router.push('/transaction/add')
        }
      />
    );
  }

  return (
    <TransactionList
      sections={sections}
      onPress={(id) => router.push(`/transaction/${id}`)}
      onDelete={handleDelete}
      onRefresh={handleRefresh}
      refreshing={refreshing}
    />
  );
}
