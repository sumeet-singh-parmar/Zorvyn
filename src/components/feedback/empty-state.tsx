import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from '@components/shared/icon-map';
import { Button } from '@components/ui/button';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';

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
  const theme = useTheme();

  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <View
        className="w-20 h-20 rounded-full items-center justify-center mb-6"
        style={{ backgroundColor: theme.surfaceBg }}
      >
        <Icon name={icon} size={36} color={theme.textMuted} />
      </View>
      <Text
        className="text-center mb-3"
        style={{ fontSize: 20, color: theme.textPrimary, fontFamily: fonts.heading }}
      >
        {title}
      </Text>
      {description && (
        <Text
          className="text-center mb-8"
          style={{ fontSize: 14, lineHeight: 20, color: theme.textSecondary }}
        >
          {description}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button title={actionLabel} onPress={onAction} size="sm" />
      )}
    </View>
  );
}
