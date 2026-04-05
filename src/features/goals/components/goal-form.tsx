import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Input } from '@components/ui/input';
import { AmountInput } from '@components/shared/amount-input';
import { Button } from '@components/ui/button';
import { IconPicker } from '@components/shared/icon-picker';
import { ColorPicker } from '@components/shared/color-picker';
import { Calendar } from 'lucide-react-native';

const accent = require('@theme/accent');

interface GoalFormProps {
  onSubmit: (data: { name: string; targetAmount: number; deadline?: string; icon?: string; color?: string }) => void;
  loading?: boolean;
}

export function GoalForm({ onSubmit, loading }: GoalFormProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [icon, setIcon] = useState('target');
  const [color, setColor] = useState(accent[500]);
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
          <Text className="text-sm font-bold text-gray-900 dark:text-gray-200 mb-2">Goal Name</Text>
          <Input
            placeholder="e.g. Vacation Fund"
            value={name}
            onChangeText={(t) => { setName(t); setError(''); }}
          />
        </View>

        {/* Target Amount */}
        <View className="mb-6">
          <Text className="text-sm font-bold text-gray-900 dark:text-gray-200 mb-2">Target Amount</Text>
          <View className="rounded-2xl px-4 py-3" style={{ backgroundColor: isDark ? accent.surfaceDark : accent.surfaceLight }}>
            <AmountInput value={amount} onChangeText={setAmount} autoFocus={false} />
          </View>
        </View>

        {/* Deadline */}
        <View className="mb-6">
          <Text className="text-sm font-bold text-gray-900 dark:text-gray-200 mb-2">Deadline (optional)</Text>
          <Input
            placeholder="YYYY-MM-DD"
            value={deadline}
            onChangeText={setDeadline}
            leftIcon={<Calendar size={18} color="#9CA3AF" />}
          />
        </View>

        {/* Icon Picker */}
        <View className="mb-6">
          <Text className="text-sm font-bold text-gray-900 dark:text-gray-200 mb-3">Choose Icon</Text>
          <View className="rounded-2xl p-4" style={{ backgroundColor: isDark ? accent.surfaceDark : accent.surfaceLight }}>
            <IconPicker selected={icon} onSelect={setIcon} color={color} />
          </View>
        </View>

        {/* Color Picker */}
        <View className="mb-6">
          <Text className="text-sm font-bold text-gray-900 dark:text-gray-200 mb-3">Choose Color</Text>
          <View className="rounded-2xl p-4" style={{ backgroundColor: isDark ? accent.surfaceDark : accent.surfaceLight }}>
            <ColorPicker selected={color} onSelect={setColor} />
          </View>
        </View>

        {/* Error Message */}
        {error ? (
          <View className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-3 mb-6">
            <Text className="text-red-600 dark:text-red-400 text-sm font-medium text-center">
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
          className="mb-6 bg-accent-500"
        />
      </View>
    </ScrollView>
  );
}
