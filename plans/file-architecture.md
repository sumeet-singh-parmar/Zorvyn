# Personal Finance Companion — File Architecture Plan

## Context
Building a personal finance companion mobile app for an internship assignment. Stack: Expo, Expo Router, expo-sqlite, TanStack Query, Zustand, NativeWind, react-native-gifted-charts, react-native-mmkv, react-native-reanimated. The architecture must be modular, SOLID-compliant, and designed so adding new features is just "drop in a new folder."

## Tech Stack (Locked)

| Layer | Choice | Purpose |
|---|---|---|
| Framework | Expo (managed) | Cross-platform, fast dev |
| Navigation | Expo Router | File-based routing |
| Relational Data | expo-sqlite | Transactions, accounts, categories, budgets, goals |
| Key-Value Storage | react-native-mmkv | Zustand persist, TanStack cache, tokens, preferences (30x faster than AsyncStorage) |
| Data Layer | TanStack Query | Cache, mutations, query invalidation, offline persistence (MMKV persister) |
| UI State | Zustand (persisted to MMKV) | Theme, currency, filters, onboarding |
| Styling | NativeWind | Tailwind CSS for React Native |
| Charts | react-native-gifted-charts | Pie, bar, line, area charts |
| Animations | react-native-reanimated | Screen transitions, micro-interactions, shared element transitions |
| Currency | core/currency/ | Multi-currency formatting + future exchange rates |

### Storage Split: SQLite vs MMKV
```
SQLite (relational, queryable)          MMKV (key-value, instant)
─────────────────────────────           ─────────────────────────
transactions                            Zustand stores (theme, currency, filters)
accounts                                TanStack Query cache (offline persistence)
categories                              Onboarding completed flag
budgets                                 Auth tokens (FUTURE)
goals                                   Last sync timestamp (FUTURE)
goal_contributions                      Feature flags (FUTURE)
recurring_rules
tags
user_preferences
```
Rule: if you need to query/filter/join → SQLite. If you need instant read/write of a single value → MMKV.

---

## Architecture Philosophy

**Feature-first (vertical) organization** — not layer-first. Each feature owns all its code (components, hooks, services, types). Shared code lives in `core/` and `components/`. The `/app` directory is thin — routing only, re-exports from features.

**Why feature-first?**
- Adding a new feature = adding a new folder. No touching existing code (Open/Closed principle)
- Everything related to "transactions" lives in `features/transactions/`. No hunting across 5 directories
- Features never import from each other — only from `core/` or `components/`. Prevents circular deps
- A feature can be deleted without breaking anything else

---

## File Structure

