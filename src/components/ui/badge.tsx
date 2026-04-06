import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';

interface BadgeProps {
  label: string;
  color?: string;
  variant?: 'filled' | 'outline';
  size?: 'sm' | 'md';
}

export function Badge({
  label,
  color,
  variant = 'filled',
  size = 'sm',
}: BadgeProps) {
  const theme = useTheme();
  const resolvedColor = color ?? theme.accent500;

  const paddingHorizontal = size === 'sm' ? 12 : 16;
  const paddingVertical = size === 'sm' ? 4 : 6;
  const fontSize = size === 'sm' ? 12 : 14;

  if (variant === 'outline') {
    return (
      <View
        style={{
          borderRadius: 9999,
          paddingHorizontal,
          paddingVertical,
          borderWidth: 1.5,
          borderColor: resolvedColor,
        }}
      >
        <Text
          style={{
            fontSize,
            fontFamily: fonts.semibold,
            color: resolvedColor,
          }}
        >
          {label}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        borderRadius: 9999,
        paddingHorizontal,
        paddingVertical,
        backgroundColor: resolvedColor + '1A',
      }}
    >
      <Text
        style={{
          fontSize,
          fontFamily: fonts.semibold,
          color: resolvedColor,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
