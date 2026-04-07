import type { SQLiteDatabase } from 'expo-sqlite';
import { generateUUID } from '@core/utils/uuid';
import { seedDatabase } from '@core/database/seed';
import {
  DEMO_TRANSACTIONS,
  DEMO_BUDGETS,
  DEMO_GOALS,
  DEMO_RECURRING,
  DEMO_LOANS,
} from '../data/demo-data';

type CategoryRow = { id: string; name: string; type: string };

/**
 * Populate the database with realistic demo data for screenshots and testing.
 *
 * Side effects:
 * - Ensures default categories exist (calls `seedDatabase` if missing)
 * - Creates two default accounts (HDFC Savings + Cash) if none exist
 * - Inserts ~90 transactions across 4 months
 * - Inserts 6 budgets, 5 goals (with contributions), 7 recurring rules, 5 loans
 * - Updates the bank account balance to reflect demo income/expense totals
 *
 * Idempotency: NOT idempotent. Calling twice will create duplicate transactions,
 * goals, etc. Caller should clear data first if a fresh seed is desired.
 */
export async function seedDemoData(db: SQLiteDatabase): Promise<void> {
  const now = new Date();
  const iso = () => new Date().toISOString();

  /** Random local-time timestamp `d` days ago, between 8am and 10pm. */
  const daysAgo = (d: number) => {
    const date = new Date(now);
    date.setDate(date.getDate() - d);
    date.setHours(Math.floor(Math.random() * 14) + 8, Math.floor(Math.random() * 60));
    return date.toISOString();
  };

  // ── Ensure categories ──
  const existingCats = await db.getAllAsync<CategoryRow>(
    'SELECT id, name, type FROM categories WHERE deleted_at IS NULL'
  );
  if (existingCats.length === 0) {
    await seedDatabase(db);
  }
  const allCats = await db.getAllAsync<CategoryRow>(
    'SELECT id, name, type FROM categories WHERE deleted_at IS NULL'
  );
  const expenseCats = allCats.filter((c) => c.type === 'expense');
  const incomeCats = allCats.filter((c) => c.type === 'income');

  // ── Ensure accounts ──
  const accounts = await db.getAllAsync<{ id: string; name: string }>(
    'SELECT id, name FROM accounts WHERE deleted_at IS NULL'
  );
  let primaryAccountId: string;
  let secondaryAccountId: string;
  if (accounts.length === 0) {
    primaryAccountId = generateUUID();
    secondaryAccountId = generateUUID();
    await db.runAsync(
      `INSERT INTO accounts (id, name, type, balance, currency_code, icon, color, is_default, sort_order, created_at, updated_at, sync_status)
       VALUES (?, 'HDFC Savings', 'bank', 125000, 'INR', 'landmark', '#314972', 1, 0, ?, ?, 'synced')`,
      [primaryAccountId, iso(), iso()]
    );
    await db.runAsync(
      `INSERT INTO accounts (id, name, type, balance, currency_code, icon, color, is_default, sort_order, created_at, updated_at, sync_status)
       VALUES (?, 'Cash', 'cash', 8500, 'INR', 'banknote', '#38512B', 0, 1, ?, ?, 'synced')`,
      [secondaryAccountId, iso(), iso()]
    );
  } else {
    primaryAccountId = accounts[0].id;
    secondaryAccountId = accounts[1]?.id ?? primaryAccountId;
  }

  // ── Transactions ──
  for (const tx of DEMO_TRANSACTIONS) {
    const catList = tx.t === 'income' ? incomeCats : expenseCats;
    const cat = catList[tx.c % catList.length];
    // 30% chance the transaction came out of the cash account, 70% from the bank
    const accId = Math.random() > 0.7 ? secondaryAccountId : primaryAccountId;
    await db.runAsync(
      `INSERT INTO transactions (id, amount, type, category_id, account_id, currency_code, date, notes, created_at, updated_at, sync_status)
       VALUES (?, ?, ?, ?, ?, 'INR', ?, ?, ?, ?, 'synced')`,
      [generateUUID(), tx.a, tx.t, cat.id, accId, daysAgo(tx.d), tx.n, iso(), iso()]
    );
  }

  // Update primary account balance to reflect the demo income/expense totals
  const incomeTotal = DEMO_TRANSACTIONS.filter((t) => t.t === 'income').reduce((s, t) => s + t.a, 0);
  const expenseTotal = DEMO_TRANSACTIONS.filter((t) => t.t === 'expense').reduce((s, t) => s + t.a, 0);
  await db.runAsync(
    `UPDATE accounts SET balance = ? WHERE id = ?`,
    [125000 + incomeTotal - expenseTotal, primaryAccountId]
  );

  // ── Budgets ──
  for (const b of DEMO_BUDGETS) {
    const cat = expenseCats[b.catIdx % expenseCats.length];
    await db.runAsync(
      `INSERT INTO budgets (id, category_id, amount, period, currency_code, start_date, alert_threshold, is_active, created_at, updated_at, sync_status)
       VALUES (?, ?, ?, 'monthly', 'INR', ?, 0.8, 1, ?, ?, 'synced')`,
      [generateUUID(), cat.id, b.amount, daysAgo(30), iso(), iso()]
    );
  }

  // ── Goals (with contributions) ──
  for (const g of DEMO_GOALS) {
    const goalId = generateUUID();
    const deadlineDate = new Date(now);
    deadlineDate.setDate(deadlineDate.getDate() + g.deadline);
    const isCompleted = g.saved >= g.target ? 1 : 0;
    await db.runAsync(
      `INSERT INTO goals (id, name, target_amount, current_amount, currency_code, deadline, icon, color, is_completed, completed_at, created_at, updated_at, sync_status)
       VALUES (?, ?, ?, ?, 'INR', ?, 'target', ?, ?, ?, ?, ?, 'synced')`,
      [goalId, g.name, g.target, g.saved, deadlineDate.toISOString(), g.color, isCompleted, isCompleted ? iso() : null, iso(), iso()]
    );
    // Spread the saved amount across ~5 contribution events (one per week)
    const contribCount = Math.max(1, Math.floor(g.saved / (g.target / 5)));
    const perContrib = g.saved / contribCount;
    for (let c = 0; c < contribCount; c++) {
      await db.runAsync(
        `INSERT INTO goal_contributions (id, goal_id, amount, account_id, notes, created_at, updated_at, sync_status)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'synced')`,
        [generateUUID(), goalId, Math.round(perContrib), primaryAccountId, null, daysAgo((contribCount - c) * 7), iso()]
      );
    }
  }

  // ── Recurring rules ──
  for (const r of DEMO_RECURRING) {
    const catList = r.type === 'income' ? incomeCats : expenseCats;
    const cat = catList[r.catIdx % catList.length];
    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + r.dueIn);
    await db.runAsync(
      `INSERT INTO recurring_rules (id, amount, type, category_id, account_id, currency_code, frequency, interval_count, next_due_date, notes, is_active, created_at, updated_at, sync_status)
       VALUES (?, ?, ?, ?, ?, 'INR', ?, 1, ?, ?, 1, ?, ?, 'synced')`,
      [generateUUID(), r.amount, r.type, cat.id, primaryAccountId, r.freq, dueDate.toISOString(), r.notes, iso(), iso()]
    );
  }

  // ── Loans ──
  for (const l of DEMO_LOANS) {
    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + l.dueIn);
    await db.runAsync(
      `INSERT INTO loans (id, person_name, amount, type, date, due_date, notes, status, created_at, updated_at, sync_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'synced')`,
      [generateUUID(), l.person, l.amount, l.type, daysAgo(30), dueDate.toISOString(), l.notes, l.status, iso(), iso()]
    );
  }
}

/**
 * Wipe all user data from every table. Used by the "Clear All Data" action.
 */
export async function clearAllData(db: SQLiteDatabase): Promise<void> {
  await db.runAsync('DELETE FROM goal_contributions');
  await db.runAsync('DELETE FROM goals');
  await db.runAsync('DELETE FROM budgets');
  await db.runAsync('DELETE FROM transactions');
  await db.runAsync('DELETE FROM accounts');
  await db.runAsync('DELETE FROM categories');
  await db.runAsync('DELETE FROM tags');
  await db.runAsync('DELETE FROM user_preferences');
}