```
src/
├── app/                              # EXPO ROUTER — routing only, thin re-exports
│   ├── _layout.tsx                   # Root layout (providers wrap here)
│   ├── index.tsx                     # Entry → redirects to tabs
│   ├── (onboarding)/                 # First-time user flow (gated by onboarding_completed)
│   │   ├── _layout.tsx               # Stack layout for onboarding
│   │   ├── welcome.tsx               # Welcome screen
│   │   ├── setup-currency.tsx        # Pick default currency
│   │   └── create-account.tsx        # Create first account
│   ├── (tabs)/                       # Tab navigator group
│   │   ├── _layout.tsx               # Bottom tab bar config
│   │   ├── index.tsx                 # Home/Dashboard tab
│   │   ├── transactions.tsx          # Transactions tab
│   │   ├── analytics.tsx             # Insights tab
│   │   └── settings.tsx              # Settings tab
│   ├── transaction/
│   │   ├── add.tsx                   # Add transaction screen
│   │   ├── [id].tsx                  # Transaction detail/edit screen
│   │   └── _layout.tsx              # Stack layout for transaction flow
│   ├── budget/
│   │   ├── index.tsx                 # Budget overview
│   │   ├── create.tsx                # Create budget
│   │   └── [id].tsx                  # Budget detail
│   ├── goal/
│   │   ├── index.tsx                 # Goals overview
│   │   ├── create.tsx                # Create goal
│   │   └── [id].tsx                  # Goal detail
│   └── +not-found.tsx                # 404 screen
│
├── features/                         # FEATURE MODULES — self-contained vertical slices
│   ├── dashboard/
│   │   ├── components/
│   │   │   ├── balance-card.tsx
│   │   │   ├── quick-stats.tsx
│   │   │   ├── spending-chart.tsx
│   │   │   ├── recent-transactions.tsx
│   │   │   └── savings-progress.tsx
│   │   ├── hooks/
│   │   │   └── use-dashboard-data.ts
│   │   ├── screens/
│   │   │   └── dashboard-screen.tsx
│   │   └── types/
│   │       └── index.ts
│   │
│   ├── transactions/
│   │   ├── components/
│   │   │   ├── transaction-list.tsx
│   │   │   ├── transaction-card.tsx
│   │   │   ├── transaction-form.tsx
│   │   │   ├── transaction-filters.tsx
│   │   │   └── category-picker.tsx
│   │   ├── hooks/
│   │   │   ├── use-transactions.ts       # TanStack Query hooks
│   │   │   ├── use-transaction-form.ts   # Form state + validation
│   │   │   └── use-transaction-filters.ts
│   │   ├── services/
│   │   │   └── transaction-service.ts    # Business logic (calculations, grouping)
│   │   ├── screens/
│   │   │   ├── transactions-screen.tsx
│   │   │   ├── add-transaction-screen.tsx
│   │   │   └── transaction-detail-screen.tsx
│   │   └── types/
│   │       └── index.ts
│   │
│   ├── budget/
│   │   ├── components/
│   │   │   ├── budget-card.tsx
│   │   │   ├── budget-form.tsx
│   │   │   ├── budget-progress-bar.tsx
│   │   │   └── budget-alert-banner.tsx
│   │   ├── hooks/
│   │   │   ├── use-budgets.ts
│   │   │   ├── use-budget-progress.ts
│   │   │   └── use-budget-alerts.ts
│   │   ├── services/
│   │   │   └── budget-service.ts         # Spending velocity, alert logic
│   │   ├── screens/
│   │   │   ├── budget-screen.tsx
│   │   │   ├── create-budget-screen.tsx
│   │   │   └── budget-detail-screen.tsx
│   │   └── types/
│   │       └── index.ts
│   │
│   ├── goals/
│   │   ├── components/
│   │   │   ├── goal-card.tsx
│   │   │   ├── goal-form.tsx
│   │   │   ├── goal-progress-ring.tsx
│   │   │   └── milestone-badge.tsx
│   │   ├── hooks/
│   │   │   ├── use-goals.ts
│   │   │   └── use-goal-progress.ts
│   │   ├── services/
│   │   │   └── goal-service.ts
│   │   ├── screens/
│   │   │   ├── goals-screen.tsx
│   │   │   ├── create-goal-screen.tsx
│   │   │   └── goal-detail-screen.tsx
│   │   └── types/
│   │       └── index.ts
│   │
│   ├── analytics/
│   │   ├── components/
│   │   │   ├── category-breakdown-chart.tsx
│   │   │   ├── weekly-trend-chart.tsx
│   │   │   ├── monthly-comparison.tsx
│   │   │   ├── top-categories-list.tsx
│   │   │   └── spending-heatmap.tsx
│   │   ├── hooks/
│   │   │   ├── use-analytics.ts
│   │   │   └── use-chart-data.ts
│   │   ├── services/
│   │   │   └── analytics-service.ts      # Aggregation, trend calculation
│   │   ├── screens/
│   │   │   └── analytics-screen.tsx
│   │   └── types/
│   │       └── index.ts
│   │
│   ├── onboarding/
│   │   ├── components/
│   │   │   ├── welcome-hero.tsx
│   │   │   ├── currency-picker.tsx
│   │   │   └── account-setup-form.tsx
│   │   ├── hooks/
│   │   │   └── use-onboarding.ts
│   │   ├── screens/
│   │   │   ├── welcome-screen.tsx
│   │   │   ├── setup-currency-screen.tsx
│   │   │   └── create-account-screen.tsx
│   │   └── types/
│   │       └── index.ts
│   │
│   └── settings/
│       ├── components/
│       │   ├── theme-toggle.tsx
│       │   ├── currency-selector.tsx
│       │   ├── category-manager.tsx
│       │   └── account-manager.tsx
│       ├── hooks/
│       │   └── use-settings.ts
│       ├── screens/
│       │   └── settings-screen.tsx
│       └── types/
│           └── index.ts
│
├── core/                             # INFRASTRUCTURE — shared foundation
│   ├── database/
│   │   ├── client.ts                 # expo-sqlite instance + init
│   │   ├── migrations.ts            # Schema versioning + migrations
│   │   └── seed.ts                  # Demo/seed data for development
│   │
│   ├── search/                       # Search abstraction layer
│   │   ├── interfaces.ts            # ISearchEngine<T> contract: search(query) → results
│   │   ├── fts-search.ts            # FTS5 implementation (current) — SQLite virtual table
│   │   └── fuzzy-search.ts          # FUTURE: Fuse.js/MiniSearch implementation (same interface)
│   │
│   ├── analytics/                    # Event tracking abstraction
│   │   ├── interfaces.ts            # IAnalyticsProvider: track(), identify(), screen()
│   │   ├── noop-provider.ts         # Does nothing (development / assignment)
│   │   └── mixpanel-provider.ts     # FUTURE: Mixpanel/Amplitude/PostHog (same interface)
│   │
│   ├── logger/                       # Logging + crash reporting abstraction
│   │   ├── interfaces.ts            # ILogger: info(), warn(), error(), fatal()
│   │   ├── console-logger.ts        # console.log (development)
│   │   └── sentry-logger.ts         # FUTURE: Sentry/Crashlytics (same interface)
│   │
│   ├── file-storage/                 # File storage abstraction (receipts, exports)
│   │   ├── interfaces.ts            # IFileStorage: upload(), download(), delete(), getUrl()
│   │   ├── local-storage.ts         # expo-file-system (current)
│   │   └── cloud-storage.ts         # FUTURE: Supabase Storage / S3 (same interface)
│   │
│   ├── api/                          # FUTURE: Remote API layer
│   │   ├── client.ts                 # Axios/fetch instance, base URL, headers
│   │   ├── interceptors.ts          # Auth token injection, error handling, retry
│   │   └── endpoints.ts             # API route constants (e.g. /transactions, /auth)
│   │
│   ├── sync/                         # FUTURE: Offline-first sync engine
│   │   ├── sync-manager.ts          # Orchestrates push/pull between SQLite ↔ Supabase
│   │   ├── conflict-resolver.ts     # Last-write-wins on updated_at, soft delete handling
│   │   ├── sync-queue.ts            # Pending mutations queue (TanStack mutation cache)
│   │   └── sync-status.ts           # Track per-row sync state: pending | synced | conflict
│   │
│   ├── auth/                         # FUTURE: Authentication layer
│   │   ├── auth-service.ts          # Login, signup, logout, token refresh
│   │   ├── auth-storage.ts          # Secure token storage (expo-secure-store)
│   │   ├── auth-context.tsx         # Auth state provider + useAuth hook
│   │   ├── auth-guard.tsx           # Protected route wrapper (redirect if not logged in)
│   │   └── biometric-service.ts    # expo-local-authentication wrapper (FUTURE)
│   │
│   ├── notifications/                # FUTURE: Push notifications + local reminders
│   │   ├── notification-service.ts  # Schedule/cancel local notifications
│   │   ├── push-handler.ts          # Handle incoming push notifications
│   │   └── reminder-scheduler.ts    # Bill reminders, budget alerts, goal milestones
│   │
│   ├── i18n/                         # FUTURE: Internationalization / multi-language
│   │   ├── index.ts                  # i18n instance setup (i18next + expo-localization)
│   │   ├── language-detector.ts     # Detect device locale, fall back to 'en'
│   │   └── locales/                  # Translation files per language
│   │       ├── en.json               # English (default)
│   │       ├── hi.json               # Hindi
│   │       ├── es.json               # Spanish
│   │       └── ...                   # Drop new JSON = new language
│   │
│   ├── export/                       # Data export
│   │   ├── export-service.ts        # Generate CSV/JSON from transaction data
│   │   └── share-utils.ts           # expo-sharing + expo-file-system to send files
│   │
│   ├── storage/                      # MMKV key-value storage
│   │   └── mmkv.ts                   # MMKV instance + Zustand persist adapter + TanStack persister
│   │
│   ├── currency/                     # Multi-currency support
│   │   ├── currency-service.ts      # Format amounts by currency code (INR, USD, EUR...)
│   │   ├── currency-data.ts         # Currency metadata: symbol, decimal places, position
│   │   ├── exchange-service.ts      # FUTURE: Fetch live exchange rates from API
│   │   └── converter.ts             # FUTURE: Convert between currencies using rates
│   │
│   ├── repositories/                 # Data access layer (SOLID: Dependency Inversion)
│   │   ├── interfaces.ts            # IRepository<T> + IDataSource<T> contracts
│   │   ├── base-repository.ts       # Abstract base with shared CRUD + sync metadata logic
│   │   ├── datasources/             # Concrete data source implementations
│   │   │   ├── sqlite-datasource.ts # SQLite implementation (current)
│   │   │   └── api-datasource.ts    # FUTURE: Supabase/REST API implementation
│   │   ├── transaction-repository.ts
│   │   ├── account-repository.ts
│   │   ├── category-repository.ts
│   │   ├── budget-repository.ts
│   │   ├── goal-repository.ts
│   │   ├── goal-contribution-repository.ts
│   │   └── user-preferences-repository.ts
│   │
│   ├── models/                       # Domain types shared across features
│   │   ├── base.ts                   # BaseModel: id, created_at, updated_at, deleted_at, sync_status
│   │   ├── transaction.ts
│   │   ├── account.ts
│   │   ├── category.ts
│   │   ├── budget.ts
│   │   ├── goal.ts
│   │   ├── goal-contribution.ts
│   │   ├── recurring-rule.ts
│   │   ├── tag.ts
│   │   └── user-preferences.ts
│   │
│   ├── hooks/                        # Shared hooks
│   │   ├── use-database.ts           # DB initialization hook
│   │   ├── use-app-state.ts          # App lifecycle
│   │   ├── use-network.ts           # FUTURE: Online/offline detection
│   │   └── use-sync.ts              # FUTURE: Trigger/monitor sync status
│   │
│   ├── utils/
│   │   ├── date.ts                   # Date helpers (locale-aware formatting)
│   │   ├── uuid.ts                   # UUID generation
│   │   └── validators.ts             # Shared validation
│   │
│   ├── constants/
│   │   ├── categories.ts             # Default categories + icons
│   │   ├── config.ts                 # App-wide constants
│   │   └── query-keys.ts            # Centralized TanStack Query key factory
│   │
│   └── providers/
│       ├── query-provider.tsx         # TanStack QueryClientProvider
│       ├── database-provider.tsx      # DB init + context
│       ├── i18n-provider.tsx          # FUTURE: Wraps i18n context, language detection
│       ├── auth-provider.tsx          # FUTURE: Wraps auth-context
│       ├── sync-provider.tsx          # FUTURE: Initializes sync engine on app start
│       └── app-providers.tsx          # Composes all providers (single wrapper)
│
├── stores/                           # GLOBAL STATE — Zustand (persisted with zustand/persist + MMKV)
│   ├── app-store.ts                  # Theme (dark/light), onboarding completed
│   ├── currency-store.ts             # Selected currency code, locale, display preferences
│   ├── auth-store.ts                 # FUTURE: User session, tokens
│   ├── sync-store.ts                 # FUTURE: Sync status (syncing, lastSyncedAt, errors)
│   └── filters-store.ts             # Active filters (date range, category, account)
│
├── components/                       # SHARED UI — used by 2+ features
│   ├── ui/                           # Design system primitives
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── modal.tsx
│   │   ├── badge.tsx
│   │   ├── progress-bar.tsx
│   │   ├── skeleton.tsx
│   │   └── divider.tsx
│   ├── feedback/                     # State feedback components
│   │   ├── empty-state.tsx
│   │   ├── error-state.tsx
│   │   └── loading-state.tsx
│   └── shared/                       # Cross-feature composed components
│       ├── currency-text.tsx
│       ├── category-icon.tsx
│       ├── date-range-picker.tsx
│       └── amount-input.tsx
│
├── theme/                            # STYLING
│   ├── colors.ts
│   ├── typography.ts
│   └── spacing.ts
│
└── assets/
    ├── icons/
    ├── images/
    └── fonts/
```

