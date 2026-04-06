import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { CurrencyText } from '@components/shared/currency-text';
import { useTheme } from '@theme/use-theme';
import { useThemeStore } from '@stores/theme-store';
import { hslToHex, hslToRgba } from '@theme/hsl';
import { fonts } from '@theme/fonts';
import { ChevronRight } from 'lucide-react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ChartBarIncreasingIcon } from '@hugeicons/core-free-icons';
import type { CategoryBreakdownItem } from '../types';

interface SpendingChartProps {
  data: CategoryBreakdownItem[];
  onSeeAll: () => void;
}

export function SpendingChart({ data, onSeeAll }: SpendingChartProps) {
  const theme = useTheme();
  const { hue, saturation } = useThemeStore();

  if (data.length === 0) {
    return (
      <View
        style={{
          backgroundColor: theme.cardBg,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: theme.border,
          padding: 24,
          alignItems: 'center',
        }}
      >
        <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: theme.tint, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
          <HugeiconsIcon icon={ChartBarIncreasingIcon} size={24} color={theme.accent500} strokeWidth={1.8} />
        </View>
        <Text style={{ fontSize: 15, fontFamily: fonts.heading, color: theme.textPrimary }}>
          No spending this month
        </Text>
        <Text style={{ fontSize: 13, fontFamily: fonts.body, color: theme.textMuted, marginTop: 4, textAlign: 'center' }}>
          Start tracking expenses to see your breakdown
        </Text>
      </View>
    );
  }

  const total = data.reduce((sum, d) => sum + d.amount, 0);

  // Generate accent-harmonious colors for chart slices
  const sliceColors = data.slice(0, 6).map((_, i) => {
    const shift = i * 35;
    return hslToHex((hue + shift) % 360, Math.max(40, saturation * 0.6), 55 + (i * 5));
  });

  const pieData = data.slice(0, 6).map((item, i) => ({
    value: item.amount,
    color: sliceColors[i],
    text: `${item.percentage}%`,
  }));

  const centerBg = hslToRgba(hue, saturation * 0.1, 12, 1);

  return (
    <View
      style={{
        backgroundColor: theme.cardBg,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.border,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingBottom: 0 }}>
        <Text style={{ fontSize: 17, fontFamily: fonts.heading, color: theme.textPrimary }}>
          Spending Breakdown
        </Text>
        <Pressable
          onPress={onSeeAll}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 20, backgroundColor: theme.tint }}
        >
          <Text style={{ fontSize: 13, fontFamily: fonts.semibold, color: theme.buttonBg }}>See All</Text>
          <ChevronRight size={14} color={theme.buttonBg} />
        </Pressable>
      </View>

      {/* Chart */}
      <View style={{ alignItems: 'center', paddingVertical: 20 }}>
        <PieChart
          data={pieData}
          donut
          innerRadius={55}
          radius={85}
          innerCircleColor={theme.cardBg}
          isAnimated
          animationDuration={600}
          centerLabelComponent={() => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 11, fontFamily: fonts.medium, color: theme.textMuted }}>
                Total Spent
              </Text>
              <CurrencyText
                amount={total}
                compact
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.6}
                style={{ fontSize: 18, fontFamily: fonts.black, color: theme.textPrimary, marginTop: 2 }}
              />
            </View>
          )}
        />
      </View>

      {/* Legend */}
      <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
        {data.slice(0, 5).map((item, i) => (
          <View
            key={item.categoryId}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 10,
              borderTopWidth: 1,
              borderTopColor: theme.border,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: sliceColors[i] ?? theme.accent500,
                  marginRight: 10,
                }}
              />
              <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: theme.textPrimary, flex: 1 }}>
                {item.categoryName}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end', marginLeft: 12 }}>
              <Text style={{ fontSize: 14, fontFamily: fonts.heading, color: theme.textPrimary }}>
                {item.percentage}%
              </Text>
              <CurrencyText
                amount={item.amount}
                compact
                style={{ fontSize: 12, fontFamily: fonts.body, color: theme.textMuted }}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
