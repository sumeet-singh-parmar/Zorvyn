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
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, paddingVertical: 64 }}>
      <View style={{
        width: 88,
        height: 88,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.tint,
        marginBottom: 24,
      }}>
        <Icon name={icon} size={38} color={theme.buttonBg} strokeWidth={1.8} />
      </View>
      <Text style={{ fontSize: 20, fontFamily: fonts.heading, color: theme.textPrimary, textAlign: 'center', marginBottom: 8 }}>
        {title}
      </Text>
      {description && (
        <Text style={{ fontSize: 14, fontFamily: fonts.body, lineHeight: 20, color: theme.textSecondary, textAlign: 'center', marginBottom: 28 }}>
          {description}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button title={actionLabel} onPress={onAction} size="sm" />
      )}
    </View>
  );
}
