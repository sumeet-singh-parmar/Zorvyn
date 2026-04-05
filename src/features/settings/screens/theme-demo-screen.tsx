import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TrendingUp, TrendingDown, ChevronRight, Search } from 'lucide-react-native';
import {
  Home01Icon, Home02Icon,
  TransactionHistoryIcon,
  Analytics01Icon,
  Setting07Icon,
  MoneyBag02Icon,
  ChartHistogramIcon,
  Invoice02Icon,
  CreditCardIcon,
} from '@hugeicons/core-free-icons';
import { OverviewCard } from '@components/ui/overview-card';
import { Modal } from '@components/ui/modal';
import { useTheme, useIsDark } from '@theme/use-theme';
import { useThemeStore, ACCENT_PRESETS, type PresetName } from '@stores/theme-store';
import { useAppStore } from '@stores/app-store';
import { StatusBarGradient } from '@components/shared/status-bar-gradient';
import { BalanceCard } from '@features/dashboard/components/balance-card';
import { GlassTabBarPreview } from '@components/ui/glass-tab-bar';
import { formatCurrency } from '@core/currency';
import { fonts } from '@theme/fonts';

const DEMO_TABS = [
  { key: 'home', label: 'Home', icon: Home01Icon, iconFilled: Home02Icon },
  { key: 'transactions', label: 'Transactions', icon: TransactionHistoryIcon, iconFilled: TransactionHistoryIcon },
  { key: 'insights', label: 'Insights', icon: Analytics01Icon, iconFilled: Analytics01Icon },
  { key: 'settings', label: 'Settings', icon: Setting07Icon, iconFilled: Setting07Icon },
];

const PRESET_ENTRIES = Object.entries(ACCENT_PRESETS) as [PresetName, [number, number, number]][];

