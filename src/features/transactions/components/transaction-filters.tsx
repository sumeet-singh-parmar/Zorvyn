import React from 'react';
import { View, Text } from 'react-native';
import { ArrowDownLeft, ArrowUpRight, Repeat, Layers } from 'lucide-react-native';
import { useTransactionFilters } from '../hooks/use-transaction-filters';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';

const FILTERS = [
  { key: null, label: 'All', Icon: Layers },
  { key: 'income', label: 'Income', Icon: ArrowDownLeft },
  { key: 'expense', label: 'Expense', Icon: ArrowUpRight },
  { key: 'transfer', label: 'Transfer', Icon: Repeat },
] as const;

export const TransactionFilters = React.memo(function TransactionFilters() {
  const { selectedType, setSelectedType } = useTransactionFilters();
  const theme = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 4,
        backgroundColor: theme.surfaceBg,
      }}
    >
      {FILTERS.map((filter) => {
        const isSelected = selectedType === filter.key;
        const IconComp = filter.Icon;

        return (
          <View
            key={filter.label}
            style={{
              flex: 1,
              borderRadius: 12,
              overflow: 'hidden',
              backgroundColor: isSelected ? theme.buttonBg : 'transparent',
            }}
          >
            <View
              onTouchEnd={() => setSelectedType(filter.key)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 11,
              }}
            >
              <IconComp
                size={15}
                color={isSelected ? theme.textOnAccent : theme.textMuted}
                strokeWidth={isSelected ? 2.5 : 1.8}
              />
              <Text
                style={{
                  marginLeft: 5,
                  fontSize: 13,
                  fontFamily: isSelected ? fonts.heading : fonts.medium,
                  color: isSelected ? theme.textOnAccent : theme.textMuted,
                }}
              >
                {filter.label}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
});
