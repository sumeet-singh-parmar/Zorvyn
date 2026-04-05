import type { SQLiteDatabase } from 'expo-sqlite';
import { generateUUID } from '@core/utils/uuid';

export async function seedDatabase(db: SQLiteDatabase): Promise<void> {
  // Check if already seeded
  const existing = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM categories WHERE deleted_at IS NULL'
  );
  if (existing && existing.count > 0) return;

  const now = new Date().toISOString();

  // Seed default expense categories
  const expenseCategories = [
    { name: 'Food & Dining', icon: 'utensils', color: '#FF6B6B' },
    { name: 'Transport', icon: 'car', color: '#4ECDC4' },
    { name: 'Shopping', icon: 'shopping-bag', color: '#45B7D1' },
    { name: 'Entertainment', icon: 'film', color: '#96CEB4' },
    { name: 'Bills & Utilities', icon: 'zap', color: '#FFEAA7' },
    { name: 'Health', icon: 'heart', color: '#DDA0DD' },
    { name: 'Education', icon: 'book', color: '#98D8C8' },
    { name: 'Groceries', icon: 'shopping-cart', color: '#F7DC6F' },
    { name: 'Rent', icon: 'home', color: '#BB8FCE' },
    { name: 'Other', icon: 'more-horizontal', color: '#AEB6BF' },
  ];

  for (let i = 0; i < expenseCategories.length; i++) {
    const cat = expenseCategories[i];
    await db.runAsync(
      `INSERT INTO categories (id, name, type, icon, color, sort_order, is_default, created_at, updated_at, sync_status)
       VALUES (?, ?, 'expense', ?, ?, ?, 1, ?, ?, 'synced')`,
      [generateUUID(), cat.name, cat.icon, cat.color, i, now, now]
    );
  }

  // Seed default income categories
  const incomeCategories = [
    { name: 'Salary', icon: 'briefcase', color: '#2ECC71' },
    { name: 'Freelance', icon: 'code', color: '#3498DB' },
    { name: 'Investment', icon: 'trending-up', color: '#E74C3C' },
    { name: 'Gift', icon: 'gift', color: '#F39C12' },
    { name: 'Other Income', icon: 'plus-circle', color: '#1ABC9C' },
  ];

  for (let i = 0; i < incomeCategories.length; i++) {
    const cat = incomeCategories[i];
    await db.runAsync(
      `INSERT INTO categories (id, name, type, icon, color, sort_order, is_default, created_at, updated_at, sync_status)
       VALUES (?, ?, 'income', ?, ?, ?, 1, ?, ?, 'synced')`,
      [generateUUID(), cat.name, cat.icon, cat.color, i, now, now]
    );
  }

  // Seed default user preferences
  await db.runAsync(
    `INSERT INTO user_preferences (id, default_currency, date_format, first_day_of_week, theme, onboarding_completed, created_at, updated_at, sync_status)
     VALUES (?, 'INR', 'DD/MM/YYYY', 1, 'system', 0, ?, ?, 'synced')`,
    [generateUUID(), now, now]
  );
}
