import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDatabase } from '@core/providers/database-provider';
import { TransactionRepository } from '@core/repositories/transaction-repository';
import { queryKeys } from '@core/constants/query-keys';
import { exportToCSV, exportToJSON } from '@core/export/export-service';
import { shareFile } from '@core/export/share-utils';
import { seedDatabase } from '@core/database/seed';

export function useSettings() {
  const db = useDatabase();
  const transactionRepo = useMemo(() => new TransactionRepository(db), [db]);
  const queryClient = useQueryClient();
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const transactionsQuery = useQuery({
    queryKey: queryKeys.transactions.all,
    queryFn: () => transactionRepo.getAll(),
  });

  const exportData = async (format: 'csv' | 'json') => {
    try {
      setIsExporting(true);
      setExportError(null);
      const transactions = transactionsQuery.data ?? [];

      let filePath: string;
      if (format === 'csv') {
        filePath = await exportToCSV(transactions);
      } else {
        filePath = await exportToJSON(transactions);
      }

      await shareFile(filePath);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Export failed';
      setExportError(message);
    } finally {
      setIsExporting(false);
    }
  };

  const seedDemoData = async () => {
    try {
      setIsExporting(true);
      setExportError(null);

      // Reset seed check by clearing existing categories so seed runs again
      await db.runAsync("DELETE FROM transactions WHERE deleted_at IS NULL");
      await db.runAsync("DELETE FROM categories WHERE deleted_at IS NULL");
      await db.runAsync("DELETE FROM goals WHERE deleted_at IS NULL");
      await db.runAsync("DELETE FROM budgets WHERE deleted_at IS NULL");

      // Re-run seed to populate fresh demo data
      await seedDatabase(db);

      // Invalidate all queries so UI refreshes
      await queryClient.invalidateQueries();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Seeding failed';
      setExportError(message);
    } finally {
      setIsExporting(false);
    }
  };

  const clearAllData = async () => {
    try {
      setIsExporting(true);
      setExportError(null);

      // Clear all user data from every table
      await db.runAsync("DELETE FROM goal_contributions");
      await db.runAsync("DELETE FROM goals");
      await db.runAsync("DELETE FROM budgets");
      await db.runAsync("DELETE FROM transactions");
      await db.runAsync("DELETE FROM accounts");
      await db.runAsync("DELETE FROM categories");
      await db.runAsync("DELETE FROM tags");
      await db.runAsync("DELETE FROM user_preferences");

      // Invalidate all queries so UI reflects empty state
      await queryClient.invalidateQueries();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Clear failed';
      setExportError(message);
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportData,
    seedDemoData,
    clearAllData,
    transactionCount: transactionsQuery.data?.length ?? 0,
    isExporting,
    exportError,
  };
}
