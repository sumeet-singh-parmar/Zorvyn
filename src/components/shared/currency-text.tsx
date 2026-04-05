import React from 'react';
import { Text, type TextStyle, type TextProps } from 'react-native';
import { formatCurrency, formatCompactCurrency } from '@core/currency';
import { useCurrencyStore } from '@stores/currency-store';
import { fonts } from '@theme/fonts';

const semantic = require('@theme/semantic');

interface CurrencyTextProps extends Pick<TextProps, 'numberOfLines' | 'adjustsFontSizeToFit' | 'minimumFontScale'> {
  amount: number;
  currencyCode?: string;
  type?: 'income' | 'expense' | 'transfer' | 'neutral';
  compact?: boolean;
  style?: TextStyle;
  className?: string;
}

const typeColors = {
  income: semantic.income.DEFAULT,
  expense: semantic.expense.DEFAULT,
  transfer: semantic.transfer.DEFAULT,
  neutral: undefined,
};

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
  const defaultCurrency = useCurrencyStore((s) => s.currencyCode);
  const code = currencyCode ?? defaultCurrency;

  const formatted = compact
    ? formatCompactCurrency(amount, code)
    : formatCurrency(amount, code);

  const prefix = type === 'income' ? '+' : type === 'expense' ? '-' : '';
  const displayAmount = type === 'expense' ? Math.abs(amount) : amount;
  const displayText = compact
    ? formatCompactCurrency(displayAmount, code)
    : formatCurrency(displayAmount, code);

  return (
    <Text
      className={`text-base ${className}`}
      numberOfLines={numberOfLines}
      adjustsFontSizeToFit={adjustsFontSizeToFit}
      minimumFontScale={minimumFontScale}
      style={[{ fontFamily: fonts.heading }, typeColors[type] ? { color: typeColors[type] } : { color: '#111827' }, style]}
    >
      {prefix}{displayText}
    </Text>
  );
}
