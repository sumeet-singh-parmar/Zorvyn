import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { AccountSetupForm } from '../components/account-setup-form';
import { useOnboarding } from '../hooks/use-onboarding';
import { useScreenTopPadding } from '@components/shared/edge-fade';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';
import type { AccountType } from '@core/models';

export function CreateAccountScreen() {
  const router = useRouter();
  const topPadding = useScreenTopPadding();
  const theme = useTheme();
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
    <View style={{ flex: 1 }}>
      <View className="flex-1 px-6" style={{ paddingTop: topPadding }}>
        {/* Back Button */}
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full items-center justify-center mb-4"
          style={{ backgroundColor: theme.surfaceBg }}
        >
          <ChevronLeft size={24} color={theme.textPrimary} />
        </Pressable>

        {/* Header */}
        <Text
          className="text-3xl mb-1 tracking-tight"
          style={{ color: theme.textPrimary, fontFamily: fonts.extrabold }}
        >
          Set Up Account
        </Text>
        <Text
          className="text-base mb-5"
          style={{ color: theme.textSecondary }}
        >
          Where does your money live?
        </Text>

        {/* Step Indicator */}
        <View className="flex-row gap-2 mb-6">
          <View className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: theme.accent600 }} />
          <View className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: theme.accent600 }} />
          <View className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: theme.accent600 }} />
        </View>

        {/* Form */}
        <AccountSetupForm onSubmit={handleSubmit} loading={loading} />
      </View>
    </View>
  );
}
