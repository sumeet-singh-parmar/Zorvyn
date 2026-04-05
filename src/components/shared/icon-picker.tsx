import React from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Icon } from './icon-map';

const accent = require('@theme/accent');

interface IconPickerProps {
  selected: string;
  onSelect: (icon: string) => void;
  color?: string;
}

const AVAILABLE_ICONS = [
  'shopping-bag', 'shopping-cart', 'coffee', 'clipboard',
  'navigation', 'truck', 'home', 'zap',
  'heart', 'book', 'film', 'music',
  'gift', 'briefcase', 'code', 'trending-up',
  'plus-circle', 'more-horizontal', 'dollar-sign', 'credit-card',
  'smartphone', 'wifi', 'globe', 'map-pin',
  'scissors', 'wrench', 'umbrella', 'sun',
  'star', 'award', 'target', 'flag',
  'utensils', 'car',
];

export function IconPicker({
  selected,
  onSelect,
  color = accent[500],
}: IconPickerProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  return (
    <ScrollView>
      <View className="flex-row flex-wrap gap-2 p-2">
        {AVAILABLE_ICONS.map((icon) => (
          <Pressable
            key={icon}
            onPress={() => onSelect(icon)}
            className={`w-14 h-14 items-center justify-center rounded-xl`}
            style={
              selected === icon
                ? { backgroundColor: color + '15', borderColor: color, borderWidth: 2.5 }
                : { backgroundColor: isDark ? accent.surfaceDark : accent.surfaceLight, borderWidth: 0 }
            }
          >
            <Icon
              name={icon}
              size={26}
              color={selected === icon ? color : '#9CA3AF'}
            />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
