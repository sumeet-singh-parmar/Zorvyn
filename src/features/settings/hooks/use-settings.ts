import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDatabase } from '@core/providers/database-provider';
import { TransactionRepository } from '@core/repositories/transaction-repository';
import { queryKeys } from '@core/constants/query-keys';
import { exportToCSV, exportToJSON } from '@core/export/export-service';
import { shareFile } from '@core/export/share-utils';
import { seedDemoData as runSeed, clearAllData as runClear } from '../services/seed-service';

/**
 * Settings screen actions: export data, seed demo data, clear all data.
 * Wraps the seed-service so the screen never touches the database directly.
 */
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
      const filePath = format === 'csv'
        ? await exportToCSV(transactions)
        : await exportToJSON(transactions);
      await shareFile(filePath);
    } catch (error) {
      setExportError(error instanceof Error ? error.message : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const seedDemoData = async () => {
    try {
      setIsExporting(true);
      setExportError(null);
      await runSeed(db);
      await queryClient.invalidateQueries();
    } catch (error) {
      setExportError(error instanceof Error ? error.message : 'Seeding failed');
    } finally {
      setIsExporting(false);
    }
  };

  const clearAllData = async () => {
    try {
      setIsExporting(true);
      setExportError(null);
      await runClear(db);
      await queryClient.invalidateQueries();
    } catch (error) {
      setExportError(error instanceof Error ? error.message : 'Clear failed');
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
