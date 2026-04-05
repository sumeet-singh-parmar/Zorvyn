import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X } from 'lucide-react-native';
import { Icon } from '@components/shared/icon-map';

import { shadows } from '@theme/shadows';

const accent = require('@theme/accent');

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
  const content = (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {icon && (
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: selected ? 'rgba(255,255,255,0.25)' : accent.tint,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 7,
          }}
        >
          <Icon
            name={icon}
            size={14}
            color={selected ? '#FFFFFF' : accent[500]}
          />
        </View>
      )}
      <Text
        style={{
          fontSize: 14,
          fontWeight: '600',
          color: selected ? '#FFFFFF' : '#374151',
        }}
      >
        {label}
      </Text>
      {selected && onClear && (
        <Pressable onPress={onClear} style={{ marginLeft: 8 }}>
          <X size={14} color="#FFFFFF" />
        </Pressable>
      )}
    </View>
  );

  if (selected) {
    return (
      <Pressable
        onPress={onPress}
        className="rounded-full overflow-hidden self-start"
        style={({ pressed }) => ({
          opacity: pressed ? 0.8 : 1,
          ...shadows.accentSm,
        })}
      >
        <LinearGradient
          colors={[accent.gradientStart, accent[500]]}
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
      className="rounded-full self-start bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderWidth: 1.5,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      {content}
    </Pressable>
  );
}
