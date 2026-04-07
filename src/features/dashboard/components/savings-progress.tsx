import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { ProgressBar } from '@components/ui/progress-bar';
import { formatCompactCurrency } from '@core/currency';
import { Target, Plus, ChevronRight, Trophy } from 'lucide-react-native';
import { shadows } from '@theme/shadows';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';
import type { Goal } from '@core/models';

function getMotivationShort(pct: number): string {
  if (pct >= 100) return '🎉 Achieved!';
  if (pct >= 75) return '🔥 Almost there!';
  if (pct >= 50) return '💪 Halfway!';
  if (pct >= 25) return '📈 Progress!';
  if (pct > 0) return '🌱 Started!';
  return '✨ Get started!';
}

interface SavingsProgressProps {
  goals: Goal[];
  onPress: (id: string) => void;
  onAddGoal?: () => void;
  onSeeAll?: () => void;
}

export function SavingsProgress({ goals, onPress, onAddGoal, onSeeAll }: SavingsProgressProps) {
  const theme = useTheme();

  if (goals.length === 0) {
    return (
      <View style={{
        backgroundColor: theme.tint,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.ring,
        padding: 24,
        alignItems: 'center',
      }}>
        <View style={{
          width: 56,
          height: 56,
          borderRadius: 18,
          backgroundColor: theme.buttonBg + '20',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 14,
        }}>
          <Target size={28} color={theme.buttonBg} />
        </View>
        <Text style={{ fontSize: 16, fontFamily: fonts.heading, color: theme.textPrimary, marginBottom: 6 }}>
          No savings goals yet
        </Text>
        <Text style={{ fontSize: 13, fontFamily: fonts.body, color: theme.textSecondary, textAlign: 'center', marginBottom: 18, lineHeight: 18 }}>
          Set a goal and track your progress as you save towards it
        </Text>
        {onAddGoal && (
          <Pressable onPress={onAddGoal} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              backgroundColor: theme.buttonBg,
              paddingVertical: 14,
              paddingHorizontal: 28,
              borderRadius: 50,
            }}>
              <Plus size={18} color={theme.textOnAccent} strokeWidth={2.5} />
              <Text style={{ fontSize: 15, fontFamily: fonts.heading, color: theme.textOnAccent }}>
                Create Your First Goal
              </Text>
            </View>
          </Pressable>
        )}
      </View>
    );
  }

  return (
    <View>
      {/* Header with See All */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <Text style={{ fontSize: 16, fontFamily: fonts.heading, color: theme.textPrimary }}>
          Savings Goals
        </Text>
        {onSeeAll && (
          <Pressable onPress={onSeeAll} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={{ fontSize: 13, fontFamily: fonts.semibold, color: theme.buttonBg }}>See All</Text>
              <ChevronRight size={14} color={theme.buttonBg} />
            </View>
          </Pressable>
        )}
      </View>

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
          const isCompleted = progress >= 1;

          return (
            <Pressable
              key={goal.id}
              onPress={() => onPress(goal.id)}
              style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
            >
              <View style={{
                width: 180,
                borderRadius: 20,
                padding: 16,
                marginRight: 12,
                backgroundColor: isCompleted ? theme.incomeTint : theme.cardBg,
                borderWidth: 1,
                borderColor: isCompleted ? theme.income + '30' : theme.border,
                ...shadows.sm,
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <View style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    backgroundColor: (goal.color ?? theme.accent500) + '15',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Target size={16} color={goal.color ?? theme.accent500} />
                  </View>
                  <Text
                    style={{ fontSize: 14, fontFamily: fonts.heading, marginLeft: 10, flex: 1, color: theme.textPrimary }}
                    numberOfLines={1}
                  >
                    {goal.name}
                  </Text>
                </View>

                {/* Progress */}
                <View style={{ marginBottom: 10 }}>
                  <ProgressBar
                    progress={progress}
                    height={6}
                    color={isCompleted ? theme.income : (goal.color ?? theme.accent500)}
                  />
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{
                    fontSize: 15,
                    fontFamily: fonts.black,
                    color: isCompleted ? theme.income : (goal.color ?? theme.accent500),
                  }}>
                    {progressPercentage}%
                  </Text>
                  <Text style={{ fontSize: 11, fontFamily: fonts.body, color: theme.textMuted }}>
                    {formatCompactCurrency(goal.current_amount, goal.currency_code)} / {formatCompactCurrency(goal.target_amount, goal.currency_code)}
                  </Text>
                </View>

                {/* Motivation */}
                <Text style={{ fontSize: 11, fontFamily: fonts.semibold, color: isCompleted ? theme.income : (goal.color ?? theme.accent500), marginTop: 8 }}>
                  {getMotivationShort(progressPercentage)}
                </Text>
              </View>
            </Pressable>
          );
        })}

        {/* Add Goal card at the end */}
        {onAddGoal && (
          <Pressable onPress={onAddGoal} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
            <View style={{
              width: 100,
              borderRadius: 20,
              padding: 16,
              backgroundColor: 'transparent',
              borderWidth: 1.5,
              borderColor: theme.border,
              borderStyle: 'dashed',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 120,
            }}>
              <View style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: theme.tint,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 8,
              }}>
                <Plus size={18} color={theme.buttonBg} />
              </View>
              <Text style={{ fontSize: 12, fontFamily: fonts.semibold, color: theme.buttonBg }}>
                Add Goal
              </Text>
            </View>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}
