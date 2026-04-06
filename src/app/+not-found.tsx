import React from 'react';
import { View, Text } from 'react-native';
import { Link } from 'expo-router';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';

export default function NotFoundScreen() {
  const theme = useTheme();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.screenBg }}>
      <Text style={{ fontSize: 18, fontFamily: fonts.semibold, color: theme.textPrimary }}>Page not found</Text>
      <Link href="/" style={{ marginTop: 16, color: theme.accent500, fontFamily: fonts.medium }}>
        Go home
      </Link>
    </View>
  );
}
