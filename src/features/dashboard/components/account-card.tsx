import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Star, Wallet } from 'lucide-react-native';
import { CurrencyText } from '@components/shared/currency-text';
import { fonts } from '@theme/fonts';
import { TYPE_ICONS, TYPE_LABELS } from '../constants';
import type { Account } from '@core/models';

interface AccountCardProps {
  account: Account;
  cardWidth: number;
  color: string;
  onPress: () => void;
}

/**
 * Horizontal-scroll account card showing type, name, balance and default badge.
 * Uses a colored background with decorative circles for a credit-card aesthetic.
 */
export function AccountCard({ account, cardWidth, color, onPress }: AccountCardProps) {
  const IconComp = TYPE_ICONS[account.type] ?? Wallet;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.95 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      <View style={{
        width: cardWidth,
        height: 220,
        borderRadius: 20,
        backgroundColor: color,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.15)',
        padding: 22,
        justifyContent: 'space-between',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <View style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.1)' }} />
        <View style={{ position: 'absolute', bottom: -30, left: -30, width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.06)' }} />

        {/* Top: Type + Icon */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View>
            <Text style={{ fontSize: 16, fontFamily: fonts.heading, color: 'rgba(255,255,255,0.9)' }}>
              {TYPE_LABELS[account.type] ?? account.type}
            </Text>
            <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
              {account.name}
            </Text>
          </View>
          <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}>
            <IconComp size={20} color="rgba(255,255,255,0.9)" />
          </View>
        </View>

        {/* Bottom: Balance */}
        <View>
          {account.is_default === 1 && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 }}>
              <Star size={10} color="rgba(255,255,255,0.7)" fill="rgba(255,255,255,0.7)" />
              <Text style={{ fontSize: 10, fontFamily: fonts.semibold, color: 'rgba(255,255,255,0.7)' }}>Default</Text>
            </View>
          )}
          <Text style={{ fontSize: 12, fontFamily: fonts.medium, color: 'rgba(255,255,255,0.6)' }}>
            Total balance
          </Text>
          <CurrencyText
            amount={account.balance}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.5}
            style={{ fontSize: 28, fontFamily: fonts.black, color: '#FFFFFF', marginTop: 2 }}
          />
        </View>
      </View>
    </Pressable>
  );
}
