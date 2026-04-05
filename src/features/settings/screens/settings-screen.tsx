import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { AlertCircle, ChevronRight } from 'lucide-react-native';
import { Icon } from '@components/shared/icon-map';
import { Card } from '@components/ui/card';
import { Divider } from '@components/ui/divider';
import { ThemeToggle } from '../components/theme-toggle';
import { CurrencySelector } from '../components/currency-selector';
import { useSettings } from '../hooks/use-settings';
import { useRouter } from 'expo-router';

const accent = require('@theme/accent');

export function SettingsScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
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
    Alert.alert(
      'Export as CSV',
      `Export ${transactionCount} transactions as CSV file?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Export',
          onPress: () => exportData('csv'),
          style: 'default',
        },
      ]
    );
  };

  const handleExportJSON = () => {
    Alert.alert(
      'Export as JSON',
      `Export ${transactionCount} transactions as JSON file?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Export',
          onPress: () => exportData('json'),
          style: 'default',
        },
      ]
    );
  };

  const handleSeedDemo = () => {
    Alert.alert(
      'Seed Demo Data',
      'This will add sample transactions to your account. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Seed',
          onPress: () => seedDemoData(),
          style: 'default',
        },
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your transactions and accounts. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          onPress: () => clearAllData(),
          style: 'destructive',
        },
      ]
    );
  };

  React.useEffect(() => {
    if (exportError) {
      setShowExportError(true);
    }
  }, [exportError]);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: isDark ? accent.screenBg : accent.screenBgLight }}>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header */}
        <View className="px-4 pt-2 pb-4">
          <Text className="text-3xl font-bold text-gray-900 dark:text-gray-200">Settings</Text>
        </View>

        {/* Appearance Section */}
        <View className="px-4 mb-6">
          <Text className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Appearance
          </Text>
          <Card className="p-4">
            <ThemeToggle />
          </Card>
        </View>

        {/* Preferences Section */}
        <View className="px-4 mb-6">
          <Text className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Preferences
          </Text>
          <Card className="p-0 overflow-hidden">
            <CurrencySelector />
          </Card>
        </View>

        {/* Data Section */}
        <View className="px-4 mb-6">
          <Text className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Data
          </Text>
          <Card className="p-0 overflow-hidden">
            <SettingsRow
              icon="download"
              iconBgColor="bg-blue-100 dark:bg-blue-900/30"
              iconColor="#3B82F6"
              label="Export as CSV"
              value={`${transactionCount} transactions`}
              onPress={handleExportCSV}
              disabled={isExporting}
            />
            <Divider />
            <SettingsRow
              icon="code"
              iconBgColor="bg-green-100 dark:bg-green-900/30"
              iconColor="#10B981"
              label="Export as JSON"
              value={`${transactionCount} transactions`}
              onPress={handleExportJSON}
              disabled={isExporting}
            />
            <Divider />
            <SettingsRow
              icon="database"
              iconBgColor="bg-orange-100 dark:bg-orange-900/30"
              iconColor="#F59E0B"
              label="Seed Demo Data"
              value="Add samples"
              onPress={handleSeedDemo}
              disabled={isExporting}
            />
            <Divider />
            <SettingsRow
              icon="trash-2"
              iconBgColor="bg-red-100 dark:bg-red-900/30"
              iconColor="#EF4444"
              label="Clear All Data"
              value="Destructive"
              onPress={handleClearData}
              disabled={isExporting}
              destructive
            />
          </Card>
        </View>

        {/* About Section */}
        <View className="px-4 mb-8">
          <Text className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            About
          </Text>
          <Card className="p-0 overflow-hidden">
            <SettingsRow
              icon="package"
              iconBgColor="bg-purple-100 dark:bg-purple-900/30"
              iconColor={accent.focus}
              label="App Version"
              value="1.0.0"
              onPress={() => {}}
            />
          </Card>
        </View>
      </ScrollView>

      {/* Loading Overlay */}
      {isExporting && (
        <View className="absolute inset-0 bg-black/20 items-center justify-center">
          <View className="rounded-xl p-6 items-center" style={{ backgroundColor: isDark ? accent.cardDark : accent.cardLight }}>
            <ActivityIndicator size="large" color={accent.focus} />
            <Text className="text-gray-900 dark:text-gray-200 font-semibold mt-3">Exporting...</Text>
          </View>
        </View>
      )}

      {/* Error Alert */}
      {showExportError && exportError && (
        <View className="absolute inset-0 bg-black/50 items-center justify-center">
          <View className="rounded-2xl p-6 w-4/5 items-center" style={{ backgroundColor: isDark ? accent.cardDark : accent.cardLight }}>
            <View className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 items-center justify-center mb-3">
              <AlertCircle size={24} color="#EF4444" />
            </View>
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-200 text-center">
              Export Error
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
              {exportError}
            </Text>
            <Pressable
              onPress={() => setShowExportError(false)}
              className="mt-4 bg-red-500 rounded-lg px-6 py-3"
            >
              <Text className="text-white font-semibold">Dismiss</Text>
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

interface SettingsRowProps {
  icon: string;
  iconBgColor?: string;
  iconColor?: string;
  label: string;
  value?: string;
  onPress: () => void;
  disabled?: boolean;
  destructive?: boolean;
}

function SettingsRow({
  icon,
  iconBgColor = 'bg-gray-100 dark:bg-gray-800',
  iconColor = '#9CA3AF',
  label,
  value,
  onPress,
  disabled = false,
  destructive = false,
}: SettingsRowProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`flex-row items-center px-4 py-4 active:bg-gray-50 dark:active:bg-gray-800 ${
        disabled ? 'opacity-50' : ''
      }`}
    >
      <View className={`w-10 h-10 rounded-lg ${iconBgColor} items-center justify-center`}>
        <Icon name={icon} size={20} color={iconColor} />
      </View>
      <View className="flex-1 ml-3">
        <Text
          className={`text-base font-semibold ${
            destructive
              ? 'text-red-600 dark:text-red-400'
              : 'text-gray-900 dark:text-gray-200'
          }`}
        >
          {label}
        </Text>
        {value && (
          <Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{value}</Text>
        )}
      </View>
      <ChevronRight size={20} color="#9CA3AF" />
    </Pressable>
  );
}
