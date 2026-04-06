import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';

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
  const theme = useTheme();

  return (
    <View className={`flex-row items-center justify-between ${className}`}>
      <Text
        style={{ fontSize: 18, color: theme.textPrimary, fontFamily: fonts.heading }}
      >
        {title}
      </Text>
      {action && onAction && (
        <Pressable onPress={onAction} className="px-2 py-1">
          <Text
            style={{ fontSize: 14, color: theme.accent500, fontFamily: fonts.semibold }}
          >
            {action}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
