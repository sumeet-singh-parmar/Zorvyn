import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { ChevronLeft } from 'lucide-react-native';
import { CurrencyPicker } from '../components/currency-picker';
import { Button } from '@components/ui/button';
import { useOnboarding } from '../hooks/use-onboarding';

const accent = require('@theme/accent');

export function SetupCurrencyScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
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
    <SafeAreaView className="flex-1" style={{ backgroundColor: isDark ? accent.screenBg : accent.screenBgLight }}>
      <View className="flex-1 px-6">
        {/* Back Button */}
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mb-4"
        >
          <ChevronLeft size={24} color="#374151" />
        </Pressable>

        {/* Header */}
        <Text className="text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">
          Choose Currency
        </Text>
        <Text className="text-base text-gray-500 mb-5">
          Default currency for all transactions
        </Text>

        {/* Step Indicator */}
        <View className="flex-row gap-2 mb-6">
          <View className="flex-1 h-1.5 bg-accent-600 rounded-full" />
          <View className="flex-1 h-1.5 bg-accent-600 rounded-full" />
          <View className="flex-1 h-1.5 bg-gray-200 rounded-full" />
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
    </SafeAreaView>
  );
}
