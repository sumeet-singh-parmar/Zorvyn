import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Sun, Moon, Smartphone } from 'lucide-react-native';
import { useAppStore } from '@stores/app-store';
import type { ThemeMode } from '@core/models';

const THEME_OPTIONS: { mode: ThemeMode; label: string; icon: 'sun' | 'moon' | 'smartphone' }[] = [
  { mode: 'light', label: 'Light', icon: 'sun' },
  { mode: 'dark', label: 'Dark', icon: 'moon' },
  { mode: 'system', label: 'System', icon: 'smartphone' },
];

export function ThemeToggle() {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);

  return (
    <View className="flex-row gap-2">
      {THEME_OPTIONS.map((option) => (
        <Pressable
          key={option.mode}
          onPress={() => setTheme(option.mode)}
          className={`flex-1 items-center justify-center py-4 rounded-xl border ${
            theme === option.mode
              ? 'bg-accent-500 border-accent-600'
              : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          }`}
        >
          {option.icon === 'sun' && <Sun size={22} color={theme === option.mode ? '#FFFFFF' : '#9CA3AF'} />}
          {option.icon === 'moon' && <Moon size={22} color={theme === option.mode ? '#FFFFFF' : '#9CA3AF'} />}
          {option.icon === 'smartphone' && <Smartphone size={22} color={theme === option.mode ? '#FFFFFF' : '#9CA3AF'} />}
          <Text
            className={`text-xs mt-2 font-semibold ${
              theme === option.mode ? 'text-white' : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {option.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