export function ThemeDemoScreen() {
  const theme = useTheme();
  const isDark = useIsDark();
  const { setPreset, activePreset, hue, saturation, lightness } = useThemeStore();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState(0);
  const [showSheet, setShowSheet] = useState(false);
  const setTheme = useAppStore((s) => s.setTheme);
  const toggleDark = () => {
    const next = isDark ? 'light' : 'dark';
    setTheme(next);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.screenBg }}>
      <StatusBarGradient />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: insets.top + 16, paddingBottom: 60 }}>

        {/* Title */}
        <Text style={{ fontFamily: fonts.black, fontSize: 28, color: theme.textPrimary, marginBottom: 4 }}>
          Theme Demo
        </Text>
        <Text style={{ fontFamily: fonts.body, fontSize: 14, color: theme.textSecondary, marginBottom: 24 }}>
          HSL({hue}, {saturation}%, {lightness}%)
        </Text>

        {/* Dark/Light Toggle */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <Text style={{ fontFamily: fonts.semibold, fontSize: 16, color: theme.textPrimary }}>
            Dark Mode
          </Text>
          <Switch
            value={isDark}
            onValueChange={toggleDark}
            trackColor={{ false: theme.border, true: theme.accent500 }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Preset Circles */}
        <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12 }}>
          Accent Color
        </Text>
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 28 }}>
          {PRESET_ENTRIES.map(([name, [h, s, l]]) => {
            const isActive = activePreset === name;
            const previewColor = `hsl(${h}, ${s}%, ${l}%)`;
            return (
              <Pressable
                key={name}
                onPress={() => setPreset(name)}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: previewColor,
                  borderWidth: isActive ? 3 : 0,
                  borderColor: theme.textPrimary,
                  opacity: isActive ? 1 : 0.7,
                }}
              />
            );
          })}
        </View>

        {/* Hero Card */}
        <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12 }}>
          Hero Card
        </Text>
        <View style={{ marginBottom: 24 }}>
          <BalanceCard totalBalance={48204} totalIncome={4124} totalExpense={4656} lastMonthIncome={3763} lastMonthExpense={4840} />
        </View>

        {/* Overview Grid */}
        <Text style={{ fontFamily: fonts.heading, fontSize: 18, color: theme.textPrimary, marginBottom: 12 }}>
          Overview
        </Text>
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
          <OverviewCard
            icon={MoneyBag02Icon}
            title="Budgets"
            stat="10"
            statLabel="Budgets"
            progress={0.13}
          />
          <OverviewCard
            icon={ChartHistogramIcon}
            title="Assets"
            stat="7"
            statLabel="Assets"
            secondaryStat={formatCurrency(688000)}
            secondaryLabel="Total"
          />
        </View>
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
          <OverviewCard
            icon={Invoice02Icon}
            title="Bill Splitter"
            stat="6"
            statLabel="Bills"
            secondaryStat="6"
            secondaryLabel="Active"
          />
          <OverviewCard
            icon={CreditCardIcon}
            title="Loans"
            stat="4"
            statLabel="Lending"
            secondaryStat="6"
            secondaryLabel="Borrowing"
          />
        </View>

        {/* Quick Stats */}
        <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12 }}>
          Quick Stats
        </Text>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 24 }}>
          {/* Income */}
          <View style={{ flex: 1, backgroundColor: theme.incomeTint, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: 'rgba(0,196,140,0.15)' }}>
            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(0,196,140,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <TrendingUp size={16} color={theme.income} />
            </View>
            <Text style={{ fontFamily: fonts.body, fontSize: 12, color: theme.textSecondary }}>Income</Text>
            <Text style={{ fontFamily: fonts.heading, fontSize: 17, color: theme.income, marginTop: 2 }}>{formatCurrency(4124, 'USD')}</Text>
          </View>
          {/* Expense */}
          <View style={{ flex: 1, backgroundColor: theme.expenseTint, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: 'rgba(255,107,107,0.15)' }}>
            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,107,107,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <TrendingDown size={16} color={theme.expense} />
            </View>
            <Text style={{ fontFamily: fonts.body, fontSize: 12, color: theme.textSecondary }}>Expense</Text>
            <Text style={{ fontFamily: fonts.heading, fontSize: 17, color: theme.expense, marginTop: 2 }}>{formatCurrency(4656, 'USD')}</Text>
          </View>
          {/* Accent tint */}
          <View style={{ flex: 1, backgroundColor: theme.tint, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: theme.ring }}>
            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: theme.ring, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <Search size={16} color={theme.accent500} />
            </View>
            <Text style={{ fontFamily: fonts.body, fontSize: 12, color: theme.textSecondary }}>Savings</Text>
            <Text style={{ fontFamily: fonts.heading, fontSize: 17, color: theme.accent500, marginTop: 2 }}>12%</Text>
          </View>
        </View>

        {/* Card with content */}
        <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12 }}>
          Card
        </Text>
        <View style={{ backgroundColor: theme.cardBg, borderRadius: 20, borderWidth: 1, borderColor: theme.border, marginBottom: 24, overflow: 'hidden' }}>
          <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: theme.border }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: 16, color: theme.textPrimary }}>Recent Transactions</Text>
          </View>
          {/* Row 1 */}
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: theme.border }}>
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: theme.tint, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <Search size={18} color={theme.accent500} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.semibold, fontSize: 14, color: theme.textPrimary }}>Groceries</Text>
              <Text style={{ fontFamily: fonts.body, fontSize: 12, color: theme.textMuted, marginTop: 2 }}>Food & Dining</Text>
            </View>
            <Text style={{ fontFamily: fonts.heading, fontSize: 14, color: theme.expense }}>-{formatCurrency(45)}</Text>
          </View>
          {/* Row 2 */}
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: theme.incomeTint, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <TrendingUp size={18} color={theme.income} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.semibold, fontSize: 14, color: theme.textPrimary }}>Salary</Text>
              <Text style={{ fontFamily: fonts.body, fontSize: 12, color: theme.textMuted, marginTop: 2 }}>Monthly</Text>
            </View>
            <Text style={{ fontFamily: fonts.heading, fontSize: 14, color: theme.income }}>+{formatCurrency(3200)}</Text>
          </View>
        </View>

        {/* Menu rows with tint */}
        <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12 }}>
          Menu Rows
        </Text>
        <View style={{ backgroundColor: theme.cardBg, borderRadius: 20, borderWidth: 1, borderColor: theme.border, marginBottom: 24, overflow: 'hidden' }}>
          {['Export CSV', 'Notifications', 'Currency'].map((label, i) => (
            <View key={label} style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: i < 2 ? 1 : 0, borderBottomColor: theme.border }}>
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: theme.tint, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <Search size={16} color={theme.accent500} />
              </View>
              <Text style={{ flex: 1, fontFamily: fonts.semibold, fontSize: 15, color: theme.textPrimary }}>{label}</Text>
              <ChevronRight size={18} color={theme.textMuted} />
            </View>
          ))}
        </View>

        {/* Input field */}
        <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12 }}>
          Input
        </Text>
        <View style={{ backgroundColor: theme.surfaceBg, borderRadius: 16, borderWidth: 2, borderColor: theme.border, padding: 16, marginBottom: 24, flexDirection: 'row', alignItems: 'center' }}>
          <Search size={18} color={theme.textMuted} />
          <Text style={{ fontFamily: fonts.body, fontSize: 15, color: theme.textMuted, marginLeft: 10 }}>Search transactions...</Text>
        </View>

        {/* Button */}
        <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12 }}>
          Button
        </Text>
        <View style={{ borderRadius: 50, overflow: 'hidden', marginBottom: 24 }}>
          <Pressable style={{ backgroundColor: theme.buttonBg, borderRadius: 50, paddingVertical: 16, alignItems: 'center' }}>
            <Text style={{ fontFamily: fonts.black, fontSize: 16, color: theme.textOnAccent }}>Add Transaction</Text>
          </Pressable>
        </View>

        {/* Tab bar preview */}
        <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12 }}>
          Tab Bar
        </Text>
        <GlassTabBarPreview
          tabs={DEMO_TABS}
          activeIndex={activeTab}
          onTabPress={setActiveTab}
          onPlusPress={() => {}}
        />

        {/* Text samples */}
        <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginTop: 28, marginBottom: 12 }}>
          Typography
        </Text>
        <Text style={{ fontFamily: fonts.black, fontSize: 34, color: theme.textPrimary, marginBottom: 4 }}>Black (900) — Heading</Text>
        <Text style={{ fontFamily: fonts.extrabold, fontSize: 20, color: theme.textPrimary, marginBottom: 4 }}>ExtraBold (800)</Text>
        <Text style={{ fontFamily: fonts.heading, fontSize: 18, color: theme.textPrimary, marginBottom: 4 }}>Bold (700) — Titles</Text>
        <Text style={{ fontFamily: fonts.semibold, fontSize: 16, color: theme.textSecondary, marginBottom: 4 }}>SemiBold (600) — Labels</Text>
        <Text style={{ fontFamily: fonts.medium, fontSize: 15, color: theme.textSecondary, marginBottom: 4 }}>Medium (500) — Body emphasis</Text>
        <Text style={{ fontFamily: fonts.body, fontSize: 14, color: theme.textMuted, marginBottom: 4 }}>Regular (400) — Body text</Text>

        {/* Bottom Sheet */}
        <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginTop: 28, marginBottom: 12 }}>
          Bottom Sheet
        </Text>
        <Pressable
          onPress={() => setShowSheet(true)}
          style={{
            backgroundColor: theme.buttonBg,
            borderRadius: 50,
            paddingVertical: 14,
            alignItems: 'center',
            marginBottom: 60,
          }}
        >
          <Text style={{ fontFamily: fonts.heading, fontSize: 15, color: theme.textOnAccent }}>Open Bottom Sheet</Text>
        </Pressable>

      </ScrollView>

      {/* Bottom Sheet Modal */}
      <Modal visible={showSheet} onClose={() => setShowSheet(false)} title="Select Account">
        {['Kotak Savings', 'HDFC Current', 'Cash Wallet'].map((name, i) => (
          <Pressable
            key={name}
            onPress={() => setShowSheet(false)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 14,
              borderBottomWidth: i < 2 ? 1 : 0,
              borderBottomColor: theme.border,
            }}
          >
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: theme.tint, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <Text style={{ fontFamily: fonts.heading, fontSize: 16, color: theme.accent500 }}>{name[0]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.semibold, fontSize: 15, color: theme.textPrimary }}>{name}</Text>
              <Text style={{ fontFamily: fonts.body, fontSize: 12, color: theme.textMuted, marginTop: 2 }}>Savings Account</Text>
            </View>
            <ChevronRight size={18} color={theme.textMuted} />
          </Pressable>
        ))}
      </Modal>
    </View>
  );
}
