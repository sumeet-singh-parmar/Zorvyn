import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { CategoryIcon } from '@components/shared/category-icon';
import { useTheme } from '@theme/use-theme';
import { fonts } from '@theme/fonts';
import type { Category } from '@core/models';

interface CategoryPickerProps {
  categories: Category[];
  selected: string;
  onSelect: (id: string) => void;
}

export function CategoryPicker({ categories, selected, onSelect }: CategoryPickerProps) {
  const theme = useTheme();

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {categories.map((cat) => {
        const isSelected = selected === cat.id;
        return (
          <Pressable
            key={cat.id}
            onPress={() => onSelect(cat.id)}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 50,
              gap: 7,
              backgroundColor: isSelected ? theme.buttonBg : theme.surfaceBg,
              borderWidth: 1,
              borderColor: isSelected ? theme.buttonBg : theme.border,
            }}>
              <CategoryIcon
                iconName={cat.icon}
                color={isSelected ? theme.textOnAccent : cat.color}
                size="sm"
              />
              <Text style={{
                fontSize: 13,
                fontFamily: isSelected ? fonts.heading : fonts.medium,
                color: isSelected ? theme.textOnAccent : theme.textPrimary,
              }}>
                {cat.name}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
