import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { DateTimeInput } from '@components/shared/date-time-input';
import { AccountSelector } from '@components/shared/account-selector';
import { CategoryPicker } from './category-picker';
import { useFiltersStore } from '@stores/filters-store';
import { useDatabase } from '@core/providers/database-provider';
import { AccountRepository } from '@core/repositories/account-repository';
import { CategoryRepository } from '@core/repositories/category-repository';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@core/constants/query-keys';
import { RotateCcw } from 'lucide-react-native';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';

interface TransactionFilterSheetProps {
  onClose: () => void;
}

export function TransactionFilterSheet({ onClose }: TransactionFilterSheetProps) {
  const theme = useTheme();
  const db = useDatabase();
  const accountRepo = useMemo(() => new AccountRepository(db), [db]);
  const categoryRepo = useMemo(() => new CategoryRepository(db), [db]);

  const {
    dateRange,
    selectedAccountId,
    selectedCategoryId,
    setDateRange,
    setSelectedAccountId,
    setSelectedCategoryId,
    resetFilters,
  } = useFiltersStore();

  const accountsQuery = useQuery({
    queryKey: queryKeys.accounts.all,
    queryFn: () => accountRepo.getAll(),
  });

  const categoriesQuery = useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => categoryRepo.getAll(),
  });

  const accounts = accountsQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];

  // Local state for date pickers
  const [fromDate, setFromDate] = useState<Date | null>(dateRange ? new Date(dateRange.start) : null);
  const [toDate, setToDate] = useState<Date | null>(dateRange ? new Date(dateRange.end) : null);

  // Sync date changes to store
  useEffect(() => {
    if (fromDate && toDate) {
      setDateRange({ start: fromDate.toISOString(), end: toDate.toISOString() });
    } else {
      setDateRange(null);
    }
  }, [fromDate, toDate]);

  const activeCount = [dateRange, selectedAccountId, selectedCategoryId].filter(Boolean).length;

  const handleReset = () => {
    setFromDate(null);
    setToDate(null);
    resetFilters();
  };

  return (
    <View style={{ gap: 20 }}>
      {/* Active count + Reset */}
      {activeCount > 0 && (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: theme.textMuted }}>
            {activeCount} filter{activeCount > 1 ? 's' : ''} active
          </Text>
          <Pressable onPress={handleReset} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <RotateCcw size={14} color={theme.expense} />
              <Text style={{ fontSize: 13, fontFamily: fonts.semibold, color: theme.expense }}>Reset All</Text>
            </View>
          </Pressable>
        </View>
      )}

      {/* Date Range */}
      <View>
        <Text style={{ fontSize: 14, fontFamily: fonts.heading, color: theme.textPrimary, marginBottom: 12 }}>
          Date Range
        </Text>
        <View style={{ gap: 10 }}>
          <DateTimeInput
            value={fromDate ?? new Date(new Date().getFullYear(), new Date().getMonth(), 1)}
            onChange={setFromDate}
            mode="date"
            label="From"
          />
          <DateTimeInput
            value={toDate ?? new Date()}
            onChange={setToDate}
            mode="date"
            label="To"
          />
        </View>
        {fromDate && (
          <Pressable onPress={() => { setFromDate(null); setToDate(null); }} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1, marginTop: 8 })}>
            <Text style={{ fontSize: 12, fontFamily: fonts.medium, color: theme.textMuted }}>Clear date range</Text>
          </Pressable>
        )}
      </View>

      {/* Account */}
      {accounts.length > 0 && (
        <View>
          <Text style={{ fontSize: 14, fontFamily: fonts.heading, color: theme.textPrimary, marginBottom: 12 }}>
            Account
          </Text>
          <AccountSelector
            accounts={accounts}
            selected={selectedAccountId ?? ''}
            onSelect={(id) => setSelectedAccountId(id === selectedAccountId ? null : id)}
          />
        </View>
      )}

      {/* Category */}
      {categories.length > 0 && (
        <View>
          <Text style={{ fontSize: 14, fontFamily: fonts.heading, color: theme.textPrimary, marginBottom: 12 }}>
            Category
          </Text>
          <CategoryPicker
            categories={categories}
            selected={selectedCategoryId ?? ''}
            onSelect={(id) => setSelectedCategoryId(id === selectedCategoryId ? null : id)}
          />
        </View>
      )}

      {/* Apply Button */}
      <Pressable onPress={onClose} style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>
        <View style={{
          backgroundColor: theme.buttonBg,
          borderRadius: 50,
          paddingVertical: 16,
          alignItems: 'center',
        }}>
          <Text style={{ fontSize: 16, fontFamily: fonts.black, color: theme.textOnAccent }}>
            Apply Filters
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