---

## Why This Structure — Design Principles Explained

### 1. Feature-First = Open/Closed Principle (SOLID — O)
```
features/
├── transactions/    ← exists
├── budget/          ← exists
├── goals/           ← exists
├── recurring/       ← NEW! Just add this folder. Zero changes to existing code.
└── loans/           ← NEW! Same thing.
```
Adding a feature never requires modifying existing feature code. The system is **open for extension, closed for modification**.

### 2. Thin `app/` Directory = Single Responsibility (SOLID — S)
```typescript
// app/(tabs)/transactions.tsx — THIS IS ALL IT DOES
import { TransactionsScreen } from '@/features/transactions/screens/transactions-screen';
export default TransactionsScreen;
```
Route files have ONE job: map a URL to a screen. No business logic, no data fetching, no state. If Expo Router changes its API tomorrow, you only touch `app/` — features are untouched.

### 3. Repository Pattern = Dependency Inversion (SOLID — D)
```
core/repositories/interfaces.ts     ← Abstract contract
core/repositories/transaction-repository.ts  ← SQLite implementation today

features/transactions/hooks/use-transactions.ts  ← Depends on interface, not SQLite
```
Hooks call the repository. The repository talks to SQLite. Tomorrow when you add Supabase sync, you modify the repository internals — hooks and UI never change. **High-level modules don't depend on low-level modules. Both depend on abstractions.**

