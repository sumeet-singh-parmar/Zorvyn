import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';

interface AvatarProps {
  name?: string;
  size?: number;
  backgroundColor?: string;
  className?: string;
}

export function Avatar({
  name,
  size = 40,
  backgroundColor,
  className = '',
}: AvatarProps) {
  const theme = useTheme();
  const bgColor = backgroundColor ?? theme.accent500;

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
      className={`items-center justify-center rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: bgColor,
        borderWidth: 2,
        borderColor: theme.cardBg,
        shadowColor: bgColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <Text
        style={{
          color: theme.textOnAccent,
          fontFamily: fonts.semibold,
          fontSize: size * 0.38,
        }}
      >
        {initials}
      </Text>
    </View>
  );
}
