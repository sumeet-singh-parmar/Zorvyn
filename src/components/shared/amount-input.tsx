import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useIsInBottomSheet } from '@components/shared/global-sheet';
import { getCurrencyInfo } from '@core/currency';
import { useCurrencyStore } from '@stores/currency-store';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';

interface AmountInputProps {
  value: string;
  onChangeText: (text: string) => void;
  currencyCode?: string;
  autoFocus?: boolean;
}

export function AmountInput({
  value,
  onChangeText,
  currencyCode,
  autoFocus = false,
}: AmountInputProps) {
  const isSheet = useIsInBottomSheet();
  const InputComponent = isSheet ? BottomSheetTextInput : TextInput;
  const theme = useTheme();
  const defaultCurrency = useCurrencyStore((s) => s.currencyCode);
  const code = currencyCode ?? defaultCurrency;
  const { symbol } = getCurrencyInfo(code);

  const handleChange = (text: string) => {
    const cleaned = text.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 2) return;
    onChangeText(cleaned);
  };

  // Dynamically shrink font based on length so it never overflows
  const len = value.length || 1;
  const fontSize = len <= 6 ? 52 : len <= 8 ? 42 : len <= 10 ? 34 : len <= 13 ? 28 : 22;
  const symbolSize = Math.max(16, fontSize * 0.5);

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 28 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 24,
          maxWidth: '100%',
        }}
      >
        <Text
          style={{
            fontSize: symbolSize,
            fontFamily: fonts.amount,
            color: theme.textMuted,
            marginRight: 4,
          }}
        >
          {symbol}
        </Text>
        <InputComponent
          style={{
            fontSize,
            fontFamily: fonts.amount,
            color: theme.textPrimary,
            padding: 0,
            margin: 0,
            flexShrink: 1,
            minWidth: 40,
          }}
          keyboardType="decimal-pad"
          value={value}
          onChangeText={handleChange}
          placeholder="0"
          placeholderTextColor={theme.textMuted}
          autoFocus={autoFocus}
          maxLength={15}
        />
      </View>
      <View
        style={{
          height: 2,
          backgroundColor: theme.border,
          marginTop: 10,
          width: 100,
          borderRadius: 1,
        }}
      />
    </View>
  );
}
