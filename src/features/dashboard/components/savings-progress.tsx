import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { ProgressBar } from '@components/ui/progress-bar';
import { formatCompactCurrency } from '@core/currency';
import { Target } from 'lucide-react-native';
import { shadows } from '@theme/shadows';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';
import type { Goal } from '@core/models';

interface SavingsProgressProps {
  goals: Goal[];
  onPress: (id: string) => void;
}

export function SavingsProgress({ goals, onPress }: SavingsProgressProps) {
  const theme = useTheme();

  if (goals.length === 0) {
    return (
      <View
        className="rounded-2xl p-4 items-center"
        style={{
          backgroundColor: theme.tint,
          borderWidth: 1,
          borderColor: theme.ring,
        }}
      >
        <Target size={32} color={theme.accent500} />
        <Text style={{ fontSize: 14, fontFamily: fonts.semibold, color: theme.textPrimary, marginTop: 8 }}>
          No savings goals yet
        </Text>
        <Text style={{ fontSize: 12, fontFamily: fonts.body, color: theme.textSecondary, marginTop: 4, textAlign: 'center' }}>
          Create your first goal to start tracking progress
        </Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={{ fontSize: 16, fontFamily: fonts.heading, color: theme.textPrimary, marginBottom: 12 }}>
        Savings Goals
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {goals.map((goal) => {
          const progress = goal.target_amount > 0
            ? goal.current_amount / goal.target_amount
            : 0;
          const progressPercentage = Math.round(progress * 100);

          return (
            <Pressable
              key={goal.id}
              onPress={() => onPress(goal.id)}
              className="w-48 rounded-2xl p-4 mr-3 overflow-hidden"
              style={{
                backgroundColor: theme.cardBg,
                borderWidth: 1,
                borderColor: theme.border,
                ...shadows.sm,
              }}
            >
              <View className="flex-row items-center mb-3">
                <View
                  className="rounded-full p-2"
                  style={{
                    backgroundColor: goal.color ? `${goal.color}20` : theme.tint,
                  }}
                >
                  <Target size={14} color={goal.color ?? theme.accent500} />
                </View>
                <Text
                  style={{ fontSize: 14, fontFamily: fonts.heading, marginLeft: 8, flex: 1, color: theme.textPrimary }}
                  numberOfLines={1}
                >
                  {goal.name}
                </Text>
              </View>

              <View className="mb-3">
                <ProgressBar
                  progress={progress}
                  height={8}
                  color={goal.color ?? theme.accent500}
                />
              </View>

              <View className="flex-row justify-between items-center">
                <Text style={{ fontSize: 12, fontFamily: fonts.semibold, color: theme.textSecondary }}>
                  {progressPercentage}%
                </Text>
                <Text style={{ fontSize: 12, fontFamily: fonts.body, color: theme.textMuted }}>
                  {formatCompactCurrency(goal.current_amount, goal.currency_code)} / {formatCompactCurrency(goal.target_amount, goal.currency_code)}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