### 4. `services/` = Business Logic Separation
```
features/budget/services/budget-service.ts
- calculateSpendingVelocity()
- predictBudgetOverrun()
- generateAlerts()
```
Pure functions. No React, no hooks, no UI. Can be unit tested independently. This is the **Single Responsibility Principle** — UI components render, services compute.

### 5. `components/ui/` = Interface Segregation (SOLID — I)
```
components/ui/button.tsx    ← Small, focused, does one thing
components/ui/input.tsx     ← Small, focused, does one thing
components/ui/card.tsx      ← Small, focused, does one thing
```
No god components. Each UI primitive has a clear, narrow interface. Features compose them together. You never import a "Form" component that does 47 things — you compose `Input` + `Button` + `Card`.

### 6. Feature-Scoped `types/` = Liskov Substitution (SOLID — L)
Each feature defines its own types extending from `core/models/`. A `BudgetTransaction` can stand in for a `Transaction` anywhere a `Transaction` is expected, because it extends the base type properly.

### 7. `screens/` Inside Features = Separation of Concerns
```
features/transactions/
├── screens/           ← Full page layout, orchestration
├── components/        ← Reusable pieces within this feature
├── hooks/             ← Data + logic
└── services/          ← Pure computation
```
Screens compose components + hooks. Components are dumb (receive props). Hooks connect to data. Services compute. Each layer has one job.

### 8. `core/providers/` = Composition Root
All providers (Query, Database, Theme) are composed in one place and wrapped at the root layout. Features don't care about provider setup — they just use hooks.

### 9. `stores/` at Root = Global UI State Only
Zustand stores are ONLY for truly global UI state (theme, currency preference). All data state lives in TanStack Query. This prevents the "everything in global state" antipattern.

### 10. `components/feedback/` = UX Quality
```
empty-state.tsx     ← "No transactions yet. Add your first one!"
error-state.tsx     ← "Something went wrong. Try again."
loading-state.tsx   ← Skeleton loaders
```
These exist as shared components because EVERY feature needs them. The assignment specifically calls out empty/loading/error states as evaluation criteria.

---

## Data Flow — Current (SQLite Only)

```
User taps "Add Transaction"
        ↓
Screen (orchestration) → calls hook
        ↓
Hook (use-transaction-form.ts) → validates input, calls repository mutation
        ↓
TanStack Mutation → calls repository.create()
        ↓
Repository → SQLite datasource → writes to SQLite (sync_status = 'pending')
        ↓
TanStack invalidates queries → Dashboard, Analytics auto-refresh
        ↓
UI re-renders with new data
```

## Data Flow — Future (SQLite + Supabase Sync)

```
User taps "Add Transaction"
        ↓
Screen → Hook → TanStack Mutation → Repository
        ↓
SQLite datasource → writes locally (sync_status = 'pending')  ← INSTANT
        ↓
TanStack invalidates → UI updates immediately (optimistic)
        ↓
Sync Manager detects pending row (background)
        ↓
API datasource → pushes to Supabase
        ↓
On success: sync_status = 'synced'
On conflict: conflict-resolver.ts → last-write-wins on updated_at
On offline: stays 'pending', retries when use-network.ts detects connectivity
        ↓
Sync Manager pulls remote changes → merges into SQLite → TanStack refetch
```

**The key**: the Repository is the adapter. It calls SQLite datasource today. Tomorrow it calls SQLite datasource + queues to API datasource. The hook, the screen, the component — none of them change. That's why `datasources/` is separated from `repositories/`.

Every layer only knows about the layer directly below it. The UI doesn't know SQLite exists. The repository doesn't know React exists.

---

## Future-Ready Layers — What They're For

These folders exist in the structure NOW but are built LATER. Having the slots means no restructuring when the time comes.

### `core/api/` — Remote Backend
When you add Supabase or any REST backend:
- `client.ts` sets up the HTTP client with base URL and auth headers
- `interceptors.ts` auto-injects the JWT token, handles 401 → token refresh → retry
- `endpoints.ts` centralizes all API routes so you never hardcode URLs
- **Plug-in point**: `core/repositories/datasources/api-datasource.ts` uses this client

### `core/sync/` — Offline-First Sync Engine
When you wire up SQLite ↔ Supabase:
- `sync-manager.ts` runs on app foreground/network reconnect, pushes pending rows, pulls remote changes
- `conflict-resolver.ts` implements last-write-wins using `updated_at` timestamps
- `sync-queue.ts` leverages TanStack Query's mutation cache for retry + persistence
- `sync-status.ts` exposes per-entity sync state for UI indicators ("Syncing..." badge)
- **Plug-in point**: `core/providers/sync-provider.tsx` initializes the engine at app start

