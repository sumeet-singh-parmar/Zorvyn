import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Card } from '@components/ui/card';
import { CurrencyText } from '@components/shared/currency-text';
import { Target, Trophy, Sparkles, Lightbulb } from 'lucide-react-native';
import { daysRemaining } from '@core/utils/date';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';
import type { Goal } from '@core/models';

interface GoalCardProps {
  goal: Goal;
  onPress: () => void;
  onContribute?: () => void;
}

function getMotivation(pct: number): { text: string; emoji: string } {
  if (pct >= 100) return { text: 'Goal achieved!', emoji: '🎉' };
  if (pct >= 75) return { text: 'Almost there! So close!', emoji: '🔥' };
  if (pct >= 50) return { text: 'Halfway there!', emoji: '💪' };
  if (pct >= 25) return { text: 'Making real progress!', emoji: '📈' };
  if (pct > 0) return { text: 'Great start! Keep it up!', emoji: '🌱' };
  return { text: "Let's get started!", emoji: '✨' };
}

function getSavingSuggestion(remaining: number, daysLeft: number): string | null {
  if (daysLeft <= 0 || remaining <= 0) return null;
  if (daysLeft <= 7) {
    const perDay = Math.ceil(remaining / daysLeft);
    return `Save ~${perDay.toLocaleString()}/day to reach your goal`;
  }
  if (daysLeft <= 60) {
    const perWeek = Math.ceil(remaining / (daysLeft / 7));
    return `Save ~${perWeek.toLocaleString()}/week to reach your goal`;
  }
  const perMonth = Math.ceil(remaining / (daysLeft / 30));
  return `Save ~${perMonth.toLocaleString()}/month to reach your goal`;
}

export function GoalCard({ goal, onPress, onContribute }: GoalCardProps) {
  const theme = useTheme();
  const progress = goal.target_amount > 0 ? goal.current_amount / goal.target_amount : 0;
  const days = goal.deadline ? daysRemaining(goal.deadline) : null;
  const color = goal.color ?? theme.accent500;
  const isCompleted = progress >= 1;
  const percentage = Math.round(progress * 100);
  const motivation = getMotivation(percentage);
  const remainingAmount = Math.max(0, goal.target_amount - goal.current_amount);
  const suggestion = days !== null ? getSavingSuggestion(remainingAmount, days) : null;

  const milestones = [25, 50, 75, 100];

  return (
    <Card onPress={onPress} style={{
      backgroundColor: isCompleted ? theme.incomeTint : theme.cardBg,
      borderRadius: 24,
      borderWidth: isCompleted ? 1 : 0,
      borderColor: isCompleted ? theme.income + '30' : undefined,
      marginBottom: 16,
      overflow: 'hidden',
    }}>
      <View style={{ padding: 20 }}>
        {/* Header Row */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 12 }}>
            <View style={{
              width: 52,
              height: 52,
              borderRadius: 18,
              backgroundColor: isCompleted ? theme.income + '20' : color + '15',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {isCompleted
                ? <Trophy size={24} color={theme.income} />
                : <Target size={24} color={color} />
              }
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={{ fontSize: 17, fontFamily: fonts.heading, color: theme.textPrimary, lineHeight: 22 }}>
                {goal.name}
              </Text>
              {days !== null && !isCompleted && (
                <Text style={{ fontSize: 12, fontFamily: fonts.medium, marginTop: 3, color: days > 0 ? theme.textSecondary : theme.expense }}>
                  {days > 0 ? `${days} days left` : `${Math.abs(days)} days overdue`}
                </Text>
              )}
            </View>
          </View>

          {/* Badge */}
          <View style={{
            backgroundColor: isCompleted ? theme.income + '20' : theme.tint,
            paddingHorizontal: 12,
            paddingVertical: 5,
            borderRadius: 50,
          }}>
            <Text style={{ fontSize: 14, fontFamily: fonts.black, color: isCompleted ? theme.income : color }}>
              {percentage}%
            </Text>
          </View>
        </View>

        {/* Progress Bar with Milestones */}
        <View style={{ marginBottom: 6 }}>
          {/* Bar */}
          <View style={{ height: 10, borderRadius: 5, backgroundColor: theme.surfaceBg, overflow: 'hidden' }}>
            <View style={{
              height: 10,
              borderRadius: 5,
              backgroundColor: isCompleted ? theme.income : color,
              width: `${Math.min(100, percentage)}%`,
            }} />
          </View>
          {/* Milestone dots */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6, paddingHorizontal: 2 }}>
            {milestones.map((m) => {
              const reached = percentage >= m;
              return (
                <View key={m} style={{ alignItems: 'center' }}>
                  <View style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: reached ? (isCompleted ? theme.income : color) : theme.surfaceBg,
                    borderWidth: reached ? 0 : 1,
                    borderColor: theme.border,
                  }} />
                  <Text style={{ fontSize: 9, fontFamily: fonts.medium, color: reached ? theme.textSecondary : theme.textMuted, marginTop: 2 }}>
                    {m}%
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Motivational Text */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14, marginTop: 8 }}>
          <Text style={{ fontSize: 16 }}>{motivation.emoji}</Text>
          <Text style={{ fontSize: 13, fontFamily: fonts.semibold, color: isCompleted ? theme.income : color }}>
            {motivation.text}
          </Text>
        </View>

        {/* Amount Info */}
        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
          <View>
            <Text style={{ fontSize: 11, fontFamily: fonts.body, color: theme.textSecondary, marginBottom: 3 }}>Saved</Text>
            <CurrencyText
              amount={goal.current_amount}
              style={{ fontSize: 20, color: isCompleted ? theme.income : color, fontFamily: fonts.heading }}
            />
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 11, fontFamily: fonts.body, color: theme.textSecondary, marginBottom: 3 }}>Target</Text>
            <CurrencyText
              amount={goal.target_amount}
              style={{ fontSize: 16, color: theme.textPrimary, fontFamily: fonts.semibold }}
            />
          </View>
        </View>

        {/* Smart Suggestion */}
        {!isCompleted && suggestion && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: theme.surfaceBg, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 14 }}>
            <Lightbulb size={14} color={theme.warning} />
            <Text style={{ flex: 1, fontSize: 12, fontFamily: fonts.medium, color: theme.textSecondary }}>
              {suggestion}
            </Text>
          </View>
        )}

        {/* Deadline passed warning */}
        {!isCompleted && days !== null && days <= 0 && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: theme.expenseTint, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 14 }}>
            <Text style={{ fontSize: 12, fontFamily: fonts.medium, color: theme.expense }}>
              Deadline passed — {Math.abs(days)} days ago
            </Text>
          </View>
        )}

        {/* Contribute Button */}
        {!isCompleted && (
          <Pressable onPress={onContribute} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              backgroundColor: color,
              paddingVertical: 14,
              borderRadius: 14,
            }}>
              <Sparkles size={16} color={theme.textOnAccent} />
              <Text style={{ color: theme.textOnAccent, fontFamily: fonts.heading, fontSize: 15 }}>Contribute</Text>
            </View>
          </Pressable>
        )}

        {/* Completed celebration */}
        {isCompleted && (
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            backgroundColor: theme.income + '15',
            paddingVertical: 14,
            borderRadius: 14,
          }}>
            <Trophy size={16} color={theme.income} />
            <Text style={{ color: theme.income, fontFamily: fonts.heading, fontSize: 15 }}>Goal Achieved!</Text>
          </View>
        )}
      </View>
    </Card>
  );
}
