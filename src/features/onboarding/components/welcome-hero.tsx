import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { DollarSign, Target, BarChart2, TrendingUp } from 'lucide-react-native';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';

function FeatureRow({
  icon,
  colors,
  title,
  subtitle,
  delay,
}: {
  icon: React.ComponentType<any>;
  colors: [string, string];
  title: string;
  subtitle: string;
  delay: number;
}) {
  const theme = useTheme();
  return (
    <Animated.View
      entering={FadeInUp.delay(delay).duration(500)}
      className="flex-row items-center mb-5"
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: 48,
          height: 48,
          borderRadius: 16,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 16,
        }}
      >
        {React.createElement(icon, { size: 22, color: theme.textOnAccent })}
      </LinearGradient>
      <View className="flex-1">
        <Text style={{ fontSize: 16, fontFamily: fonts.heading, color: theme.textPrimary }}>
          {title}
        </Text>
        <Text style={{ fontSize: 14, fontFamily: fonts.body, color: theme.textMuted, marginTop: 2 }}>
          {subtitle}
        </Text>
      </View>
    </Animated.View>
  );
}

export function WelcomeHero() {
  const theme = useTheme();

  return (
    <View className="flex-1 items-center justify-center px-4">
      {/* Logo Circle with Gradient */}
      <Animated.View
        entering={FadeInDown.delay(200).duration(700)}
        className="mb-10"
      >
        <LinearGradient
          colors={[theme.accent400, theme.accent500, theme.accent700]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 32,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: theme.accent500,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.35,
            shadowRadius: 20,
            elevation: 12,
          }}
        >
          <TrendingUp size={48} color={theme.textOnAccent} />
        </LinearGradient>
      </Animated.View>

      {/* App Name */}
      <Animated.Text
        entering={FadeInUp.delay(500).duration(600)}
        style={{ fontSize: 36, fontFamily: fonts.extrabold, color: theme.textPrimary, marginBottom: 8, letterSpacing: -0.5 }}
      >
        Zorvyn
      </Animated.Text>

      {/* Tagline */}
      <Animated.Text
        entering={FadeInUp.delay(650).duration(600)}
        style={{ fontSize: 16, fontFamily: fonts.medium, color: theme.textMuted, textAlign: 'center', marginBottom: 48 }}
      >
        Your personal finance companion
      </Animated.Text>

      {/* Feature Highlights */}
      <View className="w-full">
        <FeatureRow
          icon={DollarSign}
          colors={[theme.income, theme.income]}
          title="Track Spending"
          subtitle="Monitor every transaction effortlessly"
          delay={800}
        />
        <FeatureRow
          icon={Target}
          colors={[theme.transfer, theme.accent500]}
          title="Set Goals"
          subtitle="Achieve your financial milestones"
          delay={950}
        />
        <FeatureRow
          icon={BarChart2}
          colors={[theme.warning, theme.warning]}
          title="Get Insights"
          subtitle="Smart analytics and spending trends"
          delay={1100}
        />
      </View>
    </View>
  );
}
