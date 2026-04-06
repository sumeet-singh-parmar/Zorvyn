import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@theme/use-theme';

interface DividerProps {
  className?: string;
}

export function Divider({ className = '' }: DividerProps) {
  const theme = useTheme();

  return (
    <View
      className={`h-px ${className}`}
      style={{ backgroundColor: theme.border }}
    />
  );
}
