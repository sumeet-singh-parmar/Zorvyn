# Zorvyn — Personal Finance Companion

> A premium, offline-first personal finance app for iOS, built with React Native (Expo). Track spending, set savings goals, manage budgets, recurring charges, and loans — all with rich insights, a fully reactive theme system, and a polished UI inspired by modern fintech apps.

**Platform:** iOS only (built and tested on iPhone via `expo run:ios`)
**Status:** Submitted for the screening round of an interview.

---

## Table of Contents

1. [Demo Video & Screenshots](#-demo-video--screenshots)
2. [Feature Walkthrough](#-feature-walkthrough)
3. [Tech Stack](#-tech-stack)
4. [Architecture](#-architecture)
5. [Project Structure](#-project-structure)
6. [Database Design (SQLite)](#-database-design-sqlite)
7. [State Management Strategy](#-state-management-strategy)
8. [Theme System](#-theme-system)
9. [Design Principles](#-design-principles)
10. [Key Implementation Highlights](#-key-implementation-highlights)
11. [Setup & Run](#-setup--run)
12. [Features Checklist](#-features-checklist)

---

## 📹 Demo Video & Screenshots

### Walkthrough Video

A full app walkthrough video (~216 MB, recorded on iPhone) is **hosted externally** because it exceeds GitHub's 100 MB single-file limit. It is not committed to the repo — request the link from the submitter.

> 🎥 **Video link:** _to be provided alongside the submission_

### Screenshot Index

All 50 screenshots live in the [`Demo/`](./Demo) folder and are numbered in feature order so they sort naturally on disk. The walkthrough video is hosted externally (see above). Each entry below links straight to the file — click any item to open it.

**Dashboard**
- [01 — Dashboard: balance and stats](./Demo/01-dashboard-balance-and-stats.png)
- [02 — Dashboard: spending breakdown pie](./Demo/02-dashboard-spending-breakdown-pie.png)
- [03 — Dashboard: recent transactions and goals](./Demo/03-dashboard-recent-transactions-and-goals.png)

**Goals**
- [04 — Goals screen: active goals](./Demo/04-goals-screen-active-goals.png)
- [05 — Create goal form](./Demo/05-create-goal-form.png)
- [06 — Create goal: color picker](./Demo/06-create-goal-color-picker.png)

**Budgets**
- [07 — Budgets screen: over-budget warnings](./Demo/07-budgets-screen-over-budget-warnings.png)
- [08 — Budgets screen: on track](./Demo/08-budgets-screen-on-track.png)
- [09 — Create budget form](./Demo/09-create-budget-form.png)

**Recurring**
- [10 — Recurring screen: summary and list](./Demo/10-recurring-screen-summary-and-list.png)
- [11 — Add recurring: amount + frequency](./Demo/11-add-recurring-form-amount-frequency.png)
- [12 — Add recurring: account + dates](./Demo/12-add-recurring-form-account-dates.png)

**Loans**
- [13 — Loans screen: lending tab](./Demo/13-loans-screen-lending-tab.png)
- [14 — Loans screen: borrowing tab + action sheet](./Demo/14-loans-screen-borrowing-tab-action-sheet.png)
- [15 — Add loan form](./Demo/15-add-loan-form.png)

**Transactions**
- [16 — Transaction detail view](./Demo/16-transaction-detail-view.png)
- [17 — Edit transaction: expense categories](./Demo/17-edit-transaction-expense-categories.png)
- [18 — Edit transaction: income categories](./Demo/18-edit-transaction-income-categories.png)
- [19 — Edit transaction: income account + notes](./Demo/19-edit-transaction-income-account-notes.png)
- [20 — Edit transaction: expense account + notes](./Demo/20-edit-transaction-expense-account-notes.png)
- [21 — Edit transaction: transfer accounts](./Demo/21-edit-transaction-transfer-accounts.png)
- [22 — Transactions list: all today](./Demo/22-transactions-list-all-today.png)
- [23 — Transactions list: search "food"](./Demo/23-transactions-list-search-food.png)
- [24 — Transactions filter sheet](./Demo/24-transactions-filter-sheet.png)
- [25 — Transactions list: expense filter, December](./Demo/25-transactions-list-expense-filter-december.png)

**Insights**
- [26 — Insights: savings rate + pie](./Demo/26-insights-savings-rate-and-pie.png)
- [27 — Insights: custom date range](./Demo/27-insights-custom-date-range.png)
- [28 — Insights: top categories + budgets](./Demo/28-insights-top-categories-and-budgets.png)
- [29 — Insights: monthly bar chart + spending by day](./Demo/29-insights-monthly-bar-chart-and-spending-by-day.png)
- [30 — Insights: recurring projection](./Demo/30-insights-recurring-projection.png)
- [31 — Insights: top spending with trends](./Demo/31-insights-top-spending-with-trends.png)

**Settings & Theme**
- [32 — Settings screen (dark)](./Demo/32-settings-screen-dark-mode.png)
- [33 — Settings screen (light)](./Demo/33-settings-screen-light-mode.png)
- [37 — Settings: accent color picker (light)](./Demo/37-settings-accent-color-picker-light.png)
- [38 — Settings screen: full light](./Demo/38-settings-screen-light-full.png)

**Light Mode Variants**
- [34 — Dashboard (light)](./Demo/34-dashboard-light-mode.png)
- [35 — Transactions list (light)](./Demo/35-transactions-list-light-mode.png)
- [36 — Insights + budgets (light)](./Demo/36-insights-budgets-light-mode.png)
- [39 — Add transaction (light)](./Demo/39-add-transaction-light-mode.png)
- [40 — Add transaction: account + notes (light)](./Demo/40-add-transaction-account-notes-light.png)

**Native iOS Date Picker (4 modes)**
- [41 — Date picker: calendar](./Demo/41-add-transaction-date-picker-calendar.png)
- [42 — Date picker: month-year wheel](./Demo/42-add-transaction-date-picker-month-year-wheel.png)
- [43 — Date picker: day wheel](./Demo/43-add-transaction-date-picker-day-wheel.png)
- [44 — Date picker: day grid](./Demo/44-add-transaction-date-picker-day-grid.png)

**Onboarding (dark + light pairs)**
- [45 — Onboarding welcome (dark)](./Demo/45-onboarding-welcome-dark.png)
- [46 — Onboarding welcome (light)](./Demo/46-onboarding-welcome-light.png)
- [47 — Onboarding choose currency (light)](./Demo/47-onboarding-choose-currency-light.png)
- [48 — Onboarding choose currency (dark)](./Demo/48-onboarding-choose-currency-dark.png)
- [49 — Onboarding setup account (light)](./Demo/49-onboarding-setup-account-light.png)
- [50 — Onboarding setup account (dark)](./Demo/50-onboarding-setup-account-dark.png)

---

## 🚀 Feature Walkthrough

### 1. Onboarding

A first-launch flow that walks the user through setting up their currency and creating their first account. Once completed, the user is redirected straight into the app. Every step is rendered for both light and dark themes.

| ![Welcome screen — dark mode with animated hero card and feature highlights](./Demo/45-onboarding-welcome-dark.png) | ![Welcome screen — light mode](./Demo/46-onboarding-welcome-light.png) |
|---|---|
| **Welcome (Dark)** — Animated hero card, three feature highlights, "Get Started" CTA | **Welcome (Light)** — Same screen rendered against the light theme |

| ![Choose currency screen — light mode with INR selected](./Demo/47-onboarding-choose-currency-light.png) | ![Choose currency screen — dark mode](./Demo/48-onboarding-choose-currency-dark.png) |
|---|---|
| **Choose Currency (Light)** — Searchable currency list, drives every monetary display in the app | **Choose Currency (Dark)** — Same flow, dark theme |

| ![Set up account screen — light mode with card preview](./Demo/49-onboarding-setup-account-light.png) | ![Set up account screen — dark mode](./Demo/50-onboarding-setup-account-dark.png) |
|---|---|
| **Set Up Account (Light)** — Reuses the main `AddAccountForm` with a forced-on default toggle, type chips, color picker, and a live card preview. Keyboard-aware scrolling included. | **Set Up Account (Dark)** — Same form, dark theme |

---

### 2. Home Dashboard

The dashboard is the entry point for the app. It shows a complete overview of the user's financial state at a glance.

| ![Dashboard top — total balance + month-over-month income/expense](./Demo/01-dashboard-balance-and-stats.png) | ![Spending breakdown donut chart with category legend](./Demo/02-dashboard-spending-breakdown-pie.png) | ![Recent transactions and savings goals](./Demo/03-dashboard-recent-transactions-and-goals.png) |
|---|---|---|

**What's on the dashboard:**

- **Greeting card** — "Good morning / afternoon / evening" based on local time.
- **Hero balance card** — Total balance across all accounts. Animated frosted-glass blob background. Toggleable balance visibility (eye icon). Income / expense for the current month with month-over-month % change vs the previous month.
- **Quick stats row** — Three equal-height cards (Income / Expenses / Savings Rate %) using accent-derived tints.
- **Spending breakdown donut chart** — Top 6 categories with percentages. Categories beyond the top 6 are grouped into an "Other" bucket so nothing is hidden. Legend lists every slice.
- **Savings Goals carousel** — Horizontal scroll showing each active goal with a progress %, motivation emoji, and a dashed "+ Add Goal" card at the end. "See All →" link on the section header navigates to the full Goals screen.
- **Recent transactions** — Latest 5 transactions with a "See All" link.
- **Overview cards (4)** — Budgets, Accounts, Recurring, Loans. Each shows real counts pulled from the DB and is tappable to navigate to that feature's screen.

**Pull-to-refresh** invalidates every dashboard query so the user can force a fresh fetch from SQLite.

---

### 3. Transactions

| ![Transactions list grouped by date with search bar and filter button](./Demo/22-transactions-list-all-today.png) | ![Search filtering transactions by "Food"](./Demo/23-transactions-list-search-food.png) | ![Granular filter sheet — date range, account, category](./Demo/24-transactions-filter-sheet.png) |
|---|---|---|

| ![Expense filter showing December 2025 transactions](./Demo/25-transactions-list-expense-filter-december.png) | ![Transaction detail with hero amount, category, account, date/time](./Demo/16-transaction-detail-view.png) | ![Edit Transaction sheet — Expense category picker](./Demo/17-edit-transaction-expense-categories.png) |
|---|---|---|

| ![Edit Transaction — Income category picker](./Demo/18-edit-transaction-income-categories.png) | ![Edit Transaction — Income account & notes](./Demo/19-edit-transaction-income-account-notes.png) | ![Edit Transaction — Transfer between accounts](./Demo/21-edit-transaction-transfer-accounts.png) |
|---|---|---|

**Capabilities:**

- **CRUD** — Add, view, edit, delete (with confirmation dialog and account-balance reversal).
- **Three transaction types** — Income, Expense, Transfer. The Transfer option only appears when the user has 2+ accounts.
- **Smart account picker** — Inline expandable selector with type icons; for transfers, the "To Account" dropdown filters out the "From" account so you can't transfer to yourself.
- **Native date & time picker** — iOS-style inline calendar + time spinner via `@react-native-community/datetimepicker`. Stored as full ISO timestamps so transactions show real time-of-day, not just the date.
- **Date sectioning** — Lists are auto-grouped into Today / Yesterday / This Week / Last Week / Month names. New sections appear automatically as data spans more time.
- **Type filter pills** — All / Income / Expense / Transfer.
- **Granular filter sheet** — Tap the filter icon (HugeIcons) next to the search bar to open a bottom sheet with date range pickers, an Account selector, and a Category picker. Multiple filters combine (e.g. "Expenses this week from HDFC in Food"). An active-filter count badge appears on the icon.
- **Full-text search** — Filters by category name and notes (powered by SQLite FTS5 virtual table).
- **Swipe to delete** — Each row supports swipe-left to delete.

---

### 4. Insights (Analytics)

A rich analytics screen with seven distinct widgets, all reacting to the same period filter.

| ![Insights — savings rate, pie chart, period pills](./Demo/26-insights-savings-rate-and-pie.png) | ![Custom date range picker for arbitrary ranges](./Demo/27-insights-custom-date-range.png) | ![Top spending categories and budget tracking](./Demo/28-insights-top-categories-and-budgets.png) |
|---|---|---|

| ![Monthly comparison bar chart and spending-by-day chart](./Demo/29-insights-monthly-bar-chart-and-spending-by-day.png) | ![Recurring expenses projection widget](./Demo/30-insights-recurring-projection.png) | ![Top spending list with up/down trend badges vs previous period](./Demo/31-insights-top-spending-with-trends.png) |
|---|---|---|

**Widgets:**

1. **Period selector** — Week / Month / Year preset pills + a custom date range icon (HugeIcons filter icon) that opens an inline From/To picker card.
2. **Quick summary** — Total Income & Total Expense for the current period.
3. **Savings Rate Card** — Big circle showing your savings %, plus motivational text and trend vs last period.
4. **Spending Breakdown** — Donut chart with center total + category legend.
5. **Budget Tracking** — Per-budget progress bars colored by health (green / amber / red) with a status pill summary ("3 on track · 1 warning · 2 over").
6. **Monthly Overview** — Grouped bar chart for the last 6 months showing income vs expense, with this-month vs last-month delta cards.
7. **Spending by Day of Week** — 7 vertical bars (Mon–Sun) with the highest day highlighted in the accent color ("You spend most on Saturdays").
8. **Recurring Projection** — Sums all active recurring rules to show projected monthly expense, plus the top 3 individual rules.
9. **Top Spending list** — Top 5 categories with rank badges, progress bars, percentages, and **trend badges** (↑12% red / ↓8% green) vs the previous period.

**Custom date range** — Swap the preset pills entirely for any "From → To" range. All widgets refilter accordingly.

---

### 5. Goals (Savings Challenges)

| ![Goals screen — total saved, active goals with milestones](./Demo/04-goals-screen-active-goals.png) | ![Create Goal form — name, amount, deadline, icon](./Demo/05-create-goal-form.png) | ![Create Goal form — color picker grid](./Demo/06-create-goal-color-picker.png) |
|---|---|---|

**Goal cards include:**

- **Live progress bar** with milestone dots at 25 / 50 / 75 / 100%, filled as you reach each tier.
- **Motivational text** that changes per progress band: "Let's get started!" → "Great start!" → "Halfway there!" → "Almost there!" → **"Goal achieved!"** with a Trophy icon and green-tinted card background on completion.
- **Smart suggestion** — Auto-calculated "Save ~₹500/week to reach your goal" based on remaining amount and days left. Switches to per-day or per-month based on what's natural.
- **Days remaining** — turns red when overdue.
- **Contribute button** with a sparkle icon. Contributions are capped at the remaining amount so you can never overshoot. If you raise a completed goal's target, it automatically un-completes and moves back to Active.

**Tapping a card** opens an action sheet with: Edit / Contribute / **History** / Delete. The History sheet shows every contribution with date, time, amount, and a running total — backed by the `goal_contributions` table.

The dashboard's Savings widget also has empty-state CTA, "See All", and a dashed "+ Add Goal" tile so users can discover goals immediately.

---

### 6. Budgets

| ![Budgets screen — over-budget warnings with red banners](./Demo/07-budgets-screen-over-budget-warnings.png) | ![Budgets screen — entertainment on track](./Demo/08-budgets-screen-on-track.png) | ![Create Budget form — period and category](./Demo/09-create-budget-form.png) |
|---|---|---|

**Features:**

- **Per-category monthly budgets** with three states: On Track (green) / Be Careful (amber) / Almost There / **Over Budget** (red).
- **Over-budget cards** get a red border, an `AlertTriangle` warning banner showing exact amount over, and the spent amount turns red.
- **Aggregate overview card at the top** shows total spent vs total budgeted, with status breakdown pills ("3 On Track · 1 Warning · 2 Over"). The whole card turns red when ANY budget is over.
- **Real-time progress** — `BudgetRepository.getSpentAmount()` runs a SQL `SUM` over the category's transactions for the current month.
- **Edit / delete** via tap → action sheet.

---

### 7. Recurring Charges

| ![Recurring screen — Next up card, monthly expense/income summary, list](./Demo/10-recurring-screen-summary-and-list.png) | ![Add Recurring form — type, amount, frequency, category](./Demo/11-add-recurring-form-amount-frequency.png) | ![Add Recurring form — account, dates, active toggle](./Demo/12-add-recurring-form-account-dates.png) |
|---|---|---|

**Features:**

- **Tracks subscriptions, bills, rent, salary** — anything that repeats.
- **Frequencies:** Daily / Weekly / Monthly / Yearly.
- **"Next up" card** at the top shows the soonest upcoming charge with a "Tomorrow / In 3 days" pill.
- **Side-by-side summary cards** — Monthly Expenses (red tint) and Monthly Income (green tint), with a Net Monthly row when both exist. All amounts use a shared `getMonthlyEquivalent()` helper that normalizes any frequency to a monthly figure.
- **Filter pills** — All / Active / Paused with count badges.
- **Card states** — left accent stripe colored by type (income green / expense red), type badge, frequency, next due date, status pill (Overdue / Due today / Due tomorrow / On Track / Paused).
- **Pay Now button** — When a charge is overdue, a green "Pay Now" button appears inside the card. Tapping it creates a real transaction, adjusts the linked account balance, and advances the next due date by one cycle.
- **Swipe gestures** — pause/resume + delete.

---

### 8. Loans (Lending & Borrowing)

| ![Loans — Lending tab with active and settled loans](./Demo/13-loans-screen-lending-tab.png) | ![Loans — Borrowing tab with overdue loan and action sheet](./Demo/14-loans-screen-borrowing-tab-action-sheet.png) | ![Add Loan form](./Demo/15-add-loan-form.png) |
|---|---|---|

**Features:**

- **Two tabs** — Lending (money you lent to others) / Borrowing (money you owe).
- **Summary cards** — "You Lent" total and "You Owe" total at the top.
- **Direction-aware cards** — `↗` arrow icon for lending, `↙` for borrowing. Color-coded (green income / red expense). "You lent" / "You owe" sub-label.
- **Smart date pills** — "5d left" / "Due tomorrow" / "12d overdue" / "Settled" / "Due soon" (≤7 days).
- **Tap card** → action sheet with Edit / Mark as Paid / Delete.

---

### 9. Accounts

A horizontal carousel of card-style accounts with per-account stats and recent transactions.

**Features:**

- **Bank-card-style horizontal carousel** with paging indicators. Each card shows account type, name, balance, and a "Default" badge if applicable.
- **16 preset card colors** + custom color picker in the form. Light mode lightens the chosen color by ~20% so cards stay readable.
- **Per-account stats** — Income / Expense for the active account this month.
- **Per-account recent transactions** — Last 5 transactions filtered for the active account.
- **CRUD via global sheet** — Add, edit, delete (default account is protected; can't delete the last account).

---

### 10. Settings

| ![Settings screen — dark mode with theme, accent, currency, data actions](./Demo/32-settings-screen-dark-mode.png) | ![Settings screen — light mode](./Demo/33-settings-screen-light-mode.png) | ![Accent color picker — 6 presets](./Demo/37-settings-accent-color-picker-light.png) |
|---|---|---|

**Sections:**

- **Appearance** — Light / Dark / System theme toggle. Accent color picker with 6 presets (Brown / Blue / Green / Purple / Teal / Red) that re-theme the entire app instantly.
- **Preferences** — Currency selector (drives every monetary display).
- **Data**
  - Export as CSV / JSON (sharable via the system share sheet)
  - **Seed Demo Data** — Populates the DB with 90+ realistic transactions, 6 budgets, 5 goals, 7 recurring rules, 5 loans across 4 months. Used to populate the demo screenshots.
  - **Clear All Data** — Wipes every table.
- **About** — App version.

---

### 11. Theming (Light + Dark Mode)

The entire app supports light mode, dark mode, and system mode. Every color is HSL-derived from a single accent value, so changing the accent re-themes everything in real-time.

| ![Dashboard — light mode](./Demo/34-dashboard-light-mode.png) | ![Transactions — light mode](./Demo/35-transactions-list-light-mode.png) | ![Insights — light mode budgets](./Demo/36-insights-budgets-light-mode.png) |
|---|---|---|

| ![Settings — light mode full](./Demo/38-settings-screen-light-full.png) | ![Add Transaction — light mode](./Demo/39-add-transaction-light-mode.png) | ![Add Transaction — account, date, notes (light)](./Demo/40-add-transaction-account-notes-light.png) |
|---|---|---|

---

### 12. Native Date & Time Pickers

The app uses iOS-native pickers for all date/time selection (`@react-native-community/datetimepicker`) — no third-party calendars or laggy spinners.

| ![Inline calendar grid for picking date](./Demo/41-add-transaction-date-picker-calendar.png) | ![Month/year wheel picker](./Demo/42-add-transaction-date-picker-month-year-wheel.png) | ![Day wheel picker (compact)](./Demo/43-add-transaction-date-picker-day-wheel.png) |
|---|---|---|

| ![Day grid picker](./Demo/44-add-transaction-date-picker-day-grid.png) |
|---|

The `DateTimeInput` component auto-detects whether it's inside a bottom sheet via context and automatically uses the correct underlying component (regular `TextInput` outside, `BottomSheetTextInput` inside). It supports `date`, `time`, and `datetime` modes.

---

## 🧱 Tech Stack

| Layer | Library | Version | Why |
|---|---|---|---|
| **Runtime** | React Native | 0.81.5 | Native iOS performance |
| **Framework** | Expo | SDK 54 | Managed native modules, OTA, dev experience |
| **Language** | TypeScript | 5.9 (strict) | Full type safety across the codebase |
| **Navigation** | Expo Router | 6.0 | File-based, type-safe routing on top of React Navigation |
| **Database** | expo-sqlite | 16.0 | Local SQLite with WAL mode + FTS5 |
| **Server state** | TanStack Query | 5.96 | Caching, mutation invalidation, background refetching |
| **Client state** | Zustand | 5.0 | Tiny persisted stores for theme, currency, filters |
| **Persistence** | AsyncStorage | 2.1 | JSON storage adapter for Zustand persist |
| **Styling** | NativeWind | 4.2 | Tailwind utilities for React Native (used sparingly — see Design Principles) |
| **Bottom sheets** | @gorhom/bottom-sheet | 5.2 | High-quality native sheet primitive |
| **Animations** | Reanimated + Skia | 4.1 / 2.6 | 60fps animations on the UI thread |
| **Charts** | react-native-gifted-charts | 1.4 | Pie, bar, line charts |
| **Date/time** | @react-native-community/datetimepicker | 8.4 | Native iOS calendar/time picker |
| **Keyboard** | react-native-keyboard-controller | 1.18 | Keyboard-aware scrolling inside bottom sheets |
| **Icons** | lucide-react-native + @hugeicons/react-native | – | Two complementary icon sets |
| **Fonts** | Nunito (6 weights) | – | Rounded, friendly numerals for finance display |
| **Gestures** | react-native-gesture-handler | 2.28 | Swipe-to-delete, pan-to-close sheets |
| **Linear gradients** | expo-linear-gradient | 15.0 | Edge fades, glass effects |
| **Blur** | expo-blur | 15.0 | Frosted-glass tab bar and balance card |

---

## 🏗️ Architecture

Zorvyn follows a **feature-first vertical slice** architecture. Each feature owns its own screens, components, hooks, services, and types — instead of scattering them across global folders. This makes features easy to find, easy to delete, and easy to test in isolation.

### Layer responsibilities

```
┌────────────────────────────────────────────────────────────┐
│                       app/  (routes)                       │  ← thin routing layer
├────────────────────────────────────────────────────────────┤
│                  features/<feature>/screens                │  ← screen components
│                  features/<feature>/components             │  ← UI building blocks
│                  features/<feature>/hooks                  │  ← React Query + state
│                  features/<feature>/services               │  ← business logic
│                  features/<feature>/types                  │  ← feature-local types
├────────────────────────────────────────────────────────────┤
│                   components/ui   shared/   feedback/      │  ← cross-feature UI primitives
├────────────────────────────────────────────────────────────┤
│   core/repositories/   core/database/   core/providers/    │  ← infrastructure
│   core/utils/          core/currency/   core/export/       │
├────────────────────────────────────────────────────────────┤
│                       SQLite (expo-sqlite)                 │
└────────────────────────────────────────────────────────────┘
```

### Data flow (e.g. creating a transaction)

```
TransactionForm                    (UI)
      ↓ calls
useTransactionForm hook            (form state + mutation)
      ↓ calls
TransactionRepository.create()     (data layer)
      ↓ executes SQL
SQLite (transactions table + FTS index)
      ↓ on success
queryClient.invalidateQueries()    (cache invalidation)
      ↓ triggers refetch
Affected screens re-render with fresh data
```

### Architectural rules enforced throughout

1. **Screens never touch the database directly.** They always go through hooks → repositories.
2. **Repositories never touch React.** They take a `db` instance and return Promises.
3. **Hooks own React Query keys and mutation invalidation.** Screens just call mutations.
4. **Pure components.** Extracted UI components receive everything via props — no `useTheme()` or `useStore()` calls beyond the top-level screen unless absolutely necessary.
5. **Single source of truth.** Theme is driven by HSL math from one accent. Currency is driven by one Zustand store. No values are duplicated.

---

## 📁 Project Structure

```
zorvyn/
├── README.md                    ← you are here
├── app.json                     ← Expo config (iOS bundle id, splash, fonts)
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── babel.config.js
├── ios/                         ← native iOS project (autogenerated by Expo prebuild)
├── assets/                      ← icon, splash
├── Demo/                        ← screenshots & video for this README
│   ├── 01-…44-….png
│   └── Video/zorvyn-app-walkthrough.mp4
└── src/
    ├── app/                     ← Expo Router file-based routes (thin)
    │   ├── _layout.tsx          ← Root stack, providers, font loading
    │   ├── index.tsx            ← Splash redirect (onboarding vs main)
    │   ├── (tabs)/              ← Tab navigator
    │   │   ├── _layout.tsx      ← Custom GlassTabBar
    │   │   ├── index.tsx        ← Home (dashboard)
    │   │   ├── transactions.tsx
    │   │   ├── analytics.tsx    ← Insights
    │   │   └── settings.tsx
    │   ├── (onboarding)/        ← Onboarding flow
    │   │   ├── _layout.tsx
    │   │   ├── welcome.tsx
    │   │   ├── setup-currency.tsx
    │   │   └── create-account.tsx
    │   ├── accounts.tsx         ← Stack route
    │   ├── recurring.tsx        ← Stack route
    │   ├── loans.tsx            ← Stack route
    │   ├── budget/index.tsx     ← Stack route
    │   ├── goal/index.tsx       ← Stack route
    │   └── transaction/[id].tsx ← Dynamic route for transaction detail
    │
    ├── features/                ← FEATURE-FIRST: each feature is self-contained
    │   ├── dashboard/
    │   │   ├── screens/         ← dashboard-screen.tsx, accounts-screen.tsx
    │   │   ├── components/      ← balance-card, savings-progress, account-card, …
    │   │   ├── hooks/           ← use-dashboard-data.ts
    │   │   └── constants.ts     ← TYPE_ICONS, CARD_COLORS, etc.
    │   ├── transactions/
    │   │   ├── screens/         ← transactions-screen, transaction-detail-screen
    │   │   ├── components/      ← transaction-card, transaction-form, transaction-filter-sheet, …
    │   │   ├── hooks/           ← use-transactions, use-transaction-form, use-transaction-filters
    │   │   ├── services/        ← transaction-service.ts (date grouping + search filtering)
    │   │   └── types/
    │   ├── analytics/
    │   │   ├── screens/         ← analytics-screen.tsx
    │   │   ├── components/      ← savings-rate-card, budget-vs-actual, monthly-comparison, …
    │   │   ├── hooks/           ← use-analytics.ts
    │   │   ├── services/        ← analytics-service.ts (period filtering, breakdowns, trends)
    │   │   └── types/
    │   ├── goals/
    │   │   ├── screens/         ← goals-screen.tsx
    │   │   ├── components/      ← goal-card, goal-form, contribution-history
    │   │   └── hooks/           ← use-goals.ts
    │   ├── budget/
    │   │   ├── screens/
    │   │   ├── components/
    │   │   ├── hooks/
    │   │   ├── services/        ← budget-service.ts (status colors, sort by urgency)
    │   │   └── types/
    │   ├── recurring/
    │   │   ├── screens/
    │   │   ├── components/
    │   │   ├── hooks/
    │   │   └── types/
    │   ├── loans/
    │   │   ├── screens/
    │   │   ├── components/
    │   │   ├── hooks/
    │   │   └── types/
    │   ├── settings/
    │   │   ├── screens/
    │   │   ├── components/
    │   │   ├── hooks/           ← use-settings.ts (lean — delegates to seed-service)
    │   │   ├── services/        ← seed-service.ts
    │   │   └── data/            ← demo-data.ts (pure data arrays)
    │   └── onboarding/
    │       ├── screens/
    │       ├── components/
    │       └── hooks/
    │
    ├── components/              ← cross-feature UI primitives
    │   ├── ui/                  ← Button, Input, SegmentedControl, OverviewCard, GlassTabBar, …
    │   ├── shared/              ← AmountInput, DateTimeInput, AccountSelector, CurrencyText,
    │   │                            CategoryIcon, GlobalSheet, EdgeFade, …
    │   └── feedback/            ← EmptyState, LoadingState, ErrorState
    │
    ├── core/                    ← infrastructure & cross-cutting concerns
    │   ├── database/
    │   │   ├── client.ts        ← SQLite open + WAL pragma
    │   │   ├── migrations.ts    ← versioned schema migrations (currently v1 + v2)
    │   │   └── seed.ts          ← default categories + user_preferences row
    │   ├── repositories/
    │   │   ├── base-repository.ts          ← generic CRUD (getAll, getById, create, update, delete)
    │   │   ├── transaction-repository.ts   ← + getByDateRange, getByAccount, getByCategory, FTS sync
    │   │   ├── account-repository.ts
    │   │   ├── category-repository.ts
    │   │   ├── budget-repository.ts        ← + getSpentAmount(category, range)
    │   │   ├── goal-repository.ts          ← + markCompleted
    │   │   ├── goal-contribution-repository.ts
    │   │   ├── recurring-repository.ts
    │   │   ├── loan-repository.ts
    │   │   └── user-preferences-repository.ts
    │   ├── providers/
    │   │   ├── app-providers.tsx           ← composition root: GestureHandler → Keyboard → Theme → DB → Query → Sheet
    │   │   ├── database-provider.tsx       ← runs migrations + seed on first launch
    │   │   ├── query-provider.tsx          ← TanStack Query client with sensible defaults
    │   │   └── theme-provider.tsx          ← syncs Zustand theme → NativeWind colorScheme
    │   ├── models/                         ← TypeScript interfaces matching SQLite tables
    │   ├── currency/
    │   │   ├── currency-data.ts            ← currency catalog (symbol, decimals, separators)
    │   │   └── currency-service.ts         ← formatCurrency, formatCompactCurrency
    │   ├── export/
    │   │   ├── export-service.ts           ← CSV / JSON serialization
    │   │   └── share-utils.ts              ← expo-sharing wrapper
    │   ├── utils/
    │   │   ├── date.ts                     ← startOfMonth, formatDateTime, formatTime, getRelativeTime
    │   │   ├── recurring.ts                ← getMonthlyEquivalent (shared frequency conversion)
    │   │   └── uuid.ts                     ← generateUUID
    │   ├── storage/
    │   │   └── mmkv.ts                     ← Zustand storage adapter (uses AsyncStorage under the hood)
    │   ├── constants/
    │   │   ├── config.ts                   ← app defaults
    │   │   └── query-keys.ts               ← namespaced React Query keys
    │   └── logger/
    │       └── console-logger.ts           ← single intentional logger (the only place console.* is allowed)
    │
    ├── stores/                  ← Zustand stores (persisted to AsyncStorage)
    │   ├── app-store.ts                    ← theme, onboardingCompleted (with v0→v1 migration)
    │   ├── currency-store.ts               ← user's selected currency code
    │   ├── theme-store.ts                  ← HSL accent values + computed light/dark palettes
    │   └── filters-store.ts                ← persistent transaction filters
    │
    └── theme/
        ├── hsl.ts                          ← HSL math + palette generation (single source of truth for colors)
        ├── use-theme.ts                    ← useTheme(), useIsDark() hooks
        ├── fonts.ts                        ← Nunito font family map
        ├── shadows.ts                      ← shadow presets
        └── typography.ts                   ← text style presets
```

### Path aliases (in `tsconfig.json`)

```json
{
  "@components/*": "src/components/*",
  "@core/*":       "src/core/*",
  "@features/*":   "src/features/*",
  "@stores/*":     "src/stores/*",
  "@theme/*":      "src/theme/*"
}
```

These keep imports clean: `import { useTheme } from '@theme/use-theme'` instead of `import { useTheme } from '../../../theme/use-theme'`.

---

## 🗄️ Database Design (SQLite)

The app uses **`expo-sqlite`** in **WAL (Write-Ahead Logging)** mode for better concurrent reads, with **foreign keys enabled** and **FTS5** for full-text search on transaction notes.

### Migration system

Migrations are versioned and tracked in a `_migrations` table. They run inside transactions and are idempotent — already-applied versions are skipped on subsequent launches.

```typescript
// src/core/database/migrations.ts
const migrations: Migration[] = [
  { version: 1, name: 'initial_schema', up: async (db) => { /* … */ } },
  { version: 2, name: 'add_loans_table', up: async (db) => { /* … */ } },
];
```

### Tables

| Table | Purpose | Key columns |
|---|---|---|
| **`accounts`** | Bank accounts, cash, wallets, credit cards | `name`, `type`, `balance`, `currency_code`, `color`, `is_default` |
| **`categories`** | Transaction categories (income & expense) | `name`, `type`, `icon`, `color`, `parent_id` (for hierarchy) |
| **`transactions`** | Income, expense, transfer entries | `amount`, `type`, `category_id`, `account_id`, `to_account_id`, `date`, `notes` |
| **`budgets`** | Monthly spending limits per category | `category_id`, `amount`, `period`, `alert_threshold`, `is_active` |
| **`goals`** | Savings targets | `name`, `target_amount`, `current_amount`, `deadline`, `is_completed` |
| **`goal_contributions`** | Each contribution to a goal | `goal_id`, `amount`, `account_id`, `notes` |
| **`recurring_rules`** | Recurring charges/subscriptions/income | `amount`, `type`, `frequency`, `next_due_date`, `is_active` |
| **`loans`** | Money lent or borrowed | `person_name`, `amount`, `type` (lending/borrowing), `due_date`, `status` |
| **`tags`** + **`transaction_tags`** | Many-to-many tagging (schema ready) | – |
| **`user_preferences`** | Currency, theme, onboarding status, etc. | – |
| **`transactions_fts`** | FTS5 virtual table for searching notes | – |
| **`_migrations`** | Schema version tracking | – |

### Conventions on every table

Every domain table includes:

- `id TEXT PRIMARY KEY` — UUIDs (generated client-side)
- `created_at`, `updated_at` — ISO timestamps
- `deleted_at` — **soft deletes** (every query filters `WHERE deleted_at IS NULL`)
- `sync_status TEXT DEFAULT 'pending'` — ready for a future cloud sync feature

### Indexes

Performance-critical lookups have explicit indexes:

```sql
CREATE INDEX idx_transactions_date     ON transactions(date);
CREATE INDEX idx_transactions_account  ON transactions(account_id);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_transactions_type     ON transactions(type);
CREATE INDEX idx_budgets_period        ON budgets(period, start_date);
CREATE INDEX idx_recurring_next_due    ON recurring_rules(next_due_date, is_active);
-- …and more
```

### Repository pattern

Every table is accessed through a repository that extends `BaseRepository<T>`:

```typescript
// src/core/repositories/base-repository.ts
export abstract class BaseRepository<T extends BaseModel> {
  constructor(protected db: SQLiteDatabase, protected tableName: string) {}

  async getAll(): Promise<T[]> { /* … */ }
  async getById(id: string): Promise<T | null> { /* … */ }
  async create(data: Omit<T, keyof BaseModel>): Promise<T> { /* … */ }
  async update(id: string, data: Partial<...>): Promise<T> { /* … */ }
  async delete(id: string): Promise<void> { /* soft delete */ }
}
```

Specialized methods are added per repository — e.g. `TransactionRepository.getByDateRange()`, `BudgetRepository.getSpentAmount()`, `RecurringRepository.getAllWithCategory()`.

This means **no SQL is ever written inside a React component or screen**. All SQL lives in `core/repositories/`.

### Demo data seeding

The "Seed Demo Data" action in Settings populates the database with realistic data:

- **90+ transactions** spread across the last 4 months (Indian context: Swiggy, Ola, BigBasket, BESCOM, etc.)
- **6 active budgets**
- **5 goals** at varying progress levels (one completed, one almost done, etc.)
- **7 recurring rules** (Netflix, rent, gym, salary, …)
- **5 loans** (mix of lending/borrowing/active/paid/overdue)

Demo data lives in `src/features/settings/data/demo-data.ts` (pure data) and the seeding logic lives in `src/features/settings/services/seed-service.ts` (DB operations). The hook `use-settings.ts` just orchestrates them — clean separation.

---

## 🔄 State Management Strategy

Zorvyn uses **two complementary state systems**:

### 1. TanStack React Query — server state (database)

Anything that lives in SQLite is a React Query query. This gives us:

- **Caching** — same query key = same cached data, no duplicate fetches
- **Automatic invalidation** — mutations call `queryClient.invalidateQueries()` and dependent screens refetch
- **Loading & error states** — first-class, no manual flag wrangling
- **`refetchOnMount: 'always'`** — used for critical dashboard widgets so they always show fresh data when navigating back

Query keys are namespaced in `src/core/constants/query-keys.ts`:

```typescript
queryKeys.transactions.all          // ['transactions', 'all']
queryKeys.transactions.byDateRange(start, end)
queryKeys.accounts.all
queryKeys.budgets.active
queryKeys.goals.active
```

### 2. Zustand — client state (UI preferences)

Anything **not** in SQLite — theme, currency, transaction filters, onboarding status — lives in a tiny Zustand store with `persist` middleware backed by AsyncStorage.

| Store | What it holds |
|---|---|
| **`app-store`** | `theme: 'system' / 'light' / 'dark'`, `onboardingCompleted` |
| **`currency-store`** | `currencyCode` (drives every `formatCurrency()` call) |
| **`theme-store`** | `hue`, `saturation`, `lightness`, `activePreset`, computed `darkPalette` and `lightPalette` |
| **`filters-store`** | `dateRange`, `selectedAccountId`, `selectedCategoryId`, `selectedType` |

The `app-store` even has a **schema migration** (`v0 → v1`) to handle a one-time data fix without breaking existing installs:

```typescript
version: 1,
migrate: (persisted: unknown, version: number) => {
  if (version === 0) {
    return { ...(persisted as Record<string, unknown>), theme: 'system' } as AppState;
  }
  return persisted as AppState;
},
```

---

## 🎨 Theme System

Possibly the coolest piece of the app: **the entire visual style is generated from a single HSL accent color**.

### How it works

1. The user picks an **accent preset** (Brown / Blue / Green / Purple / Teal / Red) in Settings.
2. Each preset maps to a `[hue, saturation, lightness]` triple stored in `theme-store`.
3. `theme/hsl.ts` generates a complete `ThemePalette` (~25 color tokens) for both dark and light modes from those three numbers — accent scale (`accent200`–`accent700`), surfaces, text, borders, tab bar, semantic colors (`income`, `expense`, `transfer`, `warning`), card backgrounds, tints, glow rings, gradient stops.
4. Components use `const theme = useTheme()` to read tokens. When the accent changes, every `useTheme()` consumer re-renders with the new palette in real time. **No CSS variables, no app reload, no manual list of colors to update.**

### Example: how `textOnAccent` is computed

```typescript
// theme/hsl.ts
const textOnAccent = lightness > 55 ? darkText : lightText;
```

Lighter accents (orange, yellow) get dark text; darker accents (navy, deep purple) get white text. **Contrast is automatic.**

### Light vs Dark mode

The palette generator has two functions, `generateDarkPalette()` and `generateLightPalette()`, that derive sensible surface/text values from the same HSL input. The active palette is selected by NativeWind's `useColorScheme()`, which is itself driven by the user's `app-store.theme` preference + the OS system theme.

The `ThemeProvider` syncs the Zustand preference to NativeWind in a `useEffect`, with module-level fallback for the very first render to avoid white flashes.

---

## 🎯 Design Principles

These are the rules I followed throughout the codebase:

### 1. **Feature-first, not type-first**

A single feature (e.g. "transactions") owns its screens, components, hooks, services, and types in one folder. You can grep one folder and understand 90% of the feature.

### 2. **Separation of concerns**

| Layer | Responsibility | Example |
|---|---|---|
| Screen | Layout + orchestration | `accounts-screen.tsx` |
| Component | Presentation only, props in / JSX out | `account-card.tsx` |
| Hook | React state + React Query keys + mutations | `use-transactions.ts` |
| Service | Pure business logic / data transforms | `analytics-service.ts` |
| Repository | SQL only | `transaction-repository.ts` |

Screens never write SQL. Repositories never call hooks. Services are framework-free.

### 3. **Single source of truth**

- One theme system → all colors come from `useTheme()`.
- One currency store → every monetary display formats consistently.
- One date utility → all date formatting goes through `@core/utils/date`.
- One frequency converter → `getMonthlyEquivalent()` is shared between recurring and analytics.

### 4. **Composition over duplication**

- Reusable UI primitives: `Button`, `Input`, `SegmentedControl`, `OverviewCard`, `EmptyState`, `LoadingState`, `ErrorState`.
- Reusable shared components: `AmountInput`, `DateTimeInput`, `AccountSelector`, `CategoryPicker`, `CurrencyText`, `CategoryIcon`, `GlobalSheet`.
- A single `GlobalSheet` hosts every bottom-sheet form in the app — one provider at the root, every form opens via `useGlobalSheet().openSheet({ title, content, snapPoints })`.

### 5. **Defensive about React Native quirks**

- **NativeWind Pressable bug** — `borderRadius`/`backgroundColor`/inline `style` on `<Pressable>` get silently dropped by NativeWind v4. The fix throughout the codebase: wrap `Pressable` content in a `View`, only put `opacity` on the Pressable. This is documented in code comments where it matters.
- **`BottomSheetTextInput` vs `TextInput`** — gorhom's bottom sheet needs a special text input to track focus correctly. The `Input` and `AmountInput` components auto-detect via React context whether they're inside a sheet (`useIsInBottomSheet()`) and pick the right one.
- **Hooks order** — every screen has a strict "hooks at the top, conditionals after" structure.
- **No `as any`** — zero `any` casts in the entire codebase (except for one documented union-type workaround in `Input`).

### 6. **Production hygiene**

- **No `console.log`** anywhere except the dedicated `console-logger` abstraction.
- **No dead code** — every import is used, every variable is read.
- **No unused store fields** — the filters store, for example, dropped `searchQuery` because it lived as local screen state instead.
- **Consistent file size** — the largest screen is ~230 lines. Anything bigger gets decomposed.

### 7. **Accessibility & ergonomics**

- All inputs use the OS-native keyboard with the right `keyboardType`.
- Forms support keyboard dismiss on scroll (`keyboardDismissMode="on-drag"`).
- Bottom sheets resize gracefully when the keyboard appears.
- Tap targets are at least 44x44 (Apple HIG).
- Status bar style follows the active theme (`<StatusBar style="auto" />`).

---

## ⚡ Key Implementation Highlights

### 1. Smart account/transfer logic
- The "Transfer" type only appears when the user has 2+ accounts.
- The "To Account" picker filters out the "From" account so you can't transfer to yourself.
- Editing a transaction reverses the old account balance change before applying the new one — no orphaned balances.

### 2. Goal completion is reactive
- Contributing more than the remaining amount is **clamped** to the remaining (no overshoot).
- Editing a completed goal's target above the current saved amount **automatically un-completes** the goal and moves it back to Active.

### 3. Recurring "Pay Now" flow
- Overdue recurring charges show a green "Pay Now" button inside the card.
- Tapping it: creates a transaction → adjusts the account balance → advances `next_due_date` by one cycle.

### 4. Transaction filter combinator
- The `useTransactions` hook fetches all transactions once and filters in JS, so multiple filters **combine** ("Expenses this week from HDFC in Food category").
- Earlier versions used an SQL if-else chain that only applied one filter at a time — fixed during cleanup.

### 5. N+1 query fix in analytics
- The budget-vs-actual widget originally fetched categories inside a loop (N+1 reads). Hoisted the categories fetch out of the loop and used a `Map` lookup — single fetch regardless of budget count.

### 6. Reactive theme switching
- Switching the accent in Settings instantly recolors every visible screen with no app reload, because the entire palette is computed from the HSL store and every component subscribes via `useTheme()`.

### 7. Custom date range insights
- The Insights period selector supports Week / Month / Year presets **and** a custom From → To range. All seven analytics widgets re-filter from the same source.

### 8. Demo data seeding
- One-tap "Seed Demo Data" populates 90+ transactions, 6 budgets, 5 goals, 7 recurring rules, 5 loans across 4 months — used to populate every screenshot in this README.

---

## 🛠️ Setup & Run

### Prerequisites

- Node.js 18+
- macOS with Xcode (for iOS)
- An iPhone or iOS Simulator
- iOS 16+

### Install

```bash
git clone <this-repo>
cd zorvyn
npm install
```

### Run on iOS Simulator

```bash
npx expo run:ios
```

### Run on a physical iPhone

Connect your device via USB, then:

```bash
npx expo run:ios --device
```

### First-launch flow

1. The splash screen appears while fonts load.
2. The `DatabaseProvider` runs SQLite migrations and seeds default categories.
3. The user is redirected to the onboarding flow (Welcome → Currency → Create Account).
4. After account creation, the main tab navigator appears.

### To populate demo data for screenshots

Open the app → Settings → "Seed Demo Data" → confirm. The DB will be populated with 90+ transactions, 6 budgets, 5 goals, 7 recurring rules, and 5 loans.

---

## ✅ Features Checklist

| # | Feature | Status |
|---|---|---|
| 1 | Home Dashboard with Summary | ✅ Complete |
| 2 | Visual Element (Chart, Trend, Breakdown) | ✅ Complete |
| 3 | Transaction Tracking (Add, View, Edit, Delete) | ✅ Complete |
| 4 | Transaction Filtering or Search | ✅ Complete (granular filter sheet + multi-filter combination) |
| 5 | Goal or Challenge Feature | ✅ Complete (with milestones, motivational text, smart suggestions, contribution history) |
| 6 | Insights Screen | ✅ Complete (7 widgets with custom date range support) |
| 7 | Smooth Navigation Flow | ✅ Complete (tabs + stack + global bottom sheet) |
| 8 | Empty, Loading, and Error States | ✅ Complete (themed components used app-wide) |
| 9 | Local Data Persistence | ✅ Complete (SQLite with WAL, FTS5, soft deletes, migrations) |
| 10 | State Management | ✅ Complete (TanStack Query + Zustand + persist) |

### Bonus features beyond the checklist

- Reactive HSL-based theme system with 6 accent presets and full light/dark/system mode
- Custom glass tab bar with frosted blur
- Native iOS date/time picker integration
- Recurring charge "Pay Now" flow that creates real transactions
- Per-account carousel with stats and recent transactions
- Loan tracking (lending + borrowing) with overdue detection
- CSV / JSON export with system share sheet
- Demo data seeder

---

## 📝 Notes

- This app is **iOS only**. The Android folder isn't included and `app.json` is iOS-focused. All native pickers (date/time), gestures, and animations are tested on iOS.
- The codebase has **zero `console.log` statements** outside the dedicated logger, **zero `as any` casts**, and **zero TypeScript errors** (`npx tsc --noEmit` passes clean).
- Built and submitted as part of an interview screening round.

---
