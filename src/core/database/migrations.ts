import type { SQLiteDatabase } from 'expo-sqlite';

interface Migration {
  version: number;
  name: string;
  up: (db: SQLiteDatabase) => Promise<void>;
}

const migrations: Migration[] = [
  {
    version: 1,
    name: 'initial_schema',
    up: async (db) => {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS accounts (
          id              TEXT PRIMARY KEY,
          name            TEXT NOT NULL,
          type            TEXT NOT NULL,
          balance         REAL DEFAULT 0,
          currency_code   TEXT DEFAULT 'INR',
          icon            TEXT,
          color           TEXT,
          is_default      INTEGER DEFAULT 0,
          sort_order      INTEGER DEFAULT 0,
          created_at      TEXT NOT NULL,
          updated_at      TEXT NOT NULL,
          deleted_at      TEXT,
          sync_status     TEXT DEFAULT 'pending'
        );

        CREATE TABLE IF NOT EXISTS categories (
          id              TEXT PRIMARY KEY,
          name            TEXT NOT NULL,
          type            TEXT NOT NULL,
          icon            TEXT NOT NULL,
          color           TEXT NOT NULL,
          parent_id       TEXT,
          sort_order      INTEGER DEFAULT 0,
          is_default      INTEGER DEFAULT 0,
          created_at      TEXT NOT NULL,
          updated_at      TEXT NOT NULL,
          deleted_at      TEXT,
          sync_status     TEXT DEFAULT 'pending',
          FOREIGN KEY (parent_id) REFERENCES categories(id)
        );

        CREATE TABLE IF NOT EXISTS recurring_rules (
          id              TEXT PRIMARY KEY,
          amount          REAL NOT NULL,
          type            TEXT NOT NULL,
          category_id     TEXT NOT NULL,
          account_id      TEXT NOT NULL,
          currency_code   TEXT DEFAULT 'INR',
          frequency       TEXT NOT NULL,
          interval_count  INTEGER DEFAULT 1,
          next_due_date   TEXT NOT NULL,
          end_date        TEXT,
          notes           TEXT,
          is_active       INTEGER DEFAULT 1,
          created_at      TEXT NOT NULL,
          updated_at      TEXT NOT NULL,
          deleted_at      TEXT,
          sync_status     TEXT DEFAULT 'pending',
          FOREIGN KEY (category_id) REFERENCES categories(id),
          FOREIGN KEY (account_id) REFERENCES accounts(id)
        );

        CREATE TABLE IF NOT EXISTS transactions (
          id              TEXT PRIMARY KEY,
          amount          REAL NOT NULL,
          type            TEXT NOT NULL,
          category_id     TEXT NOT NULL,
          account_id      TEXT NOT NULL,
          to_account_id   TEXT,
          currency_code   TEXT DEFAULT 'INR',
          date            TEXT NOT NULL,
          notes           TEXT,
          recurring_id    TEXT,
          attachment_path TEXT,
          latitude        REAL,
          longitude       REAL,
          created_at      TEXT NOT NULL,
          updated_at      TEXT NOT NULL,
          deleted_at      TEXT,
          sync_status     TEXT DEFAULT 'pending',
          FOREIGN KEY (category_id) REFERENCES categories(id),
          FOREIGN KEY (account_id) REFERENCES accounts(id),
          FOREIGN KEY (to_account_id) REFERENCES accounts(id),
          FOREIGN KEY (recurring_id) REFERENCES recurring_rules(id)
        );

        CREATE TABLE IF NOT EXISTS budgets (
          id              TEXT PRIMARY KEY,
          category_id     TEXT NOT NULL,
          amount          REAL NOT NULL,
          period          TEXT NOT NULL,
          currency_code   TEXT DEFAULT 'INR',
          start_date      TEXT NOT NULL,
          alert_threshold REAL DEFAULT 0.8,
          is_active       INTEGER DEFAULT 1,
          created_at      TEXT NOT NULL,
          updated_at      TEXT NOT NULL,
          deleted_at      TEXT,
          sync_status     TEXT DEFAULT 'pending',
          FOREIGN KEY (category_id) REFERENCES categories(id)
        );

        CREATE TABLE IF NOT EXISTS goals (
          id              TEXT PRIMARY KEY,
          name            TEXT NOT NULL,
          target_amount   REAL NOT NULL,
          current_amount  REAL DEFAULT 0,
          currency_code   TEXT DEFAULT 'INR',
          deadline        TEXT,
          icon            TEXT,
          color           TEXT,
          is_completed    INTEGER DEFAULT 0,
          completed_at    TEXT,
          created_at      TEXT NOT NULL,
          updated_at      TEXT NOT NULL,
          deleted_at      TEXT,
          sync_status     TEXT DEFAULT 'pending'
        );

        CREATE TABLE IF NOT EXISTS goal_contributions (
          id              TEXT PRIMARY KEY,
          goal_id         TEXT NOT NULL,
          amount          REAL NOT NULL,
          account_id      TEXT,
          notes           TEXT,
          created_at      TEXT NOT NULL,
          updated_at      TEXT NOT NULL,
          deleted_at      TEXT,
          sync_status     TEXT DEFAULT 'pending',
          FOREIGN KEY (goal_id) REFERENCES goals(id),
          FOREIGN KEY (account_id) REFERENCES accounts(id)
        );

        CREATE TABLE IF NOT EXISTS tags (
          id              TEXT PRIMARY KEY,
          name            TEXT NOT NULL UNIQUE,
          color           TEXT,
          created_at      TEXT NOT NULL,
          updated_at      TEXT NOT NULL,
          deleted_at      TEXT,
          sync_status     TEXT DEFAULT 'pending'
        );

        CREATE TABLE IF NOT EXISTS transaction_tags (
          transaction_id  TEXT NOT NULL,
          tag_id          TEXT NOT NULL,
          PRIMARY KEY (transaction_id, tag_id),
          FOREIGN KEY (transaction_id) REFERENCES transactions(id),
          FOREIGN KEY (tag_id) REFERENCES tags(id)
        );

        CREATE TABLE IF NOT EXISTS user_preferences (
          id                    TEXT PRIMARY KEY,
          display_name          TEXT,
          default_currency      TEXT DEFAULT 'INR',
          date_format           TEXT DEFAULT 'DD/MM/YYYY',
          first_day_of_week     INTEGER DEFAULT 1,
          theme                 TEXT DEFAULT 'system',
          biometric_enabled     INTEGER DEFAULT 0,
          onboarding_completed  INTEGER DEFAULT 0,
          created_at            TEXT NOT NULL,
          updated_at            TEXT NOT NULL,
          deleted_at            TEXT,
          sync_status           TEXT DEFAULT 'pending'
        );
      `);

      // Indexes
      await db.execAsync(`
        CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
        CREATE INDEX IF NOT EXISTS idx_transactions_account ON transactions(account_id);
        CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category_id);
        CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
        CREATE INDEX IF NOT EXISTS idx_transactions_deleted ON transactions(deleted_at);
        CREATE INDEX IF NOT EXISTS idx_transactions_sync ON transactions(sync_status);

        CREATE INDEX IF NOT EXISTS idx_budgets_category ON budgets(category_id);
        CREATE INDEX IF NOT EXISTS idx_budgets_period ON budgets(period, start_date);

        CREATE INDEX IF NOT EXISTS idx_goal_contributions_goal ON goal_contributions(goal_id);

        CREATE INDEX IF NOT EXISTS idx_recurring_next_due ON recurring_rules(next_due_date, is_active);

        CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);
      `);

      // FTS5 virtual table for full-text search on transaction notes
      await db.execAsync(`
        CREATE VIRTUAL TABLE IF NOT EXISTS transactions_fts USING fts5(
          notes,
          content='transactions',
          content_rowid='rowid'
        );
      `);
    },
  },
  {
    version: 2,
    name: 'add_loans_table',
    up: async (db) => {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS loans (
          id              TEXT PRIMARY KEY,
          person_name     TEXT NOT NULL,
          amount          REAL NOT NULL,
          type            TEXT NOT NULL CHECK(type IN ('lending', 'borrowing')),
          date            TEXT NOT NULL,
          due_date        TEXT,
          notes           TEXT,
          status          TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'paid')),
          created_at      TEXT NOT NULL,
          updated_at      TEXT NOT NULL,
          deleted_at      TEXT,
          sync_status     TEXT DEFAULT 'pending'
        );

        CREATE INDEX IF NOT EXISTS idx_loans_type ON loans(type);
        CREATE INDEX IF NOT EXISTS idx_loans_status ON loans(status);
        CREATE INDEX IF NOT EXISTS idx_loans_deleted ON loans(deleted_at);
      `);
    },
  },
];

export async function runMigrations(db: SQLiteDatabase): Promise<void> {
  // Create migrations tracking table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS _migrations (
      version     INTEGER PRIMARY KEY,
      name        TEXT NOT NULL,
      applied_at  TEXT NOT NULL
    );
  `);

  // Get already applied migrations
  const applied = await db.getAllAsync<{ version: number }>(
    'SELECT version FROM _migrations ORDER BY version'
  );
  const appliedVersions = new Set(applied.map((m) => m.version));

  // Run pending migrations in order
  for (const migration of migrations) {
    if (appliedVersions.has(migration.version)) continue;

    await db.execAsync('BEGIN TRANSACTION;');
    try {
      await migration.up(db);
      await db.runAsync(
        'INSERT INTO _migrations (version, name, applied_at) VALUES (?, ?, ?)',
        [migration.version, migration.name, new Date().toISOString()]
      );
      await db.execAsync('COMMIT;');
    } catch (error) {
      await db.execAsync('ROLLBACK;');
      throw new Error(
        `Migration ${migration.version} (${migration.name}) failed: ${error}`
      );
    }
  }
}
