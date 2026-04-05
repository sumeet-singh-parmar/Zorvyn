import React from 'react';
import { ScrollView } from 'react-native';
import { FilterChip } from '@components/ui/filter-chip';
import { startOfWeek, startOfMonth, startOfDay, endOfDay } from '@core/utils/date';

interface DateRangePickerProps {
  selectedPreset: string | null;
  onSelect: (preset: string, range: { start: string; end: string }) => void;
  onClear: () => void;
}

const presets = [
  { label: 'All Time', key: 'all' },
  { label: 'Today', key: 'today' },
  { label: 'This Week', key: 'week' },
  { label: 'This Month', key: 'month' },
  { label: 'This Year', key: 'year' },
];

function getRangeForPreset(key: string): { start: string; end: string } {
  const now = new Date();
  switch (key) {
    case 'all':
      return { start: '1970-01-01T00:00:00Z', end: endOfDay(now) };
    case 'today':
      return { start: startOfDay(now), end: endOfDay(now) };
    case 'week':
      return { start: startOfWeek(now), end: endOfDay(now) };
    case 'month':
      return { start: startOfMonth(now), end: endOfDay(now) };
    case 'year':
      return {
        start: new Date(now.getFullYear(), 0, 1).toISOString(),
        end: endOfDay(now),
      };
    default:
      return { start: startOfMonth(now), end: endOfDay(now) };
  }
}

export function DateRangePicker({
  selectedPreset,
  onSelect,
  onClear,
}: DateRangePickerProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="py-3 px-1"
    >
      {presets.map((preset) => (
        <FilterChip
          key={preset.key}
          label={preset.label}
          selected={selectedPreset === preset.key}
          onPress={() => onSelect(preset.key, getRangeForPreset(preset.key))}
          onClear={selectedPreset === preset.key ? onClear : undefined}
          icon="calendar"
        />
      ))}
    </ScrollView>
  );
}
