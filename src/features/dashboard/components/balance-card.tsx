import React, { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Eye, EyeOff } from 'lucide-react-native';
import { useTheme, useIsDark } from '@theme/use-theme';
import { useThemeStore } from '@stores/theme-store';
import { hslToRgba } from '@theme/hsl';
import { CurrencyText } from '@components/shared/currency-text';
import { formatCurrency } from '@core/currency';
import { fonts } from '@theme/fonts';

interface BalanceCardProps {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  lastMonthIncome: number;
  lastMonthExpense: number;
  onPress?: () => void;
}

function Blob({ size, startX, startY, color, delay }: {
  size: number;
  startX: number;
  startY: number;
  color: string;
  delay: number;
}) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    const duration = 4000 + Math.random() * 2000;
    const moveX = 30 + Math.random() * 20;
    const moveY = 20 + Math.random() * 15;

    translateX.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(moveX, { duration, easing: Easing.inOut(Easing.ease) }),
          withTiming(-moveX, { duration, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      ),
    );

    translateY.value = withDelay(
      delay + 500,
      withRepeat(
        withSequence(
          withTiming(-moveY, { duration: duration * 0.8, easing: Easing.inOut(Easing.ease) }),
          withTiming(moveY, { duration: duration * 0.8, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      ),
    );

    scale.value = withDelay(
      delay + 200,
      withRepeat(
        withSequence(
          withTiming(1.2, { duration: duration * 1.2, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.85, { duration: duration * 1.2, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          left: startX,
          top: startY,
        },
        animStyle,
      ]}
    />
  );
}

export function BalanceCard({ totalBalance, totalIncome, totalExpense, lastMonthIncome, lastMonthExpense, onPress }: BalanceCardProps) {
  const theme = useTheme();
  const isDark = useIsDark();
  const { hue, saturation, lightness } = useThemeStore();
  const [hidden, setHidden] = useState(false);

  // Card text -- light on dark glass, dark on light glass
  const cardText = isDark ? hslToRgba(hue, saturation * 0.15, 92, 1) : hslToRgba(hue, saturation * 0.5, 15, 1);
  const cardTextSub = isDark ? hslToRgba(hue, saturation * 0.12, 80, 1) : hslToRgba(hue, saturation * 0.4, 25, 1);
  const cardLabel = isDark ? hslToRgba(hue, saturation * 0.25, 72, 1) : hslToRgba(hue, saturation * 0.3, 35, 1);

  // Comparison percentages
  const incomeChange = lastMonthIncome > 0
    ? Math.round(((totalIncome - lastMonthIncome) / lastMonthIncome) * 100)
    : 0;
  const expenseChange = lastMonthExpense > 0
    ? Math.round(((totalExpense - lastMonthExpense) / lastMonthExpense) * 100)
    : 0;

  // Blob colors -- vivid, fully opaque so they show through glass
  const blob1 = hslToRgba(hue, saturation, lightness, 1);
  const blob2 = hslToRgba(hue, saturation * 0.9, lightness + 15, 1);
  const blob3 = hslToRgba(hue, saturation, lightness - 8, 1);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: onPress && pressed ? 0.9 : 1, transform: [{ scale: onPress && pressed ? 0.98 : 1 }] })}>
    <View
      style={{
        borderRadius: 28,
        borderWidth: 1.5,
        borderColor: isDark
          ? hslToRgba(hue, saturation * 0.6, lightness, 0.35)
          : hslToRgba(hue, saturation * 0.5, lightness, 0.3),
      }}
    >
    <View
      style={{
        borderRadius: 27,
        overflow: 'hidden',
      }}
    >
      {/* Blobs spread across card */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <Blob size={150} startX={-20} startY={-20} color={blob1} delay={0} />
        <Blob size={120} startX={220} startY={20} color={blob2} delay={1000} />
        <Blob size={130} startX={100} startY={120} color={blob3} delay={2000} />
        <Blob size={100} startX={280} startY={100} color={blob1} delay={1500} />
      </View>

      {/* Frosted glass -- dark in dark mode, light in light mode */}
      <BlurView
        intensity={80}
        tint={isDark ? 'dark' : 'light'}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Tint overlay */}
      <View
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: isDark
            ? hslToRgba(hue, saturation * 0.3, 10, 0.4)
            : hslToRgba(hue, saturation * 0.5, 85, 0.3),
        }}
      />

      {/* Glossy shine */}
      <LinearGradient
        colors={isDark
          ? ['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.03)', 'rgba(255,255,255,0)']
          : ['rgba(255,255,255,0.5)', 'rgba(255,255,255,0.15)', 'rgba(255,255,255,0)']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Content */}
      <View style={{ padding: 24, paddingBottom: 28 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontFamily: fonts.heading, color: cardTextSub, opacity: 0.7 }}>
            Total balance
          </Text>
          <Pressable onPress={() => setHidden(!hidden)} hitSlop={12}>
            {hidden ? (
              <EyeOff size={20} color={cardText} style={{ opacity: 0.7 }} />
            ) : (
              <Eye size={20} color={cardText} style={{ opacity: 0.7 }} />
            )}
          </Pressable>
        </View>

        {/* Balance */}
        {hidden ? (
          <Text style={{ fontSize: 36, fontFamily: fonts.amountBlack, color: cardText, marginTop: 6, lineHeight: 48 }}>
            ••••••
          </Text>
        ) : (
          <CurrencyText
            amount={totalBalance}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.5}
            style={{ fontSize: 36, fontFamily: fonts.amountBlack, color: cardText, marginTop: 6, lineHeight: 48 }}
          />
        )}

        {/* This month */}
        <Text style={{ fontSize: 17, fontFamily: fonts.heading, color: cardText, marginTop: 20, marginBottom: 12, opacity: 0.8 }}>
          This month
        </Text>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          {/* Income */}
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontFamily: fonts.medium, color: cardLabel, marginBottom: 4 }}>
              Income
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2, gap: 6, flexWrap: 'wrap' }}>
              {hidden ? (
                <Text style={{ fontSize: 18, fontFamily: fonts.amount, color: cardText }}>••••</Text>
              ) : (
                <CurrencyText
                  amount={totalIncome}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.7}
                  style={{ fontSize: 18, fontFamily: fonts.amount, color: cardText, flexShrink: 1 }}
                />
              )}
              {!hidden && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                  {incomeChange >= 0 ? (
                    <TrendingUp size={12} color={theme.income} />
                  ) : (
                    <TrendingDown size={12} color={theme.expense} />
                  )}
                  <Text style={{ fontSize: 14, fontFamily: fonts.semibold, color: incomeChange >= 0 ? theme.income : theme.expense }}>
                    {incomeChange >= 0 ? '+' : ''}{incomeChange}%
                  </Text>
                </View>
              )}
            </View>
            {!hidden && (
              <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7} style={{ fontSize: 12, fontFamily: fonts.body, color: cardLabel, marginTop: 3 }}>
                Compared to {formatCurrency(lastMonthIncome)} last month
              </Text>
            )}
          </View>

          {/* Expense */}
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontFamily: fonts.medium, color: cardLabel, marginBottom: 4 }}>
              Expense
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2, gap: 6, flexWrap: 'wrap' }}>
              {hidden ? (
                <Text style={{ fontSize: 18, fontFamily: fonts.amount, color: cardText }}>••••</Text>
              ) : (
                <CurrencyText
                  amount={totalExpense}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.7}
                  style={{ fontSize: 18, fontFamily: fonts.amount, color: cardText, flexShrink: 1 }}
                />
              )}
              {!hidden && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                  {expenseChange <= 0 ? (
                    <TrendingDown size={12} color={theme.income} />
                  ) : (
                    <TrendingUp size={12} color={theme.expense} />
                  )}
                  <Text style={{ fontSize: 14, fontFamily: fonts.semibold, color: expenseChange <= 0 ? theme.income : theme.expense }}>
                    {expenseChange >= 0 ? '+' : ''}{expenseChange}%
                  </Text>
                </View>
              )}
            </View>
            {!hidden && (
              <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7} style={{ fontSize: 12, fontFamily: fonts.body, color: cardLabel, marginTop: 3 }}>
                Compared to {formatCurrency(lastMonthExpense)} last month
              </Text>
            )}
          </View>
        </View>
      </View>
    </View>
    </View>
    </Pressable>
  );
}
