import React from 'react';
import { View, Text, SectionList } from 'react-native';
import { TransactionCard } from './transaction-card';
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
  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      renderSectionHeader={({ section: { title, data } }) => (
        <View
          className="flex-row items-center justify-between px-6 bg-[#FAFAF8] dark:bg-gray-950"
          style={{ paddingTop: 20, paddingBottom: 10 }}
        >
          <Text
            className="text-xs font-bold text-gray-400 uppercase"
            style={{ letterSpacing: 1.2 }}
          >
            {title}
          </Text>
          <Text className="text-xs font-semibold text-gray-300 dark:text-gray-600">
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
