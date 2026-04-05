import React, { useState } from 'react';
import { Pressable, Text, View, ActivityIndicator } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Modal } from '@components/ui/modal';
import { CurrencyPicker } from '@features/onboarding/components/currency-picker';
import { useCurrencyStore } from '@stores/currency-store';
import { getCurrencyInfo } from '@core/currency';

export function CurrencySelector() {
  const [visible, setVisible] = useState(false);
  const currencyCode = useCurrencyStore((s) => s.currencyCode);
  const setCurrencyCode = useCurrencyStore((s) => s.setCurrencyCode);
  const info = getCurrencyInfo(currencyCode ?? 'INR');

  return (
    <>
      <Pressable
        onPress={() => setVisible(true)}
        className="flex-row items-center justify-between py-4 px-1 active:bg-gray-50 dark:active:bg-gray-800 rounded-lg"
      >
        <View className="flex-row items-center flex-1">
          <View className="w-12 h-12 rounded-lg bg-accent-100 dark:bg-accent-900/30 items-center justify-center mr-3">
            <Text className="text-xl font-semibold text-accent-600 dark:text-accent-400">
              {info.symbol}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-gray-900 dark:text-gray-200">
              {info.code}
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400">{info.name}</Text>
          </View>
        </View>
        <ChevronRight size={20} color="#9CA3AF" />
      </Pressable>

      <Modal visible={visible} onClose={() => setVisible(false)} title="Select Currency">
        <CurrencyPicker
          selected={currencyCode}
          onSelect={(code) => {
            setCurrencyCode(code);
            setVisible(false);
          }}
        />
      </Modal>
    </>
  );
}
