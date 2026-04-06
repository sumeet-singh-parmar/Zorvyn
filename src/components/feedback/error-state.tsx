import React from 'react';
import { View, Text } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { Button } from '@components/ui/button';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = 'Something went wrong',
  onRetry,
}: ErrorStateProps) {
  const theme = useTheme();

  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <View
        className="w-20 h-20 rounded-full items-center justify-center mb-6"
        style={{ backgroundColor: theme.expenseTint }}
      >
        <AlertCircle size={36} color={theme.expense} />
      </View>
      <Text
        className="text-center mb-3"
        style={{ fontSize: 20, color: theme.textPrimary, fontFamily: fonts.heading }}
      >
        Oops!
      </Text>
      <Text
        className="text-center mb-8"
        style={{ fontSize: 14, lineHeight: 20, color: theme.textSecondary }}
      >
        {message}
      </Text>
      {onRetry && (
        <Button title="Try Again" onPress={onRetry} size="sm" />
      )}
    </View>
  );
}
