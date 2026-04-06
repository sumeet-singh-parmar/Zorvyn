import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X } from 'lucide-react-native';
import { Icon } from '@components/shared/icon-map';

import { shadows } from '@theme/shadows';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';

interface FilterChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
  onClear?: () => void;
  icon?: string;
}

export function FilterChip({
  label,
  selected = false,
  onPress,
  onClear,
  icon,
}: FilterChipProps) {
  const theme = useTheme();

  const content = (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {icon && (
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: selected ? 'rgba(255,255,255,0.25)' : theme.tint,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 7,
          }}
        >
          <Icon
            name={icon}
            size={14}
            color={selected ? theme.textOnAccent : theme.accent500}
          />
        </View>
      )}
      <Text
        style={{
          fontSize: 14,
          fontFamily: fonts.semibold,
          color: selected ? theme.textOnAccent : theme.textPrimary,
        }}
      >
        {label}
      </Text>
      {selected && onClear && (
        <Pressable onPress={onClear} style={{ marginLeft: 8 }}>
          <X size={14} color={theme.textOnAccent} />
        </Pressable>
      )}
    </View>
  );

  if (selected) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          borderRadius: 9999,
          overflow: 'hidden',
          alignSelf: 'flex-start',
          opacity: pressed ? 0.8 : 1,
          ...shadows.accentSm,
        })}
      >
        <LinearGradient
          colors={[theme.gradientStart, theme.accent500]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 22,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {content}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        borderRadius: 9999,
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderWidth: 1.5,
        borderColor: theme.border,
        backgroundColor: theme.surfaceBg,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      {content}
    </Pressable>
  );
}
