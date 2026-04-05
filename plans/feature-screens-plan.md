Since I cannot use a Write tool (read-only mode), I will provide the complete plan directly in my response. I have now read every single file in this project and fully understand the architecture. Here is the comprehensive screen-by-screen implementation plan.

---

# Zorvyn -- Complete Screen-by-Screen Implementation Plan

## Existing Infrastructure Summary

**What is built and ready:**
- SQLite database with full schema (accounts, categories, transactions, budgets, goals, goal_contributions, tags, recurring_rules, user_preferences) plus FTS5 search index
- All repositories (BaseRepository, TransactionRepository, AccountRepository, CategoryRepository, BudgetRepository, GoalRepository, GoalContributionRepository, UserPreferencesRepository)
- Database provider with `useDatabase()` and `useDatabaseStatus()` hooks
- TanStack Query provider with MMKV persistence and centralized `queryKeys`
- 3 Zustand stores: `useAppStore` (theme, onboarding), `useCurrencyStore` (currencyCode), `useFiltersStore` (dateRange, account, category, type, search)
- Currency formatting service (INR, USD, EUR, GBP, JPY, AED, CAD, AUD, SGD, CNY)
- Date utilities (formatDate, startOfDay, endOfDay, startOfWeek, startOfMonth, endOfMonth, daysRemaining, getRelativeTime)
- Validators (isPositiveNumber, isNonEmptyString, isValidCurrencyCode, isValidDate, isValidUUID, clamp)
- FTS5 search engine for transaction notes
- Export service (CSV/JSON) and sharing utilities
- Theme tokens (colors, typography, spacing/borderRadius)
- Route skeleton: Root layout with Stack (tabs, onboarding, transaction, budget, goal groups), Tab layout with 4 tabs (Home, Transactions, Insights, Settings) -- all placeholder content
- All feature directories scaffolded but empty

**What is NOT built:**
- Every file in `src/features/*/`
- Every file in `src/components/ui/`, `src/components/feedback/`, `src/components/shared/`
- Route files for onboarding (`src/app/(onboarding)/*`), transaction modals (`src/app/transaction/*`), budget modals (`src/app/budget/*`), goal modals (`src/app/goal/*`)
- The actual screens referenced by existing tab routes

**Icon system:** The seed categories use Feather icon names (utensils, car, shopping-bag, film, zap, heart, book, shopping-cart, home, more-horizontal, briefcase, code, trending-up, gift, plus-circle). The project does NOT currently have an icon library installed. You need to install `@expo/vector-icons` (bundled with Expo) or use it directly since it ships with Expo.

---

## 0. SHARED UI COMPONENTS (Build First)

These must be built before any screen since every feature depends on them.

### 0A. `src/components/ui/button.tsx`

```
Props:
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size: 'sm' | 'md' | 'lg'
  label: string
  onPress: () => void
  disabled?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  fullWidth?: boolean
  className?: string
```

Layout:
```
[Pressable className="flex-row items-center justify-center rounded-xl"]
  {loading ? <ActivityIndicator /> : leftIcon}
  <Text>{label}</Text>
[/Pressable]
```

NativeWind variants:
- primary: `bg-violet-600 active:bg-violet-700`
- secondary: `bg-gray-100 dark:bg-gray-800`
- outline: `border border-violet-600 bg-transparent`
- ghost: `bg-transparent`
- danger: `bg-red-500 active:bg-red-600`
- sm: `px-3 py-2`, md: `px-4 py-3`, lg: `px-6 py-4`

Animations: use `react-native-reanimated` for scale-on-press (`useAnimatedStyle` with `withSpring(0.97)` on pressIn, `withSpring(1)` on pressOut).

### 0B. `src/components/ui/input.tsx`

```
Props:
  label?: string
  placeholder?: string
  value: string
  onChangeText: (text: string) => void
  error?: string
  keyboardType?: KeyboardTypeOptions
  multiline?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  className?: string
```

Layout:
```
[View]
  {label && <Text className="text-sm font-medium text-gray-600 mb-1">{label}</Text>}
  [View className="flex-row items-center border rounded-xl px-3 py-3 bg-white dark:bg-gray-900"]
    {leftIcon}
    <TextInput className="flex-1 text-base" />
    {rightIcon}
  [/View]
  {error && <Text className="text-sm text-red-500 mt-1">{error}</Text>}
[/View]
```

Border color: default `border-gray-200`, focused `border-violet-500`, error `border-red-500`. Use `Animated` for border color transition.

### 0C. `src/components/ui/card.tsx`

```
Props:
  children: React.ReactNode
  onPress?: () => void
  className?: string
  variant?: 'elevated' | 'outlined' | 'filled'
```

Layout:
```
[Pressable/View className="bg-white dark:bg-gray-900 rounded-2xl p-4 {variant classes}"]
  {children}
[/Pressable or View]
```

Variants:
- elevated: `shadow-sm shadow-black/10` (iOS shadow) + `elevation-2` (Android)
- outlined: `border border-gray-200 dark:border-gray-700`
- filled: `bg-gray-50 dark:bg-gray-800`

### 0D. `src/components/ui/modal.tsx`

A bottom sheet modal wrapper using `react-native-reanimated` for slide-up animation.

```
Props:
  visible: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  snapPoints?: number[]  // percentage of screen height, e.g. [0.5, 0.9]
```

Implementation: Use a full-screen `Modal` with `transparent` background, a `Pressable` backdrop with `bg-black/40`, and an `Animated.View` that slides up using `withSpring`. Pan-to-dismiss using `useAnimatedGestureHandler` from reanimated + gesture-handler.

Layout:
```
[Modal transparent visible={visible}]
  [Pressable className="flex-1 bg-black/40" onPress={onClose}]
  [Animated.View className="bg-white dark:bg-gray-900 rounded-t-3xl px-4 pt-3 pb-8"]
    [View className="w-10 h-1 rounded-full bg-gray-300 self-center mb-4"]  // drag handle
    {title && <Text className="text-lg font-semibold mb-4">{title}</Text>}
    {children}
  [/Animated.View]
[/Modal]
```

### 0E. `src/components/ui/badge.tsx`

```
Props:
  label: string
  color?: string  // hex color for background (with opacity)
  variant?: 'filled' | 'outline'
  size?: 'sm' | 'md'
```

Layout:
```
[View className="rounded-full px-2 py-0.5" style={{ backgroundColor: color + '20' }}]
  <Text className="text-xs font-medium" style={{ color }}>{label}</Text>
[/View]
```

### 0F. `src/components/ui/progress-bar.tsx`

```
Props:
  progress: number  // 0 to 1
  color?: string    // defaults to computed green/yellow/red
  height?: number   // default 8
  showLabel?: boolean
  animated?: boolean
  className?: string
```

Color logic: progress < 0.6 => colors.success, 0.6-0.8 => colors.warning, > 0.8 => colors.error.

Layout:
```
[View className="rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800" style={{ height }}]
  [Animated.View className="rounded-full" style={{ width: animatedWidth, backgroundColor: color }}]
[/View]
{showLabel && <Text className="text-xs text-gray-500 mt-1">{Math.round(progress * 100)}%</Text>}
```

Animation: Use `useAnimatedStyle` with `withTiming` to animate width from 0 to target.

### 0G. `src/components/ui/skeleton.tsx`

```
Props:
  width?: number | string
  height?: number
  borderRadius?: number
  className?: string
```

Uses reanimated `useSharedValue` + `useAnimatedStyle` with `withRepeat(withTiming(...))` to pulse opacity between 0.3 and 0.7.

### 0H. `src/components/ui/divider.tsx`

```
Props:
  className?: string
```

Simply: `<View className="h-px bg-gray-200 dark:bg-gray-700 my-2 {className}" />`

### 0I. `src/components/ui/fab.tsx`

Floating Action Button -- not in the original architecture doc but essential for the Paisa-style design.

```
Props:
  onPress: () => void
  icon?: React.ReactNode   // defaults to "+" icon
  className?: string
```

Layout:
```
[Pressable className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-violet-600 items-center justify-center shadow-lg"]
  <Feather name="plus" size={24} color="white" />
[/Pressable]
```

Animation: Scale spring on press. Entry animation: `FadeInUp.springify()` from reanimated layout animations.

### 0J. `src/components/feedback/empty-state.tsx`

```
Props:
  icon?: string  // Feather icon name
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
```

Layout:
```
[View className="flex-1 items-center justify-center px-8"]
  <Feather name={icon} size={64} color={colors.textSecondary} />
  <Text className="text-lg font-semibold text-gray-800 mt-4">{title}</Text>
  <Text className="text-sm text-gray-500 text-center mt-2">{description}</Text>
  {actionLabel && <Button variant="primary" label={actionLabel} onPress={onAction} />}
[/View]
```

### 0K. `src/components/feedback/error-state.tsx`

```
Props:
  message?: string  // defaults to "Something went wrong"
  onRetry?: () => void
```

Layout:
```
[View className="flex-1 items-center justify-center px-8"]
  <Feather name="alert-circle" size={64} color={colors.error} />
  <Text className="text-lg font-semibold text-gray-800 mt-4">{message}</Text>
  {onRetry && <Button variant="outline" label="Try Again" onPress={onRetry} />}
[/View]
```

### 0L. `src/components/feedback/loading-state.tsx`

```
Props:
  variant?: 'spinner' | 'skeleton'
  message?: string
```

For spinner: centered `ActivityIndicator` with optional message text.
For skeleton: renders a few `Skeleton` components in a list-like pattern (used when we know the layout shape).

### 0M. `src/components/shared/currency-text.tsx`

```
Props:
  amount: number
  currencyCode?: string  // defaults to useCurrencyStore().currencyCode
  type?: 'income' | 'expense' | 'transfer'  // controls color
  compact?: boolean
  style?: TextStyle
  className?: string
```

Implementation: Calls `formatCurrency` or `formatCompactCurrency` from `@core/currency`. Colors: income => `text-emerald-500`, expense => `text-red-500`, transfer => `text-blue-500`.

### 0N. `src/components/shared/category-icon.tsx`

```
Props:
  iconName: string
  color: string
  size?: 'sm' | 'md' | 'lg'  // 32, 40, 48
```

Layout:
```
[View className="items-center justify-center rounded-xl" style={{ backgroundColor: color + '15', width: size, height: size }}]
  <Feather name={iconName} size={size * 0.5} color={color} />
[/View]
```

### 0O. `src/components/shared/amount-input.tsx`

Large, prominent amount input for transaction entry.

```
Props:
  value: string
  onChangeText: (text: string) => void
  currencyCode?: string
  autoFocus?: boolean
```

Layout:
```
[View className="items-center py-8"]
  [View className="flex-row items-baseline"]
    <Text className="text-2xl font-bold text-gray-400 mr-1">{symbol}</Text>
    <TextInput
      className="text-5xl font-bold text-gray-900 dark:text-white min-w-[80px]"
      keyboardType="decimal-pad"
      value={value}
      onChangeText={onChangeText}
      placeholder="0"
      placeholderTextColor="#D1D5DB"
    />
  [/View]
[/View]
```

### 0P. `src/components/shared/date-range-picker.tsx`

