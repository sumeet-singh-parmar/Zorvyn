import React from 'react';
import { View } from 'react-native';

interface DividerProps {
  className?: string;
}

export function Divider({ className = '' }: DividerProps) {
  return (
    <View className={`h-px bg-gray-200 dark:bg-gray-700/50 ${className}`} />
  );
}
