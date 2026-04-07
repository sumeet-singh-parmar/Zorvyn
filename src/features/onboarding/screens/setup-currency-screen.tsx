import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { CurrencyPicker } from '../components/currency-picker';
import { Button } from '@components/ui/button';
import { useOnboarding } from '../hooks/use-onboarding';
import { useScreenTopPadding } from '@components/shared/edge-fade';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';

export function SetupCurrencyScreen() {
  const router = useRouter();
  const topPadding = useScreenTopPadding();
  const theme = useTheme();
  const { selectCurrency } = useOnboarding();
  const [selected, setSelected] = useState('INR');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    setLoading(true);
    await selectCurrency(selected);
    setLoading(false);
    router.push('/(onboarding)/create-account');
  };

  return (
    <View style={{ flex: 1 }}>
      <View className="flex-1 px-6" style={{ paddingTop: topPadding }}>
        {/* Back Button */}
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full items-center justify-center mb-7"
          style={{ backgroundColor: theme.surfaceBg }}
        >
          <ChevronLeft size={24} color={theme.textPrimary} />
        </Pressable>

        {/* Header */}
        <Text
          className="text-3xl mb-1 tracking-tight"
          style={{ color: theme.textPrimary, fontFamily: fonts.extrabold }}
        >
          Choose Currency
        </Text>
        <Text
          className="text-base mb-5"
          style={{ color: theme.textSecondary }}
        >
          Default currency for all transactions
        </Text>

        {/* Step Indicator */}
        <View className="flex-row gap-2 mb-6">
          <View className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: theme.accent600 }} />
          <View className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: theme.accent600 }} />
          <View className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: theme.border }} />
        </View>

        {/* Currency Picker */}
        <CurrencyPicker selected={selected} onSelect={setSelected} />

        {/* Next Button */}
        <View className="py-4">
          <Button
            title="Continue"
            onPress={handleContinue}
            loading={loading}
            size="lg"
          />
        </View>
      </View>
    </View>
  );
}
