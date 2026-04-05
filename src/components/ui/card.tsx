import React from 'react';
import { View, Pressable, type ViewStyle } from 'react-native';
import { shadows } from '@theme/shadows';
import { useColorScheme } from 'nativewind';

const accent = require('@theme/accent');

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
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={`rounded-[20px] overflow-hidden ${className}`}
        style={({ pressed }) => [
          {
            ...shadows.md,
            backgroundColor: isDark ? accent.cardDark : accent.cardLight,
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
          backgroundColor: isDark ? accent.cardDark : accent.cardLight,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
