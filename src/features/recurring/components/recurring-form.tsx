import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, Pressable, TextInput, Switch } from 'react-native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useIsInBottomSheet } from '@components/shared/global-sheet';
import { Plus, Repeat } from 'lucide-react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { FloppyDiskIcon } from '@hugeicons/core-free-icons';
import { DateTimeInput } from '@components/shared/date-time-input';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDatabase } from '@core/providers/database-provider';
import { CategoryRepository } from '@core/repositories/category-repository';
import { AccountRepository } from '@core/repositories/account-repository';
import { queryKeys } from '@core/constants/query-keys';
import { generateUUID } from '@core/utils/uuid';
import { CategoryPicker } from '@features/transactions/components/category-picker';
import { SegmentedControl } from '@components/ui/segmented-control';
import { AccountSelector } from '@components/shared/account-selector';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';
import { useCurrencyStore } from '@stores/currency-store';
import { getCurrencyInfo } from '@core/currency/currency-service';
import type { RecurringFrequency, RecurringRule } from '../types';
import type { Category, Account } from '@core/models';

interface RecurringFormProps {
  onSuccess: () => void;
  editItem?: RecurringRule;
}

const FREQUENCIES: { key: RecurringFrequency; label: string }[] = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'yearly', label: 'Yearly' },
];


