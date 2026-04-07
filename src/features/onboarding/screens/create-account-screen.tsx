import React from 'react';
import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { AddAccountForm } from '@features/dashboard/components/add-account-form';
import { useOnboarding } from '../hooks/use-onboarding';
import { useScreenTopPadding } from '@components/shared/edge-fade';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';

export function CreateAccountScreen() {
  const router = useRouter();
  const topPadding = useScreenTopPadding();
  const theme = useTheme();
  const { completeOnboarding } = useOnboarding();

  const handleSuccess = async () => {
    await completeOnboarding();
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: topPadding, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
            {/* Back Button */}
            <View style={{ marginBottom: 28 }}>
              <Pressable
                onPress={() => router.back()}
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              >
                <View style={{
                  width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center',
                  backgroundColor: theme.surfaceBg,
                }}>
                  <ChevronLeft size={24} color={theme.textPrimary} />
                </View>
              </Pressable>
            </View>

            {/* Header */}
            <Text style={{ fontSize: 28, fontFamily: fonts.extrabold, color: theme.textPrimary, marginBottom: 4 }}>
              Set Up Account
            </Text>
            <Text style={{ fontSize: 15, fontFamily: fonts.medium, color: theme.textSecondary, marginBottom: 20 }}>
              Where does your money live?
            </Text>

            {/* Step Indicator */}
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 24 }}>
              <View style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: theme.accent600 }} />
              <View style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: theme.accent600 }} />
              <View style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: theme.accent600 }} />
            </View>

            {/* Reuse the main app's account form */}
            <AddAccountForm onSuccess={handleSuccess} isOnboarding />

            <Text style={{ textAlign: 'center', fontSize: 13, fontFamily: fonts.body, color: theme.textMuted, marginTop: 16 }}>
              You can add more accounts anytime
            </Text>
        </ScrollView>
    </KeyboardAvoidingView>
  );
}
