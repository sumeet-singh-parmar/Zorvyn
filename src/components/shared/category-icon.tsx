import React from 'react';
import { View } from 'react-native';
import { Icon } from './icon-map';

interface CategoryIconProps {
  iconName: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 36,
  md: 44,
  lg: 52,
};

export function CategoryIcon({
  iconName,
  color,
  size = 'md',
}: CategoryIconProps) {
  const dimension = sizeMap[size];

  return (
    <View
      className="items-center justify-center rounded-2xl"
      style={{
        width: dimension,
        height: dimension,
        backgroundColor: color + '20',
      }}
    >
      <Icon name={iconName} size={dimension * 0.45} color={color} />
    </View>
  );
}
