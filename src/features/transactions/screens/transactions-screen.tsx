import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { TransactionFilters } from '../components/transaction-filters';
import { TransactionContent } from '../components/transaction-content';
import { Input } from '@components/ui/input';
import { Search, X } from 'lucide-react-native';
import { useScreenTopPadding } from '@components/shared/edge-fade';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';

export function TransactionsScreen() {
  const topPadding = useScreenTopPadding();
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: topPadding, paddingBottom: 12 }}>
          <Text style={{ fontSize: 28, fontFamily: fonts.black, color: theme.textPrimary, marginBottom: 16 }}>
            Transactions
          </Text>

          {/* Search */}
          <Input
            placeholder="Search transactions..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon={<Search size={18} color={theme.textMuted} />}
            rightIcon={
              searchQuery ? (
                <Pressable onPress={() => setSearchQuery('')}>
                  <X size={18} color={theme.textMuted} />
                </Pressable>
              ) : undefined
            }
          />
        </View>

        {/* Filters */}
        <View style={{ paddingBottom: 4 }}>
          <TransactionFilters />
        </View>

        {/* Content */}
        <TransactionContent searchQuery={searchQuery} />
      </View>
    </View>
  );
}
