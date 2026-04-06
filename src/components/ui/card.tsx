import React from 'react';
import { View, Pressable, type ViewStyle } from 'react-native';
import { shadows } from '@theme/shadows';
import { useTheme } from '@theme/use-theme';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
  style?: ViewStyle;
}

export function Card({
  children,
  onPress,
  className = '',
  style,
}: CardProps) {
  const theme = useTheme();

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={`rounded-[20px] overflow-hidden ${className}`}
        style={({ pressed }) => [
          {
            ...shadows.md,
            backgroundColor: theme.cardBg,
            opacity: pressed ? 0.95 : 1,
            transform: [{ scale: pressed ? 0.99 : 1 }],
          },
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View
      className={`rounded-[20px] overflow-hidden ${className}`}
      style={[
        {
          ...shadows.md,
          backgroundColor: theme.cardBg,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
