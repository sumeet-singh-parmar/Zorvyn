import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Briefcase, DollarSign, CreditCard, CircleCheck } from 'lucide-react-native';
import { Modal } from '@components/ui/modal';
import type { Account } from '@core/models';

const accent = require('@theme/accent');

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
              className={`flex-row items-center p-4 rounded-lg ${
                selected === item.id
                  ? 'bg-accent-50 dark:bg-accent-900/20'
                  : 'bg-transparent'
              }`}
            >
              <View
                className="w-11 h-11 rounded-full items-center justify-center mr-4"
                style={{ backgroundColor: (item.color ?? accent[500]) + '20' }}
              >
                {React.createElement(
                  accountTypeIcons[item.type] ?? CreditCard,
                  {
                    size: 20,
                    color: item.color ?? accent[500],
                  }
                )}
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900 dark:text-gray-200">
                  {item.name}
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400 capitalize">{item.type.replace('_', ' ')}</Text>
              </View>
              {selected === item.id && (
                <CircleCheck size={22} color={accent[500]} />
              )}
            </Pressable>
            {index < accounts.length - 1 && (
              <View className="h-px bg-gray-200 dark:bg-gray-700 mx-4" />
            )}
          </React.Fragment>
        ))}
      </View>
    </Modal>
  );
}
