import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Sun, Moon, Smartphone } from 'lucide-react-native';
import { useAppStore } from '@stores/app-store';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';
import type { ThemeMode } from '@core/models';

const THEME_OPTIONS: { mode: ThemeMode; label: string; icon: 'sun' | 'moon' | 'smartphone' }[] = [
  { mode: 'light', label: 'Light', icon: 'sun' },
  { mode: 'dark', label: 'Dark', icon: 'moon' },
  { mode: 'system', label: 'System', icon: 'smartphone' },
];

export function ThemeToggle() {
  const themeMode = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const theme = useTheme();

  return (
    <View className="flex-row gap-2">
      {THEME_OPTIONS.map((option) => (
        <Pressable
          key={option.mode}
          onPress={() => setTheme(option.mode)}
          className={`flex-1 items-center justify-center py-4 rounded-xl border ${
            themeMode === option.mode
              ? ''
              : ''
          }`}
          style={
            themeMode === option.mode
              ? { backgroundColor: theme.accent500, borderColor: theme.accent600 }
              : { backgroundColor: theme.surfaceBg, borderColor: theme.border }
          }
        >
          {option.icon === 'sun' && <Sun size={22} color={themeMode === option.mode ? theme.textOnAccent : theme.textMuted} />}
          {option.icon === 'moon' && <Moon size={22} color={themeMode === option.mode ? theme.textOnAccent : theme.textMuted} />}
          {option.icon === 'smartphone' && <Smartphone size={22} color={themeMode === option.mode ? theme.textOnAccent : theme.textMuted} />}
          <Text
            className="text-xs mt-2"
            style={{
              fontFamily: fonts.semibold,
              color: themeMode === option.mode ? theme.textOnAccent : theme.textSecondary,
            }}
          >
            {option.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
