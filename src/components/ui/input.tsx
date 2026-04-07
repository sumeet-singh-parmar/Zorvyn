import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  type TextInputProps,
} from 'react-native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useIsInBottomSheet } from '@components/shared/global-sheet';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';

// The Input component switches between RN's TextInput and gorhom's BottomSheetTextInput,
// which have incompatible focus event signatures. Using a relaxed type here is intentional.
type FocusEvt = Parameters<NonNullable<TextInputProps['onFocus']>>[0];

interface InputProps extends Omit<TextInputProps, 'className'> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  multiline,
  ...props
}: InputProps) {
  const isSheet = useIsInBottomSheet();
  const InputComponent = isSheet ? BottomSheetTextInput : TextInput;
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  const handleFocus = (e: FocusEvt) => {
    setFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: FocusEvt) => {
    setFocused(false);
    props.onBlur?.(e);
  };

  const borderColor = error
    ? theme.expense
    : focused
      ? theme.accent400
      : theme.border;

  return (
    <View>
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
        <InputComponent
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