```
Props:
  startDate: string | null
  endDate: string | null
  onSelect: (range: { start: string; end: string }) => void
  presets?: Array<{ label: string; range: { start: string; end: string } }>
```

Renders preset chips (Today, This Week, This Month, This Year, Custom) horizontally scrollable. Custom opens a date picker modal.

---

## 1. DASHBOARD (Home Tab)

**Route file:** `src/app/(tabs)/index.tsx` -- replace current placeholder with thin re-export:
```typescript
export { DashboardScreen as default } from '@features/dashboard/screens/dashboard-screen';
```

### Layout Mockup (ASCII)

```
+------------------------------------------+
| StatusBar                                |
+------------------------------------------+
| [Header: "Zorvyn"         avatar/bell]   |
+------------------------------------------+
| ScrollView (vertical, pull-to-refresh)   |
|                                          |
| +--------------------------------------+ |
| | BALANCE CARD                         | |
| | "Total Balance"                      | |
| | ₹1,23,456.78                         | |
| | [Bank] ₹80K  [Cash] ₹20K  [+]      | |
| +--------------------------------------+ |
|                                          |
| +--------------------------------------+ |
| | QUICK STATS (3 columns)             | |
| | [Income]    [Expenses]   [Savings]   | |
| | ₹50,000     ₹35,000      30%        | |
| | this month  this month   rate        | |
| +--------------------------------------+ |
|                                          |
| +--------------------------------------+ |
| | SPENDING CHART                       | |
| | "This Month's Spending"  [see all]   | |
| |        [Pie Chart]                   | |
| | Food 35%  Transport 20%  ...         | |
| +--------------------------------------+ |
|                                          |
| +--------------------------------------+ |
| | RECENT TRANSACTIONS                  | |
| | "Recent"                 [see all]   | |
| | > Food & Dining   -₹250   Today     | |
| | > Salary          +₹50K   Yesterday | |
| | > Transport       -₹120   Yesterday | |
| | > Shopping        -₹800   Mon       | |
| | > Bills           -₹1200  Mon       | |
| +--------------------------------------+ |
|                                          |
| GOALS PROGRESS (horizontal scroll)      |
| +--------+ +--------+ +--------+       |
| |Vacation| |EmergFnd| |Laptop  |       |
| | ■■■□□  | | ■■■■□  | | ■□□□□  |       |
| | ₹30K/1L| | ₹80K/1L| | ₹10K/8K|      |
| +--------+ +--------+ +--------+       |
|                                          |
+------------------------------------------+
| [FAB +]                                  |
+------------------------------------------+
| [Home*] [Trans] [Insights] [Settings]    |
+------------------------------------------+
```

### Components

| File | Purpose |
|------|---------|
| `src/features/dashboard/components/balance-card.tsx` | Total balance card with account pills |
| `src/features/dashboard/components/quick-stats.tsx` | 3-column income/expense/savings rate |
| `src/features/dashboard/components/spending-chart.tsx` | Pie chart with category legend |
| `src/features/dashboard/components/recent-transactions.tsx` | Last 5 transactions list |
| `src/features/dashboard/components/savings-progress.tsx` | Horizontal scrollable goal cards |
| `src/features/dashboard/screens/dashboard-screen.tsx` | Screen orchestrator |
| `src/features/dashboard/types/index.ts` | DashboardData, QuickStats types |

### Hooks

**`src/features/dashboard/hooks/use-dashboard-data.ts`**

This is the single aggregation hook for the dashboard. It composes multiple TanStack queries:

```typescript
export function useDashboardData() {
  const db = useDatabase();
  const accountRepo = useMemo(() => new AccountRepository(db), [db]);
  const transactionRepo = useMemo(() => new TransactionRepository(db), [db]);
  const goalRepo = useMemo(() => new GoalRepository(db), [db]);
  const categoryRepo = useMemo(() => new CategoryRepository(db), [db]);

  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  // Query 1: All accounts (for total balance)
  const accountsQuery = useQuery({
    queryKey: queryKeys.accounts.all,
    queryFn: () => accountRepo.getAll(),
  });

  // Query 2: Income this month
  const incomeQuery = useQuery({
    queryKey: queryKeys.transactions.totals(monthStart, monthEnd),
    queryFn: () => transactionRepo.getTotalByType('income', monthStart, monthEnd),
  });

  // Query 3: Expense this month
  const expenseQuery = useQuery({
    queryKey: [...queryKeys.transactions.totals(monthStart, monthEnd), 'expense'],
    queryFn: () => transactionRepo.getTotalByType('expense', monthStart, monthEnd),
  });

  // Query 4: Transactions this month (for pie chart + recent list)
  const transactionsQuery = useQuery({
    queryKey: queryKeys.transactions.byDateRange(monthStart, monthEnd),
    queryFn: () => transactionRepo.getByDateRange(monthStart, monthEnd),
  });

  // Query 5: Active goals
  const goalsQuery = useQuery({
    queryKey: queryKeys.goals.active,
    queryFn: () => goalRepo.getActive(),
  });

  // Query 6: All categories (for icon/color lookup)
  const categoriesQuery = useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => categoryRepo.getAll(),
  });

  // Derived computations
  const totalBalance = accountsQuery.data?.reduce((sum, a) => sum + a.balance, 0) ?? 0;
  const totalIncome = incomeQuery.data ?? 0;
  const totalExpense = expenseQuery.data ?? 0;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

  // Category breakdown for pie chart
  const categoryBreakdown = useMemo(() => {
    // Group expense transactions by category_id, sum amounts, 
    // join with categories for name/color/icon
  }, [transactionsQuery.data, categoriesQuery.data]);

  // Recent 5 transactions
  const recentTransactions = transactionsQuery.data?.slice(0, 5) ?? [];

  const isLoading = accountsQuery.isLoading || incomeQuery.isLoading || /* ... */;
  const isError = accountsQuery.isError || /* ... */;

  const refetchAll = () => {
    accountsQuery.refetch();
    incomeQuery.refetch();
    expenseQuery.refetch();
    transactionsQuery.refetch();
    goalsQuery.refetch();
  };

  return {
    totalBalance, accounts: accountsQuery.data,
    totalIncome, totalExpense, savingsRate,
    categoryBreakdown, recentTransactions,
    goals: goalsQuery.data, categories: categoriesQuery.data,
    isLoading, isError, refetchAll,
  };
}
```

### Data Flow

| Component | Repository Method | Query Key |
|-----------|------------------|-----------|
| BalanceCard | `accountRepo.getAll()` | `queryKeys.accounts.all` |
| QuickStats | `transactionRepo.getTotalByType('income', start, end)` | `queryKeys.transactions.totals(start, end)` |
| QuickStats | `transactionRepo.getTotalByType('expense', start, end)` | `[...queryKeys.transactions.totals(start, end), 'expense']` |
| SpendingChart | `transactionRepo.getByDateRange(start, end)` + `categoryRepo.getAll()` | `queryKeys.transactions.byDateRange(...)` + `queryKeys.categories.all` |
| RecentTransactions | Same query as above, sliced to 5 | (shared) |
| SavingsProgress | `goalRepo.getActive()` | `queryKeys.goals.active` |

### Component Detail: `balance-card.tsx`

```
Props:
  totalBalance: number
  accounts: Account[]
  currencyCode: string
```

Layout:
```
[Card variant="elevated" className="bg-violet-600 mx-4 mt-4"]
  <Text className="text-sm text-violet-200">Total Balance</Text>
  <CurrencyText amount={totalBalance} className="text-3xl font-bold text-white mt-1" />
  [ScrollView horizontal className="flex-row mt-4 gap-2"]
    {accounts.map(a => 
      [View className="bg-white/20 rounded-lg px-3 py-1.5"]
        <Text className="text-xs text-violet-100">{a.name}</Text>
        <CurrencyText amount={a.balance} className="text-sm text-white font-semibold" />
      [/View]
    )}
  [/ScrollView]
[/Card]
```

Animation: Card entry uses `FadeInDown.delay(100).springify()`.

### Component Detail: `quick-stats.tsx`

```
Props:
  income: number
  expense: number
  savingsRate: number
  currencyCode: string
```

Layout:
```
[View className="flex-row mx-4 mt-4 gap-3"]
  [Card className="flex-1 items-center py-3"]
    <Feather name="trending-up" color={colors.income} />
    <CurrencyText amount={income} compact type="income" className="text-base font-bold mt-1" />
    <Text className="text-xs text-gray-500">Income</Text>
  [/Card]
  [Card className="flex-1 items-center py-3"]
    <Feather name="trending-down" color={colors.expense} />
    <CurrencyText amount={expense} compact type="expense" className="text-base font-bold mt-1" />
    <Text className="text-xs text-gray-500">Expenses</Text>
  [/Card]
  [Card className="flex-1 items-center py-3"]
    <Feather name="pie-chart" color={colors.primary} />
    <Text className="text-base font-bold mt-1">{savingsRate.toFixed(0)}%</Text>
    <Text className="text-xs text-gray-500">Saved</Text>
  [/Card]
[/View]
```

Animation: Staggered `FadeInUp` with increasing delay per card.

### Component Detail: `spending-chart.tsx`

```
Props:
  data: Array<{ categoryName: string; amount: number; color: string; percentage: number }>
  onSeeAll: () => void
```

Uses `PieChart` from `react-native-gifted-charts`.

Layout:
```
[Card className="mx-4 mt-4"]
  [View className="flex-row justify-between items-center mb-3"]
    <Text className="text-base font-semibold">This Month's Spending</Text>
    <Pressable onPress={onSeeAll}>
      <Text className="text-sm text-violet-600">See All</Text>
    </Pressable>
  [/View]
  [View className="items-center"]
    <PieChart
      data={pieData}
      donut
      innerRadius={60}
      radius={90}
      centerLabelComponent={() => <CurrencyText amount={total} compact className="text-lg font-bold" />}
    />
  [/View]
  [View className="flex-row flex-wrap mt-3 gap-2"]
    {data.slice(0, 4).map(item =>
      [View className="flex-row items-center"]
        [View className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: item.color }}]
        <Text className="text-xs text-gray-600">{item.categoryName} {item.percentage}%</Text>
      [/View]
    )}
  [/View]
[/Card]
```

### Component Detail: `recent-transactions.tsx`

```
Props:
  transactions: Transaction[]
  categories: Map<string, Category>  // lookup map
  onSeeAll: () => void
  onPress: (id: string) => void
```

Layout:
```
[Card className="mx-4 mt-4"]
  [View className="flex-row justify-between items-center mb-3"]
    <Text className="text-base font-semibold">Recent</Text>
    <Pressable onPress={onSeeAll}><Text className="text-sm text-violet-600">See All</Text></Pressable>
  [/View]
  {transactions.map((tx, i) => (
    [Pressable key={tx.id} onPress={() => onPress(tx.id)} className="flex-row items-center py-3 {i > 0 && 'border-t border-gray-100'}"]
      <CategoryIcon iconName={cat.icon} color={cat.color} size="md" />
      [View className="flex-1 ml-3"]
        <Text className="text-sm font-medium text-gray-800">{cat.name}</Text>
        <Text className="text-xs text-gray-500">{tx.notes ?? getRelativeTime(tx.date)}</Text>
      [/View]
      <CurrencyText amount={tx.amount} type={tx.type} className="text-sm font-semibold" />
    [/Pressable]
  ))}
[/Card]
```

