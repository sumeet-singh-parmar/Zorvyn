import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';

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

function getProgressColor(
  progress: number,
  theme: { expense: string; warning: string; income: string },
  customColor?: string,
): string {
  if (customColor) return customColor;
  if (progress >= 0.9) return theme.expense;
  if (progress >= 0.7) return theme.warning;
  return theme.income;
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
  const theme = useTheme();
  const resolvedTrackColor = trackColor ?? theme.surfaceBg;
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const barColor = getProgressColor(clampedProgress, theme, color);

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
            <Text
              style={{
                fontSize: 12,
                fontFamily: fonts.body,
                color: theme.textMuted,
              }}
            >
              {label}
            </Text>
          )}
          {showLabel && (
            <Text
              style={{
                fontSize: 12,
                fontFamily: fonts.medium,
                color: barColor,
              }}
            >
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
