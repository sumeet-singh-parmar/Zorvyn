import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { TransactionForm } from '../components/transaction-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';

export function AddTransactionScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1" style={{ paddingTop: insets.top, backgroundColor: theme.screenBg }}>
      {/* Clean Header */}
      <View className="flex-row items-center justify-between px-6 py-4" style={{ borderBottomWidth: 1, borderBottomColor: theme.border }}>
        <Pressable onPress={() => router.back()} className="p-2 -ml-2">
          <X size={28} color={theme.textMuted} />
        </Pressable>
        <Text style={{ fontSize: 20, fontFamily: fonts.heading, color: theme.textPrimary }}>
          Add Transaction
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <TransactionForm onSuccess={() => router.back()} />
    </View>
  );
}
