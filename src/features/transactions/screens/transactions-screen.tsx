import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { useRouter } from 'expo-router';
import { TransactionFilters } from '../components/transaction-filters';
import { TransactionContent } from '../components/transaction-content';
import { Input } from '@components/ui/input';
import { Search, X } from 'lucide-react-native';

const accent = require('@theme/accent');

export function TransactionsScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: isDark ? accent.screenBg : accent.screenBgLight }}>
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 pt-4 pb-3">
          <View className="mb-4">
            <Text
              className="text-3xl font-extrabold text-gray-900 dark:text-gray-200"
              style={{ letterSpacing: -0.5 }}
            >
              Transactions
            </Text>
          </View>

          {/* Search */}
          <Input
            placeholder="Search transactions..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon={<Search size={18} color="#9CA3AF" />}
            rightIcon={
              searchQuery ? (
                <Pressable onPress={() => setSearchQuery('')}>
                  <X size={18} color="#9CA3AF" />
                </Pressable>
              ) : undefined
            }
            containerClassName="rounded-2xl"
          />
        </View>

        {/* Filters */}
        <View className="pb-1">
          <TransactionFilters />
        </View>

        {/* Content -- isolated from header re-renders */}
        <TransactionContent searchQuery={searchQuery} />
      </View>

    </SafeAreaView>
  );
}
