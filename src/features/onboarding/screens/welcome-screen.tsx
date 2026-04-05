import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { WelcomeHero } from '../components/welcome-hero';
import { Button } from '@components/ui/button';

const accent = require('@theme/accent');

export function WelcomeScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: isDark ? accent.screenBg : accent.screenBgLight }}>
      <View className="flex-1 justify-between px-6">
        {/* Hero Content */}
        <WelcomeHero />

        {/* Bottom Section */}
        <Animated.View
          entering={FadeInUp.delay(1300).duration(600)}
          className="items-center pb-8"
        >
          {/* Step Indicator */}
          <View className="flex-row items-center gap-2 mb-6">
            <View className="w-8 h-2 rounded-full bg-accent-600" />
            <View className="w-2 h-2 rounded-full bg-gray-200" />
            <View className="w-2 h-2 rounded-full bg-gray-200" />
          </View>

          {/* CTA Button */}
          <Button
            title="Get Started"
            onPress={() => router.push('/(onboarding)/setup-currency')}
            size="lg"
            className="w-full"
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
