import React from 'react';
import { View, Text } from 'react-native';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import { CategoryIcon } from '@components/shared/category-icon';
import { CurrencyText } from '@components/shared/currency-text';
import { ProgressBar } from '@components/ui/progress-bar';
import { useTheme } from '@theme/use-theme';
import { useThemeStore } from '@stores/theme-store';
import { hslToHex, hslToRgba } from '@theme/hsl';
import { fonts } from '@theme/fonts';
import type { CategorySpending } from '../types';

interface TopCategoriesListProps {
  data: CategorySpending[];
  trends?: Map<string, number>;
}

export function TopCategoriesList({ data, trends }: TopCategoriesListProps) {
  const theme = useTheme();
  const { hue, saturation } = useThemeStore();

  if (data.length === 0) return null;

  const maxAmount = data[0]?.amount || 1;

  // Rank colors derived from accent
  const rankColors = [
    hslToHex(hue, saturation * 0.7, 55),       // 1st -- bright accent
    hslToHex((hue + 30) % 360, saturation * 0.4, 60),  // 2nd
    hslToHex((hue + 60) % 360, saturation * 0.35, 55), // 3rd
  ];

  return (
    <View style={{ backgroundColor: theme.cardBg, borderRadius: 20, borderWidth: 1, borderColor: theme.border, overflow: 'hidden' }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: theme.border }}>
        <Text style={{ fontSize: 17, fontFamily: fonts.heading, color: theme.textPrimary }}>
          Top Spending
        </Text>
        <Text style={{ fontSize: 13, fontFamily: fonts.body, color: theme.textMuted, marginTop: 4 }}>
          Your top {Math.min(data.length, 5)} categories
        </Text>
      </View>

      {/* List */}
      {data.slice(0, 5).map((item, index) => {
        const progress = item.amount / maxAmount;
        const isTop = index === 0;
        const rankColor = index < 3 ? rankColors[index] : theme.textMuted;

        return (
          <View
            key={item.categoryId}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 14,
              backgroundColor: isTop ? theme.tint : undefined,
              borderTopWidth: index > 0 ? 1 : 0,
              borderTopColor: theme.border,
            }}
          >
            {/* Top row */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              {/* Rank */}
              <View style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: hslToRgba(hue, saturation * 0.3, index < 3 ? 50 : 40, 0.15),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Text style={{ fontSize: 13, fontFamily: fonts.black, color: rankColor }}>
                  {index + 1}
                </Text>
              </View>

              {/* Category */}
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <CategoryIcon iconName={item.icon} color={item.color} size="sm" />
                <Text style={{ flex: 1, fontFamily: fonts.semibold, fontSize: isTop ? 16 : 14, color: theme.textPrimary }}>
                  {item.categoryName}
                </Text>
              </View>

              {/* Amount + Trend */}
              <View style={{ alignItems: 'flex-end' }}>
                <CurrencyText
                  amount={item.amount}
                  style={{ fontSize: isTop ? 16 : 14, fontFamily: fonts.heading, color: theme.textPrimary }}
                />
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                  <Text style={{ fontSize: 12, fontFamily: fonts.body, color: theme.textMuted }}>
                    {item.percentage}%
                  </Text>
                  {trends?.has(item.categoryId) && (() => {
                    const change = trends.get(item.categoryId)!;
                    if (change === 0) return null;
                    const isUp = change > 0;
                    return (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                        {isUp ? <TrendingUp size={10} color={theme.expense} /> : <TrendingDown size={10} color={theme.income} />}
                        <Text style={{ fontSize: 10, fontFamily: fonts.semibold, color: isUp ? theme.expense : theme.income }}>
                          {isUp ? '+' : ''}{change}%
                        </Text>
                      </View>
                    );
                  })()}
                </View>
              </View>
            </View>

            {/* Progress bar */}
            <View style={{ marginLeft: 42 }}>
              <ProgressBar
                progress={progress}
                color={index < 3 ? rankColors[index] : theme.accent500}
                height={5}
                animated={true}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}
