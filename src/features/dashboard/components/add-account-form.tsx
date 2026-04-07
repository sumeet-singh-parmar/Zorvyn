import React, { useState } from 'react';
import { View, Text, Pressable, Switch, TextInput } from 'react-native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useIsInBottomSheet } from '@components/shared/global-sheet';
import { Landmark, Banknote, Wallet, CreditCard, Check, Plus, Star } from 'lucide-react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { FloppyDiskIcon } from '@hugeicons/core-free-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDatabase } from '@core/providers/database-provider';
import { queryKeys } from '@core/constants/query-keys';
import { generateUUID } from '@core/utils/uuid';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';
import { useCurrencyStore } from '@stores/currency-store';
import type { Account, AccountType } from '@core/models';

interface AddAccountFormProps {
  onSuccess: () => void;
  editAccount?: Account;
  isOnboarding?: boolean;
}

const ACCOUNT_TYPES: { key: AccountType; label: string; icon: typeof Landmark }[] = [
  { key: 'bank', label: 'Card', icon: CreditCard },
  { key: 'cash', label: 'Cash', icon: Banknote },
  { key: 'wallet', label: 'Wallet', icon: Wallet },
];

const CARD_COLORS = [
  '#314972', '#38512B', '#6B5A3D', '#4A3560',
  '#8B2252', '#2F4F4F', '#4A4A6A', '#6B3A3A',
  '#2D5A4E', '#5C4033', '#3B3B6D', '#704214',
  '#1C3A5F', '#4B6043', '#5B3256', '#3D6B6B',
];

