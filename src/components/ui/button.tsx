import React from 'react';
import { Pressable, Text, ActivityIndicator, View, type ViewStyle } from 'react-native';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
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
  style,
}: ButtonProps) {
  const theme = useTheme();
  const cfg = sizeConfig[size];

  if (variant === 'primary') {
    return (
      <View style={[{ borderRadius: 50, overflow: 'hidden', backgroundColor: theme.buttonBg }, style]}>
        <Pressable
          onPress={onPress}
          disabled={disabled || loading}
          style={({ pressed }) => ({
            opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
            transform: [{ scale: pressed ? 0.97 : 1 }],
          })}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: cfg.px, paddingVertical: cfg.py }}>
            {loading ? (
              <ActivityIndicator size="small" color={theme.textOnAccent} />
            ) : (
              <>
                {leftIcon && <View style={{ marginRight: cfg.iconGap }}>{leftIcon}</View>}
                <Text style={{ fontSize: cfg.fontSize, fontFamily: fonts.black, color: theme.textOnAccent, letterSpacing: 0.3 }}>
                  {title}
                </Text>
              </>
            )}
          </View>
        </Pressable>
      </View>
    );
  }

  const variants: Record<string, { bg: string; borderWidth: number; borderColor: string; textColor: string }> = {
    secondary: { bg: theme.surfaceBg, borderWidth: 0, borderColor: 'transparent', textColor: theme.textPrimary },
    outline: { bg: 'transparent', borderWidth: 2, borderColor: theme.border, textColor: theme.textPrimary },
    ghost: { bg: 'transparent', borderWidth: 0, borderColor: 'transparent', textColor: theme.buttonBg },
    danger: { bg: theme.expenseTint, borderWidth: 1, borderColor: theme.expense + '25', textColor: theme.expense },
  };

  const vs = variants[variant] ?? variants.secondary;

  return (
    <View style={[{ borderRadius: 50, overflow: 'hidden', backgroundColor: vs.bg, borderWidth: vs.borderWidth, borderColor: vs.borderColor }, style]}>
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        style={({ pressed }) => ({
          opacity: pressed ? 0.75 : disabled ? 0.5 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        })}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: cfg.px, paddingVertical: cfg.py }}>
          {loading ? (
            <ActivityIndicator size="small" color={variant === 'danger' ? theme.expense : theme.buttonBg} />
          ) : (
            <>
              {leftIcon && <View style={{ marginRight: cfg.iconGap }}>{leftIcon}</View>}
              <Text style={{ fontSize: cfg.fontSize, fontFamily: fonts.heading, color: vs.textColor, letterSpacing: 0.2 }}>
                {title}
              </Text>
            </>
          )}
        </View>
      </Pressable>
    </View>
  );
}