### Component Detail: `savings-progress.tsx`

```
Props:
  goals: Goal[]
  onPress: (id: string) => void
```

Layout:
```
[View className="mt-4 mb-24"]
  <Text className="text-base font-semibold mx-4 mb-3">Savings Goals</Text>
  [ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4"]
    {goals.map(goal => (
      [Card key={goal.id} onPress={() => onPress(goal.id)} className="w-40 mr-3"]
        [View className="flex-row items-center mb-2"]
          <Feather name={goal.icon ?? 'target'} size={16} color={goal.color ?? colors.primary} />
          <Text className="text-sm font-medium ml-2 flex-1" numberOfLines={1}>{goal.name}</Text>
        [/View]
        <ProgressBar progress={goal.current_amount / goal.target_amount} height={6} />
        <Text className="text-xs text-gray-500 mt-1">
          {formatCompactCurrency(goal.current_amount)} / {formatCompactCurrency(goal.target_amount)}
        </Text>
      [/Card]
    ))}
  [/ScrollView]
[/View]
```

### User Interactions

| Interaction | Action |
|-------------|--------|
| Pull to refresh on ScrollView | Calls `refetchAll()` from hook |
| Tap FAB (+) | Navigate to `/transaction/add` |
| Tap a recent transaction | Navigate to `/transaction/[id]` |
| Tap "See All" on Recent | Navigate to `/(tabs)/transactions` |
| Tap "See All" on Spending | Navigate to `/(tabs)/analytics` |
| Tap a goal card | Navigate to `/goal/[id]` |
| Tap an account pill on balance card | Navigate to `/(tabs)/transactions` with that account filter set |

### States

| State | Rendering |
|-------|-----------|
| Loading | `LoadingState variant="skeleton"` -- show Skeleton shapes mimicking the card layout |
| Empty (no transactions) | Balance card shows ₹0, QuickStats show ₹0, SpendingChart replaced by EmptyState ("No spending this month. Add your first transaction!"), RecentTransactions shows EmptyState |
| Empty (no goals) | SavingsProgress section hidden or shows "Set a savings goal" card |
| Error | `ErrorState` with retry button calling `refetchAll()` |
| Populated | Full layout as described |

### Animations

| Element | Animation |
|---------|-----------|
| Balance card | `FadeInDown.delay(100).springify()` on mount |
| Quick stats cards | Staggered `FadeInUp.delay(200 + i*100).springify()` |
| Pie chart | Built-in `react-native-gifted-charts` animation (set `animationDuration={800}`) |
| Recent transactions | Each row `FadeInRight.delay(i * 50)` |
| Goal cards | `FadeIn` as they scroll into view |
| FAB | `FadeInUp.springify().delay(500)` |

### Dashboard Screen Orchestrator: `dashboard-screen.tsx`

```typescript
export function DashboardScreen() {
  const { totalBalance, accounts, totalIncome, totalExpense, savingsRate,
          categoryBreakdown, recentTransactions, goals, categories,
          isLoading, isError, refetchAll } = useDashboardData();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => { setRefreshing(true); await refetchAll(); setRefreshing(false); };

  if (isError) return <ErrorState onRetry={refetchAll} />;

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-950">
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {isLoading ? <DashboardSkeleton /> : (
          <>
            <BalanceCard totalBalance={totalBalance} accounts={accounts} />
            <QuickStats income={totalIncome} expense={totalExpense} savingsRate={savingsRate} />
            <SpendingChart data={categoryBreakdown} onSeeAll={() => router.push('/(tabs)/analytics')} />
            <RecentTransactions
              transactions={recentTransactions}
              categories={categoriesMap}
              onSeeAll={() => router.push('/(tabs)/transactions')}
              onPress={(id) => router.push(`/transaction/${id}`)}
            />
            {goals.length > 0 && (
              <SavingsProgress goals={goals} onPress={(id) => router.push(`/goal/${id}`)} />
            )}
          </>
        )}
      </ScrollView>
      <FAB onPress={() => router.push('/transaction/add')} />
    </View>
  );
}
```

---

## 2. TRANSACTIONS (Tab)

**Route file:** `src/app/(tabs)/transactions.tsx` -- replace with:
```typescript
export { TransactionsScreen as default } from '@features/transactions/screens/transactions-screen';
```

### Layout Mockup

```
+------------------------------------------+
| StatusBar                                |
+------------------------------------------+
| [Header: "Transactions"        🔍]       |
+------------------------------------------+
| [Search Bar: "Search transactions..."]   |
+------------------------------------------+
| [All] [Income] [Expense] [This Month ▼] |
+------------------------------------------+
| SectionList (grouped by date)            |
|                                          |
|  TODAY                                   |
|  +------------------------------------+  |
|  | 🍴 Food & Dining     -₹250        |  |
|  |    Coffee at Starbucks             |  |
|  +------------------------------------+  |
|  | 🛒 Groceries          -₹1,200     |  |
|  |    Weekly groceries                |  |
|  +------------------------------------+  |
|                                          |
|  YESTERDAY                               |
|  +------------------------------------+  |
|  | 💼 Salary             +₹50,000    |  |
|  |                                    |  |
|  +------------------------------------+  |
|  | 🚗 Transport          -₹120       |  |
|  |    Uber to office                  |  |
|  +------------------------------------+  |
|                                          |
|  THIS WEEK                               |
|  +------------------------------------+  |
|  | 🛍 Shopping            -₹3,400    |  |
|  |    Amazon order                    |  |
|  +------------------------------------+  |
|                                          |
|  EARLIER                                 |
|  +------------------------------------+  |
|  | ...                                |  |
|  +------------------------------------+  |
|                                          |
+------------------------------------------+
| [FAB +]                                  |
+------------------------------------------+
| [Home] [Trans*] [Insights] [Settings]    |
+------------------------------------------+
```

### Components

| File | Purpose |
|------|---------|
| `src/features/transactions/components/transaction-list.tsx` | SectionList with date-grouped sections, swipe-to-delete |
| `src/features/transactions/components/transaction-card.tsx` | Single transaction row item |
| `src/features/transactions/components/transaction-filters.tsx` | Horizontal filter chips |
| `src/features/transactions/components/category-picker.tsx` | Grid of category icons (used in add/edit form) |
| `src/features/transactions/services/transaction-service.ts` | Grouping logic, filtering, search |
| `src/features/transactions/screens/transactions-screen.tsx` | Screen orchestrator |
| `src/features/transactions/types/index.ts` | TransactionWithCategory, TransactionGroup types |

### Hooks

**`src/features/transactions/hooks/use-transactions.ts`**

```typescript
export function useTransactions() {
  const db = useDatabase();
  const transactionRepo = useMemo(() => new TransactionRepository(db), [db]);
  const categoryRepo = useMemo(() => new CategoryRepository(db), [db]);
  const { dateRange, selectedAccountId, selectedCategoryId, selectedType } = useFiltersStore();

  // All transactions (filtered by active filters)
  const transactionsQuery = useQuery({
    queryKey: [...queryKeys.transactions.all, dateRange, selectedAccountId, selectedCategoryId, selectedType],
    queryFn: async () => {
      if (dateRange) return transactionRepo.getByDateRange(dateRange.start, dateRange.end);
      if (selectedAccountId) return transactionRepo.getByAccount(selectedAccountId);
      if (selectedCategoryId) return transactionRepo.getByCategory(selectedCategoryId);
      if (selectedType) return transactionRepo.getByType(selectedType);
      return transactionRepo.getAll();
    },
  });

  const categoriesQuery = useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => categoryRepo.getAll(),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => transactionRepo.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
    },
  });

  return { transactionsQuery, categoriesQuery, deleteMutation };
}
```

**`src/features/transactions/hooks/use-transaction-filters.ts`**

Wraps `useFiltersStore` with convenience methods and derives filter chip display state.

```typescript
export function useTransactionFilters() {
  const store = useFiltersStore();
  const activeFilterCount = [store.dateRange, store.selectedAccountId, store.selectedCategoryId, store.selectedType]
    .filter(Boolean).length;

  return { ...store, activeFilterCount };
}
```

### Service: `transaction-service.ts`

```typescript
type DateSection = 'Today' | 'Yesterday' | 'This Week' | 'Earlier';

interface TransactionSection {
  title: DateSection;
  data: TransactionWithCategory[];
}

export function groupTransactionsByDate(
  transactions: Transaction[],
  categories: Category[]
): TransactionSection[] {
  const catMap = new Map(categories.map(c => [c.id, c]));
  const today = startOfDay();
  const yesterday = startOfDay(new Date(Date.now() - 86400000));
  const weekStart = startOfWeek();

  const sections: Record<DateSection, TransactionWithCategory[]> = {
    'Today': [], 'Yesterday': [], 'This Week': [], 'Earlier': [],
  };

  for (const tx of transactions) {
    const cat = catMap.get(tx.category_id);
    const withCat = { ...tx, category: cat };
    if (tx.date >= today) sections['Today'].push(withCat);
    else if (tx.date >= yesterday) sections['Yesterday'].push(withCat);
    else if (tx.date >= weekStart) sections['This Week'].push(withCat);
    else sections['Earlier'].push(withCat);
  }

  return Object.entries(sections)
    .filter(([_, data]) => data.length > 0)
    .map(([title, data]) => ({ title: title as DateSection, data }));
}

export function searchTransactions(
  transactions: TransactionWithCategory[],
  query: string
): TransactionWithCategory[] {
  const lower = query.toLowerCase();
  return transactions.filter(tx =>
    tx.category?.name.toLowerCase().includes(lower) ||
    tx.notes?.toLowerCase().includes(lower)
  );
}
```

### Component Detail: `transaction-card.tsx`

```
Props:
  transaction: TransactionWithCategory
  onPress: () => void
  onDelete: () => void
```

Layout:
```
[Swipeable  // from react-native-gesture-handler
  renderRightActions={() => (
    [View className="bg-red-500 justify-center px-6"]
      <Feather name="trash-2" size={20} color="white" />
    [/View]
  )}
  onSwipeableOpen={(direction) => { if (direction === 'right') onDelete(); }}
]
  [Pressable onPress={onPress} className="flex-row items-center px-4 py-3 bg-white dark:bg-gray-900"]
    <CategoryIcon iconName={tx.category.icon} color={tx.category.color} size="md" />
    [View className="flex-1 ml-3"]
      <Text className="text-sm font-medium text-gray-800 dark:text-gray-100">{tx.category.name}</Text>
      {tx.notes && <Text className="text-xs text-gray-500 mt-0.5" numberOfLines={1}>{tx.notes}</Text>}
    [/View]
    [View className="items-end"]
      <CurrencyText
        amount={tx.type === 'income' ? tx.amount : -tx.amount}
        type={tx.type}
        className="text-sm font-semibold"
      />
      <Text className="text-xs text-gray-400 mt-0.5">{getRelativeTime(tx.date)}</Text>
    [/View]
  [/Pressable]
[/Swipeable]
```