export function AddAccountForm({ onSuccess, editAccount, isOnboarding }: AddAccountFormProps) {
  const theme = useTheme();
  const db = useDatabase();
  const queryClient = useQueryClient();
  const isEdit = !!editAccount;
  const currencyCode = useCurrencyStore((s) => s.currencyCode);
  const isSheet = useIsInBottomSheet();
  const InputComponent = isSheet ? BottomSheetTextInput : TextInput;

  const [type, setType] = useState<AccountType>(editAccount?.type ?? 'bank');
  const [name, setName] = useState(editAccount?.name ?? '');
  const [balance, setBalance] = useState(editAccount?.balance?.toString() ?? '');
  const [selectedColor, setSelectedColor] = useState(editAccount?.color ?? CARD_COLORS[0]);
  const [isDefault, setIsDefault] = useState(editAccount?.is_default === 1 || !!isOnboarding);
  const [error, setError] = useState('');

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!name.trim()) throw new Error('Account name is required');
      const now = new Date().toISOString();
      const parsedBalance = parseFloat(balance) || 0;
      const iconName = type === 'bank' ? 'landmark' : type === 'cash' ? 'banknote' : 'wallet';

      // If setting as default, unset all others first
      if (isDefault) {
        await db.runAsync(`UPDATE accounts SET is_default = 0, updated_at = datetime('now')`);
      }

      if (isEdit && editAccount) {
        // UPDATE existing
        await db.runAsync(
          `UPDATE accounts SET name = ?, type = ?, balance = ?, icon = ?, color = ?, is_default = ?, updated_at = ? WHERE id = ?`,
          [name.trim(), type, parsedBalance, iconName, selectedColor, isDefault ? 1 : 0, now, editAccount.id]
        );
      } else {
        // INSERT new
        await db.runAsync(
          `INSERT INTO accounts (id, name, type, balance, currency_code, icon, color, is_default, sort_order, created_at, updated_at, sync_status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'synced')`,
          [generateUUID(), name.trim(), type, parsedBalance, currencyCode, iconName, selectedColor, isDefault ? 1 : 0, Date.now(), now, now]
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
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
    <View style={{ gap: 24 }}>
      {/* Type Chips */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        {ACCOUNT_TYPES.map((t) => {
          const isActive = type === t.key;
          const IconComp = t.icon;
          return (
            <Pressable key={t.key} onPress={() => setType(t.key)} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1, flex: 1 })}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                paddingVertical: 14,
                paddingHorizontal: 16,
                borderRadius: 50,
                backgroundColor: isActive ? theme.buttonBg : theme.surfaceBg,
                borderWidth: isActive ? 0 : 1,
                borderColor: theme.border,
              }}>
                <IconComp size={17} color={isActive ? theme.textOnAccent : theme.textMuted} />
                <Text style={{ fontFamily: isActive ? fonts.heading : fonts.medium, fontSize: 15, color: isActive ? theme.textOnAccent : theme.textPrimary }}>
                  {t.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Account Name */}
      <View>
        <Text style={{ fontSize: 13, fontFamily: fonts.heading, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
          {type === 'cash' ? 'Name' : type === 'wallet' ? 'Wallet Name' : 'Account Name'}
        </Text>
        <View style={{ backgroundColor: theme.surfaceBg, borderRadius: 14, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 16, paddingVertical: 14 }}>
          <InputComponent
            value={name}
            onChangeText={setName}
            placeholder={type === 'cash' ? 'e.g. My Cash' : type === 'wallet' ? 'e.g. Paytm, GPay' : 'e.g. HDFC Savings'}
            placeholderTextColor={theme.textMuted}
            style={{ fontSize: 16, fontFamily: fonts.medium, color: theme.textPrimary }}
          />
        </View>
      </View>

      {/* Balance */}
      <View>
        <Text style={{ fontSize: 13, fontFamily: fonts.heading, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
          {type === 'cash' ? 'Cash in Hand' : 'Balance'}
        </Text>
        <View style={{ backgroundColor: theme.surfaceBg, borderRadius: 14, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 16, paddingVertical: 14 }}>
          <InputComponent
            value={balance}
            onChangeText={setBalance}
            placeholder="0.00"
            placeholderTextColor={theme.textMuted}
            keyboardType="decimal-pad"
            style={{ fontSize: 16, fontFamily: fonts.medium, color: theme.textPrimary }}
          />
        </View>
      </View>

      {/* Default Toggle */}
      <Pressable onPress={isOnboarding ? undefined : () => setIsDefault(!isDefault)} disabled={isOnboarding} style={({ pressed }) => ({ opacity: pressed && !isOnboarding ? 0.9 : 1 })}>
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
          <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: theme.tint, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
            <Star size={18} color={theme.buttonBg} fill={theme.buttonBg} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontFamily: fonts.semibold, color: theme.textPrimary }}>
              {isOnboarding ? 'Default account' : 'Set as default'}
            </Text>
            <Text style={{ fontSize: 12, fontFamily: fonts.body, color: theme.textMuted, marginTop: 2 }}>
              {isOnboarding
                ? 'This will be your primary account. You can change it later.'
                : isDefault ? 'This will be your primary account' : 'Auto-selected when adding transactions'}
            </Text>
          </View>
          {!isOnboarding && (
            <Switch
              value={isDefault}
              onValueChange={setIsDefault}
              trackColor={{ false: theme.border, true: theme.buttonBg }}
              thumbColor={theme.textOnAccent}
            />
          )}
        </View>
      </Pressable>

      {/* Color Picker */}
      <View>
        <Text style={{ fontSize: 13, fontFamily: fonts.heading, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
          Card Color
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {CARD_COLORS.map((color) => (
            <Pressable key={color} onPress={() => setSelectedColor(color)} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: color,
                borderWidth: selectedColor === color ? 3 : 0,
                borderColor: theme.textPrimary,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {selectedColor === color && <Check size={16} color="#FFFFFF" strokeWidth={3} />}
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Card Preview */}
      <View style={{
        height: 140,
        borderRadius: 16,
        backgroundColor: selectedColor,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        padding: 18,
        justifyContent: 'space-between',
        overflow: 'hidden',
      }}>
        <View style={{ position: 'absolute', top: -15, right: -15, width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(255,255,255,0.08)' }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontSize: 14, fontFamily: fonts.heading, color: 'rgba(255,255,255,0.9)' }}>
              {ACCOUNT_TYPES.find((t) => t.key === type)?.label ?? type}
            </Text>
            <Text style={{ fontSize: 12, fontFamily: fonts.medium, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
              {name || 'Account name'}
            </Text>
          </View>
          {React.createElement(ACCOUNT_TYPES.find((t) => t.key === type)?.icon ?? Wallet, { size: 18, color: 'rgba(255,255,255,0.7)' })}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
          {isDefault && <Star size={12} color="rgba(255,255,255,0.7)" fill="rgba(255,255,255,0.7)" />}
        </View>
      </View>

      {/* Error */}
      {error ? (
        <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: theme.expense, textAlign: 'center' }}>{error}</Text>
      ) : null}

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
                  {isEdit ? 'Save Changes' : 'Add Account'}
                </Text>
              </>
            )}
          </View>
        </Pressable>
      </View>
    </View>
  );
}
