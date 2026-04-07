import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react-native';
import { useTheme, useIsDark } from '@theme/use-theme';
import { useThemeStore } from '@stores/theme-store';
import { hslToRgba } from '@theme/hsl';
import { fonts } from '@theme/fonts';

interface OverviewCardProps {
  icon: IconSvgElement;
  title: string;
  stat: string;
  statLabel: string;
  secondaryStat?: string;
  secondaryLabel?: string;
  progress?: number; // 0-1
  progressLabel?: string;
  onPress?: () => void;
}

export function OverviewCard({
  icon,
  title,
  stat,
  statLabel,
  secondaryStat,
  secondaryLabel,
  progress,
  progressLabel,
  onPress,
}: OverviewCardProps) {
  const theme = useTheme();
  const { hue, saturation } = useThemeStore();

  const isDark = useIsDark();
  const cardBg = isDark ? hslToRgba(hue, saturation * 0.12, 14, 1) : hslToRgba(hue, saturation * 0.5, 92, 0.7);
  const borderColor = isDark ? hslToRgba(hue, saturation * 0.1, 22, 1) : hslToRgba(hue, saturation * 0.3, 78, 1);
  const dividerColor = isDark ? hslToRgba(hue, saturation * 0.08, 25, 1) : hslToRgba(hue, saturation * 0.25, 82, 1);

  return (
    <View style={{ flex: 1 }}>
    <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>
      <View style={{
        backgroundColor: cardBg,
        borderRadius: 20,
        borderWidth: 1,
        borderColor,
        overflow: 'hidden',
        minHeight: 170,
      }}>
      {/* Header row with divider below */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 14,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: dividerColor,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
          <HugeiconsIcon icon={icon} size={17} color={theme.buttonBg} strokeWidth={1.8} />
          <Text style={{ fontFamily: fonts.heading, fontSize: 14, color: theme.textPrimary }}>
            {title}
          </Text>
        </View>
        <ChevronRight size={16} color={theme.textMuted} />
      </View>

      {/* Content */}
      <View style={{ flex: 1, paddingHorizontal: 14, paddingVertical: 12, justifyContent: 'space-between' }}>
        {/* Main stat -- number and label side by side */}
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 5 }}>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.5}
            style={{ fontFamily: fonts.black, fontSize: 24, color: theme.buttonBg, flexShrink: 1 }}
          >
            {stat}
          </Text>
          <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: theme.textSecondary }}>
            {statLabel}
          </Text>
        </View>

        {/* Secondary stat */}
        {secondaryStat && (
          <View style={{ marginTop: 'auto' }}>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.5}
              style={{ fontFamily: fonts.black, fontSize: 22, color: theme.buttonBg }}
            >
              {secondaryStat}
            </Text>
            {secondaryLabel && (
              <Text style={{ fontFamily: fonts.body, fontSize: 12, color: theme.textMuted }}>
                {secondaryLabel}
              </Text>
            )}
          </View>
        )}

        {/* Progress bar */}
        {progress !== undefined && (
          <View style={{ marginTop: 'auto' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View
                style={{
                  flex: 1,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: isDark ? hslToRgba(hue, saturation * 0.1, 25, 1) : theme.surfaceBg,
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    height: 6,
                    borderRadius: 3,
                    width: `${Math.min(progress * 100, 100)}%`,
                    backgroundColor: theme.buttonBg,
                  }}
                />
              </View>
            </View>
            <Text style={{ fontFamily: fonts.body, fontSize: 11, color: theme.textMuted, marginTop: 4 }}>
              {progressLabel ?? `${Math.round(progress * 100)}% of total budget spent`}
            </Text>
          </View>
        )}
      </View>
      </View>
    </Pressable>
    </View>
  );
}
