import React from 'react';
import { Tabs } from 'expo-router';
import { GlassTabBar } from '@components/ui/glass-tab-bar';
import { useGlobalSheet } from '@components/shared/global-sheet';
import { TransactionForm } from '@features/transactions/components/transaction-form';

export default function TabLayout() {
  const { openSheet, closeSheet } = useGlobalSheet();

  const handlePlusPress = () => {
    openSheet({
      title: 'Add Transaction',
      content: <TransactionForm onSuccess={closeSheet} />,
      snapPoints: ['90%'],
    });
  };

  return (
    <Tabs
      tabBar={(props) => <GlassTabBar {...props} onPlusPress={handlePlusPress} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="transactions" options={{ title: 'Transactions' }} />
      <Tabs.Screen name="analytics" options={{ title: 'Insights' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
