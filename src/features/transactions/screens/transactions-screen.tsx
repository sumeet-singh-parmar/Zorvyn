import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { TransactionFilters } from '../components/transaction-filters';
import { TransactionContent } from '../components/transaction-content';
import { TransactionFilterSheet } from '../components/transaction-filter-sheet';
import { Input } from '@components/ui/input';
import { useGlobalSheet } from '@components/shared/global-sheet';
import { useFiltersStore } from '@stores/filters-store';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { FilterHorizontalIcon } from '@hugeicons/core-free-icons';
import { Search, X } from 'lucide-react-native';
import { useScreenTopPadding } from '@components/shared/edge-fade';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';

export function TransactionsScreen() {
  const topPadding = useScreenTopPadding();
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const { openSheet, closeSheet } = useGlobalSheet();
  const { dateRange, selectedAccountId, selectedCategoryId, resetFilters } = useFiltersStore();

  const activeFilterCount = [dateRange, selectedAccountId, selectedCategoryId].filter(Boolean).length;

  const handleOpenFilters = () => {
    openSheet({
      title: 'Filters',
      content: <TransactionFilterSheet onClose={closeSheet} />,
      snapPoints: ['85%'],
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: topPadding, paddingBottom: 12 }}>
          <Text style={{ fontSize: 28, fontFamily: fonts.black, color: theme.textPrimary, marginBottom: 16 }}>
            Transactions
          </Text>

          {/* Search + Filter Row */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ flex: 1 }}>
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

            {/* Filter Button */}
            <Pressable onPress={handleOpenFilters} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
              <View style={{
                width: 50,
                height: 50,
                borderRadius: 16,
                backgroundColor: activeFilterCount > 0 ? theme.tint : theme.surfaceBg,
                borderWidth: 1,
                borderColor: activeFilterCount > 0 ? theme.buttonBg : theme.border,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <HugeiconsIcon
                  icon={FilterHorizontalIcon}
                  size={20}
                  color={activeFilterCount > 0 ? theme.buttonBg : theme.textMuted}
                  strokeWidth={1.8}
                />
                {/* Badge */}
                {activeFilterCount > 0 && (
                  <View style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: theme.buttonBg,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Text style={{ fontSize: 11, fontFamily: fonts.black, color: theme.textOnAccent }}>
                      {activeFilterCount}
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          </View>
        </View>

        {/* Active Filters Bar */}
        {activeFilterCount > 0 && (
          <Pressable onPress={resetFilters} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              marginHorizontal: 20,
              marginBottom: 8,
              paddingVertical: 8,
              borderRadius: 10,
              backgroundColor: theme.tint,
            }}>
              <Text style={{ fontSize: 12, fontFamily: fonts.semibold, color: theme.buttonBg }}>
                {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
              </Text>
              <X size={14} color={theme.buttonBg} />
            </View>
          </Pressable>
        )}

        {/* Type Filters */}
        <View style={{ paddingBottom: 4 }}>
          <TransactionFilters />
        </View>

        {/* Content */}
        <TransactionContent searchQuery={searchQuery} />
      </View>
    </View>
  );
}
