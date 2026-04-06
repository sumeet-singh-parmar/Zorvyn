import React from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { useTheme } from '@theme/use-theme';
import { Icon } from './icon-map';

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
  color,
}: IconPickerProps) {
  const theme = useTheme();
  const resolvedColor = color ?? theme.accent500;
  return (
    <ScrollView>
      <View className="flex-row flex-wrap gap-2 p-2">
        {AVAILABLE_ICONS.map((icon) => (
          <Pressable
            key={icon}
            onPress={() => onSelect(icon)}
            className="w-14 h-14 items-center justify-center rounded-xl"
            style={
              selected === icon
                ? { backgroundColor: resolvedColor + '15', borderColor: resolvedColor, borderWidth: 2.5 }
                : { backgroundColor: theme.surfaceBg, borderWidth: 0 }
            }
          >
            <Icon
              name={icon}
              size={26}
              color={selected === icon ? resolvedColor : theme.textMuted}
            />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
