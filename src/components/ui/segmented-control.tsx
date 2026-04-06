import React, { useState } from 'react';
import { View, Pressable, Text, LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';

interface SegmentedControlProps {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  className?: string;
}

export function SegmentedControl({
  options,
  selected,
  onSelect,
  className = '',
}: SegmentedControlProps) {
  const theme = useTheme();
  const selectedIndex = options.indexOf(selected);
  const translateX = useSharedValue(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const segmentWidth = containerWidth > 0 ? (containerWidth - 8) / options.length : 0;

  useEffect(() => {
    if (segmentWidth > 0) {
      translateX.value = withTiming(selectedIndex * segmentWidth, { duration: 200 });
    }
  }, [selectedIndex, segmentWidth]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    width: segmentWidth,
  }));

  const handleLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  return (
    <View
      onLayout={handleLayout}
      className={`flex-row rounded-2xl p-1 ${className}`}
      style={{ backgroundColor: theme.surfaceBg }}
    >
      {segmentWidth > 0 && (
        <Animated.View
          className="absolute top-1 bottom-1 rounded-xl"
          style={[
            indicatorStyle,
            {
              left: 4,
              backgroundColor: theme.cardBg,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.08,
              shadowRadius: 4,
              elevation: 2,
            },
          ]}
        />
      )}
      {options.map((option) => (
        <Pressable
          key={option}
          onPress={() => onSelect(option)}
          className="flex-1 items-center py-3 z-10"
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: fonts.semibold,
              color: selected === option ? theme.accent700 : theme.textMuted,
            }}
          >
            {option}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
