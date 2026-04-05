import React from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import { useColorScheme } from 'nativewind';
import { CategoryIcon } from '@components/shared/category-icon';
import type { Category } from '@core/models';

const accent = require('@theme/accent');

interface CategoryPickerProps {
  categories: Category[];
  selected: string;
  onSelect: (id: string) => void;
}

const NUM_COLUMNS = 4;
const GRID_GAP = 10;
const HORIZONTAL_PADDING = 0; // parent already has px-6

export function CategoryPicker({ categories, selected, onSelect }: CategoryPickerProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { width: screenWidth } = useWindowDimensions();
  // Account for parent px-6 (24px each side = 48px total)
  const availableWidth = screenWidth - 48;
  const itemWidth = (availableWidth - GRID_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: GRID_GAP,
      }}
    >
      {categories.map((cat) => {
        const isSelected = selected === cat.id;
        return (
          <Pressable
            key={cat.id}
            onPress={() => onSelect(cat.id)}
            className="rounded-2xl"
            style={{
              width: itemWidth,
              alignItems: 'center',
              paddingVertical: 14,
              paddingHorizontal: 4,
              borderWidth: 2,
              borderColor: isSelected ? accent.focus : (isDark ? '#374151' : accent.surfaceLight),
              backgroundColor: isSelected ? (isDark ? '#2E1065' : accent[50]) : (isDark ? '#1F2937' : accent.surfaceLight),
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: isSelected ? (isDark ? '#3B0764' : accent[100]) : (isDark ? '#111827' : accent.cardLight),
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 8,
              }}
            >
              <CategoryIcon
                iconName={cat.icon}
                color={isSelected ? accent[600] : cat.color}
                size="sm"
              />
            </View>
            <Text
              style={{
                fontSize: 11,
                fontWeight: '600',
                textAlign: 'center',
                color: isSelected ? '#6D28D9' : '#4B5563',
                lineHeight: 14,
              }}
              numberOfLines={2}
            >
              {cat.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
