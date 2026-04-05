import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { DollarSign, Target, BarChart2, TrendingUp } from 'lucide-react-native';

const accent = require('@theme/accent');

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
        {React.createElement(icon, { size: 22, color: '#fff' })}
      </LinearGradient>
      <View className="flex-1">
        <Text className="text-base font-bold text-gray-900">
          {title}
        </Text>
        <Text className="text-sm text-gray-500 mt-0.5">
          {subtitle}
        </Text>
      </View>
    </Animated.View>
  );
}

export function WelcomeHero() {
  return (
    <View className="flex-1 items-center justify-center px-4">
      {/* Logo Circle with Gradient */}
      <Animated.View
        entering={FadeInDown.delay(200).duration(700)}
        className="mb-10"
      >
        <LinearGradient
          colors={['#7C6FF1', accent[500], '#5C4CD4']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 32,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: accent[500],
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.35,
            shadowRadius: 20,
            elevation: 12,
          }}
        >
          <TrendingUp size={48} color="white" />
        </LinearGradient>
      </Animated.View>

      {/* App Name */}
      <Animated.Text
        entering={FadeInUp.delay(500).duration(600)}
        className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight"
      >
        Zorvyn
      </Animated.Text>

      {/* Tagline */}
      <Animated.Text
        entering={FadeInUp.delay(650).duration(600)}
        className="text-base text-gray-500 text-center mb-12 font-medium"
      >
        Your personal finance companion
      </Animated.Text>

      {/* Feature Highlights */}
      <View className="w-full">
        <FeatureRow
          icon={DollarSign}
          colors={['#00D9A3', '#00B88A']}
          title="Track Spending"
          subtitle="Monitor every transaction effortlessly"
          delay={800}
        />
        <FeatureRow
          icon={Target}
          colors={['#4DA6FF', '#3B82F6']}
          title="Set Goals"
          subtitle="Achieve your financial milestones"
          delay={950}
        />
        <FeatureRow
          icon={BarChart2}
          colors={['#F59E0B', '#E67E22']}
          title="Get Insights"
          subtitle="Smart analytics and spending trends"
          delay={1100}
        />
      </View>
    </View>
  );
}
