import React from 'react';
import { View, Text } from 'react-native';

const accent = require('@theme/accent');

interface BadgeProps {
  label: string;
  color?: string;
  variant?: 'filled' | 'outline';
  size?: 'sm' | 'md';
}

export function Badge({
  label,
  color = accent[500],
  variant = 'filled',
  size = 'sm',
}: BadgeProps) {
  const paddingClass = size === 'sm' ? 'px-3 py-1' : 'px-4 py-1.5';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  if (variant === 'outline') {
    return (
      <View
        className={`rounded-full ${paddingClass}`}
        style={{ borderWidth: 1.5, borderColor: color }}
      >
        <Text className={`${textSize} font-semibold`} style={{ color }}>
          {label}
        </Text>
      </View>
    );
  }

  return (
    <View
      className={`rounded-full ${paddingClass}`}
      style={{ backgroundColor: color + '1A' }}
    >
      <Text className={`${textSize} font-semibold`} style={{ color }}>
        {label}
      </Text>
    </View>
  );
}
