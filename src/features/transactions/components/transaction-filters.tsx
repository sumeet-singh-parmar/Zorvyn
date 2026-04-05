import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ArrowDownLeft, ArrowUpRight, Repeat, Layers } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useTransactionFilters } from '../hooks/use-transaction-filters';

import { fonts } from '@theme/fonts';

const semantic = require('@theme/semantic');
const accent = require('@theme/accent');

const FILTERS = [
  { key: null, label: 'All', Icon: Layers, selectedBg: '#1F2937' },
  { key: 'income', label: 'Income', Icon: ArrowDownLeft, selectedBg: semantic.income.dark },
  { key: 'expense', label: 'Expense', Icon: ArrowUpRight, selectedBg: semantic.expense.dark },
  { key: 'transfer', label: 'Transfer', Icon: Repeat, selectedBg: semantic.transfer.dark },
] as const;

export const TransactionFilters = React.memo(function TransactionFilters() {
  const { selectedType, setSelectedType } = useTransactionFilters();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View
      style={{
        flexDirection: 'row',
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 4,
        backgroundColor: isDark ? accent.surfaceDark : accent.surfaceLight,
      }}
    >
      {FILTERS.map((filter) => {
        const isSelected = selectedType === filter.key;
        const IconComp = filter.Icon;

        return (
          <Pressable
            key={filter.label}
            onPress={() => setSelectedType(filter.key)}
            className="rounded-xl"
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 11,
              backgroundColor: isSelected ? filter.selectedBg : 'transparent',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <IconComp
                size={15}
                color={isSelected ? '#FFFFFF' : '#9CA3AF'}
                strokeWidth={isSelected ? 2.5 : 1.8}
              />
              <Text
                style={{
                  marginLeft: 5,
                  fontSize: 13,
                  fontFamily: isSelected ? fonts.heading : fonts.medium,
                  color: isSelected ? '#FFFFFF' : '#6B7280',
                }}
              >
                {filter.label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
});
