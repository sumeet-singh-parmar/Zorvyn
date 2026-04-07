import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Pencil, Trash2, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';

interface AccountActionSheetProps {
  isDefault: boolean;
  canDelete: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * Action sheet content rendered when a user taps an account card.
 * Offers Edit (always) and Delete (only when not default and >1 account exists).
 */
export function AccountActionSheet({ isDefault, canDelete, onEdit, onDelete }: AccountActionSheetProps) {
  const theme = useTheme();

  return (
    <View style={{ gap: 4 }}>
      {/* Edit */}
      <Pressable onPress={onEdit} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, gap: 14 }}>
          <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: theme.tint, alignItems: 'center', justifyContent: 'center' }}>
            <Pencil size={18} color={theme.buttonBg} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontFamily: fonts.semibold, color: theme.textPrimary }}>Edit Account</Text>
            <Text style={{ fontSize: 12, fontFamily: fonts.body, color: theme.textMuted, marginTop: 2 }}>Change name, color, or balance</Text>
          </View>
          <ChevronRight size={18} color={theme.textMuted} />
        </View>
      </Pressable>

      {/* Delete — only when not default and there are other accounts */}
      {canDelete && !isDefault && (
        <Pressable onPress={onDelete} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, gap: 14, borderTopWidth: 1, borderTopColor: theme.border }}>
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: theme.expenseTint, alignItems: 'center', justifyContent: 'center' }}>
              <Trash2 size={18} color={theme.expense} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontFamily: fonts.semibold, color: theme.expense }}>Delete Account</Text>
              <Text style={{ fontSize: 12, fontFamily: fonts.body, color: theme.textMuted, marginTop: 2 }}>This cannot be undone</Text>
            </View>
          </View>
        </Pressable>
      )}
    </View>
  );
}
