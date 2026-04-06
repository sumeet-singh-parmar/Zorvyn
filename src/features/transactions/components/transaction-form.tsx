import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { AmountInput } from '@components/shared/amount-input';
import { SegmentedControl } from '@components/ui/segmented-control';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { AccountPicker } from '@components/shared/account-picker';
import { CategoryPicker } from './category-picker';
import { CreditCard, ChevronDown, Calendar, Edit3, Check } from 'lucide-react-native';
import { useTransactionForm } from '../hooks/use-transaction-form';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';
import type { TransactionType } from '@core/models';

interface TransactionFormProps {
  onSuccess: () => void;
}

const TYPE_OPTIONS = ['Income', 'Expense', 'Transfer'];
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

export function TransactionForm({ onSuccess }: TransactionFormProps) {
  const theme = useTheme();
  const form = useTransactionForm();
  const [accountPickerVisible, setAccountPickerVisible] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setError('');
    try {
      await form.createMutation.mutateAsync();
      form.reset();
      onSuccess();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Hero Amount Input */}
      <View className="px-6 py-8">
        <AmountInput value={form.amount} onChangeText={form.setAmount} />
      </View>

      {/* Type Segmented Control */}
      <View className="px-6 mb-8">
        <SegmentedControl
          options={TYPE_OPTIONS}
          selected={reverseTypeMap[form.type]}
          onSelect={(val) => form.setType(typeMap[val])}
        />
      </View>

      {/* Category Picker */}
      {form.type !== 'transfer' && (
        <View className="px-6 mb-8">
          <Text
            className="mb-4"
            style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 0.5, color: theme.textSecondary, fontFamily: fonts.heading }}
          >
            Category
          </Text>
          <CategoryPicker
            categories={form.filteredCategories}
            selected={form.categoryId}
            onSelect={form.setCategoryId}
          />
        </View>
      )}

      {/* Account Picker */}
      <View className="px-6 mb-6">
        <Text
          className="mb-3"
          style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 0.5, color: theme.textSecondary, fontFamily: fonts.heading }}
        >
          Account
        </Text>
        <Pressable onPress={() => setAccountPickerVisible(true)} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: theme.surfaceBg, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14 }}>
            <CreditCard size={20} color={theme.textMuted} />
            <Text style={{ flex: 1, marginLeft: 12, fontSize: 16, color: theme.textPrimary, fontFamily: fonts.medium }}>
              {form.accounts.find((a) => a.id === form.accountId)?.name ?? 'Select account'}
            </Text>
            <ChevronDown size={20} color={theme.textMuted} />
          </View>
        </Pressable>
      </View>

      {/* Date Input */}
      <View className="px-6 mb-6">
        <Text
          className="mb-3"
          style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 0.5, color: theme.textSecondary, fontFamily: fonts.heading }}
        >
          Date
        </Text>
        <Input
          value={form.date}
          onChangeText={form.setDate}
          placeholder="YYYY-MM-DD"
          leftIcon={<Calendar size={20} color={theme.textMuted} />}
          containerClassName="rounded-xl"
        />
      </View>

      {/* Notes Input */}
      <View className="px-6 mb-6">
        <Text
          className="mb-3"
          style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 0.5, color: theme.textSecondary, fontFamily: fonts.heading }}
        >
          Notes (optional)
        </Text>
        <Input
          value={form.notes}
          onChangeText={form.setNotes}
          placeholder="e.g. Coffee at Starbucks"
          multiline
          leftIcon={<Edit3 size={20} color={theme.textMuted} />}
          containerClassName="rounded-xl"
        />
      </View>

      {/* Error Message */}
      {error ? (
        <Text
          className="text-center mb-4 px-6"
          style={{ fontSize: 14, color: theme.expense, fontFamily: fonts.medium }}
        >
          {error}
        </Text>
      ) : null}

      {/* Save Button */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 36, paddingTop: 8 }}>
        <Button
          title="Save Transaction"
          onPress={handleSave}
          loading={form.createMutation.isPending}
          size="lg"
          leftIcon={<Check size={20} color={theme.textOnAccent} strokeWidth={2.5} />}
        />
      </View>

      <AccountPicker
        visible={accountPickerVisible}
        onClose={() => setAccountPickerVisible(false)}
        accounts={form.accounts}
        selected={form.accountId}
        onSelect={form.setAccountId}
      />
    </View>
  );
}