### Component Detail: `transaction-filters.tsx`

```
Props:
  // reads from useTransactionFilters() internally
```

Layout:
```
[ScrollView horizontal className="px-4 py-2" showsHorizontalScrollIndicator={false}]
  [FilterChip label="All" active={!selectedType} onPress={() => setSelectedType(null)} /]
  [FilterChip label="Income" active={selectedType === 'income'} onPress={() => setSelectedType('income')} color={colors.income} /]
  [FilterChip label="Expense" active={selectedType === 'expense'} onPress={() => setSelectedType('expense')} color={colors.expense} /]
  [FilterChip label="This Month" active={!!dateRange} onPress={openDatePicker} /]
  [FilterChip label="Category ▼" active={!!selectedCategoryId} onPress={openCategoryPicker} /]
[/ScrollView]
```

Each `FilterChip` is a small internal component: `Pressable` with `rounded-full px-3 py-1.5`, active state `bg-violet-600 text-white`, inactive `bg-gray-100 text-gray-600`.

### User Interactions

| Interaction | Action |
|-------------|--------|
| Pull to refresh | `transactionsQuery.refetch()` |
| Type in search bar | Debounced (300ms), calls `searchTransactions()` locally or `FTSSearchEngine.search()` for notes |
| Tap filter chip | Updates `useFiltersStore`, query refetches automatically via key change |
| Tap transaction row | Navigate to `/transaction/[id]` |
| Swipe transaction left | Reveals red delete action. On full swipe or tap, shows Alert.alert confirmation, then calls `deleteMutation.mutate(id)` |
| Tap FAB (+) | Navigate to `/transaction/add` |

### States

| State | Rendering |
|-------|-----------|
| Loading | `LoadingState variant="skeleton"` -- 6 skeleton rows |
| Empty (no transactions ever) | `EmptyState icon="receipt" title="No transactions yet" description="Tap + to add your first transaction" actionLabel="Add Transaction" onAction={navigateToAdd}` |
| Empty (filters active but no results) | `EmptyState icon="search" title="No results" description="Try adjusting your filters"` |
| Error | `ErrorState onRetry={refetch}` |
| Populated | SectionList with grouped data |

### Animations

| Element | Animation |
|---------|-----------|
| Transaction rows | `FadeInRight` as they enter the list |
| Swipe delete | Built-in `Swipeable` gesture animation |
| Filter chip selection | `withSpring` scale + background color transition |
| Section headers | `FadeIn` |

---

## 3. ADD TRANSACTION (Modal/Bottom Sheet)

**Route files needed:**
- `src/app/transaction/_layout.tsx` -- Stack layout for transaction flow
- `src/app/transaction/add.tsx` -- re-exports `AddTransactionScreen`

The root `_layout.tsx` already declares `<Stack.Screen name="transaction" options={{ presentation: 'modal' }} />`.

### Layout Mockup

```
+------------------------------------------+
| [X Close]    Add Transaction    [Save]   |
+------------------------------------------+
|                                          |
|              ₹ 0                         |
|         (large amount input)             |
|                                          |
+------------------------------------------+
| [Income]  [*Expense*]  [Transfer]        |
+------------------------------------------+
|                                          |
| Category                                 |
| +--+ +--+ +--+ +--+ +--+               |
| |🍴| |🚗| |🛍| |🎬| |⚡|               |
| |Food|Tran|Shop|Ent|Bill|               |
| +--+ +--+ +--+ +--+ +--+               |
| +--+ +--+ +--+ +--+ +--+               |
| |❤| |📖| |🛒| |🏠| |⋯|                |
| |Hlth|Edu|Groc|Rent|Othr|               |
| +--+ +--+ +--+ +--+ +--+               |
|                                          |
+------------------------------------------+
| Account      [💳 My Bank Account  ▼]    |
+------------------------------------------+
| Date         [📅 Today             ▼]    |
+------------------------------------------+
| Notes        [Optional notes...       ]  |
+------------------------------------------+
|                                          |
|         [    Save Transaction    ]       |
|                                          |
+------------------------------------------+
```

For transfer type, an additional "To Account" selector appears.

### Components

| File | Purpose |
|------|---------|
| `src/features/transactions/components/transaction-form.tsx` | The full form (used for both add and edit) |
| `src/features/transactions/components/category-picker.tsx` | Grid of category icons |
| `src/features/transactions/screens/add-transaction-screen.tsx` | Screen orchestrator for add |
| `src/features/transactions/types/index.ts` | `TransactionFormData` type |

### Hooks

**`src/features/transactions/hooks/use-transaction-form.ts`**

```typescript
interface TransactionFormData {
  amount: string;
  type: TransactionType;
  category_id: string;
  account_id: string;
  to_account_id: string | null;
  date: string;
  notes: string;
}

export function useTransactionForm(initialData?: Partial<TransactionFormData>) {
  const db = useDatabase();
  const transactionRepo = useMemo(() => new TransactionRepository(db), [db]);
  const accountRepo = useMemo(() => new AccountRepository(db), [db]);
  const { currencyCode } = useCurrencyStore();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<TransactionFormData>({
    amount: initialData?.amount ?? '',
    type: initialData?.type ?? 'expense',
    category_id: initialData?.category_id ?? '',
    account_id: initialData?.account_id ?? '',
    to_account_id: initialData?.to_account_id ?? null,
    date: initialData?.date ?? new Date().toISOString(),
    notes: initialData?.notes ?? '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TransactionFormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!isPositiveNumber(parseFloat(form.amount))) newErrors.amount = 'Enter a valid amount';
    if (!form.category_id) newErrors.category_id = 'Select a category';
    if (!form.account_id) newErrors.account_id = 'Select an account';
    if (form.type === 'transfer' && !form.to_account_id) newErrors.to_account_id = 'Select destination';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      const record = await transactionRepo.create({
        amount: parseFloat(form.amount),
        type: form.type,
        category_id: form.category_id,
        account_id: form.account_id,
        to_account_id: form.to_account_id,
        currency_code: currencyCode,
        date: form.date,
        notes: form.notes || null,
        recurring_id: null,
        attachment_path: null,
        latitude: null,
        longitude: null,
      });
      // Update account balance
      if (form.type === 'expense') {
        await accountRepo.updateBalance(form.account_id, -parseFloat(form.amount));
      } else if (form.type === 'income') {
        await accountRepo.updateBalance(form.account_id, parseFloat(form.amount));
      } else if (form.type === 'transfer' && form.to_account_id) {
        await accountRepo.updateBalance(form.account_id, -parseFloat(form.amount));
        await accountRepo.updateBalance(form.to_account_id, parseFloat(form.amount));
      }
      return record;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets.active });
    },
  });

  const updateField = <K extends keyof TransactionFormData>(field: K, value: TransactionFormData[K]) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  return { form, errors, updateField, validate, createMutation };
}
```

### Component Detail: `category-picker.tsx`

```
Props:
  type: TransactionType  // filters categories by 'income' | 'expense' | 'both'
  selectedId: string
  onSelect: (id: string) => void
```

Internally queries `categoryRepo.getByType(type)`.

Layout:
```
[View className="flex-row flex-wrap gap-3 px-4"]
  {categories.map(cat => (
    [Pressable
      key={cat.id}
      onPress={() => onSelect(cat.id)}
      className="items-center w-[18%]"
    ]
      [View className="w-12 h-12 rounded-xl items-center justify-center {selected ? 'border-2 border-violet-500' : ''}"
        style={{ backgroundColor: cat.color + '20' }}
      ]
        <Feather name={cat.icon} size={20} color={cat.color} />
      [/View]
      <Text className="text-xs text-gray-600 mt-1 text-center" numberOfLines={1}>{cat.name}</Text>
    [/Pressable]
  ))}
[/View]
```

Animation: Selected category animates with `withSpring` scale to 1.1. Unselected scale back to 1.0.

### Component Detail: `transaction-form.tsx`

```
Props:
  form: TransactionFormData
  errors: Record<string, string>
  updateField: (field, value) => void
  categories: Category[]
  accounts: Account[]
  onSave: () => void
  saving: boolean
  mode: 'create' | 'edit'
```

Layout:
```
[ScrollView className="flex-1 bg-white dark:bg-gray-950"]
  <AmountInput value={form.amount} onChangeText={(v) => updateField('amount', v)} autoFocus />
  {errors.amount && <Text className="text-red-500 text-center text-sm">{errors.amount}</Text>}

  // Type selector
  [View className="flex-row mx-4 mt-4 bg-gray-100 rounded-xl p-1"]
    {['income', 'expense', 'transfer'].map(t => (
      [Pressable
        key={t}
        onPress={() => updateField('type', t)}
        className="flex-1 py-2 rounded-lg items-center {form.type === t ? 'bg-white shadow-sm' : ''}"
      ]
        <Text className="{form.type === t ? 'font-semibold text-gray-800' : 'text-gray-500'}">{t}</Text>
      [/Pressable]
    ))}
  [/View]

  // Category picker
  <Text className="text-sm font-medium text-gray-600 mx-4 mt-6 mb-2">Category</Text>
  <CategoryPicker type={form.type} selectedId={form.category_id} onSelect={(id) => updateField('category_id', id)} />
  {errors.category_id && <Text className="text-red-500 text-sm mx-4">{errors.category_id}</Text>}

  // Account selector (Pressable that opens a bottom sheet / picker)
  [Pressable className="flex-row items-center justify-between mx-4 mt-6 py-3 border-b border-gray-200"]
    <Text className="text-sm text-gray-600">Account</Text>
    [View className="flex-row items-center"]
      <Text className="text-sm font-medium">{selectedAccount?.name ?? 'Select'}</Text>
      <Feather name="chevron-right" size={16} />
    [/View]
  [/Pressable]

  // Transfer: To Account (conditionally shown)
  {form.type === 'transfer' && (
    // Same as account selector for to_account_id
  )}

  // Date picker
  [Pressable className="flex-row items-center justify-between mx-4 mt-4 py-3 border-b border-gray-200"]
    <Text className="text-sm text-gray-600">Date</Text>
    <Text className="text-sm font-medium">{formatDate(form.date)}</Text>
  [/Pressable]

  // Notes
  <Input
    label="Notes"
    placeholder="Optional notes..."
    value={form.notes}
    onChangeText={(v) => updateField('notes', v)}
    multiline
    className="mx-4 mt-4"
  />

  // Save button
  <Button
    label={mode === 'create' ? 'Save Transaction' : 'Update Transaction'}
    variant="primary"
    size="lg"
    fullWidth
    loading={saving}
    onPress={onSave}
    className="mx-4 mt-8 mb-8"
  />
[/ScrollView]
```

### User Interactions

| Interaction | Action |
|-------------|--------|
| Tap amount area | Auto-focused numeric keypad input |
| Tap type toggle | Switches type, reloads category picker to show matching categories |
| Tap category icon | Selects category, highlights with border |
| Tap Account row | Opens bottom sheet with account list |
| Tap Date row | Opens native date picker (or a custom date picker modal) |
| Tap Save | Validates -> if valid, calls `createMutation.mutate()` -> on success, dismisses modal |
| Tap X / swipe down | Dismisses modal (expo-router `router.back()`) |

