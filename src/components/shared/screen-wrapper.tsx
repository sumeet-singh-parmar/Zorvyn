import React from 'react';
import { View } from 'react-native';

export { useScreenTopPadding } from './edge-fade';

/**
 * Simple full-screen wrapper that replaced SafeAreaView after
 * EdgeFade was promoted to the global layout.
 */
export function ScreenWrapper({ children }: { children: React.ReactNode }) {
  return <View style={{ flex: 1 }}>{children}</View>;
}
