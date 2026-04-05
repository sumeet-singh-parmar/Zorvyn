import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from '@components/shared/icon-map';
import { Button } from '@components/ui/button';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon = 'inbox',
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <View className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center mb-6">
        <Icon name={icon} size={36} color="#A1A1A1" />
      </View>
      <Text className="text-xl font-bold text-gray-900 text-center mb-3">
        {title}
      </Text>
      {description && (
        <Text className="text-sm text-gray-500 text-center mb-8 leading-5">
          {description}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button title={actionLabel} onPress={onAction} size="sm" />
      )}
    </View>
  );
}
