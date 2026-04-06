import React from 'react';
import { View, Pressable } from 'react-native';
import { Check } from 'lucide-react-native';
import { useTheme } from '@theme/use-theme';

interface ColorPickerProps {
  selected: string;
  onSelect: (color: string) => void;
}

const PRESET_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  '#BB8FCE', '#AEB6BF', '#2ECC71', '#3498DB',
  '#E74C3C', '#F39C12', '#1ABC9C', '#9B59B6',
  '#E67E22', '#2C3E50', '#16A085', '#D35400',
];

export function ColorPicker({ selected, onSelect }: ColorPickerProps) {
  const theme = useTheme();
  return (
    <View className="flex-row flex-wrap gap-2">
      {PRESET_COLORS.map((color) => (
        <Pressable
          key={color}
          onPress={() => onSelect(color)}
          className="w-11 h-11 rounded-full items-center justify-center"
          style={{
            backgroundColor: color,
            borderWidth: selected === color ? 3 : 0,
            borderColor: theme.cardBg,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: selected === color ? 0.3 : 0,
            shadowRadius: 3,
            elevation: selected === color ? 5 : 0,
          }}
        >
          {selected === color && (
            <Check size={20} color={theme.textOnAccent} />
          )}
        </Pressable>
      ))}
    </View>
  );
}
