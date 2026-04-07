import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useScreenTopPadding } from '@components/shared/edge-fade';
import { AlertCircle, ChevronRight, Download, Code, Database, Trash2, Package, Palette } from 'lucide-react-native';
import { ThemeToggle } from '../components/theme-toggle';
import { CurrencySelector } from '../components/currency-selector';
import { useSettings } from '../hooks/use-settings';
import { useRouter } from 'expo-router';
import { useTheme } from '@theme/use-theme';
import { useThemeStore, ACCENT_PRESETS, type PresetName } from '@stores/theme-store';
import { hslToHex } from '@theme/hsl';
import { useGlobalSheet } from '@components/shared/global-sheet';
import { fonts } from '@theme/fonts';

const PRESET_ENTRIES = Object.entries(ACCENT_PRESETS) as [PresetName, [number, number, number]][];

function AccentColorPicker() {
  const theme = useTheme();
  const { setPreset, activePreset } = useThemeStore();

  return (
    <View style={{ gap: 20 }}>
      <Text style={{ fontSize: 14, fontFamily: fonts.body, color: theme.textSecondary }}>
        Choose an accent color for the entire app
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
        {PRESET_ENTRIES.map(([name, [h, s, l]]) => {
          const isActive = activePreset === name;
          const color = hslToHex(h, Math.min(s, 85), Math.min(l, 55));
          return (
            <Pressable
              key={name}
              onPress={() => setPreset(name)}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <View style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                backgroundColor: color,
                borderWidth: isActive ? 3 : 0,
                borderColor: theme.textPrimary,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {isActive && (
                  <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: theme.textOnAccent }} />
                )}
              </View>
              <Text style={{ fontSize: 11, fontFamily: fonts.medium, color: theme.textSecondary, textAlign: 'center', marginTop: 6, textTransform: 'capitalize' }}>
                {name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function SettingsScreen() {
  const theme = useTheme();
  const topPadding = useScreenTopPadding();
  const { openSheet } = useGlobalSheet();
  const activePreset = useThemeStore((s) => s.activePreset);
  const {
    exportData,
    seedDemoData,
    clearAllData,
    transactionCount,
    isExporting,
    exportError,
  } = useSettings();
  const router = useRouter();
  const [showExportError, setShowExportError] = useState(false);

  const handleExportCSV = () => {
    Alert.alert('Export as CSV', `Export ${transactionCount} transactions as CSV?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Export', onPress: () => exportData('csv') },
    ]);
  };

  const handleExportJSON = () => {
    Alert.alert('Export as JSON', `Export ${transactionCount} transactions as JSON?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Export', onPress: () => exportData('json') },
    ]);
  };

  const handleSeedDemo = () => {
    Alert.alert('Seed Demo Data', 'Add sample transactions?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Seed', onPress: () => seedDemoData() },
    ]);
  };

  const handleClearData = () => {
    Alert.alert('Clear All Data', 'This will permanently delete everything. Cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', onPress: () => clearAllData(), style: 'destructive' },
    ]);
  };

  React.useEffect(() => {
    if (exportError) setShowExportError(true);
  }, [exportError]);

  const settingsData = [
    {
      title: 'Data',
      items: [
        { icon: Download, label: 'Export as CSV', value: `${transactionCount} transactions`, onPress: handleExportCSV, color: theme.transfer },
        { icon: Code, label: 'Export as JSON', value: `${transactionCount} transactions`, onPress: handleExportJSON, color: theme.income },
        { icon: Database, label: 'Seed Demo Data', value: 'Add samples', onPress: handleSeedDemo, color: theme.warning },
        { icon: Trash2, label: 'Clear All Data', value: 'Destructive', onPress: handleClearData, color: theme.expense, destructive: true },
      ],
    },
    {
      title: 'About',
      items: [
        { icon: Package, label: 'App Version', value: '1.0.0', onPress: () => {}, color: theme.accent500 },
      ],
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: topPadding, paddingBottom: 100 }}
      >
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
          <Text style={{ fontSize: 28, fontFamily: fonts.black, color: theme.textPrimary }}>
            Settings
          </Text>
        </View>

        {/* Appearance */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text style={{ fontSize: 13, fontFamily: fonts.heading, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12 }}>
            Appearance
          </Text>
          <View style={{ backgroundColor: theme.cardBg, borderRadius: 20, borderWidth: 1, borderColor: theme.border, padding: 16, marginBottom: 12 }}>
            <ThemeToggle />
          </View>

          {/* Accent Color */}
          <Pressable
            onPress={() => openSheet({ title: 'Accent Color', content: <AccentColorPicker />, snapPoints: ['45%'] })}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: theme.cardBg,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: theme.border,
              paddingHorizontal: 16,
              paddingVertical: 14,
            }}>
              <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: theme.tint, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <Palette size={18} color={theme.buttonBg} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontFamily: fonts.semibold, color: theme.textPrimary }}>Accent Color</Text>
                <Text style={{ fontSize: 12, fontFamily: fonts.body, color: theme.textMuted, marginTop: 2, textTransform: 'capitalize' }}>
                  {activePreset ?? 'Custom'}
                </Text>
              </View>
              <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: theme.accent500, marginRight: 8 }} />
              <ChevronRight size={18} color={theme.textMuted} />
            </View>
          </Pressable>
        </View>

        {/* Preferences */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text style={{ fontSize: 13, fontFamily: fonts.heading, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12 }}>
            Preferences
          </Text>
          <View style={{ backgroundColor: theme.cardBg, borderRadius: 20, borderWidth: 1, borderColor: theme.border, overflow: 'hidden' }}>
            <CurrencySelector />
          </View>
        </View>

        {/* Sections */}
        {settingsData.map((section) => (
          <View key={section.title} style={{ paddingHorizontal: 20, marginBottom: 24 }}>
            <Text style={{ fontSize: 13, fontFamily: fonts.heading, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12 }}>
              {section.title}
            </Text>
            <View style={{ backgroundColor: theme.cardBg, borderRadius: 20, borderWidth: 1, borderColor: theme.border, overflow: 'hidden' }}>
              {section.items.map((item, i) => {
                const IconComp = item.icon;
                return (
                  <View
                    key={item.label}
                    style={{
                      borderTopWidth: i > 0 ? 1 : 0,
                      borderTopColor: theme.border,
                    }}
                  >
                    <Pressable
                      onPress={item.onPress}
                      disabled={isExporting}
                      style={({ pressed }) => ({
                        opacity: pressed ? 0.7 : isExporting ? 0.5 : 1,
                      })}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 }}>
                        <View style={{
                          width: 38,
                          height: 38,
                          borderRadius: 12,
                          backgroundColor: item.color + '18',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <IconComp size={18} color={item.color} />
                        </View>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                          <Text style={{
                            fontSize: 15,
                            fontFamily: fonts.semibold,
                            color: item.destructive ? theme.expense : theme.textPrimary,
                          }}>
                            {item.label}
                          </Text>
                          {item.value && (
                            <Text style={{ fontSize: 12, fontFamily: fonts.body, color: theme.textMuted, marginTop: 2 }}>
                              {item.value}
                            </Text>
                          )}
                        </View>
                        <ChevronRight size={18} color={theme.textMuted} />
                      </View>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Loading Overlay */}
      {isExporting && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ backgroundColor: theme.cardBg, borderRadius: 20, padding: 24, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={theme.accent500} />
            <Text style={{ fontFamily: fonts.semibold, color: theme.textPrimary, marginTop: 12 }}>Exporting...</Text>
          </View>
        </View>
      )}

      {/* Error Alert */}
      {showExportError && exportError && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ backgroundColor: theme.cardBg, borderRadius: 24, padding: 24, width: '80%', alignItems: 'center' }}>
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: theme.expenseTint, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <AlertCircle size={24} color={theme.expense} />
            </View>
            <Text style={{ fontSize: 18, fontFamily: fonts.heading, color: theme.textPrimary, textAlign: 'center' }}>Export Error</Text>
            <Text style={{ fontSize: 14, fontFamily: fonts.body, color: theme.textSecondary, textAlign: 'center', marginTop: 8 }}>{exportError}</Text>
            <Pressable
              onPress={() => setShowExportError(false)}
              style={{ marginTop: 16, backgroundColor: theme.expense, borderRadius: 50, paddingHorizontal: 24, paddingVertical: 12 }}
            >
              <Text style={{ color: theme.textOnAccent, fontFamily: fonts.heading }}>Dismiss</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}
