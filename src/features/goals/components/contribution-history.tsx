import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useDatabase } from '@core/providers/database-provider';
import { GoalContributionRepository } from '@core/repositories/goal-contribution-repository';
import { CurrencyText } from '@components/shared/currency-text';
import { Plus } from 'lucide-react-native';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';

interface ContributionHistoryProps {
  goalId: string;
  goalColor: string;
}

export function ContributionHistory({ goalId, goalColor }: ContributionHistoryProps) {
  const theme = useTheme();
  const db = useDatabase();
  const repo = useMemo(() => new GoalContributionRepository(db), [db]);

  const { data, isLoading } = useQuery({
    queryKey: ['goal-contributions', goalId],
    queryFn: () => repo.getByGoal(goalId),
  });

  if (isLoading) {
    return (
      <View style={{ paddingVertical: 40, alignItems: 'center' }}>
        <ActivityIndicator color={theme.buttonBg} />
      </View>
    );
  }

  const contributions = data ?? [];

  if (contributions.length === 0) {
    return (
      <View style={{ paddingVertical: 40, alignItems: 'center' }}>
        <Text style={{ fontSize: 15, fontFamily: fonts.medium, color: theme.textMuted }}>
          No contributions yet
        </Text>
        <Text style={{ fontSize: 13, fontFamily: fonts.body, color: theme.textMuted, marginTop: 4 }}>
          Tap "Contribute" to add your first one
        </Text>
      </View>
    );
  }

  let runningTotal = 0;

  return (
    <View style={{ gap: 2 }}>
      {contributions.map((c, i) => {
        runningTotal += c.amount;
        const date = new Date(c.created_at);
        const dateStr = date.toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' });
        const timeStr = date.toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit' });

        return (
          <View
            key={c.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 14,
              borderTopWidth: i > 0 ? 1 : 0,
              borderTopColor: theme.border,
            }}
          >
            {/* Icon */}
            <View style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: goalColor + '15',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}>
              <Plus size={16} color={goalColor} />
            </View>

            {/* Date + notes */}
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: theme.textPrimary }}>
                {dateStr}
              </Text>
              <Text style={{ fontSize: 12, fontFamily: fonts.body, color: theme.textMuted, marginTop: 2 }}>
                {c.notes || timeStr}
              </Text>
            </View>

            {/* Amount */}
            <View style={{ alignItems: 'flex-end' }}>
              <CurrencyText
                amount={c.amount}
                style={{ fontSize: 15, fontFamily: fonts.heading, color: theme.income }}
              />
            </View>
          </View>
        );
      })}

      {/* Total */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 14,
        marginTop: 4,
        borderTopWidth: 1,
        borderTopColor: theme.border,
      }}>
        <Text style={{ fontSize: 14, fontFamily: fonts.heading, color: theme.textSecondary }}>
          Total ({contributions.length} contributions)
        </Text>
        <CurrencyText
          amount={runningTotal}
          style={{ fontSize: 16, fontFamily: fonts.black, color: theme.income }}
        />
      </View>
    </View>
  );
}
