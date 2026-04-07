import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Check, Search } from 'lucide-react-native';
import { Input } from '@components/ui/input';
import { CURRENCY_LIST, type CurrencyInfo } from '@core/currency/currency-data';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';

interface CurrencyPickerProps {
  selected: string;
  onSelect: (code: string) => void;
}

export function CurrencyPicker({ selected, onSelect }: CurrencyPickerProps) {
  const theme = useTheme();
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
        className="flex-row items-center px-4 py-3.5 rounded-2xl mb-2"
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.7 : 1,
            backgroundColor: isSelected ? theme.tint : theme.surfaceBg,
            borderWidth: isSelected ? 2 : 1,
            borderColor: isSelected ? theme.accent400 : theme.border,
          },
        ]}
      >
        <View
          className="w-10 h-10 rounded-full items-center justify-center mr-3"
          style={{
            backgroundColor: isSelected ? theme.accent200 + '40' : theme.border,
          }}
        >
          <Text
            className="text-lg"
            style={{
              fontFamily: fonts.heading,
              color: isSelected ? theme.accent700 : theme.textSecondary,
            }}
          >
            {item.symbol}
          </Text>
        </View>

        <View className="flex-1">
          <Text
            className="text-base"
            style={{
              fontFamily: fonts.semibold,
              color: isSelected ? theme.accent800 : theme.textPrimary,
            }}
          >
            {item.code}
          </Text>
          <Text
            className="text-sm"
            style={{ color: theme.textSecondary, fontFamily: fonts.body }}
          >
            {item.name}
          </Text>
        </View>

        {isSelected && (
          <View
            className="w-6 h-6 rounded-full items-center justify-center"
            style={{ backgroundColor: theme.accent600 }}
          >
            <Check size={14} color={theme.textOnAccent} />
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
          leftIcon={<Search size={18} color={theme.textMuted} />}
        />
      </View>

      <View>
        {filtered.map((item) => (
          <React.Fragment key={item.code}>
            {renderItem({ item })}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}
