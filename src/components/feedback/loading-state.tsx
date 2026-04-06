import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message }: LoadingStateProps) {
  const theme = useTheme();
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
      <ActivityIndicator size="large" color={theme.accent500} />
      {message && (
        <Animated.View style={animatedStyle}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: fonts.body,
              color: theme.textSecondary,
              marginTop: 16,
              textAlign: 'center',
            }}
          >
            {message}
          </Text>
        </Animated.View>
      )}
    </View>
  );
}
