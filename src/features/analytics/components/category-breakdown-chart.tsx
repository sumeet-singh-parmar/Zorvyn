import React from 'react';
import { View, Text } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { CurrencyText } from '@components/shared/currency-text';
import { useTheme } from '@theme/use-theme';
import { useThemeStore } from '@stores/theme-store';
import { hslToHex } from '@theme/hsl';
import { fonts } from '@theme/fonts';
import type { CategorySpending } from '../types';

interface CategoryBreakdownChartProps {
  data: CategorySpending[];
}

export function CategoryBreakdownChart({ data }: CategoryBreakdownChartProps) {
  const theme = useTheme();
  const { hue, saturation } = useThemeStore();

  if (data.length === 0) {
    return (
      <View style={{ backgroundColor: theme.cardBg, borderRadius: 20, borderWidth: 1, borderColor: theme.border, padding: 24, alignItems: 'center' }}>
        <Text style={{ fontSize: 15, fontFamily: fonts.heading, color: theme.textPrimary }}>
          No spending data yet
        </Text>
      </View>
    );
  }

  // Generate accent-harmonious colors
  const sliceColors = data.slice(0, 6).map((_, i) => {
    const shift = i * 40;
    return hslToHex((hue + shift) % 360, Math.max(45, saturation * 0.6), 50 + (i * 4));
  });

  const pieData = data.slice(0, 6).map((item, i) => ({
    value: item.amount,
    color: sliceColors[i],
  }));

  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <View style={{ backgroundColor: theme.cardBg, borderRadius: 20, borderWidth: 1, borderColor: theme.border, overflow: 'hidden' }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 }}>
        <Text style={{ fontSize: 17, fontFamily: fonts.heading, color: theme.textPrimary }}>
          Spending by Category
        </Text>
      </View>

      {/* Chart */}
      <View style={{ alignItems: 'center', paddingVertical: 16 }}>
        <PieChart
          data={pieData}
          donut
          innerRadius={55}
          radius={85}
          innerCircleColor={theme.cardBg}
          isAnimated
          animationDuration={600}
          focusOnPress
          centerLabelComponent={() => (
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 11, fontFamily: fonts.medium, color: theme.textMuted }}>Total</Text>
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
      <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
        {data.slice(0, 6).map((item, i) => (
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
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: sliceColors[i], marginRight: 10 }} />
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
