import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryProvider } from './query-provider';
import { DatabaseProvider } from './database-provider';
import { ThemeProvider } from './theme-provider';
import { GlobalSheetProvider } from '@components/shared/global-sheet';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <DatabaseProvider>
          <QueryProvider>
            <BottomSheetModalProvider>
              <GlobalSheetProvider>
                {children}
              </GlobalSheetProvider>
            </BottomSheetModalProvider>
          </QueryProvider>
        </DatabaseProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
