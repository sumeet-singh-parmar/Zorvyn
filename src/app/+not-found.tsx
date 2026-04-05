import React from 'react';
import { View, Text } from 'react-native';
import { Link } from 'expo-router';

const accent = require('@theme/accent');

export default function NotFoundScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18, fontWeight: '600' }}>Page not found</Text>
      <Link href="/" style={{ marginTop: 16, color: accent[500] }}>
        Go home
      </Link>
    </View>
  );
}