### States

| State | Rendering |
|-------|-----------|
| Initial | Empty form, amount focused, Expense type selected, no category selected |
| Validation errors | Red text below each invalid field |
| Saving | Save button shows spinner, disabled |
| Success | Modal dismisses, toast/haptic feedback optional |

### Animations

| Element | Animation |
|---------|-----------|
| Type selector | Animated sliding indicator (shared layout animation) |
| Category selection | Scale spring (1.0 -> 1.1) |
| Form entry | `FadeInUp` on mount |
| Amount input | `FadeInDown.springify()` on mount |

---

## 4. TRANSACTION DETAIL/EDIT

**Route file:** `src/app/transaction/[id].tsx` -- re-exports `TransactionDetailScreen`.

### Layout Mockup

```
+------------------------------------------+
| [← Back]  Transaction Detail   [🗑 Del] |
+------------------------------------------+
|                                          |
|   [Category Icon - large, centered]      |
|         Food & Dining                    |
|         ₹250.00                          |
|         Expense                          |
|                                          |
+------------------------------------------+
| [View mode - read only card]             |
|                                          |
| Account       My Bank Account            |
| Date          02 Apr 2026                |
| Notes         Coffee at Starbucks        |
| Created       2 hours ago                |
|                                          |
+------------------------------------------+
|                                          |
|         [   Edit Transaction   ]         |
|                                          |
+------------------------------------------+
```

When "Edit" is tapped, the screen transitions to the same `TransactionForm` component used in add, pre-populated with existing data.

### Components

| File | Purpose |
|------|---------|
| `src/features/transactions/screens/transaction-detail-screen.tsx` | Detail view + edit mode toggle |

### Hooks

Reuses `use-transaction-form.ts` with `initialData` from the fetched transaction.

```typescript
// Inside transaction-detail-screen.tsx
const { id } = useLocalSearchParams<{ id: string }>();
const db = useDatabase();
const transactionRepo = useMemo(() => new TransactionRepository(db), [db]);

const transactionQuery = useQuery({
  queryKey: queryKeys.transactions.byId(id),
  queryFn: () => transactionRepo.getById(id),
});

const updateMutation = useMutation({
  mutationFn: async (data: Partial<Transaction>) => transactionRepo.update(id, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.transactions.byId(id) });
    queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
  },
});

const deleteMutation = useMutation({
  mutationFn: () => transactionRepo.delete(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
    router.back();
  },
});
```

### User Interactions

| Interaction | Action |
|-------------|--------|
| Tap "Edit Transaction" button | Toggles `isEditing` state, renders `TransactionForm` with pre-filled data |
| Tap delete icon (top right) | `Alert.alert("Delete Transaction?", "This cannot be undone.", [{text: "Cancel"}, {text: "Delete", style: "destructive", onPress: () => deleteMutation.mutate()}])` |
| Tap Save (in edit mode) | Calls `updateMutation.mutate(changedFields)`, toggles back to view mode |
| Tap back arrow | `router.back()` |

### States

| State | Rendering |
|-------|-----------|
| Loading | Skeleton layout matching detail card shape |
| Error / Not found | `ErrorState message="Transaction not found"` |
| View mode | Read-only detail display |
| Edit mode | `TransactionForm` with mode="edit" |

### Animations

| Element | Animation |
|---------|-----------|
| View -> Edit transition | `FadeIn` / `FadeOut` crossfade using reanimated `Animated.View` with `entering={FadeIn}` and `exiting={FadeOut}` |
| Category icon | Scale spring on mount |
| Delete confirmation | Native Alert (no custom animation needed) |

---

## 5. ANALYTICS (Insights Tab)

**Route file:** `src/app/(tabs)/analytics.tsx` -- replace with:
```typescript
export { AnalyticsScreen as default } from '@features/analytics/screens/analytics-screen';
```

### Layout Mockup

```
+------------------------------------------+
| StatusBar                                |
+------------------------------------------+
| [Header: "Insights"]                     |
+------------------------------------------+
| [This Week] [*This Month*] [This Year]  |
+------------------------------------------+
| ScrollView (vertical)                    |
|                                          |
| +--------------------------------------+ |
| | SPENDING BY CATEGORY                 | |
| |         [Pie Chart]                  | |
| |                                      | |
| | Food & Dining        ₹8,500   35%   | |
| | Transport            ₹4,800   20%   | |
| | Shopping             ₹3,600   15%   | |
| | Entertainment        ₹2,400   10%   | |
| | Others               ₹4,700   20%   | |
| +--------------------------------------+ |
|                                          |
| +--------------------------------------+ |
| | INCOME vs EXPENSE TREND              | |
| |                                      | |
| | [Bar Chart - last 6 months]          | |
| | Nov  Dec  Jan  Feb  Mar  Apr         | |
| | ▓▓░░ ▓▓░░ ▓▓░░ ▓▓░░ ▓▓░░ ▓▓░░       | |
| | green=income, red=expense            | |
| +--------------------------------------+ |
|                                          |
| +--------------------------------------+ |
| | TOP SPENDING CATEGORIES              | |
| | 1. 🍴 Food & Dining   ₹8,500  35%  | |
| |    ████████████████░░░░              | |
| | 2. 🚗 Transport        ₹4,800  20%  | |
| |    ██████████░░░░░░░░░░              | |
| | 3. 🛍 Shopping          ₹3,600  15%  | |
| |    ████████░░░░░░░░░░░░              | |
| +--------------------------------------+ |
|                                          |
| +--------------------------------------+ |
| | WEEKLY COMPARISON                    | |
| | This Week    ₹12,400                | |
| | Last Week    ₹10,200                | |
| | [+21% more than last week]          | |
| |                                      | |
| | [Line Chart - daily for both weeks] | |
| +--------------------------------------+ |
|                                          |
| +--------------------------------------+ |
| | DAILY BREAKDOWN                      | |
| | Mon ▓▓▓▓▓░ ₹2,100                  | |
| | Tue ▓▓▓░░░ ₹1,200                  | |
| | Wed ▓▓▓▓░░ ₹1,800                  | |
| | Thu ▓▓░░░░ ₹800                    | |
| | Fri ▓▓▓▓▓▓ ₹3,200                  | |
| | Sat ▓▓▓░░░ ₹1,500                  | |
| | Sun ▓▓▓▓░░ ₹1,800                  | |
| +--------------------------------------+ |
|                                          |
+------------------------------------------+
```

### Components

| File | Purpose |
|------|---------|
| `src/features/analytics/components/category-breakdown-chart.tsx` | Pie chart + category list |
| `src/features/analytics/components/income-expense-trend.tsx` | Grouped bar chart (6 months) |
| `src/features/analytics/components/top-categories-list.tsx` | Ranked list with progress bars |
| `src/features/analytics/components/weekly-comparison.tsx` | This week vs last week + line chart |
| `src/features/analytics/components/daily-breakdown.tsx` | Horizontal bar chart per day |
| `src/features/analytics/services/analytics-service.ts` | All aggregation/computation functions |
| `src/features/analytics/screens/analytics-screen.tsx` | Screen orchestrator |
| `src/features/analytics/types/index.ts` | AnalyticsPeriod, CategoryBreakdown, TrendPoint types |

### Hooks

**`src/features/analytics/hooks/use-analytics.ts`**

```typescript
type AnalyticsPeriod = 'week' | 'month' | 'year';

export function useAnalytics(period: AnalyticsPeriod) {
  const db = useDatabase();
  const transactionRepo = useMemo(() => new TransactionRepository(db), [db]);
  const categoryRepo = useMemo(() => new CategoryRepository(db), [db]);

  const { startDate, endDate } = getDateRangeForPeriod(period); // helper

  const transactionsQuery = useQuery({
    queryKey: queryKeys.transactions.byDateRange(startDate, endDate),
    queryFn: () => transactionRepo.getByDateRange(startDate, endDate),
  });

  const categoriesQuery = useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => categoryRepo.getAll(),
  });

  return { transactionsQuery, categoriesQuery, startDate, endDate };
}
```

**`src/features/analytics/hooks/use-chart-data.ts`**

Derives all chart datasets from raw transactions. Calls `analytics-service.ts` functions.

```typescript
export function useChartData(transactions: Transaction[], categories: Category[], period: AnalyticsPeriod) {
  const categoryBreakdown = useMemo(() =>
    computeCategoryBreakdown(transactions, categories), [transactions, categories]);

  const monthlyTrend = useMemo(() =>
    computeMonthlyTrend(transactions, 6), [transactions]);

  const topCategories = useMemo(() =>
    getTopCategories(categoryBreakdown, 5), [categoryBreakdown]);

  const weeklyComparison = useMemo(() =>
    computeWeeklyComparison(transactions), [transactions]);

  const dailyBreakdown = useMemo(() =>
    computeDailyBreakdown(transactions, period), [transactions, period]);

  return { categoryBreakdown, monthlyTrend, topCategories, weeklyComparison, dailyBreakdown };
}
```

### Service: `analytics-service.ts`

```typescript
export function computeCategoryBreakdown(transactions: Transaction[], categories: Category[]):
  Array<{ id: string; name: string; icon: string; color: string; amount: number; percentage: number }> {
  // Filter expenses, group by category_id, sum amounts, compute percentages
  // Sort descending by amount
}

export function computeMonthlyTrend(transactions: Transaction[], monthCount: number):
  Array<{ month: string; income: number; expense: number }> {
  // Group by month for last N months, sum income and expense per month
}

export function getTopCategories(breakdown: CategoryBreakdown[], limit: number): CategoryBreakdown[] {
  return breakdown.slice(0, limit);
}

export function computeWeeklyComparison(transactions: Transaction[]):
  { thisWeek: number; lastWeek: number; dailyThis: number[]; dailyLast: number[]; changePercent: number } {
  // Partition transactions into current week and previous week
  // Sum totals, compute daily amounts, compute % change
}

export function computeDailyBreakdown(transactions: Transaction[], period: AnalyticsPeriod):
  Array<{ day: string; amount: number }> {
  // Group expense transactions by day within period
}

function getDateRangeForPeriod(period: AnalyticsPeriod): { startDate: string; endDate: string } {
  const now = new Date();
  switch (period) {
    case 'week': return { startDate: startOfWeek(now), endDate: endOfDay(now) };
    case 'month': return { startDate: startOfMonth(now), endDate: endOfMonth(now) };
    case 'year': return { startDate: new Date(now.getFullYear(), 0, 1).toISOString(), endDate: endOfDay(now) };
  }
}
```

### Component Detail: `category-breakdown-chart.tsx`

Uses `PieChart` from `react-native-gifted-charts`.

```
Props:
  data: CategoryBreakdown[]
  totalExpense: number
```

