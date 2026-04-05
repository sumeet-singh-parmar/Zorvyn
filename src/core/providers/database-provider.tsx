import React, { createContext, useContext, useEffect, useState } from 'react';
import type { SQLiteDatabase } from 'expo-sqlite';
import { getDatabase } from '@core/database/client';
import { seedDatabase } from '@core/database/seed';
import { logger } from '@core/logger/console-logger';

interface DatabaseContextValue {
  db: SQLiteDatabase | null;
  isReady: boolean;
  error: Error | null;
}

const DatabaseContext = createContext<DatabaseContextValue>({
  db: null,
  isReady: false,
  error: null,
});

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const database = await getDatabase();
        await seedDatabase(database);
        if (mounted) {
          setDb(database);
          setIsReady(true);
          logger.info('Database initialized and seeded');
        }
      } catch (err) {
        if (mounted) {
          const e = err instanceof Error ? err : new Error(String(err));
          setError(e);
          logger.error('Database initialization failed', e);
        }
      }
    }

    init();
    return () => { mounted = false; };
  }, []);

  return (
    <DatabaseContext.Provider value={{ db, isReady, error }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase(): SQLiteDatabase {
  const { db } = useContext(DatabaseContext);
  if (!db) throw new Error('Database not initialized — wrap with DatabaseProvider');
  return db;
}

export function useDatabaseStatus() {
  return useContext(DatabaseContext);
}
