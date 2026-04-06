import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Modal } from '@components/ui/modal';
import { CurrencyPicker } from '@features/onboarding/components/currency-picker';
import { useCurrencyStore } from '@stores/currency-store';
import { getCurrencyInfo } from '@core/currency';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';

export function CurrencySelector() {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const currencyCode = useCurrencyStore((s) => s.currencyCode);
  const setCurrencyCode = useCurrencyStore((s) => s.setCurrencyCode);
  const info = getCurrencyInfo(currencyCode ?? 'INR');

  return (
    <>
      <Pressable onPress={() => setVisible(true)} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: theme.tint, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <Text style={{ fontSize: 20, fontFamily: fonts.semibold, color: theme.buttonBg }}>
                {info.symbol}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontFamily: fonts.semibold, color: theme.textPrimary }}>
                {info.code}
              </Text>
              <Text style={{ fontSize: 13, fontFamily: fonts.body, color: theme.textSecondary, marginTop: 2 }}>
                {info.name}
              </Text>
            </View>
          </View>
          <ChevronRight size={18} color={theme.textMuted} />
        </View>
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
