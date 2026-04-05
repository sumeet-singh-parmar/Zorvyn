import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useColorScheme } from 'nativewind';
import { AmountInput } from '@components/shared/amount-input';
import { SegmentedControl } from '@components/ui/segmented-control';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { AccountPicker } from '@components/shared/account-picker';
import { CategoryPicker } from './category-picker';
import { CreditCard, ChevronDown, Calendar, Edit3, Check } from 'lucide-react-native';
import { useTransactionForm } from '../hooks/use-transaction-form';
import type { TransactionType } from '@core/models';

const accent = require('@theme/accent');

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
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
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
    <ScrollView className="flex-1" style={{ backgroundColor: isDark ? accent.cardDark : accent.cardLight }} showsVerticalScrollIndicator={false}>
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
          <Text className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">
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
        <Text className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
          Account
        </Text>
        <Pressable
          onPress={() => setAccountPickerVisible(true)}
          className="flex-row items-center rounded-xl px-4 py-4"
          style={{ backgroundColor: isDark ? accent.surfaceDark : accent.surfaceLight }}
        >
          <CreditCard size={20} color="#9CA3AF" />
          <Text className="flex-1 ml-3 text-base font-medium text-gray-900 dark:text-gray-200">
            {form.accounts.find((a) => a.id === form.accountId)?.name ?? 'Select account'}
          </Text>
          <ChevronDown size={20} color="#9CA3AF" />
        </Pressable>
      </View>

      {/* Date Input */}
      <View className="px-6 mb-6">
        <Text className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
          Date
        </Text>
        <Input
          value={form.date}
          onChangeText={form.setDate}
          placeholder="YYYY-MM-DD"
          leftIcon={<Calendar size={20} color="#9CA3AF" />}
          containerClassName="rounded-xl"
        />
      </View>

      {/* Notes Input */}
      <View className="px-6 mb-6">
        <Text className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
          Notes (optional)
        </Text>
        <Input
          value={form.notes}
          onChangeText={form.setNotes}
          placeholder="e.g. Coffee at Starbucks"
          multiline
          leftIcon={<Edit3 size={20} color="#9CA3AF" />}
          containerClassName="rounded-xl"
        />
      </View>

      {/* Error Message */}
      {error ? (
        <Text className="text-red-500 text-sm text-center mb-4 font-medium px-6">{error}</Text>
      ) : null}

      {/* Save Button */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 36, paddingTop: 8 }}>
        <Button
          title="Save Transaction"
          onPress={handleSave}
          loading={form.createMutation.isPending}
          size="lg"
          leftIcon={<Check size={20} color="#FFFFFF" strokeWidth={2.5} />}
        />
      </View>

      <AccountPicker
        visible={accountPickerVisible}
        onClose={() => setAccountPickerVisible(false)}
        accounts={form.accounts}
        selected={form.accountId}
        onSelect={form.setAccountId}
      />
    </ScrollView>
  );
}
