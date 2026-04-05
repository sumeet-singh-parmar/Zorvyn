import React from 'react';
import { Pressable, Text, ActivityIndicator, View, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'nativewind';

import { fonts } from '@theme/fonts';
import { shadows } from '@theme/shadows';

const accent = require('@theme/accent');

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

const sizeConfig = {
  sm: { px: 20, py: 12, fontSize: 14, iconGap: 6 },
  md: { px: 28, py: 16, fontSize: 16, iconGap: 8 },
  lg: { px: 32, py: 18, fontSize: 17, iconGap: 10 },
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  leftIcon,
  className = '',
  style,
}: ButtonProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const cfg = sizeConfig[size];

  if (variant === 'primary') {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        className="rounded-full overflow-hidden"
        style={({ pressed }) => [
          {
            opacity: disabled ? 0.5 : 1,
            transform: [{ scale: pressed ? 0.97 : 1 }],
            ...shadows.accent,
          },
          style,
        ]}
      >
        <LinearGradient
          colors={disabled ? [accent.disabledStart, accent.disabledEnd] : [accent.gradientStart, accent.gradientMid, accent.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: cfg.px,
            paddingVertical: cfg.py,
            borderRadius: 50,
          }}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              {leftIcon && (
                <View style={{ marginRight: cfg.iconGap }}>{leftIcon}</View>
              )}
              <Text
                style={{
                  fontSize: cfg.fontSize,
                  fontFamily: fonts.heading,
                  color: '#FFFFFF',
                  letterSpacing: 0.3,
                }}
              >
                {title}
              </Text>
            </>
          )}
        </LinearGradient>
      </Pressable>
    );
  }

  // Non-primary variants
  const variantStyles: Record<string, { bg: string; borderWidth: number; borderColor: string; textColor: string }> = {
    secondary: { bg: isDark ? accent.surfaceDark : accent.surfaceLight, borderWidth: 0, borderColor: 'transparent', textColor: isDark ? '#F3F4F6' : '#111827' },
    outline: { bg: 'transparent', borderWidth: 2, borderColor: isDark ? '#374151' : '#E5E7EB', textColor: isDark ? '#F3F4F6' : '#111827' },
    ghost: { bg: 'transparent', borderWidth: 0, borderColor: 'transparent', textColor: accent[500] },
    danger: { bg: '#EF4444', borderWidth: 0, borderColor: 'transparent', textColor: '#FFFFFF' },
  };

  const vs = variantStyles[variant] || variantStyles.secondary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className="rounded-full"
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: cfg.px,
          paddingVertical: cfg.py,
          backgroundColor: vs.bg,
          borderWidth: vs.borderWidth,
          borderColor: vs.borderColor,
          opacity: pressed ? 0.75 : disabled ? 0.5 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'danger' ? '#fff' : accent[500]}
        />
      ) : (
        <>
          {leftIcon && (
            <View style={{ marginRight: cfg.iconGap }}>{leftIcon}</View>
          )}
          <Text
            style={{
              fontSize: cfg.fontSize,
              fontWeight: '700',
              color: vs.textColor,
              letterSpacing: 0.2,
            }}
          >
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}
