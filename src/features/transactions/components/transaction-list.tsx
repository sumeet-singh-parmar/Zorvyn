import React from 'react';
import { View, Text, SectionList } from 'react-native';
import { TransactionCard } from './transaction-card';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';
import type { TransactionSection } from '../types';

interface TransactionListProps {
  sections: TransactionSection[];
  onPress: (id: string) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
  refreshing: boolean;
}

export function TransactionList({
  sections,
  onPress,
  onDelete,
  onRefresh,
  refreshing,
}: TransactionListProps) {
  const theme = useTheme();

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      renderSectionHeader={({ section: { title, data } }) => (
        <View
          className="flex-row items-center justify-between px-6"
          style={{ paddingTop: 20, paddingBottom: 10, backgroundColor: theme.screenBg }}
        >
          <Text
            style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.2, color: theme.textMuted, fontFamily: fonts.heading }}
          >
            {title}
          </Text>
          <Text
            style={{ fontSize: 12, color: theme.textMuted, fontFamily: fonts.semibold }}
          >
            {data.length} {data.length === 1 ? 'item' : 'items'}
          </Text>
        </View>
      )}
      renderItem={({ item }) => (
        <TransactionCard
          transaction={item}
          onPress={() => onPress(item.id)}
          onDelete={() => onDelete(item.id)}
        />
      )}
      ItemSeparatorComponent={() => null}
      stickySectionHeadersEnabled
      onRefresh={onRefresh}
      refreshing={refreshing}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100, paddingTop: 4 }}
    />
  );
}