### `core/auth/` — Authentication
When you add user accounts:
- `auth-service.ts` handles Supabase auth (email/password, OAuth, magic link)
- `auth-storage.ts` stores tokens in `expo-secure-store` (encrypted, not AsyncStorage)
- `auth-context.tsx` provides `useAuth()` hook for login state across the app
- `auth-guard.tsx` wraps protected route groups — redirects to login if not authenticated
- **Plug-in point**: `core/providers/auth-provider.tsx` + Expo Router route groups `(auth)/` and `(authenticated)/`

### `core/notifications/` — Reminders & Alerts
When you add notifications:
- `notification-service.ts` wraps `expo-notifications` for scheduling local alerts
- `reminder-scheduler.ts` sets up recurring bill reminders, budget warning alerts, goal milestone celebrations
- `push-handler.ts` processes incoming push notifications (deep links to specific transactions/budgets)
- **Plug-in point**: Budget alerts (`features/budget/hooks/use-budget-alerts.ts`) call `notification-service` to schedule "80% budget used" alerts

### `core/i18n/` — Multi-Language Support
When you add language support:
- `index.ts` initializes `i18next` with `expo-localization` to detect device language
- `language-detector.ts` checks device locale → falls back to `'en'` if unsupported
- `locales/` is a flat folder of JSON files — **drop a new JSON = new language, zero code changes**
- Every user-facing string goes through `t('key')` from `useTranslation()` hook
- **Plug-in point**: `core/providers/i18n-provider.tsx` wraps the app, `stores/app-store.ts` persists user's language override
- **How it affects other code**: `components/shared/currency-text.tsx` and `core/utils/date.ts` become locale-aware — format dates as "Apr 2" in English, "2 अप्रैल" in Hindi

### `core/currency/` — Multi-Currency Support
Built from day one (not future — this ships now):
- `currency-service.ts` — formats any amount by currency code: `formatCurrency(1500, 'INR')` → `₹1,500.00`, `formatCurrency(1500, 'USD')` → `$1,500.00`
- `currency-data.ts` — static metadata: symbol, decimal places, symbol position (before/after), grouping separator. Covers INR, USD, EUR, GBP, JPY, and more
- `exchange-service.ts` — FUTURE: fetches live rates from a free API (exchangerate-api, frankfurter)
- `converter.ts` — FUTURE: `convert(100, 'USD', 'INR')` using cached exchange rates
- **Plug-in point**: `stores/currency-store.ts` holds the user's selected currency. `components/shared/currency-text.tsx` reads from this store and calls `currency-service.ts` to render amounts everywhere. Change the currency once in settings → entire app updates.
- **Schema consideration**: transactions store `currency_code` per row (default from user preference). This means a user can track expenses in multiple currencies even before exchange rates exist.

### `core/search/` — Search Abstraction
Same pattern as repositories — interface + swappable implementations:
```typescript
// core/search/interfaces.ts
interface ISearchEngine<T> {
  search(query: string, options?: SearchOptions): Promise<SearchResult<T>[]>;
  index(items: T[]): Promise<void>;       // For in-memory engines (Fuse.js)
  update(item: T): Promise<void>;          // Keep index in sync
  remove(id: string): Promise<void>;       // Remove from index
}

interface SearchOptions {
  limit?: number;
  fuzzy?: boolean;          // Only respected by fuzzy engine
  fields?: string[];        // Which fields to search
}

interface SearchResult<T> {
  item: T;
  score: number;            // Relevance ranking
  matches?: MatchInfo[];    // Which fields matched, for highlighting
}
```
- `fts-search.ts` implements this with FTS5 `MATCH` queries — ships now
- `fuzzy-search.ts` implements this with Fuse.js — drop-in later, same interface
- The transaction repository calls `searchEngine.search('coffee')` — doesn't know which engine runs behind it
- You could even **compose both**: FTS5 for initial results, then fuzzy re-rank for typo tolerance

### `core/analytics/` — Event Tracking
Same abstraction pattern. Features call `analytics.track('transaction_created', { amount, category })` — never know where events go.
```typescript
// core/analytics/interfaces.ts
interface IAnalyticsProvider {
  track(event: string, properties?: Record<string, any>): void;
  screen(name: string, properties?: Record<string, any>): void;
  identify(userId: string, traits?: Record<string, any>): void;
  reset(): void;  // on logout
}
```
- `noop-provider.ts` — does nothing. Ships now. Zero noise in dev console.
- `mixpanel-provider.ts` — FUTURE: swap in Mixpanel/Amplitude/PostHog. Same interface.
- **Why abstract now**: every startup swaps analytics providers at least once. If you sprinkle `Mixpanel.track()` across 30 files, migration is a nightmare. With the interface, it's one file change.
- **Plug-in point**: `core/providers/app-providers.tsx` initializes the provider. Features import `useAnalytics()` hook.

### `core/logger/` — Logging + Crash Reporting
```typescript
// core/logger/interfaces.ts
interface ILogger {
  info(message: string, context?: Record<string, any>): void;
  warn(message: string, context?: Record<string, any>): void;
  error(message: string, error?: Error, context?: Record<string, any>): void;
  fatal(message: string, error?: Error, context?: Record<string, any>): void;
}
```
- `console-logger.ts` — `console.log/warn/error` with structured formatting. Ships now.
- `sentry-logger.ts` — FUTURE: Sentry/Crashlytics. `error()` and `fatal()` send to crash reporting, `info/warn` log locally.
- **Why abstract now**: you never want to find-and-replace `console.error` across the entire codebase when you add Sentry. One swap, done.
- **Bonus**: the logger can add automatic context (screen name, user id, app version) — features don't care about that plumbing.

