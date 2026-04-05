import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useColorScheme } from 'nativewind';

const accent = require('@theme/accent');

interface ProgressBarProps {
  progress: number; // 0 to 1
  color?: string;
  trackColor?: string;
  height?: number;
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  className?: string;
}

function getProgressColor(progress: number, customColor?: string): string {
  if (customColor) return customColor;
  if (progress >= 0.9) return '#EF4444';
  if (progress >= 0.7) return '#F59E0B';
  return '#10B981';
}

export function ProgressBar({
  progress,
  color,
  trackColor,
  height = 8,
  showLabel = false,
  label,
  animated = true,
  className = '',
}: ProgressBarProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const resolvedTrackColor = trackColor ?? (isDark ? accent.surfaceDark : accent.surfaceLight);
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const barColor = getProgressColor(clampedProgress, color);

  const widthAnim = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      widthAnim.value = withTiming(clampedProgress * 100, {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      widthAnim.value = clampedProgress * 100;
    }
  }, [clampedProgress, animated]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${widthAnim.value}%`,
  }));

  return (
    <View className={className}>
      {(showLabel || label) && (
        <View className="flex-row justify-between mb-1">
          {label && (
            <Text className="text-xs text-gray-500 dark:text-gray-400">{label}</Text>
          )}
          {showLabel && (
            <Text className="text-xs font-medium" style={{ color: barColor }}>
              {Math.round(clampedProgress * 100)}%
            </Text>
          )}
        </View>
      )}
      <View
        className="rounded-full overflow-hidden"
        style={{ height, backgroundColor: resolvedTrackColor, elevation: 1 }}
      >
        <Animated.View
          className="rounded-full h-full"
          style={[{ backgroundColor: barColor, shadowColor: barColor }, animatedStyle]}
        />
      </View>
    </View>
  );
}
