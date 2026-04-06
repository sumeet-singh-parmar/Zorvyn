import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Briefcase, DollarSign, CreditCard, CircleCheck } from 'lucide-react-native';
import { Modal } from '@components/ui/modal';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';
import type { Account } from '@core/models';

interface AccountPickerProps {
  visible: boolean;
  onClose: () => void;
  accounts: Account[];
  selected: string | null;
  onSelect: (accountId: string) => void;
}

const accountTypeIcons: Record<string, React.ComponentType<any>> = {
  bank: Briefcase,
  cash: DollarSign,
  wallet: CreditCard,
  credit_card: CreditCard,
};

export function AccountPicker({
  visible,
  onClose,
  accounts,
  selected,
  onSelect,
}: AccountPickerProps) {
  const theme = useTheme();

  return (
    <Modal visible={visible} onClose={onClose} title="Select Account">
      <View>
        {accounts.map((item, index) => (
          <React.Fragment key={item.id}>
            <Pressable
              onPress={() => {
                onSelect(item.id);
                onClose();
              }}
              className="flex-row items-center p-4 rounded-lg"
              style={{
                backgroundColor:
                  selected === item.id ? theme.tint : 'transparent',
              }}
            >
              <View
                className="w-11 h-11 rounded-full items-center justify-center mr-4"
                style={{ backgroundColor: (item.color ?? theme.buttonBg) + '20' }}
              >
                {React.createElement(
                  accountTypeIcons[item.type] ?? CreditCard,
                  {
                    size: 20,
                    color: item.color ?? theme.buttonBg,
                  }
                )}
              </View>
              <View className="flex-1">
                <Text
                  style={{ fontSize: 16, color: theme.textPrimary, fontFamily: fonts.semibold }}
                >
                  {item.name}
                </Text>
                <Text
                  style={{ fontSize: 12, color: theme.textSecondary, fontFamily: fonts.body, textTransform: 'capitalize' }}
                >
                  {item.type.replace('_', ' ')}
                </Text>
              </View>
              {selected === item.id && (
                <CircleCheck size={22} color={theme.buttonBg} />
              )}
            </Pressable>
            {index < accounts.length - 1 && (
              <View
                className="h-px mx-4"
                style={{ backgroundColor: theme.border }}
              />
            )}
          </React.Fragment>
        ))}
      </View>
    </Modal>
  );
}
