import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';

interface SpendingByDayProps {
  data: { day: string; amount: number }[];
}

export function SpendingByDay({ data }: SpendingByDayProps) {
  const theme = useTheme();

  const maxAmount = Math.max(...data.map((d) => d.amount), 1);
  const highestIdx = data.reduce((best, d, i) => (d.amount > data[best].amount ? i : best), 0);
  const hasData = data.some((d) => d.amount > 0);

  if (!hasData) return null;

  return (
    <View style={{
      backgroundColor: theme.cardBg,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 20,
    }}>
      {/* Header */}
      <Text style={{ fontSize: 17, fontFamily: fonts.heading, color: theme.textPrimary, marginBottom: 4 }}>
        Spending by Day
      </Text>
      <Text style={{ fontSize: 13, fontFamily: fonts.body, color: theme.textMuted, marginBottom: 20 }}>
        You spend most on <Text style={{ fontFamily: fonts.heading, color: theme.buttonBg }}>{data[highestIdx].day}s</Text>
      </Text>

      {/* Bars */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: 120 }}>
        {data.map((d, i) => {
          const height = maxAmount > 0 ? Math.max(4, (d.amount / maxAmount) * 100) : 4;
          const isHighest = i === highestIdx;

          return (
            <View key={d.day} style={{ flex: 1, alignItems: 'center' }}>
              <View style={{
                width: '100%',
                height,
                borderRadius: 6,
                backgroundColor: isHighest ? theme.buttonBg : theme.surfaceBg,
              }} />
              <Text style={{
                fontSize: 11,
                fontFamily: isHighest ? fonts.heading : fonts.body,
                color: isHighest ? theme.buttonBg : theme.textMuted,
                marginTop: 8,
              }}>
                {d.day}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
