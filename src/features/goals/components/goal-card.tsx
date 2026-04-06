import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Card } from '@components/ui/card';
import { ProgressBar } from '@components/ui/progress-bar';
import { CurrencyText } from '@components/shared/currency-text';
import { Target, Check } from 'lucide-react-native';
import { daysRemaining } from '@core/utils/date';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';
import type { Goal } from '@core/models';

interface GoalCardProps {
  goal: Goal;
  onPress: () => void;
}

export function GoalCard({ goal, onPress }: GoalCardProps) {
  const theme = useTheme();
  const progress = goal.target_amount > 0 ? goal.current_amount / goal.target_amount : 0;
  const remaining = goal.deadline ? daysRemaining(goal.deadline) : null;
  const color = goal.color ?? theme.accent500;
  const isCompleted = progress >= 1;
  const percentage = Math.round(progress * 100);

  return (
    <Card onPress={onPress} className="mb-4 rounded-3xl overflow-hidden shadow-sm active:shadow-md active:scale-98" style={{ backgroundColor: theme.cardBg }}>
      <View className="p-5">
        {/* Header Row */}
        <View className="flex-row items-start justify-between mb-4">
          <View className="flex-row items-center flex-1 mr-3">
            <View
              className="w-14 h-14 rounded-2xl items-center justify-center"
              style={{ backgroundColor: color + '15' }}
            >
              {(goal.icon ?? 'target') === 'target' && <Target size={24} color={color} />}
            </View>
            <View className="flex-1 ml-3">
              <Text style={{ fontSize: 16, fontFamily: fonts.heading, color: theme.textPrimary, lineHeight: 20 }}>
                {goal.name}
              </Text>
              {remaining !== null && (
                <Text style={{ fontSize: 12, fontFamily: fonts.medium, marginTop: 4, color: remaining > 0 ? theme.textSecondary : theme.warning }}>
                  {remaining > 0 ? `${remaining} days left` : 'Deadline passed'}
                </Text>
              )}
            </View>
          </View>

          {/* Percentage Badge */}
          {!isCompleted && (
            <View style={{ backgroundColor: theme.tint, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 9999 }}>
              <Text style={{ fontSize: 14, fontFamily: fonts.heading, color: theme.accent500 }}>
                {percentage}%
              </Text>
            </View>
          )}
          {isCompleted && (
            <View className="flex-row items-center gap-1" style={{ backgroundColor: theme.incomeTint, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 9999 }}>
              <Check size={14} color={theme.income} />
              <Text style={{ fontSize: 12, fontFamily: fonts.heading, color: theme.income }}>
                Complete
              </Text>
            </View>
          )}
        </View>

        {/* Progress Bar */}
        <ProgressBar
          progress={progress}
          color={isCompleted ? theme.income : color}
          height={10}
          className="mb-4 rounded-full overflow-hidden"
        />

        {/* Amount Info */}
        <View className="flex-row items-baseline justify-between mb-4">
          <View>
            <Text style={{ fontSize: 12, fontFamily: fonts.body, color: theme.textSecondary, marginBottom: 4 }}>Saved</Text>
            <CurrencyText
              amount={goal.current_amount}
              className="text-xl"
              style={{ color: isCompleted ? theme.income : color, fontFamily: fonts.heading }}
            />
          </View>
          <Text style={{ fontSize: 14, fontFamily: fonts.body, color: theme.textMuted }}>
            of <CurrencyText
              amount={goal.target_amount}
              style={{ color: theme.textPrimary, fontFamily: fonts.semibold }}
            />
          </Text>
        </View>

        {/* Contribute Button */}
        <Pressable
          style={{ backgroundColor: theme.accent500, paddingVertical: 12, borderRadius: 16, alignItems: 'center' }}
          onPress={() => {}}
        >
          <Text style={{ color: theme.textOnAccent, fontFamily: fonts.semibold, fontSize: 14 }}>Contribute</Text>
        </Pressable>
      </View>
    </Card>
  );
}
