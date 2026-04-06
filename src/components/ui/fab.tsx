import React from 'react';
import { Pressable, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus } from 'lucide-react-native';

import { shadows } from '@theme/shadows';
import { useTheme } from '@theme/use-theme';

interface FABProps {
  onPress: () => void;
}

export function FAB({ onPress }: FABProps) {
  const theme = useTheme();

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 28,
        right: 24,
        width: 60,
        height: 60,
        borderRadius: 30,
        overflow: 'hidden',
        ...shadows.accent,
      }}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          width: 60,
          height: 60,
          opacity: pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.92 : 1 }],
        })}
      >
        <LinearGradient
          colors={[theme.gradientStart, theme.accent500, theme.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 60,
            height: 60,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 30,
          }}
        >
          <Plus size={26} color={theme.textOnAccent} strokeWidth={2.5} />
        </LinearGradient>
      </Pressable>
    </View>
  );
}
