/**
 * Demo data definitions used to populate the app for screenshots and testing.
 * Pure data — no database access here. Consumed by `seed-service.ts`.
 *
 * Field aliases (kept short to make the long array readable):
 *   c = category index, a = amount, d = days ago, n = notes, t = type
 */

export type DemoTransaction = {
  c: number;
  a: number;
  d: number;
  n: string;
  t: 'expense' | 'income';
};

/**
 * 90+ transactions across the last 4 months — realistic Indian spending patterns.
 * Spread densely in the recent week and last month, sparser further back.
 */
export const DEMO_TRANSACTIONS: DemoTransaction[] = [
  // ── TODAY ──
  { c: 0, a: 350, d: 0, n: 'Chai & samosa', t: 'expense' },
  { c: 0, a: 890, d: 0, n: 'Lunch at Barbeque Nation', t: 'expense' },
  { c: 1, a: 150, d: 0, n: 'Auto to office', t: 'expense' },
  // ── YESTERDAY ──
  { c: 0, a: 220, d: 1, n: 'Coffee at Starbucks', t: 'expense' },
  { c: 0, a: 450, d: 1, n: 'Dinner - Dominos', t: 'expense' },
  { c: 7, a: 1250, d: 1, n: 'Fruits & vegetables', t: 'expense' },
  { c: 1, a: 280, d: 1, n: 'Ola ride', t: 'expense' },
  // ── THIS WEEK ──
  { c: 0, a: 180, d: 2, n: 'Maggi & juice', t: 'expense' },
  { c: 2, a: 1999, d: 2, n: 'Amazon - phone charger', t: 'expense' },
  { c: 0, a: 650, d: 3, n: 'KFC bucket', t: 'expense' },
  { c: 1, a: 500, d: 3, n: 'Metro card recharge', t: 'expense' },
  { c: 5, a: 450, d: 3, n: 'Pharmacy - vitamins', t: 'expense' },
  { c: 0, a: 380, d: 4, n: 'Biryani delivery', t: 'expense' },
  { c: 3, a: 149, d: 4, n: 'YouTube Premium', t: 'expense' },
  { c: 0, a: 120, d: 5, n: 'Tea & biscuits', t: 'expense' },
  { c: 1, a: 1500, d: 5, n: 'Uber to airport', t: 'expense' },
  { c: 7, a: 3200, d: 5, n: 'Weekly groceries - BigBasket', t: 'expense' },
  // ── LAST WEEK ──
  { c: 8, a: 15000, d: 7, n: 'Monthly rent', t: 'expense' },
  { c: 0, a: 85000, d: 7, n: 'April salary credited', t: 'income' },
  { c: 0, a: 750, d: 8, n: 'Lunch with team', t: 'expense' },
  { c: 4, a: 2100, d: 8, n: 'Electricity bill - BESCOM', t: 'expense' },
  { c: 4, a: 599, d: 8, n: 'Mobile recharge - Jio', t: 'expense' },
  { c: 0, a: 320, d: 9, n: 'Breakfast - Idli Vada', t: 'expense' },
  { c: 2, a: 4999, d: 9, n: 'Flipkart - Bluetooth speaker', t: 'expense' },
  { c: 0, a: 550, d: 10, n: 'Pizza Hut delivery', t: 'expense' },
  { c: 1, a: 350, d: 10, n: 'Auto rickshaw', t: 'expense' },
  { c: 3, a: 499, d: 10, n: 'Movie - PVR INOX', t: 'expense' },
  { c: 0, a: 290, d: 11, n: 'Dosa & filter coffee', t: 'expense' },
  { c: 7, a: 2800, d: 11, n: 'Groceries - DMart', t: 'expense' },
  { c: 5, a: 1200, d: 12, n: 'Doctor consultation', t: 'expense' },
  { c: 1, a: 12000, d: 12, n: 'Freelance - UI design project', t: 'income' },
  { c: 0, a: 420, d: 13, n: 'Sandwich & cold coffee', t: 'expense' },
  { c: 6, a: 2500, d: 13, n: 'Udemy course - React Native', t: 'expense' },
  // ── 2-3 WEEKS AGO ──
  { c: 0, a: 680, d: 15, n: 'Dinner at Mainland China', t: 'expense' },
  { c: 2, a: 1299, d: 15, n: 'Amazon - earbuds', t: 'expense' },
  { c: 0, a: 190, d: 16, n: 'Chai point', t: 'expense' },
  { c: 1, a: 200, d: 16, n: 'Bus ticket', t: 'expense' },
  { c: 0, a: 950, d: 17, n: 'Family dinner - Haldirams', t: 'expense' },
  { c: 7, a: 1800, d: 17, n: 'Milk & bread weekly', t: 'expense' },
  { c: 4, a: 899, d: 18, n: 'WiFi bill - Airtel', t: 'expense' },
  { c: 0, a: 350, d: 19, n: 'Pani puri & momos', t: 'expense' },
  { c: 3, a: 199, d: 19, n: 'Netflix monthly', t: 'expense' },
  { c: 3, a: 119, d: 19, n: 'Spotify Premium', t: 'expense' },
  { c: 0, a: 480, d: 20, n: 'Thali meal', t: 'expense' },
  { c: 2, a: 3499, d: 20, n: 'Myntra - shirt & jeans', t: 'expense' },
  { c: 1, a: 600, d: 21, n: 'Rapido bike taxi', t: 'expense' },
  { c: 7, a: 4500, d: 21, n: 'Monthly grocery haul', t: 'expense' },
  // ── LAST MONTH ──
  { c: 0, a: 85000, d: 37, n: 'March salary credited', t: 'income' },
  { c: 8, a: 15000, d: 37, n: 'March rent', t: 'expense' },
  { c: 0, a: 560, d: 38, n: 'Lunch - office canteen', t: 'expense' },
  { c: 0, a: 1200, d: 39, n: 'Dinner with college friends', t: 'expense' },
  { c: 1, a: 450, d: 39, n: 'Cab to restaurant', t: 'expense' },
  { c: 2, a: 7999, d: 40, n: 'Amazon - mechanical keyboard', t: 'expense' },
  { c: 4, a: 1800, d: 40, n: 'Electricity bill', t: 'expense' },
  { c: 5, a: 800, d: 41, n: 'Medicine - cold & flu', t: 'expense' },
  { c: 0, a: 320, d: 42, n: 'Breakfast - poha', t: 'expense' },
  { c: 7, a: 3800, d: 42, n: 'Groceries - Zepto', t: 'expense' },
  { c: 3, a: 250, d: 43, n: 'Bowling alley', t: 'expense' },
  { c: 0, a: 430, d: 44, n: 'Paneer tikka', t: 'expense' },
  { c: 1, a: 700, d: 44, n: 'Uber pool', t: 'expense' },
  { c: 2, a: 899, d: 45, n: 'Phone screen protector', t: 'expense' },
  { c: 0, a: 280, d: 46, n: 'Juice & snacks', t: 'expense' },
  { c: 7, a: 2200, d: 47, n: 'Fruits & dry fruits', t: 'expense' },
  { c: 3, a: 199, d: 48, n: 'Netflix', t: 'expense' },
  { c: 0, a: 1500, d: 49, n: 'Birthday dinner', t: 'expense' },
  { c: 2, a: 5000, d: 49, n: 'Investment - mutual fund SIP', t: 'income' },
  { c: 9, a: 500, d: 50, n: 'ATM withdrawal fee', t: 'expense' },
  // ── 2 MONTHS AGO ──
  { c: 0, a: 85000, d: 67, n: 'February salary', t: 'income' },
  { c: 8, a: 15000, d: 67, n: 'February rent', t: 'expense' },
  { c: 0, a: 620, d: 68, n: 'Lunch', t: 'expense' },
  { c: 0, a: 1100, d: 69, n: 'Restaurant dinner', t: 'expense' },
  { c: 1, a: 450, d: 69, n: 'Metro rides', t: 'expense' },
  { c: 2, a: 3200, d: 70, n: 'Amazon order', t: 'expense' },
  { c: 4, a: 2000, d: 70, n: 'Bills & utilities', t: 'expense' },
  { c: 7, a: 3800, d: 71, n: 'Groceries', t: 'expense' },
  { c: 5, a: 1500, d: 72, n: 'Dental checkup', t: 'expense' },
  { c: 0, a: 850, d: 73, n: 'Dinner out', t: 'expense' },
  { c: 3, a: 199, d: 74, n: 'Netflix', t: 'expense' },
  { c: 6, a: 1800, d: 75, n: 'Online course', t: 'expense' },
  { c: 2, a: 2499, d: 76, n: 'Shoes - Nike', t: 'expense' },
  { c: 0, a: 10000, d: 78, n: 'Freelance payment received', t: 'income' },
  // ── 3 MONTHS AGO ──
  { c: 0, a: 85000, d: 97, n: 'January salary', t: 'income' },
  { c: 8, a: 15000, d: 97, n: 'January rent', t: 'expense' },
  { c: 0, a: 750, d: 98, n: 'Lunch', t: 'expense' },
  { c: 7, a: 4200, d: 99, n: 'Groceries', t: 'expense' },
  { c: 4, a: 2200, d: 100, n: 'Electricity + water', t: 'expense' },
  { c: 2, a: 15000, d: 101, n: 'New year shopping', t: 'expense' },
  { c: 3, a: 800, d: 102, n: 'Concert tickets', t: 'expense' },
  { c: 0, a: 3500, d: 103, n: 'New year party dinner', t: 'expense' },
  { c: 1, a: 2500, d: 104, n: 'Airport cab', t: 'expense' },
  { c: 3, a: 15000, d: 105, n: 'Year-end bonus', t: 'income' },
];

