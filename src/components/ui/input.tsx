import React, { useState } from 'react';
import { View, Text, TextInput, type TextInputProps } from 'react-native';
import { useColorScheme } from 'nativewind';

const accent = require('@theme/accent');

interface InputProps extends Omit<TextInputProps, 'className'> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  containerClassName = '',
  multiline,
  ...props
}: InputProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [focused, setFocused] = useState(false);

  const handleFocus = (e: any) => {
    setFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setFocused(false);
    props.onBlur?.(e);
  };

  const borderColor = error
    ? '#F87171'
    : focused
      ? accent.focus
      : isDark ? '#374151' : '#E5E7EB';

  return (
    <View style={containerClassName === 'rounded-xl' ? { borderRadius: 12 } : undefined}>
      {label && (
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: isDark ? '#D1D5DB' : '#374151',
            marginBottom: 8,
          }}
        >
          {label}
        </Text>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: multiline ? 'flex-start' : 'center',
          borderWidth: 2,
          borderColor,
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 14,
          backgroundColor: isDark ? accent.surfaceDark : accent.surfaceLight,
        }}
      >
        {leftIcon && (
          <View style={{ marginRight: 12, marginTop: multiline ? 2 : 0 }}>
            {leftIcon}
          </View>
        )}
        <TextInput
          style={{
            flex: 1,
            fontSize: 16,
            color: isDark ? '#F9FAFB' : '#111827',
            padding: 0,
            margin: 0,
            minHeight: multiline ? 60 : undefined,
            textAlignVertical: multiline ? 'top' : 'center',
          }}
          placeholderTextColor="#9CA3AF"
          onFocus={handleFocus}
          onBlur={handleBlur}
          multiline={multiline}
          {...props}
        />
        {rightIcon && (
          <View style={{ marginLeft: 12, marginTop: multiline ? 2 : 0 }}>
            {rightIcon}
          </View>
        )}
      </View>
      {error && (
        <Text
          style={{
            fontSize: 14,
            fontWeight: '500',
            color: '#EF4444',
            marginTop: 6,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
