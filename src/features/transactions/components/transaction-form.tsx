import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { AmountInput } from '@components/shared/amount-input';
import { SegmentedControl } from '@components/ui/segmented-control';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { AccountSelector } from '@components/shared/account-selector';
import { DateTimeInput } from '@components/shared/date-time-input';
import { CategoryPicker } from './category-picker';
import { Edit3 } from 'lucide-react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { FloppyDiskIcon } from '@hugeicons/core-free-icons';
import { useTransactionForm } from '../hooks/use-transaction-form';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';
import type { Transaction, TransactionType } from '@core/models';

interface TransactionFormProps {
  onSuccess: () => void;
  editTransaction?: Transaction;
}

// Only show Transfer option if user has 2+ accounts
const getTypeOptions = (accountCount: number) =>
  accountCount >= 2 ? ['Income', 'Expense', 'Transfer'] : ['Income', 'Expense'];
const typeMap: Record<string, TransactionType> = {
  Income: 'income',
  Expense: 'expense',
  Transfer: 'transfer',
};
const reverseTypeMap: Record<TransactionType, string> = {
  income: 'Income',
  expense: 'Expense',
  transfer: 'Transfer',
};

export function TransactionForm({ onSuccess, editTransaction }: TransactionFormProps) {
  const theme = useTheme();
  const form = useTransactionForm({ editTransaction });
  const [error, setError] = useState('');

  const handleSave = async () => {
    setError('');
    try {
      if (form.isEditing) {
        await form.updateMutation.mutateAsync();
      } else {
        await form.createMutation.mutateAsync();
      }
      form.reset();
      onSuccess();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save');
    }
  };

  const labelStyle = { fontSize: 14, textTransform: 'uppercase' as const, letterSpacing: 0.5, color: theme.textSecondary, fontFamily: fonts.heading };

  return (
    <View style={{ flex: 1 }}>
      {/* Hero Amount Input */}
      <View style={{ paddingHorizontal: 24, paddingVertical: 32 }}>
        <AmountInput value={form.amount} onChangeText={form.setAmount} />
      </View>

      {/* Type Segmented Control */}
      <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
        <SegmentedControl
          options={getTypeOptions(form.accounts.length)}
          selected={reverseTypeMap[form.type]}
          onSelect={(val) => form.setType(typeMap[val])}
        />
      </View>

      {/* Category Picker */}
      {form.type !== 'transfer' && (
        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          <Text style={{ ...labelStyle, marginBottom: 16 }}>Category</Text>
          <CategoryPicker
            categories={form.filteredCategories}
            selected={form.categoryId}
            onSelect={form.setCategoryId}
          />
        </View>
      )}

      {/* Account Picker */}
      <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
        <AccountSelector
          accounts={form.accounts}
          selected={form.accountId}
          onSelect={form.setAccountId}
          label={form.type === 'transfer' ? 'From Account' : 'Account'}
        />
      </View>

      {/* To Account — only for transfers */}
      {form.type === 'transfer' && (
        <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
          <AccountSelector
            accounts={form.accounts.filter((a) => a.id !== form.accountId)}
            selected={form.toAccountId}
            onSelect={form.setToAccountId}
            label="To Account"
          />
        </View>
      )}

      {/* Date & Time */}
      <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
        <DateTimeInput
          value={form.date}
          onChange={form.setDate}
          mode="datetime"
          label="Date & Time"
        />
      </View>

      {/* Notes Input */}
      <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
        <Text style={{ ...labelStyle, marginBottom: 12 }}>Notes (optional)</Text>
        <Input
          value={form.notes}
          onChangeText={form.setNotes}
          placeholder="e.g. Coffee at Starbucks"
          multiline
          leftIcon={<Edit3 size={20} color={theme.textMuted} />}
        />
      </View>

      {/* Error Message */}
      {error ? (
        <Text style={{ textAlign: 'center', marginBottom: 16, paddingHorizontal: 24, fontSize: 14, color: theme.expense, fontFamily: fonts.medium }}>
          {error}
        </Text>
      ) : null}

      {/* Save Button */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 36, paddingTop: 8 }}>
        <Button
          title={form.isEditing ? 'Update Transaction' : 'Save Transaction'}
          onPress={handleSave}
          loading={form.createMutation.isPending || form.updateMutation.isPending}
          size="lg"
          leftIcon={<HugeiconsIcon icon={FloppyDiskIcon} size={20} color={theme.textOnAccent} strokeWidth={3} />}
        />
      </View>
    </View>
  );
}