Layout:
```
[Card className="mx-4 mt-4"]
  <Text className="text-base font-semibold mb-4">Spending by Category</Text>
  [View className="items-center"]
    <PieChart
      data={data.map(d => ({ value: d.amount, color: d.color, text: d.percentage + '%' }))}
      donut innerRadius={65} radius={100}
      centerLabelComponent={() => <CurrencyText amount={totalExpense} compact className="text-lg font-bold" />}
      showText textColor="white" textSize={10}
    />
  [/View]
  [View className="mt-4"]
    {data.map(item => (
      [View key={item.id} className="flex-row items-center py-2 border-b border-gray-100"]
        <CategoryIcon iconName={item.icon} color={item.color} size="sm" />
        <Text className="flex-1 ml-3 text-sm">{item.name}</Text>
        <CurrencyText amount={item.amount} className="text-sm font-medium" />
        <Text className="text-xs text-gray-500 ml-2 w-10 text-right">{item.percentage}%</Text>
      [/View]
    ))}
  [/View]
[/Card]
```

### Component Detail: `income-expense-trend.tsx`

Uses `BarChart` from `react-native-gifted-charts` with grouped bars.

```
Props:
  data: Array<{ month: string; income: number; expense: number }>
```

```
[Card className="mx-4 mt-4"]
  <Text className="text-base font-semibold mb-4">Income vs Expense</Text>
  <BarChart
    data={barData}  // grouped bar data format
    barWidth={12}
    spacing={24}
    noOfSections={4}
    barBorderRadius={4}
    yAxisThickness={0}
    xAxisThickness={1}
    xAxisColor={colors.border}
    isAnimated
    animationDuration={500}
  />
  [View className="flex-row justify-center mt-3 gap-4"]
    [Legend color={colors.income} label="Income" /]
    [Legend color={colors.expense} label="Expense" /]
  [/View]
[/Card]
```

### Component Detail: `weekly-comparison.tsx`

Uses `LineChart` from `react-native-gifted-charts`.

```
Props:
  thisWeek: number
  lastWeek: number
  changePercent: number
  dailyThis: number[]
  dailyLast: number[]
```

```
[Card className="mx-4 mt-4"]
  <Text className="text-base font-semibold">Weekly Comparison</Text>
  [View className="flex-row mt-2 gap-6"]
    [View]
      <Text className="text-xs text-gray-500">This Week</Text>
      <CurrencyText amount={thisWeek} compact className="text-lg font-bold" />
    [/View]
    [View]
      <Text className="text-xs text-gray-500">Last Week</Text>
      <CurrencyText amount={lastWeek} compact className="text-lg font-bold" />
    [/View]
  [/View]
  <Badge label={changePercent > 0 ? `+${changePercent}% more` : `${changePercent}% less`}
    color={changePercent > 0 ? colors.error : colors.success} className="mt-2" />
  <LineChart
    data={dailyThis.map((v, i) => ({ value: v, label: dayLabels[i] }))}
    data2={dailyLast.map(v => ({ value: v }))}
    color1={colors.primary}
    color2={colors.textSecondary}
    curved isAnimated
    thickness={2} dataPointsRadius={3}
    yAxisThickness={0} xAxisThickness={0}
    className="mt-3"
  />
[/Card]
```

### Period Selector

Built into `analytics-screen.tsx` as a segmented control.

```
[View className="flex-row mx-4 mt-4 bg-gray-100 dark:bg-gray-800 rounded-xl p-1"]
  {periods.map(p => (
    [Pressable className="flex-1 py-2 rounded-lg items-center {active ? 'bg-white shadow-sm' : ''}"]
      <Text>{p.label}</Text>
    [/Pressable]
  ))}
[/View]
```

### User Interactions

| Interaction | Action |
|-------------|--------|
| Tap period selector | Changes `period` state, all chart data recomputes |
| Tap a category in the breakdown list | Navigate to `/(tabs)/transactions` with that category filter set |
| Pull to refresh | Refetch transactions query |

### States

| State | Rendering |
|-------|-----------|
| Loading | Skeleton charts (rounded rectangles mimicking chart areas) |
| Empty | `EmptyState icon="bar-chart-2" title="No data yet" description="Add some transactions to see insights"` |
| Error | `ErrorState` with retry |
| Populated | Full charts |

### Animations

| Element | Animation |
|---------|-----------|
| All charts | Built-in `isAnimated` and `animationDuration` from gifted-charts |
| Period selector | Animated indicator slide |
| Cards | Staggered `FadeInUp` on mount |

---

## 6. BUDGET SCREEN

**Route files needed:**
- `src/app/budget/index.tsx` -- re-exports `BudgetScreen`
- `src/app/budget/create.tsx` -- re-exports `CreateBudgetScreen`
- `src/app/budget/[id].tsx` -- re-exports `BudgetDetailScreen`
- `src/app/budget/_layout.tsx` -- Stack layout

### Layout Mockup

```
+------------------------------------------+
| [← Back]      Budgets          [+ New]   |
+------------------------------------------+
| ScrollView                               |
|                                          |
| ACTIVE BUDGETS                           |
|                                          |
| +--------------------------------------+ |
| | 🍴 Food & Dining                     | |
| | ₹6,500 / ₹10,000                    | |
| | ████████████░░░░░░░░  65%            | |
| | ₹3,500 remaining                     | |
| +--------------------------------------+ |
|                                          |
| +--------------------------------------+ |
| | 🚗 Transport                     ⚠  | |
| | ₹4,200 / ₹5,000                     | |
| | ██████████████████░░  84%            | |
| | ₹800 remaining                       | |
| +--------------------------------------+ |
|                                          |
| +--------------------------------------+ |
| | 🛍 Shopping                      🔴  | |
| | ₹8,700 / ₹8,000                     | |
| | ████████████████████  109%           | |
| | ₹700 over budget!                    | |
| +--------------------------------------+ |
|                                          |
+------------------------------------------+
```

### Components

| File | Purpose |
|------|---------|
| `src/features/budget/components/budget-card.tsx` | Single budget item card |
| `src/features/budget/components/budget-form.tsx` | Create/edit budget form |
| `src/features/budget/components/budget-progress-bar.tsx` | Progress bar with color logic |
| `src/features/budget/components/budget-alert-banner.tsx` | Warning/danger banner |
| `src/features/budget/screens/budget-screen.tsx` | Budget list screen |
| `src/features/budget/screens/create-budget-screen.tsx` | Create budget form screen |
| `src/features/budget/screens/budget-detail-screen.tsx` | Budget detail with transactions |
| `src/features/budget/types/index.ts` | BudgetWithProgress, BudgetFormData |

### Hooks

**`src/features/budget/hooks/use-budgets.ts`**

```typescript
export function useBudgets() {
  const db = useDatabase();
  const budgetRepo = useMemo(() => new BudgetRepository(db), [db]);
  const categoryRepo = useMemo(() => new CategoryRepository(db), [db]);

  const budgetsQuery = useQuery({
    queryKey: queryKeys.budgets.active,
    queryFn: () => budgetRepo.getActive(),
  });

  const categoriesQuery = useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => categoryRepo.getAll(),
  });

  return { budgetsQuery, categoriesQuery };
}
```

**`src/features/budget/hooks/use-budget-progress.ts`**

```typescript
export function useBudgetProgress(budget: Budget) {
  const db = useDatabase();
  const budgetRepo = useMemo(() => new BudgetRepository(db), [db]);

  const { startDate, endDate } = getBudgetPeriodDates(budget); // compute from period + start_date

  const spentQuery = useQuery({
    queryKey: queryKeys.budgets.progress(budget.id),
    queryFn: () => budgetRepo.getSpentAmount(budget.category_id, startDate, endDate),
  });

  const spent = spentQuery.data ?? 0;
  const progress = budget.amount > 0 ? spent / budget.amount : 0;
  const remaining = budget.amount - spent;
  const isOverBudget = spent > budget.amount;
  const isAlerted = progress >= budget.alert_threshold;

  return { spent, progress, remaining, isOverBudget, isAlerted, isLoading: spentQuery.isLoading };
}
```

**`src/features/budget/services/budget-service.ts`**

```typescript
export function getBudgetPeriodDates(budget: Budget): { startDate: string; endDate: string } {
  const now = new Date();
  switch (budget.period) {
    case 'weekly': return { startDate: startOfWeek(now), endDate: endOfDay(now) };
    case 'monthly': return { startDate: startOfMonth(now), endDate: endOfMonth(now) };
    case 'yearly': return { startDate: new Date(now.getFullYear(), 0, 1).toISOString(), endDate: endOfDay(now) };
  }
}

export function getBudgetStatusColor(progress: number): string {
  if (progress < 0.6) return colors.success;
  if (progress < 0.8) return colors.warning;
  return colors.error;
}
```

### Component Detail: `budget-card.tsx`

```
Props:
  budget: Budget
  category: Category
  onPress: () => void
```

Internally uses `useBudgetProgress(budget)` hook.

```
[Card onPress={onPress} className="mx-4 mt-3"]
  [View className="flex-row items-center justify-between"]
    [View className="flex-row items-center"]
      <CategoryIcon iconName={category.icon} color={category.color} size="md" />
      <Text className="text-base font-medium ml-3">{category.name}</Text>
    [/View]
    {isAlerted && <Feather name="alert-triangle" size={18} color={isOverBudget ? colors.error : colors.warning} />}
  [/View]
  [View className="mt-3"]
    <ProgressBar progress={clamp(progress, 0, 1)} color={getBudgetStatusColor(progress)} animated />
  [/View]
  [View className="flex-row justify-between mt-2"]
    <Text className="text-sm text-gray-600">
      <CurrencyText amount={spent} /> / <CurrencyText amount={budget.amount} />
    </Text>
    <Text className="text-sm font-medium" style={{ color: isOverBudget ? colors.error : colors.textSecondary }}>
      {isOverBudget ? `₹${Math.abs(remaining)} over!` : `₹${remaining} left`}
    </Text>
  [/View]
[/Card]
```

### Create Budget Form: `budget-form.tsx`

```
Layout:
[ScrollView]
  // Category picker (only categories without existing active budget)
  <CategoryPicker type="expense" selectedId={categoryId} onSelect={setCategoryId} />

  // Amount input
  <AmountInput value={amount} onChangeText={setAmount} />

  // Period selector
  [View className="flex-row mx-4 mt-4 gap-3"]
    {['weekly', 'monthly', 'yearly'].map(p =>
      [Pressable className="flex-1 py-3 rounded-xl items-center {selected ? 'bg-violet-600' : 'bg-gray-100'}"]
        <Text className={selected ? 'text-white' : 'text-gray-600'}>{p}</Text>
      [/Pressable]
    )}
  [/View]

  // Alert threshold slider (optional enhancement)
  <Text>Alert at: {threshold * 100}%</Text>

  <Button label="Create Budget" variant="primary" onPress={onSave} />
[/ScrollView]
```

### Budget Detail Screen: `budget-detail-screen.tsx`

Shows the budget card at top, then a list of transactions in that category for the current period.

### User Interactions

| Interaction | Action |
|-------------|--------|
| Tap budget card | Navigate to `/budget/[id]` |
| Tap "+" / "New" | Navigate to `/budget/create` |
| Tap Save on create form | `budgetRepo.create(data)`, invalidate `queryKeys.budgets.active` |
| Pull to refresh | Refetch budgets + progress |

### Animations

| Element | Animation |
|---------|-----------|
| Progress bars | Animated width from 0 to target on mount (`withTiming`) |
| Budget cards | Staggered `FadeInUp` |
| Alert icon | `useAnimatedStyle` with `withRepeat(withSequence(withTiming(1.2), withTiming(1)))` for pulsing scale |

