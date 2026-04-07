import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronDown, Landmark, Banknote, Wallet, CreditCard, Check } from 'lucide-react-native';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';
import type { Account } from '@core/models';

interface AccountSelectorProps {
  accounts: Account[];
  selected: string;
  onSelect: (id: string) => void;
  label?: string;
}

const ICONS: Record<string, React.ComponentType<any>> = {
  bank: Landmark,
  cash: Banknote,
  wallet: Wallet,
  credit_card: CreditCard,
};

export function AccountSelector({ accounts, selected, onSelect, label }: AccountSelectorProps) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const selectedAccount = accounts.find((a) => a.id === selected);
  const SelectedIcon = ICONS[selectedAccount?.type ?? 'bank'] ?? CreditCard;

  return (
    <View>
      {label && (
        <Text style={{ fontSize: 13, fontFamily: fonts.heading, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
          {label}
        </Text>
      )}

      {/* Tap target */}
      <Pressable onPress={() => setExpanded(!expanded)} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: expanded ? theme.tint : theme.surfaceBg,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: expanded ? theme.buttonBg : theme.border,
          paddingHorizontal: 16,
          paddingVertical: 16,
        }}>
          <View style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            backgroundColor: selectedAccount?.color ? selectedAccount.color + '20' : theme.elevatedBg,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <SelectedIcon size={16} color={selectedAccount?.color ?? theme.textMuted} />
          </View>
          <Text style={{ flex: 1, marginLeft: 12, fontSize: 15, fontFamily: fonts.semibold, color: expanded ? theme.buttonBg : theme.textPrimary }}>
            {selectedAccount?.name ?? 'Select Account'}
          </Text>
          <ChevronDown
            size={18}
            color={expanded ? theme.buttonBg : theme.textMuted}
            style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}
          />
        </View>
      </Pressable>

      {/* Expanded list */}
      {expanded && (
        <View style={{
          backgroundColor: theme.surfaceBg,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: theme.border,
          marginTop: 8,
          overflow: 'hidden',
        }}>
          {accounts.map((acc, i) => {
            const isSelected = acc.id === selected;
            const IconComp = ICONS[acc.type] ?? CreditCard;
            return (
              <Pressable
                key={acc.id}
                onPress={() => { onSelect(acc.id); setExpanded(false); }}
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              >
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  backgroundColor: isSelected ? theme.tint : 'transparent',
                  borderTopWidth: i > 0 ? 1 : 0,
                  borderTopColor: theme.border,
                }}>
                  <View style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    backgroundColor: acc.color ? acc.color + '20' : theme.elevatedBg,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}>
                    <IconComp size={16} color={acc.color ?? theme.textMuted} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontFamily: fonts.semibold, color: theme.textPrimary }}>
                      {acc.name}
                    </Text>
                    <Text style={{ fontSize: 12, fontFamily: fonts.body, color: theme.textMuted, textTransform: 'capitalize', marginTop: 2 }}>
                      {acc.type.replace('_', ' ')}
                    </Text>
                  </View>
                  {isSelected && <Check size={18} color={theme.buttonBg} strokeWidth={2.5} />}
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}