### `core/file-storage/` — File Storage (Receipts, Exports)
```typescript
// core/file-storage/interfaces.ts
interface IFileStorage {
  upload(localPath: string, remotePath: string): Promise<string>;  // returns URL/path
  download(remotePath: string): Promise<string>;   // returns local path
  delete(path: string): Promise<void>;
  getUrl(path: string): string;                     // for displaying images
}
```
- `local-storage.ts` — `expo-file-system`. Stores receipt photos locally, returns local URI. Ships now.
- `cloud-storage.ts` — FUTURE: Supabase Storage / S3. Same interface, files go to cloud.
- **Plug-in point**: `transaction-repository.ts` calls `fileStorage.upload()` when a receipt is attached. Today it saves locally, tomorrow it syncs to cloud — the transaction form never changes.
- **Also used by**: `core/export/export-service.ts` — generates CSV/JSON, saves via `fileStorage`, shares via `expo-sharing`.

### `core/repositories/datasources/` — The Swap Layer
This is the most important future-proof piece:
```
datasources/
├── sqlite-datasource.ts    ← Used NOW. All reads/writes go here.
└── api-datasource.ts       ← FUTURE. Same interface, talks to Supabase.
```
Both implement `IDataSource<T>`. The repository calls one or both. Swap, compose, or layer them — the features never know the difference.

### `core/models/base.ts` — Sync-Ready + Locale-Ready Schema
Every model extends `BaseModel`:
```typescript
interface BaseModel {
  id: string;           // UUID — no auto-increment, no conflicts on merge
  created_at: string;   // ISO timestamp
  updated_at: string;   // ISO timestamp — used for conflict resolution
  deleted_at: string | null;  // Soft delete — null means active
  sync_status: 'pending' | 'synced' | 'conflict';  // Sync state tracking
}

// Transaction model includes currency per row
interface Transaction extends BaseModel {
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  category_id: string;
  account_id: string;
  currency_code: string;   // 'INR', 'USD', 'EUR' — default from user pref
  date: string;
  notes: string | null;
}
```
This costs nothing now. Every SQLite row has these columns from day one. When sync/i18n/multi-currency arrives, the infrastructure is already in the data.

---

## Import Rules (Enforced by Convention)

| From | Can Import From | Cannot Import From |
|------|----------------|-------------------|
| `app/` | `features/*/screens/` | anything else in features |
| `features/X/` | `core/`, `components/`, `stores/`, `theme/` | `features/Y/` (other features) |
| `core/` | `core/` only | `features/`, `components/`, `app/` |
| `components/` | `theme/`, `core/utils/` | `features/`, `app/` |
| `stores/` | `core/models/` | `features/`, `app/` |

This unidirectional dependency graph prevents circular imports and keeps the codebase maintainable.

---

