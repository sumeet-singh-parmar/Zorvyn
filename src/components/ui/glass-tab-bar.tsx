import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, LayoutChangeEvent } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Plus } from 'lucide-react-native';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react-native';
import { useTheme, useIsDark } from '@theme/use-theme';
import { useThemeStore } from '@stores/theme-store';
import { hslToRgba } from '@theme/hsl';
import { fonts } from '@theme/fonts';

interface TabDef {
  key: string;
  label: string;
  icon: IconSvgElement;      // Hugeicons outline variant
  iconFilled: IconSvgElement; // Hugeicons filled variant
}

interface GlassTabBarProps {
  tabs: TabDef[];
  activeIndex: number;
  onTabPress: (index: number) => void;
  onPlusPress?: () => void;
}

export function GlassTabBarPreview({ tabs, activeIndex, onTabPress, onPlusPress }: GlassTabBarProps) {
  const theme = useTheme();
  const isDark = useIsDark();
  const { hue, saturation, lightness } = useThemeStore();

  const tabCount = tabs.length;
  const [pillWidth, setPillWidth] = useState(0);
  const rawTabWidth = pillWidth > 0 ? (pillWidth - 16) / tabCount : 0;
  const indicatorWidth = rawTabWidth + 6;
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (rawTabWidth > 0) {
      translateX.value = withTiming(activeIndex * rawTabWidth - 3, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    }
  }, [activeIndex, rawTabWidth]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    width: indicatorWidth,
  }));

  const onLayout = (e: LayoutChangeEvent) => setPillWidth(e.nativeEvent.layout.width);

  const borderColor = isDark
    ? hslToRgba(hue, saturation * 0.2, 40, 0.25)
    : hslToRgba(hue, saturation * 0.15, 70, 0.3);

  const glassShine = isDark
    ? ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)', 'rgba(255,255,255,0)']
    : ['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.2)', 'rgba(255,255,255,0)'];

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {/* Glass pill */}
      <View
        onLayout={onLayout}
        style={{
          flex: 1,
          height: 64,
          borderRadius: 34,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor,
        }}
      >
        {/* Blur background */}
        <BlurView
          intensity={isDark ? 40 : 60}
          tint={isDark ? 'dark' : 'light'}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />

        {/* Accent tint wash */}
        <View
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: isDark
              ? hslToRgba(hue, saturation * 0.15, 12, 0.5)
              : hslToRgba(hue, saturation * 0.1, 95, 0.4),
          }}
        />

        {/* Glass shine */}
        <LinearGradient
          colors={glassShine as [string, string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />

        {/* Tab content */}
        <View style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 6, alignItems: 'center', justifyContent: 'center' }}>
          {/* Sliding indicator */}
          {rawTabWidth > 0 && (
            <Animated.View
              style={[
                indicatorStyle,
                {
                  position: 'absolute',
                  top: 3,
                  bottom: 3,
                  left: 6,
                  borderRadius: 28,
                  backgroundColor: isDark
                    ? hslToRgba(hue, saturation * 0.2, 22, 0.6)
                    : hslToRgba(hue, saturation * 0.15, 85, 0.5),
                  borderWidth: 1,
                  borderColor: isDark
                    ? hslToRgba(hue, saturation * 0.15, 35, 0.3)
                    : hslToRgba(hue, saturation * 0.1, 75, 0.3),
                },
              ]}
            />
          )}

          {tabs.map((tab, index) => {
            const isActive = activeIndex === index;
            const iconColor = isActive ? theme.accent400 : theme.tabInactiveIcon;
            const textColor = isActive ? theme.accent300 : theme.tabInactiveIcon;

            return (
              <Pressable
                key={tab.key}
                onPress={() => onTabPress(index)}
                style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: 52 }}
              >
                <HugeiconsIcon
                  icon={tab.icon}
                  altIcon={tab.iconFilled}
                  showAlt={isActive}
                  size={22}
                  color={iconColor}
                  strokeWidth={isActive ? 2 : 1.5}
                />
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: isActive ? fonts.heading : fonts.medium,
                    color: textColor,
                    marginTop: 3,
                  }}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Plus button */}
      {onPlusPress && (
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            marginLeft: 12,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <BlurView
            intensity={isDark ? 40 : 60}
            tint={isDark ? 'dark' : 'light'}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
          <View
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: isDark
                ? hslToRgba(hue, saturation * 0.3, 15, 0.5)
                : hslToRgba(hue, saturation * 0.2, 90, 0.4),
            }}
          />
          <Pressable
            onPress={onPlusPress}
            style={({ pressed }) => ({
              flex: 1,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Plus size={24} color={theme.accent400} strokeWidth={2.5} />
          </Pressable>
        </View>
      )}
    </View>
  );
}
