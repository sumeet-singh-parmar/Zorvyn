import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Input } from '@components/ui/input';
import { AmountInput } from '@components/shared/amount-input';
import { Button } from '@components/ui/button';
import { Briefcase, DollarSign, CreditCard } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';
import type { AccountType } from '@core/models';

interface AccountSetupFormProps {
  onSubmit: (name: string, type: AccountType, balance: number) => void;
  loading?: boolean;
}

export function AccountSetupForm({ onSubmit, loading }: AccountSetupFormProps) {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('bank');
  const [balance, setBalance] = useState('');
  const [error, setError] = useState('');

  const ACCOUNT_TYPES: { type: AccountType; label: string; icon: React.ComponentType<any>; colors: [string, string] }[] = [
    { type: 'bank', label: 'Bank', icon: Briefcase, colors: [theme.accent500, theme.accent600] },
    { type: 'cash', label: 'Cash', icon: DollarSign, colors: [theme.income, theme.income] },
    { type: 'wallet', label: 'Wallet', icon: CreditCard, colors: [theme.transfer, theme.transfer] },
    { type: 'credit_card', label: 'Credit', icon: CreditCard, colors: [theme.warning, theme.warning] },
  ];

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
      />

      {/* Account Type Selector */}
      <Text style={{ fontSize: 14, fontFamily: fonts.semibold, color: theme.textPrimary, marginBottom: 12 }}>
        Account Type
      </Text>
      <View className="flex-row flex-wrap mb-6 gap-3">
        {ACCOUNT_TYPES.map((item) => {
          const isSelected = type === item.type;
          return (
            <Pressable
              key={item.type}
              onPress={() => setType(item.type)}
              className="flex-1 min-w-[45%] items-center py-4 rounded-2xl"
              style={({ pressed }) => [{
                opacity: pressed ? 0.7 : 1,
                backgroundColor: isSelected ? theme.tint : theme.surfaceBg,
                borderWidth: isSelected ? 2 : 1,
                borderColor: isSelected ? theme.accent400 : theme.border,
              }]}
            >
              <LinearGradient
                colors={isSelected ? item.colors : [theme.border, theme.borderStrong]}
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
                  color: isSelected ? theme.textOnAccent : theme.textMuted,
                })}
              </LinearGradient>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: fonts.semibold,
                  color: isSelected ? theme.accent600 : theme.textSecondary,
                }}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Starting Balance */}
      <Text style={{ fontSize: 14, fontFamily: fonts.semibold, color: theme.textPrimary, marginBottom: 12 }}>
        Starting Balance
      </Text>
      <View className="mb-6 rounded-2xl overflow-hidden" style={{ backgroundColor: theme.surfaceBg, borderWidth: 1, borderColor: theme.border }}>
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

      <Text style={{ textAlign: 'center', fontSize: 14, fontFamily: fonts.body, color: theme.textMuted, marginBottom: 8 }}>
        You can add more accounts anytime
      </Text>
    </View>
  );
}
