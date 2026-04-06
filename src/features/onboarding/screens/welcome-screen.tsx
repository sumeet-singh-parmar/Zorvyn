import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { WelcomeHero } from '../components/welcome-hero';
import { Button } from '@components/ui/button';
import { useScreenTopPadding } from '@components/shared/edge-fade';
import { useTheme } from '@theme/use-theme';

export function WelcomeScreen() {
  const router = useRouter();
  const topPadding = useScreenTopPadding();
  const theme = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <View className="flex-1 justify-between px-6" style={{ paddingTop: topPadding }}>
        {/* Hero Content */}
        <WelcomeHero />

        {/* Bottom Section */}
        <Animated.View
          entering={FadeInUp.delay(1300).duration(600)}
          className="items-center pb-8"
        >
          {/* Step Indicator */}
          <View className="flex-row items-center gap-2 mb-6">
            <View className="w-8 h-2 rounded-full" style={{ backgroundColor: theme.accent600 }} />
            <View className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.border }} />
            <View className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.border }} />
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
    </View>
  );
}
