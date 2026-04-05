import React from 'react';
import { View, Text } from 'react-native';

const accent = require('@theme/accent');

interface AvatarProps {
  name?: string;
  size?: number;
  backgroundColor?: string;
  className?: string;
}

export function Avatar({
  name,
  size = 40,
  backgroundColor = accent[500],
  className = '',
}: AvatarProps) {
  const initials = name
    ? name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  return (
    <View
      className={`items-center justify-center rounded-full border-2 border-white dark:border-gray-900 ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor,
        shadowColor: backgroundColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <Text
        className="text-white font-semibold"
        style={{ fontSize: size * 0.38 }}
      >
        {initials}
      </Text>
    </View>
  );
}