export function RecurringForm({ onSuccess, editItem }: RecurringFormProps) {
  const theme = useTheme();
  const db = useDatabase();
  const queryClient = useQueryClient();
  const isEdit = !!editItem;

  const categoryRepo = useMemo(() => new CategoryRepository(db), [db]);
  const accountRepo = useMemo(() => new AccountRepository(db), [db]);

  const categoriesQuery = useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => categoryRepo.getAll(),
  });

  const accountsQuery = useQuery({
    queryKey: queryKeys.accounts.all,
    queryFn: () => accountRepo.getAll(),
  });

  const [type, setType] = useState<'expense' | 'income'>(editItem?.type ?? 'expense');
  const [amount, setAmount] = useState(editItem?.amount?.toString() ?? '');
  const [notes, setNotes] = useState(editItem?.notes ?? '');
  const [frequency, setFrequency] = useState<RecurringFrequency>(editItem?.frequency ?? 'monthly');
  const [categoryId, setCategoryId] = useState(editItem?.category_id ?? '');
  const [accountId, setAccountId] = useState(editItem?.account_id ?? '');
  const [nextDueDate, setNextDueDate] = useState<Date>(editItem?.next_due_date ? new Date(editItem.next_due_date) : new Date());
  const [endDate, setEndDate] = useState<Date | null>(editItem?.end_date ? new Date(editItem.end_date) : null);
  const [isActive, setIsActive] = useState(editItem?.is_active !== 0);
  const [error, setError] = useState('');
  const currencySymbol = getCurrencyInfo(useCurrencyStore.getState().currencyCode).symbol;
  const isSheet = useIsInBottomSheet();
  const InputComponent = isSheet ? BottomSheetTextInput : TextInput;

  const filteredCategories = useMemo(() => {
    if (!categoriesQuery.data) return [];
    return categoriesQuery.data.filter(c => c.type === type || c.type === 'both');
  }, [categoriesQuery.data, type]);

  const accounts = accountsQuery.data ?? [];

  // Auto-select default account
  useEffect(() => {
    if (!accountId && accounts.length > 0) {
      const defaultAcc = accounts.find((a) => a.is_default) ?? accounts[0];
      setAccountId(defaultAcc.id);
    }
  }, [accounts, accountId]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const parsedAmount = parseFloat(amount);
      if (!parsedAmount || parsedAmount <= 0) throw new Error('Enter a valid amount');
      if (!categoryId) throw new Error('Select a category');
      if (!accountId) throw new Error('Select an account');

      const now = new Date().toISOString();

      if (isEdit && editItem) {
        await db.runAsync(
          `UPDATE recurring_rules SET amount = ?, type = ?, category_id = ?, account_id = ?, frequency = ?, next_due_date = ?, end_date = ?, notes = ?, is_active = ?, updated_at = ? WHERE id = ?`,
          [parsedAmount, type, categoryId, accountId || null, frequency, nextDueDate.toISOString(), endDate?.toISOString() || null, notes.trim() || null, isActive ? 1 : 0, now, editItem.id]
        );
      } else {
        await db.runAsync(
          `INSERT INTO recurring_rules (id, amount, type, category_id, account_id, currency_code, frequency, interval_count, next_due_date, end_date, notes, is_active, created_at, updated_at, sync_status)
           VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, 'synced')`,
          [generateUUID(), parsedAmount, type, categoryId, accountId || null, useCurrencyStore.getState().currencyCode, frequency, nextDueDate.toISOString(), endDate?.toISOString() || null, notes.trim() || null, isActive ? 1 : 0, now, now]
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring'] });
      onSuccess();
    },
  });

  const handleSave = async () => {
    setError('');
    try {
      await saveMutation.mutateAsync();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save');
    }
  };

  return (
    <View style={{ gap: 22 }}>
      {/* Type Toggle */}
      <SegmentedControl
        options={['Expense', 'Income']}
        selected={type === 'expense' ? 'Expense' : 'Income'}
        onSelect={(val) => setType(val.toLowerCase() as 'expense' | 'income')}
      />

      {/* Amount */}
      <View>
        <Text style={{ fontSize: 13, fontFamily: fonts.heading, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Amount</Text>
        <View style={{ backgroundColor: theme.surfaceBg, borderRadius: 14, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontFamily: fonts.heading, color: theme.textMuted, marginRight: 8 }}>{currencySymbol}</Text>
          <InputComponent
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            placeholderTextColor={theme.textMuted}
            keyboardType="decimal-pad"
            style={{ flex: 1, fontSize: 18, fontFamily: fonts.heading, color: theme.textPrimary }}
          />
        </View>
      </View>

      {/* Name/Notes */}
      <View>
        <Text style={{ fontSize: 13, fontFamily: fonts.heading, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Name</Text>
        <View style={{ backgroundColor: theme.surfaceBg, borderRadius: 14, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 16, paddingVertical: 14 }}>
          <InputComponent
            value={notes}
            onChangeText={setNotes}
            placeholder="e.g. Netflix, Rent, Gym"
            placeholderTextColor={theme.textMuted}
            style={{ fontSize: 16, fontFamily: fonts.medium, color: theme.textPrimary }}
          />
        </View>
      </View>

      {/* Frequency */}
      <View>
        <Text style={{ fontSize: 13, fontFamily: fonts.heading, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Frequency</Text>
        <SegmentedControl
          options={FREQUENCIES.map((f) => f.label)}
          selected={FREQUENCIES.find((f) => f.key === frequency)?.label ?? 'Monthly'}
          onSelect={(val) => {
            const found = FREQUENCIES.find((f) => f.label === val);
            if (found) setFrequency(found.key);
          }}
        />
      </View>

      {/* Category */}
      {filteredCategories.length > 0 && (
        <View>
          <Text style={{ fontSize: 13, fontFamily: fonts.heading, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Category</Text>
          <CategoryPicker categories={filteredCategories} selected={categoryId} onSelect={setCategoryId} />
        </View>
      )}

      {/* Account */}
      {accounts.length > 0 && (
        <AccountSelector
          accounts={accounts}
          selected={accountId}
          onSelect={setAccountId}
          label="Account"
        />
      )}

      {/* Dates */}
      <DateTimeInput
        value={nextDueDate}
        onChange={setNextDueDate}
        mode="date"
        label="Next Due Date"
      />
      <DateTimeInput
        value={endDate ?? new Date(new Date().getFullYear() + 1, 0, 1)}
        onChange={(d) => setEndDate(d)}
        mode="date"
        label="End Date (optional)"
      />

      {/* Active Toggle */}
      <Pressable onPress={() => setIsActive(!isActive)} style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.surfaceBg,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: theme.border,
          paddingHorizontal: 16,
          paddingVertical: 14,
        }}>
          <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: isActive ? theme.tint : theme.elevatedBg, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
            <Repeat size={18} color={isActive ? theme.buttonBg : theme.textMuted} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontFamily: fonts.semibold, color: theme.textPrimary }}>Active</Text>
            <Text style={{ fontSize: 12, fontFamily: fonts.body, color: theme.textMuted, marginTop: 2 }}>
              {isActive ? 'This charge is active and will recur' : 'Paused -- will not generate transactions'}
            </Text>
          </View>
          <Switch
            value={isActive}
            onValueChange={setIsActive}
            trackColor={{ false: theme.border, true: theme.buttonBg }}
            thumbColor={theme.textOnAccent}
          />
        </View>
      </Pressable>

      {/* Error */}
      {error ? <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: theme.expense, textAlign: 'center' }}>{error}</Text> : null}

      {/* Save Button */}
      <View style={{ borderRadius: 50, overflow: 'hidden', backgroundColor: theme.buttonBg }}>
        <Pressable onPress={handleSave} style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] })}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 8 }}>
            {saveMutation.isPending ? (
              <Text style={{ fontFamily: fonts.black, fontSize: 16, color: theme.textOnAccent }}>Saving...</Text>
            ) : (
              <>
                {isEdit ? <HugeiconsIcon icon={FloppyDiskIcon} size={18} color={theme.textOnAccent} strokeWidth={3} /> : <Plus size={18} color={theme.textOnAccent} strokeWidth={2.5} />}
                <Text style={{ fontFamily: fonts.black, fontSize: 16, color: theme.textOnAccent }}>
                  {isEdit ? 'Save Changes' : 'Add Recurring'}
                </Text>
              </>
            )}
          </View>
        </Pressable>
      </View>
    </View>
  );
}
