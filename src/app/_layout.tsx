import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View, LogBox } from 'react-native';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';

LogBox.ignoreLogs([
  'Unsupported top level event type "topSvgLayout"',
  'VirtualizedLists should never be nested',
]);

import { Appearance } from 'react-native';
import { AppProviders } from '@core/providers/app-providers';
import { EdgeFade } from '@components/shared/edge-fade';
import { useTheme } from '@theme/use-theme';
import {
  useFonts,
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
} from '@expo-google-fonts/nunito';
import '../../global.css';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

/** Inner shell -- needs to be inside AppProviders to use useTheme() */
function AppShell() {
  const theme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.screenBg }}>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="accounts" />
        <Stack.Screen name="recurring" />
        <Stack.Screen name="loans" />
        <Stack.Screen name="budget/index" />
        <Stack.Screen name="goal/index" />
      </Stack>
      <EdgeFade />
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });

  if (!fontsLoaded) {
    // Hardcoded colors: this renders BEFORE AppProviders mounts, so useTheme() is unavailable here.
    const isDark = Appearance.getColorScheme() === 'dark';
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: isDark ? '#1E1915' : '#FAF7F5' }}>
        <ActivityIndicator size="large" color="#B87040" />
      </View>
    );
  }

  return (
    <AppProviders>
      <AppShell />
    </AppProviders>
  );
}
