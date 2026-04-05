import { Paths, File } from 'expo-file-system';
import type { Transaction } from '@core/models';

export async function exportToCSV(
  transactions: Transaction[],
  filename: string = 'zorvyn-export'
): Promise<string> {
  const headers = 'Date,Type,Amount,Category ID,Account ID,Currency,Notes\n';
  const rows = transactions
    .map(
      (t) =>
        `${t.date},${t.type},${t.amount},${t.category_id},${t.account_id},${t.currency_code},"${(t.notes ?? '').replace(/"/g, '""')}"`
    )
    .join('\n');

  const csv = headers + rows;
  const file = new File(Paths.cache, `${filename}.csv`);
  file.write(csv);

  return file.uri;
}

export async function exportToJSON(
  transactions: Transaction[],
  filename: string = 'zorvyn-export'
): Promise<string> {
  const json = JSON.stringify(transactions, null, 2);
  const file = new File(Paths.cache, `${filename}.json`);
  file.write(json);

  return file.uri;
}
