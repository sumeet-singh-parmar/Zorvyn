import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { X } from 'lucide-react-native';
import { TransactionForm } from '../components/transaction-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const accent = require('@theme/accent');

export function AddTransactionScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1" style={{ paddingTop: insets.top, backgroundColor: isDark ? accent.screenBg : accent.screenBgLight }}>
      {/* Clean Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <Pressable onPress={() => router.back()} className="p-2 -ml-2">
          <X size={28} color="#6B7280" />
        </Pressable>
        <Text className="text-xl font-bold text-gray-900 dark:text-gray-200">
          Add Transaction
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <TransactionForm onSuccess={() => router.back()} />
    </View>
  );
}
