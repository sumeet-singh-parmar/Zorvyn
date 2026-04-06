import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Input } from '@components/ui/input';
import { AmountInput } from '@components/shared/amount-input';
import { Button } from '@components/ui/button';
import { IconPicker } from '@components/shared/icon-picker';
import { ColorPicker } from '@components/shared/color-picker';
import { Calendar } from 'lucide-react-native';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';

interface GoalFormProps {
  onSubmit: (data: { name: string; targetAmount: number; deadline?: string; icon?: string; color?: string }) => void;
  loading?: boolean;
}

export function GoalForm({ onSubmit, loading }: GoalFormProps) {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [icon, setIcon] = useState('target');
  const [color, setColor] = useState(theme.buttonBg);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) { setError('Enter a goal name'); return; }
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) { setError('Enter a target amount'); return; }
    setError('');
    onSubmit({
      name: name.trim(),
      targetAmount: parsedAmount,
      deadline: deadline || undefined,
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
          <Text
            className="text-sm mb-2"
            style={{ color: theme.textPrimary, fontFamily: fonts.heading }}
          >
            Deadline (optional)
          </Text>
          <Input
            placeholder="YYYY-MM-DD"
            value={deadline}
            onChangeText={setDeadline}
            leftIcon={<Calendar size={18} color={theme.textMuted} />}
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
          title="Create Goal"
          onPress={handleSubmit}
          loading={loading}
          size="lg"
          className="mb-6"
        />
      </View>
    </ScrollView>
  );
}