/**
 * 6 active monthly budgets — covers the most common spending categories.
 * `catIdx` indexes into the expense category list.
 */
export const DEMO_BUDGETS: { catIdx: number; amount: number }[] = [
  { catIdx: 0, amount: 8000 },  // Food & Dining
  { catIdx: 1, amount: 3000 },  // Transport
  { catIdx: 7, amount: 7000 },  // Groceries
  { catIdx: 3, amount: 2000 },  // Entertainment
  { catIdx: 2, amount: 10000 }, // Shopping
  { catIdx: 4, amount: 5000 },  // Bills
];

/**
 * 5 savings goals at varying progress levels — including one completed.
 */
export const DEMO_GOALS = [
  { name: 'Goa Trip', target: 50000, saved: 38500, color: '#FF6B6B', deadline: 35 },
  { name: 'Emergency Fund', target: 200000, saved: 112000, color: '#4ECDC4', deadline: 180 },
  { name: 'MacBook Pro', target: 150000, saved: 150000, color: '#45B7D1', deadline: -5 },
  { name: 'Wedding Gift', target: 25000, saved: 8000, color: '#F39C12', deadline: 60 },
  { name: 'New Phone', target: 40000, saved: 28000, color: '#9B59B6', deadline: 20 },
];

/**
 * 7 active recurring rules — subscriptions, bills, and the monthly salary credit.
 */
