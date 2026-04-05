import React from 'react';
import { View, Text } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { Button } from '@components/ui/button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = 'Something went wrong',
  onRetry,
}: ErrorStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <View className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 items-center justify-center mb-6">
        <AlertCircle size={36} color="#D63031" />
      </View>
      <Text className="text-xl font-bold text-gray-900 dark:text-gray-200 text-center mb-3">
        Oops!
      </Text>
      <Text className="text-sm text-gray-600 dark:text-gray-400 text-center mb-8 leading-5">
        {message}
      </Text>
      {onRetry && (
        <Button title="Try Again" onPress={onRetry} size="sm" />
      )}
    </View>
  );
}
