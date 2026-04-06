import React from 'react';
import { Text, type TextStyle, type TextProps } from 'react-native';
import { formatCurrency, formatCompactCurrency } from '@core/currency';
import { useCurrencyStore } from '@stores/currency-store';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';

interface CurrencyTextProps extends Pick<TextProps, 'numberOfLines' | 'adjustsFontSizeToFit' | 'minimumFontScale'> {
  amount: number;
  currencyCode?: string;
  type?: 'income' | 'expense' | 'transfer' | 'neutral';
  compact?: boolean;
  style?: TextStyle;
  className?: string;
}

export function CurrencyText({
  amount,
  currencyCode,
  type = 'neutral',
  compact = false,
  style,
  className = '',
  numberOfLines,
  adjustsFontSizeToFit,
  minimumFontScale,
}: CurrencyTextProps) {
  const theme = useTheme();
  const defaultCurrency = useCurrencyStore((s) => s.currencyCode);
  const code = currencyCode ?? defaultCurrency;

  const typeColors: Record<string, string | undefined> = {
    income: theme.income,
    expense: theme.expense,
    transfer: theme.transfer,
    neutral: undefined,
  };

  const prefix = type === 'income' ? '+' : type === 'expense' ? '-' : '';
  const displayAmount = type === 'expense' ? Math.abs(amount) : amount;
  const displayText = compact
    ? formatCompactCurrency(displayAmount, code)
    : formatCurrency(displayAmount, code);

  return (
    <Text
      numberOfLines={numberOfLines}
      adjustsFontSizeToFit={adjustsFontSizeToFit}
      minimumFontScale={minimumFontScale}
      style={[{ fontFamily: fonts.heading }, typeColors[type] ? { color: typeColors[type] } : { color: theme.textPrimary }, style]}
    >
      {prefix}{displayText}
    </Text>
  );
}
