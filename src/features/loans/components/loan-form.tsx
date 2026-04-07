import React, { useState } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useIsInBottomSheet } from '@components/shared/global-sheet';
import { Plus, User } from 'lucide-react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { FloppyDiskIcon } from '@hugeicons/core-free-icons';
import { DateTimeInput } from '@components/shared/date-time-input';
import { SegmentedControl } from '@components/ui/segmented-control';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDatabase } from '@core/providers/database-provider';
import { generateUUID } from '@core/utils/uuid';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';
import { useCurrencyStore } from '@stores/currency-store';
import { getCurrencyInfo } from '@core/currency/currency-service';
import type { Loan, LoanType } from '../types';

interface LoanFormProps {
  onSuccess: () => void;
  editLoan?: Loan;
}

export function LoanForm({ onSuccess, editLoan }: LoanFormProps) {
  const theme = useTheme();
  const db = useDatabase();
  const queryClient = useQueryClient();
  const isEdit = !!editLoan;

  const [type, setType] = useState<LoanType>(editLoan?.type ?? 'lending');
  const [personName, setPersonName] = useState(editLoan?.person_name ?? '');
  const [amount, setAmount] = useState(editLoan?.amount?.toString() ?? '');
  const [date, setDate] = useState<Date>(editLoan?.date ? new Date(editLoan.date) : new Date());
  const [dueDate, setDueDate] = useState<Date | null>(editLoan?.due_date ? new Date(editLoan.due_date) : null);
  const [notes, setNotes] = useState(editLoan?.notes ?? '');
  const [error, setError] = useState('');
  const currencySymbol = getCurrencyInfo(useCurrencyStore.getState().currencyCode).symbol;
  const isSheet = useIsInBottomSheet();
  const InputComponent = isSheet ? BottomSheetTextInput : TextInput;

  const isLending = type === 'lending';
  const typeColor = isLending ? theme.income : theme.expense;

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!personName.trim()) throw new Error('Enter the person\'s name');
      const parsedAmount = parseFloat(amount);
      if (!parsedAmount || parsedAmount <= 0) throw new Error('Enter a valid amount');

      const now = new Date().toISOString();

      if (isEdit && editLoan) {
        await db.runAsync(
          `UPDATE loans SET person_name = ?, amount = ?, type = ?, date = ?, due_date = ?, notes = ?, updated_at = ? WHERE id = ?`,
          [personName.trim(), parsedAmount, type, date.toISOString(), dueDate?.toISOString() || null, notes.trim() || null, now, editLoan.id]
        );
      } else {
        await db.runAsync(
          `INSERT INTO loans (id, person_name, amount, type, date, due_date, notes, status, created_at, updated_at, sync_status)
           VALUES (?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, 'synced')`,
          [generateUUID(), personName.trim(), parsedAmount, type, date.toISOString(), dueDate?.toISOString() || null, notes.trim() || null, now, now]
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
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
    <View style={{ gap: 20 }}>
        {/* Type Toggle */}
        <SegmentedControl
          options={['I Lent', 'I Borrowed']}
          selected={isLending ? 'I Lent' : 'I Borrowed'}
          onSelect={(val) => setType(val === 'I Lent' ? 'lending' : 'borrowing')}
        />

        {/* Person Name */}
        <View>
          <Text style={{ fontSize: 13, fontFamily: fonts.heading, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
            {isLending ? 'Lent To' : 'Borrowed From'}
          </Text>
          <View style={{ backgroundColor: theme.surfaceBg, borderRadius: 14, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center' }}>
            <User size={16} color={theme.textMuted} style={{ marginRight: 10 }} />
            <InputComponent
              value={personName}
              onChangeText={setPersonName}
              placeholder="Person's name"
              placeholderTextColor={theme.textMuted}
              style={{ flex: 1, fontSize: 15, fontFamily: fonts.medium, color: theme.textPrimary }}
            />
          </View>
        </View>

        {/* Amount */}
        <View>
          <Text style={{ fontSize: 13, fontFamily: fonts.heading, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
            Amount
          </Text>
          <View style={{ backgroundColor: theme.surfaceBg, borderRadius: 14, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontFamily: fonts.heading, color: theme.textMuted, marginRight: 8 }}>{currencySymbol}</Text>
            <InputComponent
              value={amount}
              onChangeText={setAmount}
              placeholder="0"
              placeholderTextColor={theme.textMuted}
              keyboardType="decimal-pad"
              style={{ flex: 1, fontSize: 16, fontFamily: fonts.heading, color: theme.textPrimary }}
            />
          </View>
        </View>

        {/* Dates — stacked, not side by side */}
        <DateTimeInput
          value={date}
          onChange={setDate}
          mode="date"
          label={isLending ? 'Date Lent' : 'Date Borrowed'}
        />
        <DateTimeInput
          value={dueDate ?? new Date(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())}
          onChange={(d) => setDueDate(d)}
          mode="date"
          label="Due Date (optional)"
        />

        {/* Notes */}
        <View>
          <Text style={{ fontSize: 13, fontFamily: fonts.heading, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
            Notes (optional)
          </Text>
          <View style={{ backgroundColor: theme.surfaceBg, borderRadius: 14, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 16, paddingVertical: 14 }}>
            <InputComponent
              value={notes}
              onChangeText={setNotes}
              placeholder="e.g. For dinner, rent help..."
              placeholderTextColor={theme.textMuted}
              multiline
              style={{ fontSize: 15, fontFamily: fonts.medium, color: theme.textPrimary, minHeight: 48, textAlignVertical: 'top' }}
            />
          </View>
        </View>

        {/* Error */}
        {error ? (
          <View style={{ backgroundColor: theme.expenseTint, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12 }}>
            <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: theme.expense, textAlign: 'center' }}>{error}</Text>
          </View>
        ) : null}

        {/* Save Button */}
        <View style={{ borderRadius: 50, overflow: 'hidden', backgroundColor: typeColor }}>
          <Pressable onPress={handleSave} style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 10 }}>
              {saveMutation.isPending ? (
                <Text style={{ fontFamily: fonts.black, fontSize: 16, color: theme.textOnAccent }}>Saving...</Text>
              ) : (
                <>
                  {isEdit ? <HugeiconsIcon icon={FloppyDiskIcon} size={18} color={theme.textOnAccent} strokeWidth={3} /> : <Plus size={18} color={theme.textOnAccent} strokeWidth={2.5} />}
                  <Text style={{ fontFamily: fonts.black, fontSize: 16, color: theme.textOnAccent }}>
                    {isEdit ? 'Save Changes' : isLending ? 'Record Lending' : 'Record Borrowing'}
                  </Text>
                </>
              )}
            </View>
          </Pressable>
        </View>
      </View>
  );
}
