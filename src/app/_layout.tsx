import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View, LogBox } from 'react-native';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';

LogBox.ignoreLogs([
  'Unsupported top level event type "topSvgLayout"',
  'VirtualizedLists should never be nested',
]);

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
        {/* budget and goal forms now open via GlobalSheet, not modal routes */}
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
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1E1915' }}>
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