---

## 7. GOALS SCREEN

**Route files needed:**
- `src/app/goal/index.tsx` -- re-exports `GoalsScreen`
- `src/app/goal/create.tsx` -- re-exports `CreateGoalScreen`
- `src/app/goal/[id].tsx` -- re-exports `GoalDetailScreen`
- `src/app/goal/_layout.tsx` -- Stack layout

### Layout Mockup

```
+------------------------------------------+
| [← Back]       Goals           [+ New]   |
+------------------------------------------+
| ScrollView                               |
|                                          |
| ACTIVE GOALS                             |
|                                          |
| +--------------------------------------+ |
| |  [Progress Ring 30%]                 | |
| |  🏖 Vacation Fund                    | |
| |  ₹30,000 / ₹1,00,000               | |
| |  Deadline: 120 days left             | |
| +--------------------------------------+ |
|                                          |
| +--------------------------------------+ |
| |  [Progress Ring 80%]                 | |
| |  🛡 Emergency Fund                   | |
| |  ₹80,000 / ₹1,00,000               | |
| |  No deadline                         | |
| +--------------------------------------+ |
|                                          |
| ▼ COMPLETED (2)                          |
|  +------------------------------------+  |
|  | ✅ New Laptop    ₹75,000  Done!    |  |
|  | ✅ Phone         ₹25,000  Done!    |  |
|  +------------------------------------+  |
|                                          |
+------------------------------------------+
```

### Components

| File | Purpose |
|------|---------|
| `src/features/goals/components/goal-card.tsx` | Active goal card with progress ring |
| `src/features/goals/components/goal-form.tsx` | Create/edit goal form |
| `src/features/goals/components/goal-progress-ring.tsx` | Circular progress indicator |
| `src/features/goals/components/milestone-badge.tsx` | Achievement badge (25%, 50%, 75%, 100%) |
| `src/features/goals/screens/goals-screen.tsx` | Goals list screen |
| `src/features/goals/screens/create-goal-screen.tsx` | Create goal form |
| `src/features/goals/screens/goal-detail-screen.tsx` | Goal detail + contribution history |
| `src/features/goals/types/index.ts` | GoalFormData type |

### Hooks

**`src/features/goals/hooks/use-goals.ts`**

```typescript
export function useGoals() {
  const db = useDatabase();
  const goalRepo = useMemo(() => new GoalRepository(db), [db]);

  const activeQuery = useQuery({
    queryKey: queryKeys.goals.active,
    queryFn: () => goalRepo.getActive(),
  });

  const completedQuery = useQuery({
    queryKey: queryKeys.goals.completed,
    queryFn: () => goalRepo.getCompleted(),
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<Goal, keyof BaseModel>) => goalRepo.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.goals.active }),
  });

  return { activeQuery, completedQuery, createMutation };
}
```

**`src/features/goals/hooks/use-goal-progress.ts`**

```typescript
export function useGoalProgress(goalId: string) {
  const db = useDatabase();
  const contributionRepo = useMemo(() => new GoalContributionRepository(db), [db]);
  const goalRepo = useMemo(() => new GoalRepository(db), [db]);

  const contributionsQuery = useQuery({
    queryKey: queryKeys.goals.contributions(goalId),
    queryFn: () => contributionRepo.getByGoal(goalId),
  });

  const addContributionMutation = useMutation({
    mutationFn: async (amount: number) => {
      await contributionRepo.create({ goal_id: goalId, amount, account_id: null, notes: null });
      // Update goal's current_amount
      const total = await contributionRepo.getTotalByGoal(goalId);
      await goalRepo.update(goalId, { current_amount: total });
      // Check if completed
      const goal = await goalRepo.getById(goalId);
      if (goal && total >= goal.target_amount) {
        await goalRepo.markCompleted(goalId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.active });
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.completed });
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.contributions(goalId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.byId(goalId) });
    },
  });

  return { contributionsQuery, addContributionMutation };
}
```

### Component Detail: `goal-progress-ring.tsx`

```
Props:
  progress: number  // 0 to 1
  size?: number     // default 80
  strokeWidth?: number  // default 8
  color?: string
```

Implementation: Use `react-native-svg` (already installed as peer of gifted-charts) with `Circle` elements. Animate the `strokeDashoffset` using `react-native-reanimated` `useAnimatedProps`.

```
[Svg width={size} height={size}]
  // Background circle
  <Circle cx={size/2} cy={size/2} r={radius} stroke={colors.border} strokeWidth={strokeWidth} fill="none" />
  // Progress circle
  <AnimatedCircle
    cx={size/2} cy={size/2} r={radius}
    stroke={color} strokeWidth={strokeWidth} fill="none"
    strokeDasharray={circumference}
    animatedProps={animatedProps}  // strokeDashoffset animated from circumference to (1-progress)*circumference
    strokeLinecap="round"
    transform={`rotate(-90 ${size/2} ${size/2})`}
  />
[/Svg]
[View className="absolute items-center justify-center" style={{ width: size, height: size }}]
  <Text className="text-lg font-bold">{Math.round(progress * 100)}%</Text>
[/View]
```

### Goal Detail Screen

Shows: goal card at top with large progress ring, deadline countdown, then a "Add Contribution" button, followed by a FlatList of contributions (date, amount, notes).

### User Interactions

| Interaction | Action |
|-------------|--------|
| Tap active goal card | Navigate to `/goal/[id]` |
| Tap "+" / "New" | Navigate to `/goal/create` |
| Tap "Completed" header | Toggle collapsible section |
| Tap "Add Contribution" on detail | Opens modal with amount input, saves via `addContributionMutation` |

### Animations

| Element | Animation |
|---------|-----------|
| Progress ring | Animated `strokeDashoffset` from 0% to current on mount |
| Goal cards | Staggered `FadeInUp` |
| Completed section expand | `Layout.springify()` for height animation |
| Milestone badge | `BounceIn` when a milestone is reached |

---

## 8. SETTINGS TAB

**Route file:** `src/app/(tabs)/settings.tsx` -- replace with:
```typescript
export { SettingsScreen as default } from '@features/settings/screens/settings-screen';
```

### Layout Mockup

```
+------------------------------------------+
| StatusBar                                |
+------------------------------------------+
| [Header: "Settings"]                     |
+------------------------------------------+
| ScrollView                               |
|                                          |
| PROFILE                                  |
| +--------------------------------------+ |
| | [Avatar Circle]  Sumeet Kumar        | |
| |                  Edit Profile  >     | |
| +--------------------------------------+ |
|                                          |
| PREFERENCES                              |
| +--------------------------------------+ |
| | Currency            INR ₹       >   | |
| | Theme               System      >   | |
| +--------------------------------------+ |
|                                          |
| MANAGE                                   |
| +--------------------------------------+ |
| | Categories                       >   | |
| | Accounts                         >   | |
| | Budgets                          >   | |
| | Goals                            >   | |
| +--------------------------------------+ |
|                                          |
| DATA                                     |
| +--------------------------------------+ |
| | Export Data (CSV)                >   | |
| | Export Data (JSON)               >   | |
| +--------------------------------------+ |
|                                          |
| ABOUT                                    |
| +--------------------------------------+ |
| | Version              1.0.0          | |
| | Made with ❤ by Sumeet              | |
| +--------------------------------------+ |
|                                          |
+------------------------------------------+
```

### Components

| File | Purpose |
|------|---------|
| `src/features/settings/components/theme-toggle.tsx` | Light/Dark/System selector |
| `src/features/settings/components/currency-selector.tsx` | Currency list with search |
| `src/features/settings/components/category-manager.tsx` | List categories, edit, reorder, add |
| `src/features/settings/components/account-manager.tsx` | List accounts, edit, delete, add |
| `src/features/settings/screens/settings-screen.tsx` | Settings list screen |
| `src/features/settings/types/index.ts` | SettingsSection type |

### Hooks

**`src/features/settings/hooks/use-settings.ts`**

```typescript
export function useSettings() {
  const db = useDatabase();
  const prefsRepo = useMemo(() => new UserPreferencesRepository(db), [db]);
  const categoryRepo = useMemo(() => new CategoryRepository(db), [db]);
  const accountRepo = useMemo(() => new AccountRepository(db), [db]);

  const prefsQuery = useQuery({
    queryKey: queryKeys.userPreferences.current,
    queryFn: () => prefsRepo.get(),
  });

  const updatePrefsMutation = useMutation({
    mutationFn: (data: Partial<UserPreferences>) => prefsRepo.updatePreferences(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.userPreferences.current }),
  });

  const categoriesQuery = useQuery({ queryKey: queryKeys.categories.all, queryFn: () => categoryRepo.getAll() });
  const accountsQuery = useQuery({ queryKey: queryKeys.accounts.all, queryFn: () => accountRepo.getAll() });

  return { prefsQuery, updatePrefsMutation, categoriesQuery, accountsQuery };
}
```

### Component Detail: `theme-toggle.tsx`

```
Props:
  currentTheme: ThemeMode
  onSelect: (theme: ThemeMode) => void
```

Three-option segmented control (Light / Dark / System). On selection, calls `useAppStore().setTheme()` and `updatePrefsMutation.mutate({ theme })`.

### Component Detail: `currency-selector.tsx`

Opens as a bottom sheet/modal. Shows `CURRENCY_LIST` from `@core/currency/currency-data.ts` with search filtering. On select, calls `useCurrencyStore().setCurrencyCode()` and persists to user_preferences.

### Component Detail: `category-manager.tsx`

FlatList of categories. Each row: icon + color dot + name + edit button. "Add Category" button at bottom opens a form modal (name, icon picker, color picker, type).

### Component Detail: `account-manager.tsx`

FlatList of accounts. Each row: name, type badge, balance. Tap to edit (name, type). Long press or swipe to delete (with confirmation). "Add Account" at bottom.

### Export Data Flow

```typescript
// On "Export CSV" tap:
const transactions = await transactionRepo.getAll();
const filePath = await exportToCSV(transactions);
await shareFile(filePath);
```

Uses the already-built `@core/export/export-service.ts` and `@core/export/share-utils.ts`.

### User Interactions

| Interaction | Action |
|-------------|--------|
| Tap Currency row | Opens currency selector modal |
| Tap Theme row | Opens theme toggle in-place or bottom sheet |
| Tap Categories | Navigate to category manager (could be inline expandable or separate screen) |
| Tap Accounts | Navigate to account manager |
| Tap Budgets | Navigate to `/budget/` |
| Tap Goals | Navigate to `/goal/` |
| Tap Export CSV/JSON | Calls export service, opens share sheet |

---

## 9. ONBOARDING FLOW

**Route files needed:**
- `src/app/(onboarding)/_layout.tsx` -- Stack layout (no header, custom back)
- `src/app/(onboarding)/welcome.tsx` -- re-exports WelcomeScreen
- `src/app/(onboarding)/setup-currency.tsx` -- re-exports SetupCurrencyScreen
- `src/app/(onboarding)/create-account.tsx` -- re-exports CreateAccountScreen

The root `_layout.tsx` already declares `<Stack.Screen name="(onboarding)" />`.

