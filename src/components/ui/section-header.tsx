import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface SectionHeaderProps {
  title: string;
  action?: string;
  onAction?: () => void;
  className?: string;
}

export function SectionHeader({
  title,
  action,
  onAction,
  className = '',
}: SectionHeaderProps) {
  return (
    <View className={`flex-row items-center justify-between ${className}`}>
      <Text className="text-lg font-bold text-gray-900 dark:text-gray-200">
        {title}
      </Text>
      {action && onAction && (
        <Pressable onPress={onAction} className="px-2 py-1">
          <Text className="text-sm font-semibold text-accent-600 dark:text-accent-400">{action}</Text>
        </Pressable>
      )}
    </View>
  );
}