export const DEMO_RECURRING = [
  { notes: 'Netflix', amount: 199, type: 'expense' as const, freq: 'monthly', catIdx: 3, dueIn: 12 },
  { notes: 'Spotify Premium', amount: 119, type: 'expense' as const, freq: 'monthly', catIdx: 3, dueIn: 19 },
  { notes: 'House Rent', amount: 15000, type: 'expense' as const, freq: 'monthly', catIdx: 8, dueIn: 24 },
  { notes: 'Gym Membership', amount: 2500, type: 'expense' as const, freq: 'monthly', catIdx: 5, dueIn: 18 },
  { notes: 'WiFi - Airtel', amount: 899, type: 'expense' as const, freq: 'monthly', catIdx: 4, dueIn: 8 },
  { notes: 'Mutual Fund SIP', amount: 5000, type: 'expense' as const, freq: 'monthly', catIdx: 9, dueIn: 5 },
  { notes: 'Monthly Salary', amount: 85000, type: 'income' as const, freq: 'monthly', catIdx: 0, dueIn: 25 },
];

/**
 * 5 loans — mix of lending/borrowing, active/paid, on-time/overdue.
 */
export const DEMO_LOANS = [
  { person: 'Rahul', amount: 5000, type: 'lending' as const, dueIn: 15, status: 'active', notes: 'For dinner last week' },
  { person: 'Priya', amount: 12000, type: 'borrowing' as const, dueIn: -3, status: 'active', notes: 'Rent help' },
  { person: 'Mom', amount: 20000, type: 'lending' as const, dueIn: 30, status: 'paid', notes: null },
  { person: 'Amit', amount: 3000, type: 'lending' as const, dueIn: 7, status: 'active', notes: 'Movie + food' },
  { person: 'Sneha', amount: 8000, type: 'borrowing' as const, dueIn: 45, status: 'active', notes: 'Trip expenses' },
];
