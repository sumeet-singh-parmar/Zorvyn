import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { AmountInput } from '@components/shared/amount-input';
import { Button } from '@components/ui/button';
import { SegmentedControl } from '@components/ui/segmented-control';
import { CategoryPicker } from '@features/transactions/components/category-picker';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';
import type { Category, BudgetPeriod } from '@core/models';
import type { BudgetWithProgress } from '../types';

interface BudgetFormProps {
  categories: Category[];
  onSubmit: (categoryId: string, amount: number, period: BudgetPeriod) => void;
  loading?: boolean;
  editBudget?: BudgetWithProgress;
}

const PERIOD_OPTIONS = ['Weekly', 'Monthly', 'Yearly'];
const periodMap: Record<string, BudgetPeriod> = {
  Weekly: 'weekly',
  Monthly: 'monthly',
  Yearly: 'yearly',
};

const reversePeriodMap: Record<BudgetPeriod, string> = {
  weekly: 'Weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
};

export function BudgetForm({ categories, onSubmit, loading, editBudget }: BudgetFormProps) {
  const theme = useTheme();
  const [amount, setAmount] = useState(editBudget ? String(editBudget.amount) : '');
  const [categoryId, setCategoryId] = useState(editBudget?.category_id ?? '');
  const [period, setPeriod] = useState(editBudget ? reversePeriodMap[editBudget.period] : 'Monthly');
  const [error, setError] = useState('');

  const expenseCategories = categories.filter((c) => c.type === 'expense' || c.type === 'both');

  const handleSubmit = () => {
    if (!categoryId) { setError('Select a category'); return; }
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) { setError('Enter a valid amount'); return; }
    setError('');
    onSubmit(categoryId, parsedAmount, periodMap[period]);
  };

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="px-4 pt-2">
        {/* Budget Limit */}
        <View className="mb-6">
          <Text
            className="text-sm mb-2"
            style={{ color: theme.textPrimary, fontFamily: fonts.heading }}
          >
            Budget Limit
          </Text>
          <View
            className="rounded-2xl px-4 py-3"
            style={{ backgroundColor: theme.surfaceBg }}
          >
            <AmountInput value={amount} onChangeText={setAmount} />
          </View>
        </View>

        {/* Period Selection */}
        <View className="mb-6">
          <Text
            className="text-sm mb-3"
            style={{ color: theme.textPrimary, fontFamily: fonts.heading }}
          >
            Period
          </Text>
          <SegmentedControl
            options={PERIOD_OPTIONS}
            selected={period}
            onSelect={setPeriod}
          />
        </View>

        {/* Category Selection */}
        <View className="mb-6">
          <Text
            className="text-sm mb-3"
            style={{ color: theme.textPrimary, fontFamily: fonts.heading }}
          >
            Category
          </Text>
          <View
            className="rounded-2xl p-4"
            style={{ backgroundColor: theme.surfaceBg }}
          >
            <CategoryPicker
              categories={expenseCategories}
              selected={categoryId}
              onSelect={setCategoryId}
            />
          </View>
        </View>

        {/* Error Message */}
        {error ? (
          <View
            className="rounded-2xl p-3 mb-6"
            style={{ backgroundColor: theme.expenseTint }}
          >
            <Text
              className="text-sm text-center"
              style={{ color: theme.expense, fontFamily: fonts.medium }}
            >
              {error}
            </Text>
          </View>
        ) : null}

        {/* Submit Button */}
        <Button
          title={editBudget ? 'Update Budget' : 'Create Budget'}
          onPress={handleSubmit}
          loading={loading}
          size="lg"
        />
      </View>
    </ScrollView>
  );
}
