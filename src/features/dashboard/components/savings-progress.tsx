import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { ProgressBar } from '@components/ui/progress-bar';
import { formatCompactCurrency } from '@core/currency';
import { Target } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { shadows } from '@theme/shadows';
import type { Goal } from '@core/models';

const accent = require('@theme/accent');

interface SavingsProgressProps {
  goals: Goal[];
  onPress: (id: string) => void;
}

export function SavingsProgress({ goals, onPress }: SavingsProgressProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  if (goals.length === 0) {
    return (
      <View
        className="rounded-2xl p-4 items-center"
        style={{
          backgroundColor: accent.tint,
          borderWidth: 1,
          borderColor: accent.ring,
        }}
      >
        <Target size={32} color={accent[500]} />
        <Text className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-2">
          No savings goals yet
        </Text>
        <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
          Create your first goal to start tracking progress
        </Text>
      </View>
    );
  }

  return (
    <View>
      <Text className="text-base font-bold text-gray-900 dark:text-gray-200 mb-3">
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
                backgroundColor: isDark ? accent.cardDark : accent.cardLight,
                borderWidth: 1,
                borderColor: isDark ? accent[800] : accent[100],
                ...shadows.sm,
              }}
            >
              <View className="flex-row items-center mb-3">
                <View
                  className="rounded-full p-2"
                  style={{
                    backgroundColor: goal.color ? `${goal.color}20` : accent.tint,
                  }}
                >
                  <Target size={14} color={goal.color ?? accent[500]} />
                </View>
                <Text
                  className="text-sm font-bold ml-2 flex-1 text-gray-900 dark:text-gray-200"
                  numberOfLines={1}
                >
                  {goal.name}
                </Text>
              </View>

              <View className="mb-3">
                <ProgressBar
                  progress={progress}
                  height={8}
                  color={goal.color ?? accent[500]}
                />
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  {progressPercentage}%
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-500">
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
