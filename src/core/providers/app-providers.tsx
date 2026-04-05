import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryProvider } from './query-provider';
import { DatabaseProvider } from './database-provider';
import { ThemeProvider } from './theme-provider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <QueryProvider>
          <DatabaseProvider>
            {children}
          </DatabaseProvider>
        </QueryProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
