import React, { useState } from 'react';
import { View, Text, TextInput, type TextInputProps } from 'react-native';
import { useTheme, useIsDark } from '@theme/use-theme';
import { fonts } from '@theme/fonts';

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
  const theme = useTheme();
  const isDark = useIsDark();
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
    ? theme.expense
    : focused
      ? theme.accent400
      : theme.border;

  return (
    <View style={containerClassName === 'rounded-xl' ? { borderRadius: 12 } : undefined}>
      {label && (
        <Text
          style={{
            fontSize: 14,
            fontFamily: fonts.semibold,
            color: theme.textSecondary,
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
          backgroundColor: theme.surfaceBg,
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
            fontFamily: fonts.body,
            color: theme.textPrimary,
            padding: 0,
            margin: 0,
            minHeight: multiline ? 60 : undefined,
            textAlignVertical: multiline ? 'top' : 'center',
          }}
          placeholderTextColor={theme.textMuted}
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
            fontFamily: fonts.medium,
            color: theme.expense,
            marginTop: 6,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
