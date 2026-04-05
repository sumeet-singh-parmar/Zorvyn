import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Input } from '@components/ui/input';
import { AmountInput } from '@components/shared/amount-input';
import { Button } from '@components/ui/button';
import { Briefcase, DollarSign, CreditCard } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { AccountType } from '@core/models';

const accent = require('@theme/accent');
const semantic = require('@theme/semantic');

interface AccountSetupFormProps {
  onSubmit: (name: string, type: AccountType, balance: number) => void;
  loading?: boolean;
}

const ACCOUNT_TYPES: { type: AccountType; label: string; icon: React.ComponentType<any>; colors: [string, string] }[] = [
  { type: 'bank', label: 'Bank', icon: Briefcase, colors: [accent[500], accent[600]] },
  { type: 'cash', label: 'Cash', icon: DollarSign, colors: [semantic.income.DEFAULT, semantic.income[600]] },
  { type: 'wallet', label: 'Wallet', icon: CreditCard, colors: [semantic.transfer.DEFAULT, semantic.transfer[600]] },
  { type: 'credit_card', label: 'Credit', icon: CreditCard, colors: [semantic.warning[500], semantic.warning.dark] },
];

export function AccountSetupForm({ onSubmit, loading }: AccountSetupFormProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('bank');
  const [balance, setBalance] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Please enter an account name');
      return;
    }
    setError('');
    onSubmit(name.trim(), type, parseFloat(balance) || 0);
  };

  return (
    <View className="flex-1">
      {/* Account Name Input */}
      <Input
        label="Account Name"
        placeholder="e.g. My Savings"
        value={name}
        onChangeText={(t) => { setName(t); setError(''); }}
        error={error}
        containerClassName="mb-6"
      />

      {/* Account Type Selector */}
      <Text className="text-sm font-semibold text-gray-700 mb-3">
        Account Type
      </Text>
      <View className="flex-row flex-wrap mb-6 gap-3">
        {ACCOUNT_TYPES.map((item) => {
          const isSelected = type === item.type;
          return (
            <Pressable
              key={item.type}
              onPress={() => setType(item.type)}
              className={`flex-1 min-w-[45%] items-center py-4 rounded-2xl ${
                isSelected
                  ? 'bg-accent-50 border-2 border-accent-400'
                  : 'border border-gray-100'
              }`}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1, backgroundColor: isSelected ? undefined : (isDark ? accent.surfaceDark : accent.surfaceLight) }]}
            >
              <LinearGradient
                colors={isSelected ? item.colors : ['#E5E7EB', '#D1D5DB']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 8,
                }}
              >
                {React.createElement(item.icon, {
                  size: 20,
                  color: isSelected ? '#fff' : '#6B7280',
                })}
              </LinearGradient>
              <Text
                className={`text-sm font-semibold ${
                  isSelected ? 'text-accent-700' : 'text-gray-500'
                }`}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Starting Balance */}
      <Text className="text-sm font-semibold text-gray-700 mb-3">
        Starting Balance
      </Text>
      <View className="mb-6 rounded-2xl border border-gray-100 overflow-hidden" style={{ backgroundColor: isDark ? accent.surfaceDark : accent.surfaceLight }}>
        <AmountInput value={balance} onChangeText={setBalance} autoFocus={false} />
      </View>

      {/* Submit Button */}
      <View className="mt-auto mb-4">
        <Button
          title="Finish Setup"
          onPress={handleSubmit}
          loading={loading}
          size="lg"
        />
      </View>

      <Text className="text-center text-sm text-gray-400 mb-2">
        You can add more accounts anytime
      </Text>
    </View>
  );
}
