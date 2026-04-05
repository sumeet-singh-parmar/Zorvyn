import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { APP_CONFIG } from '@core/constants/config';

// ──────────────────────────────────────────────
// NOTE: Query persistence (PersistQueryClientProvider) has been temporarily
// disabled because AsyncStorage is async and the sync persister can't work
// with it. The query cache still works perfectly in-memory during the session.
//
// To restore persistence: revert to MMKV (see mmkv.backup.ts) and use
// PersistQueryClientProvider with the sync persister.
// ──────────────────────────────────────────────

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: APP_CONFIG.query.staleTime,
      gcTime: APP_CONFIG.query.gcTime,
    },
  },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

export { queryClient };
