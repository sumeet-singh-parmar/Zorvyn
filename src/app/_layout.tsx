import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View, LogBox } from 'react-native';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';

LogBox.ignoreLogs(['Unsupported top level event type "topSvgLayout"']);

import { AppProviders } from '@core/providers/app-providers';
import { ThemeDemoScreen } from '@features/settings/screens/theme-demo-screen';
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

  // TEMPORARY: Show theme demo instead of main app
  // Remove this and restore the Stack navigator once theme is validated
  return (
    <AppProviders>
      <StatusBar style="auto" />
      <ThemeDemoScreen />
    </AppProviders>
  );

  /* ORIGINAL APP ROUTES — restore after demo validation
  return (
    <AppProviders>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="transaction" options={{ presentation: 'modal' }} />
        <Stack.Screen name="budget/index" options={{ presentation: 'modal' }} />
        <Stack.Screen name="goal/index" options={{ presentation: 'modal' }} />
      </Stack>
    </AppProviders>
  );
  */
}
