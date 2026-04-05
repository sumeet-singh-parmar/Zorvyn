import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { ChevronLeft } from 'lucide-react-native';
import { AccountSetupForm } from '../components/account-setup-form';
import { useOnboarding } from '../hooks/use-onboarding';
import type { AccountType } from '@core/models';

const accent = require('@theme/accent');

export function CreateAccountScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const { createAccount, completeOnboarding } = useOnboarding();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (name: string, type: AccountType, balance: number) => {
    setLoading(true);
    await createAccount(name, type, balance);
    await completeOnboarding();
    setLoading(false);
    router.replace('/(tabs)');
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
          Set Up Account
        </Text>
        <Text className="text-base text-gray-500 mb-5">
          Where does your money live?
        </Text>

        {/* Step Indicator */}
        <View className="flex-row gap-2 mb-6">
          <View className="flex-1 h-1.5 bg-accent-600 rounded-full" />
          <View className="flex-1 h-1.5 bg-accent-600 rounded-full" />
          <View className="flex-1 h-1.5 bg-accent-600 rounded-full" />
        </View>

        {/* Form */}
        <AccountSetupForm onSubmit={handleSubmit} loading={loading} />
      </View>
    </SafeAreaView>
  );
}