## Path Aliases (tsconfig.json)

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@features/*": ["./src/features/*"],
      "@core/*": ["./src/core/*"],
      "@components/*": ["./src/components/*"],
      "@stores/*": ["./src/stores/*"],
      "@theme/*": ["./src/theme/*"],
      "@assets/*": ["./src/assets/*"]
    }
  }
}
```

---

## SQLite Schema (Locked)

### Base Columns — Every Table Gets These
```sql
id              TEXT PRIMARY KEY,      -- UUID (not auto-increment — merge-safe for sync)
created_at      TEXT NOT NULL,         -- ISO 8601 timestamp
updated_at      TEXT NOT NULL,         -- ISO 8601 — conflict resolution key
deleted_at      TEXT,                  -- NULL = active, timestamp = soft deleted
sync_status     TEXT DEFAULT 'pending' -- 'pending' | 'synced' | 'conflict'
```

### Migration Versioning
```sql
CREATE TABLE IF NOT EXISTS _migrations (
  version       INTEGER PRIMARY KEY,
  name          TEXT NOT NULL,         -- 'initial_schema', 'add_tags', etc.
  applied_at    TEXT NOT NULL          -- ISO timestamp
);
```

### Table: `accounts`
Where money lives.
```sql
CREATE TABLE IF NOT EXISTS accounts (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  type            TEXT NOT NULL,        -- 'bank' | 'cash' | 'wallet' | 'credit_card'
  balance         REAL DEFAULT 0,       -- denormalized current balance
  currency_code   TEXT DEFAULT 'INR',
  icon            TEXT,
  color           TEXT,                 -- hex color for UI
  is_default      INTEGER DEFAULT 0,    -- 1 = primary account
  sort_order      INTEGER DEFAULT 0,
  created_at      TEXT NOT NULL,
  updated_at      TEXT NOT NULL,
  deleted_at      TEXT,
  sync_status     TEXT DEFAULT 'pending'
);
```

### Table: `categories`
Spending/income categories.
```sql
CREATE TABLE IF NOT EXISTS categories (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  type            TEXT NOT NULL,        -- 'income' | 'expense' | 'both'
  icon            TEXT NOT NULL,        -- icon identifier (e.g. 'utensils', 'car')
  color           TEXT NOT NULL,        -- hex color
  parent_id       TEXT,                 -- FK → categories.id (subcategories FUTURE)
  sort_order      INTEGER DEFAULT 0,
  is_default      INTEGER DEFAULT 0,   -- 1 = system default, can't delete
  created_at      TEXT NOT NULL,
  updated_at      TEXT NOT NULL,
  deleted_at      TEXT,
  sync_status     TEXT DEFAULT 'pending',
  FOREIGN KEY (parent_id) REFERENCES categories(id)
);
```

### Table: `transactions`
Core table — every rupee in or out.
```sql
CREATE TABLE IF NOT EXISTS transactions (
  id              TEXT PRIMARY KEY,
  amount          REAL NOT NULL,
  type            TEXT NOT NULL,        -- 'income' | 'expense' | 'transfer'
  category_id     TEXT NOT NULL,        -- FK → categories.id
  account_id      TEXT NOT NULL,        -- FK → accounts.id
  to_account_id   TEXT,                 -- FK → accounts.id (transfers only)
  currency_code   TEXT DEFAULT 'INR',
  date            TEXT NOT NULL,        -- ISO 8601 date
  notes           TEXT,
  recurring_id    TEXT,                 -- FK → recurring_rules.id (FUTURE)
  attachment_path TEXT,                 -- local file path for receipt (FUTURE)
  latitude        REAL,                 -- location tagging (FUTURE)
  longitude       REAL,                 -- location tagging (FUTURE)
  created_at      TEXT NOT NULL,
  updated_at      TEXT NOT NULL,
  deleted_at      TEXT,
  sync_status     TEXT DEFAULT 'pending',
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (account_id) REFERENCES accounts(id),
  FOREIGN KEY (to_account_id) REFERENCES accounts(id),
  FOREIGN KEY (recurring_id) REFERENCES recurring_rules(id)
);
```

### Table: `transactions_fts` — Full-Text Search
Instant search on transaction notes. FTS5 virtual table — inverted index (like Google) instead of `LIKE '%coffee%'` full-scan.
```sql
CREATE VIRTUAL TABLE IF NOT EXISTS transactions_fts USING fts5(
  notes,
  content='transactions',
  content_rowid='rowid'
);
```
Kept in sync by the repository — on insert/update/delete of a transaction, the FTS index is updated too. Features just call `searchTransactions('coffee')` and get instant results.

### Table: `budgets`
Per-category spending limits.
```sql
CREATE TABLE IF NOT EXISTS budgets (
  id              TEXT PRIMARY KEY,
  category_id     TEXT NOT NULL,        -- FK → categories.id
  amount          REAL NOT NULL,        -- budget limit
  period          TEXT NOT NULL,        -- 'weekly' | 'monthly' | 'yearly'
  currency_code   TEXT DEFAULT 'INR',
  start_date      TEXT NOT NULL,
  alert_threshold REAL DEFAULT 0.8,    -- trigger alert at 80%
  is_active       INTEGER DEFAULT 1,
  created_at      TEXT NOT NULL,
  updated_at      TEXT NOT NULL,
  deleted_at      TEXT,
  sync_status     TEXT DEFAULT 'pending',
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

### Table: `goals`
Savings goals with milestone tracking.
```sql
CREATE TABLE IF NOT EXISTS goals (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  target_amount   REAL NOT NULL,
  current_amount  REAL DEFAULT 0,       -- denormalized, updated on contribution
  currency_code   TEXT DEFAULT 'INR',
  deadline        TEXT,                 -- optional target date
  icon            TEXT,
  color           TEXT,
  is_completed    INTEGER DEFAULT 0,
  completed_at    TEXT,
  created_at      TEXT NOT NULL,
  updated_at      TEXT NOT NULL,
  deleted_at      TEXT,
  sync_status     TEXT DEFAULT 'pending'
);
```

### Table: `goal_contributions`
Individual deposits toward a goal — audit trail.
```sql
CREATE TABLE IF NOT EXISTS goal_contributions (
  id              TEXT PRIMARY KEY,
  goal_id         TEXT NOT NULL,        -- FK → goals.id
  amount          REAL NOT NULL,
  account_id      TEXT,                 -- FK → accounts.id
  notes           TEXT,
  created_at      TEXT NOT NULL,
  updated_at      TEXT NOT NULL,
  deleted_at      TEXT,
  sync_status     TEXT DEFAULT 'pending',
  FOREIGN KEY (goal_id) REFERENCES goals(id),
  FOREIGN KEY (account_id) REFERENCES accounts(id)
);
```

### Table: `recurring_rules` (FUTURE — schema ready now)
Templates for auto-generating transactions.
```sql
CREATE TABLE IF NOT EXISTS recurring_rules (
  id              TEXT PRIMARY KEY,
  amount          REAL NOT NULL,
  type            TEXT NOT NULL,        -- 'income' | 'expense'
  category_id     TEXT NOT NULL,
  account_id      TEXT NOT NULL,
  currency_code   TEXT DEFAULT 'INR',
  frequency       TEXT NOT NULL,        -- 'daily' | 'weekly' | 'monthly' | 'yearly'
  interval_count  INTEGER DEFAULT 1,    -- every N frequency units
  next_due_date   TEXT NOT NULL,
  end_date        TEXT,                 -- NULL = indefinite
  notes           TEXT,
  is_active       INTEGER DEFAULT 1,
  created_at      TEXT NOT NULL,
  updated_at      TEXT NOT NULL,
  deleted_at      TEXT,
  sync_status     TEXT DEFAULT 'pending',
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (account_id) REFERENCES accounts(id)
);
```

### Table: `tags` (FUTURE — schema ready now)
Flexible labeling — "vacation", "business", "shared".
```sql
CREATE TABLE IF NOT EXISTS tags (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL UNIQUE,
  color           TEXT,
  created_at      TEXT NOT NULL,
  updated_at      TEXT NOT NULL,
  deleted_at      TEXT,
  sync_status     TEXT DEFAULT 'pending'
);
```

### Table: `transaction_tags` (FUTURE — junction table)
Many-to-many: one transaction, multiple tags.
```sql
CREATE TABLE IF NOT EXISTS transaction_tags (
  transaction_id  TEXT NOT NULL,
  tag_id          TEXT NOT NULL,
  PRIMARY KEY (transaction_id, tag_id),
  FOREIGN KEY (transaction_id) REFERENCES transactions(id),
  FOREIGN KEY (tag_id) REFERENCES tags(id)
);
```

### Table: `user_preferences`
Single-row table — all user settings that need to persist and sync.
```sql
CREATE TABLE IF NOT EXISTS user_preferences (
  id                    TEXT PRIMARY KEY,
  display_name          TEXT,
  default_currency      TEXT DEFAULT 'INR',
  date_format           TEXT DEFAULT 'DD/MM/YYYY',
  first_day_of_week     INTEGER DEFAULT 1,   -- 0=Sun, 1=Mon
  theme                 TEXT DEFAULT 'system', -- 'light' | 'dark' | 'system'
  biometric_enabled     INTEGER DEFAULT 0,
  onboarding_completed  INTEGER DEFAULT 0,
  created_at            TEXT NOT NULL,
  updated_at            TEXT NOT NULL,
  deleted_at            TEXT,
  sync_status           TEXT DEFAULT 'pending'
);
```

### Indexes
```sql
-- Transaction queries (most common)
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_account ON transactions(account_id);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_deleted ON transactions(deleted_at);
CREATE INDEX idx_transactions_sync ON transactions(sync_status);

-- Budget lookups
CREATE INDEX idx_budgets_category ON budgets(category_id);
CREATE INDEX idx_budgets_period ON budgets(period, start_date);

-- Goal contributions
CREATE INDEX idx_goal_contributions_goal ON goal_contributions(goal_id);

-- Recurring rules (FUTURE)
CREATE INDEX idx_recurring_next_due ON recurring_rules(next_due_date, is_active);

-- Categories parent lookup (FUTURE subcategories)
CREATE INDEX idx_categories_parent ON categories(parent_id);
```

### Relationships Diagram
```
accounts ←──────── transactions ────────→ categories
    ↑                   ↑                      ↑
    │              to_account_id           budgets
    │                   │                      ↑
    │              recurring_rules         parent_id (self-ref)
    │                   │
    └──── goal_contributions ──→ goals

transactions ←→ transaction_tags ←→ tags

user_preferences (single row, standalone)
_migrations (schema versioning, standalone)
```

### Future-Proofing Built Into Schema

| Future Feature | Already Handled By |
|---|---|
| Supabase sync | `sync_status` + `updated_at` + UUID `id` on every row |
| Undo/soft delete | `deleted_at` — filter `WHERE deleted_at IS NULL` |
| Multi-currency | `currency_code` on transactions, accounts, budgets, goals |
| Subcategories | `parent_id` on categories |
| Recurring bills | `recurring_rules` table + `recurring_id` FK on transactions |
| Tags/labels | `tags` + `transaction_tags` junction table |
| Receipt photos | `attachment_path` on transactions |
| Location tracking | `latitude` + `longitude` on transactions |
| Transfers | `to_account_id` on transactions |
| Budget alerts | `alert_threshold` on budgets |
| Goal audit trail | `goal_contributions` with per-deposit records |
| Full-text search | `transactions_fts` FTS5 virtual table |
| Biometric lock | `biometric_enabled` in user_preferences |
| Onboarding gate | `onboarding_completed` in user_preferences |
| Data export | `core/export/` reads from any table → CSV/JSON |

Every future column is nullable — existing rows never break. Every future table is independent — creating it never touches existing tables.

---

## MMKV Integration Points

### 1. Zustand Persist Adapter
```typescript
// core/storage/mmkv.ts
import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

// Zustand persist adapter
export const mmkvStorage = {
  getItem: (name: string) => storage.getString(name) ?? null,
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.delete(name),
};
```

### 2. TanStack Query Persister
```typescript
// core/storage/mmkv.ts (continued)
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

export const queryPersister = createSyncStoragePersister({
  storage: mmkvStorage,
});
```

### 3. What Lives Where
- **MMKV**: Zustand stores, TanStack cache, auth tokens, quick flags
- **SQLite**: All relational data (transactions, accounts, categories, budgets, goals)
- **Never AsyncStorage**: MMKV replaces it entirely — 30x faster, synchronous reads

---

## Implementation Plan — Phase 1 (Core Layer)

### Step 1: Initialize Expo Project + Dependencies
```bash
npx create-expo-app@latest . --template blank-typescript
npx expo install expo-router expo-sqlite react-native-reanimated react-native-mmkv
npm install @tanstack/react-query @tanstack/query-sync-storage-persister zustand nativewind react-native-gifted-charts
npm install -D tailwindcss@4.2.2
```
Configure: `tsconfig.json` path aliases, `tailwind.config.js`, `metro.config.js`, `app.json` (expo-router scheme)

### Step 2: Create Full Folder Structure
All directories from the file structure section above — empty `index.ts` barrel files where needed.

### Step 3: Build Core Layer (in order)
1. `core/models/` — All TypeScript interfaces
2. `core/storage/mmkv.ts` — MMKV instance + adapters
3. `core/database/` — SQLite client, migrations (full schema), seed data
4. `core/repositories/` — Interfaces, base repository, all entity repos
5. `core/search/` — ISearchEngine + FTS5 implementation
6. `core/currency/` — Currency service + data
7. `core/logger/` — ILogger + console logger
8. `core/analytics/` — IAnalyticsProvider + noop
9. `core/file-storage/` — IFileStorage + local storage
10. `core/utils/` — date, uuid, validators
11. `core/constants/` — categories, config, query-keys
12. `core/export/` — Export service + share utils
13. `core/providers/` — Query, database, app-providers
14. `stores/` — app-store, currency-store, filters-store

### Step 4: Wire Up Root Layout
`app/_layout.tsx` wraps with `AppProviders` — database init, query client, theme.

### Verification
- App starts without errors on `npx expo start`
- Database initializes with all tables on first launch
- MMKV reads/writes work
- Repository CRUD operations work (test with seed data)