**Gate logic:** In `src/app/index.tsx`, check `useAppStore().onboardingCompleted`:
```typescript
export default function Index() {
  const { onboardingCompleted } = useAppStore();
  if (!onboardingCompleted) return <Redirect href="/(onboarding)/welcome" />;
  return <Redirect href="/(tabs)" />;
}
```

### Layout Mockups

**Welcome Screen:**
```
+------------------------------------------+
|                                          |
|                                          |
|          [Illustration/Logo]             |
|                                          |
|             Zorvyn                       |
|     Your Personal Finance                |
|          Companion                       |
|                                          |
|                                          |
|                                          |
|       [    Get Started    ]              |
|                                          |
+------------------------------------------+
```

**Currency Setup:**
```
+------------------------------------------+
| [← Back]                                |
+------------------------------------------+
|                                          |
|   Choose your currency                   |
|                                          |
| [Search currencies...]                   |
|                                          |
| [✓] INR  ₹  Indian Rupee               |
| [ ] USD  $  US Dollar                    |
| [ ] EUR  €  Euro                         |
| [ ] GBP  £  British Pound               |
| [ ] JPY  ¥  Japanese Yen                |
| ...                                      |
|                                          |
|       [      Continue      ]             |
|                                          |
+------------------------------------------+
```

**Create Account:**
```
+------------------------------------------+
| [← Back]                                |
+------------------------------------------+
|                                          |
|   Create your first account              |
|                                          |
| Account Name                             |
| [My Bank Account              ]          |
|                                          |
| Account Type                             |
| [Bank] [Cash] [Wallet] [Credit]          |
|                                          |
| Starting Balance                         |
|              ₹ 0                         |
|                                          |
|       [    Start Tracking    ]           |
|                                          |
+------------------------------------------+
```

### Components

| File | Purpose |
|------|---------|
| `src/features/onboarding/components/welcome-hero.tsx` | Logo, tagline, illustration |
| `src/features/onboarding/components/currency-picker.tsx` | Currency list with radio selection |
| `src/features/onboarding/components/account-setup-form.tsx` | Account name, type, balance form |
| `src/features/onboarding/screens/welcome-screen.tsx` | Welcome page |
| `src/features/onboarding/screens/setup-currency-screen.tsx` | Currency selection page |
| `src/features/onboarding/screens/create-account-screen.tsx` | Account creation page |
| `src/features/onboarding/types/index.ts` | OnboardingStep type |

### Hooks

**`src/features/onboarding/hooks/use-onboarding.ts`**

```typescript
export function useOnboarding() {
  const db = useDatabase();
  const accountRepo = useMemo(() => new AccountRepository(db), [db]);
  const prefsRepo = useMemo(() => new UserPreferencesRepository(db), [db]);
  const { setCurrencyCode } = useCurrencyStore();
  const { setOnboardingCompleted } = useAppStore();

  const selectCurrency = async (code: string) => {
    setCurrencyCode(code);
    await prefsRepo.updatePreferences({ default_currency: code });
  };

  const createAccount = async (name: string, type: AccountType, balance: number) => {
    await accountRepo.create({
      name,
      type,
      balance,
      currency_code: useCurrencyStore.getState().currencyCode,
      icon: null,
      color: null,
      is_default: 1,
      sort_order: 0,
    });
  };

  const completeOnboarding = async () => {
    await prefsRepo.updatePreferences({ onboarding_completed: 1 });
    setOnboardingCompleted(true);
  };

  return { selectCurrency, createAccount, completeOnboarding };
}
```

### Data Flow

1. Welcome -> tap "Get Started" -> navigate to `setup-currency`
2. Select currency -> tap "Continue" -> `selectCurrency(code)` -> navigate to `create-account`
3. Fill account form -> tap "Start Tracking" -> `createAccount(...)` -> `completeOnboarding()` -> `router.replace('/(tabs)')`

### Animations

| Element | Animation |
|---------|-----------|
| Welcome logo | `BounceIn.delay(300)` |
| Welcome tagline | `FadeInUp.delay(600)` |
| "Get Started" button | `FadeInUp.delay(900)` |
| Currency list items | Staggered `FadeIn` |
| Account type selector | Scale spring on selection |
| Page transitions | Default Stack push animation from expo-router |

---

## 10. COMPLETE SHARED UI COMPONENT INVENTORY

### `src/components/ui/` (Design System Primitives)

| File | Description |
|------|-------------|
| `button.tsx` | Multi-variant pressable button with loading state and spring animation |
| `input.tsx` | Text input with label, error, icons, focus animation |
| `card.tsx` | Elevated/outlined/filled card container |
| `modal.tsx` | Bottom sheet modal with pan-to-dismiss |
| `badge.tsx` | Colored label badge (filled/outline) |
| `progress-bar.tsx` | Animated horizontal progress bar with auto-coloring |
| `skeleton.tsx` | Pulsing skeleton loading placeholder |
| `divider.tsx` | Horizontal separator line |
| `fab.tsx` | Floating action button with spring press animation |
| `section-header.tsx` | Section header with title and optional action link ("See All") |
| `filter-chip.tsx` | Togglable filter chip for horizontal filter bars |
| `segmented-control.tsx` | Multi-option segmented toggle (used for type selector, period selector, theme toggle) |
| `avatar.tsx` | Circular avatar placeholder with initials |

### `src/components/feedback/` (State Feedback)

| File | Description |
|------|-------------|
| `empty-state.tsx` | Icon + title + description + optional CTA button |
| `error-state.tsx` | Error icon + message + retry button |
| `loading-state.tsx` | Spinner or skeleton variant with optional message |

### `src/components/shared/` (Cross-Feature Composed Components)

| File | Description |
|------|-------------|
| `currency-text.tsx` | Formatted currency display with type-based coloring |
| `category-icon.tsx` | Rounded icon container with category color background |
| `amount-input.tsx` | Large centered amount input for forms |
| `date-range-picker.tsx` | Preset chips + custom date range modal |
| `account-picker.tsx` | Bottom sheet account selector list |
| `icon-picker.tsx` | Grid of Feather icons for category/goal creation |
| `color-picker.tsx` | Grid of preset colors for category/goal creation |
| `confirm-dialog.tsx` | Reusable Alert.alert wrapper or custom confirmation modal |

---

## IMPLEMENTATION SEQUENCE

Build in this order to minimize blocked dependencies:

**Phase 1: Foundation (shared UI)**
1. `components/ui/button.tsx`, `input.tsx`, `card.tsx`, `divider.tsx`, `skeleton.tsx`
2. `components/ui/badge.tsx`, `progress-bar.tsx`, `fab.tsx`, `modal.tsx`
3. `components/ui/filter-chip.tsx`, `segmented-control.tsx`, `section-header.tsx`, `avatar.tsx`
4. `components/feedback/empty-state.tsx`, `error-state.tsx`, `loading-state.tsx`
5. `components/shared/currency-text.tsx`, `category-icon.tsx`, `amount-input.tsx`
6. `components/shared/account-picker.tsx`, `date-range-picker.tsx`, `icon-picker.tsx`, `color-picker.tsx`, `confirm-dialog.tsx`

**Phase 2: Onboarding (so the app has a working entry point)**
7. Onboarding feature (all components, hooks, screens, route files)
8. Update `src/app/index.tsx` with onboarding gate

**Phase 3: Transactions (core CRUD)**
9. Transaction service (`transaction-service.ts`)
10. Transaction hooks (`use-transactions.ts`, `use-transaction-form.ts`, `use-transaction-filters.ts`)
11. Transaction components (`transaction-card.tsx`, `transaction-list.tsx`, `transaction-filters.tsx`, `category-picker.tsx`, `transaction-form.tsx`)
12. Transaction screens (`transactions-screen.tsx`, `add-transaction-screen.tsx`, `transaction-detail-screen.tsx`)
13. Transaction route files (`src/app/transaction/_layout.tsx`, `add.tsx`, `[id].tsx`)
14. Update `src/app/(tabs)/transactions.tsx` to re-export

**Phase 4: Dashboard**
15. Dashboard hook (`use-dashboard-data.ts`)
16. Dashboard components (`balance-card.tsx`, `quick-stats.tsx`, `spending-chart.tsx`, `recent-transactions.tsx`, `savings-progress.tsx`)
17. Dashboard screen (`dashboard-screen.tsx`)
18. Update `src/app/(tabs)/index.tsx` to re-export

**Phase 5: Budgets**
19. Budget service, hooks, components, screens, route files

**Phase 6: Goals**
20. Goals service, hooks, components, screens, route files

**Phase 7: Analytics**
21. Analytics service, hooks, components, screens
22. Update `src/app/(tabs)/analytics.tsx` to re-export

**Phase 8: Settings**
23. Settings hooks, components, screen
24. Update `src/app/(tabs)/settings.tsx` to re-export

---

## KEY ARCHITECTURAL DECISIONS

1. **Repository instantiation in hooks:** Each hook creates repository instances using `useDatabase()` and `useMemo`. This follows the existing `DatabaseProvider` pattern.

2. **Query key invalidation strategy:** Every mutation that changes data invalidates all related query keys. For example, creating a transaction invalidates `transactions.all`, `accounts.all` (balance changed), and `budgets.active` (spending amounts changed).

3. **Category lookup maps:** The categories query result is converted to a `Map<string, Category>` at the hook level and passed down as props to avoid repeated array lookups in render.

4. **Thin route files pattern:** Every `src/app/` route file is a single-line re-export from the corresponding feature screen, per the architecture document's conventions.

5. **NativeWind + theme tokens:** Use NativeWind className for layout/spacing. Use `style` prop with `colors.ts` tokens for dynamic theme-aware colors (since dark mode requires the `dark:` prefix in NativeWind, and dynamic colors like category colors come from data).

6. **Feather icons via @expo/vector-icons:** The seed data uses Feather icon names. Use `import { Feather } from '@expo/vector-icons'` which is bundled with Expo -- no additional installation needed.

7. **Gifted Charts configuration:** All charts use `react-native-gifted-charts` which is already installed. Key props: `isAnimated`, `animationDuration`, `noOfSections`, `yAxisThickness={0}` for clean appearance.

8. **Transfer type handling:** When type is 'transfer', the category picker is hidden (transfers are between accounts, not categorized), and a "To Account" picker appears.

---

### Critical Files for Implementation

- `/Users/sumeetkumar/Desktop/Zorvyn/src/core/repositories/transaction-repository.ts` -- All transaction data access, referenced by every major feature
- `/Users/sumeetkumar/Desktop/Zorvyn/src/core/constants/query-keys.ts` -- Central query key factory, every hook depends on these keys for caching and invalidation
- `/Users/sumeetkumar/Desktop/Zorvyn/src/core/providers/database-provider.tsx` -- `useDatabase()` hook used in every feature hook to get the SQLite instance
- `/Users/sumeetkumar/Desktop/Zorvyn/src/core/currency/currency-service.ts` -- `formatCurrency()` and `formatCompactCurrency()` used in every component that displays money
- `/Users/sumeetkumar/Desktop/Zorvyn/src/app/_layout.tsx` -- Root layout that must declare all route groups (already has transaction/budget/goal modal declarations)
