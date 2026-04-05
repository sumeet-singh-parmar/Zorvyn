import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const accent = require('@theme/accent');

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message }: LoadingStateProps) {
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View className="flex-1 items-center justify-center py-12">
      <ActivityIndicator size="large" color={accent[500]} />
      {message && (
        <Animated.View style={animatedStyle}>
          <Text className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
            {message}
          </Text>
        </Animated.View>
      )}
    </View>
  );
}
