import React, { useState } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Check, Search } from 'lucide-react-native';
import { Input } from '@components/ui/input';
import { CURRENCY_LIST, type CurrencyInfo } from '@core/currency/currency-data';

const accent = require('@theme/accent');

interface CurrencyPickerProps {
  selected: string;
  onSelect: (code: string) => void;
}

export function CurrencyPicker({ selected, onSelect }: CurrencyPickerProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [search, setSearch] = useState('');

  const filtered = CURRENCY_LIST.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }: { item: CurrencyInfo }) => {
    const isSelected = selected === item.code;
    return (
      <Pressable
        onPress={() => onSelect(item.code)}
        className={`flex-row items-center px-4 py-3.5 rounded-2xl mb-2 ${
          isSelected
            ? 'bg-accent-50 border-2 border-accent-400'
            : 'border border-gray-100'
        }`}
        style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1, backgroundColor: isSelected ? undefined : (isDark ? accent.surfaceDark : accent.surfaceLight) }]}
      >
        <View
          className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
            isSelected ? 'bg-accent-200' : 'bg-gray-200'
          }`}
        >
          <Text className={`text-lg font-bold ${
            isSelected ? 'text-accent-700' : 'text-gray-600'
          }`}>
            {item.symbol}
          </Text>
        </View>

        <View className="flex-1">
          <Text className={`text-base font-semibold ${isSelected ? 'text-accent-800' : 'text-gray-900'}`}>
            {item.code}
          </Text>
          <Text className="text-sm text-gray-500">
            {item.name}
          </Text>
        </View>

        {isSelected && (
          <View className="w-6 h-6 rounded-full bg-accent-600 items-center justify-center">
            <Check size={14} color="white" />
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <View className="flex-1 mb-4">
      <View className="mb-4">
        <Input
          placeholder="Search currencies..."
          value={search}
          onChangeText={setSearch}
          leftIcon={<Search size={18} color="#9CA3AF" />}
          containerClassName="mb-0"
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.code}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        nestedScrollEnabled={true}
      />
    </View>
  );
}
