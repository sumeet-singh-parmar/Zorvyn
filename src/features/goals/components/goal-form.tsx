import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Input } from '@components/ui/input';
import { AmountInput } from '@components/shared/amount-input';
import { Button } from '@components/ui/button';
import { IconPicker } from '@components/shared/icon-picker';
import { ColorPicker } from '@components/shared/color-picker';
import { DateTimeInput } from '@components/shared/date-time-input';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';
import type { Goal } from '@core/models';

interface GoalFormProps {
  onSubmit: (data: { name: string; targetAmount: number; deadline?: string; icon?: string; color?: string }) => void;
  loading?: boolean;
  editGoal?: Goal;
}

export function GoalForm({ onSubmit, loading, editGoal }: GoalFormProps) {
  const theme = useTheme();
  const [name, setName] = useState(editGoal?.name ?? '');
  const [amount, setAmount] = useState(editGoal ? String(editGoal.target_amount) : '');
  const [deadline, setDeadline] = useState<Date | null>(editGoal?.deadline ? new Date(editGoal.deadline) : null);
  const [icon, setIcon] = useState(editGoal?.icon ?? 'target');
  const [color, setColor] = useState(editGoal?.color ?? theme.buttonBg);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) { setError('Enter a goal name'); return; }
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) { setError('Enter a target amount'); return; }
    setError('');
    onSubmit({
      name: name.trim(),
      targetAmount: parsedAmount,
      deadline: deadline?.toISOString(),
      icon,
      color,
    });
  };

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="px-4 pt-2">
        {/* Goal Name */}
        <View className="mb-6">
          <Text
            className="text-sm mb-2"
            style={{ color: theme.textPrimary, fontFamily: fonts.heading }}
          >
            Goal Name
          </Text>
          <Input
            placeholder="e.g. Vacation Fund"
            value={name}
            onChangeText={(t) => { setName(t); setError(''); }}
          />
        </View>

        {/* Target Amount */}
        <View className="mb-6">
          <Text
            className="text-sm mb-2"
            style={{ color: theme.textPrimary, fontFamily: fonts.heading }}
          >
            Target Amount
          </Text>
          <View
            className="rounded-2xl px-4 py-3"
            style={{ backgroundColor: theme.surfaceBg }}
          >
            <AmountInput value={amount} onChangeText={setAmount} autoFocus={false} />
          </View>
        </View>

        {/* Deadline */}
        <View className="mb-6">
          <DateTimeInput
            value={deadline ?? new Date(new Date().getFullYear(), new Date().getMonth() + 3, new Date().getDate())}
            onChange={(d) => setDeadline(d)}
            mode="date"
            label="Deadline (optional)"
            minimumDate={new Date()}
          />
        </View>

        {/* Icon Picker */}
        <View className="mb-6">
          <Text
            className="text-sm mb-3"
            style={{ color: theme.textPrimary, fontFamily: fonts.heading }}
          >
            Choose Icon
          </Text>
          <View
            className="rounded-2xl p-4"
            style={{ backgroundColor: theme.surfaceBg }}
          >
            <IconPicker selected={icon} onSelect={setIcon} color={color} />
          </View>
        </View>

        {/* Color Picker */}
        <View className="mb-6">
          <Text
            className="text-sm mb-3"
            style={{ color: theme.textPrimary, fontFamily: fonts.heading }}
          >
            Choose Color
          </Text>
          <View
            className="rounded-2xl p-4"
            style={{ backgroundColor: theme.surfaceBg }}
          >
            <ColorPicker selected={color} onSelect={setColor} />
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
          title={editGoal ? 'Update Goal' : 'Create Goal'}
          onPress={handleSubmit}
          loading={loading}
          size="lg"
        />
      </View>
    </ScrollView>
  );
}
