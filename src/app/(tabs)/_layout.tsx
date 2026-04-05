import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, LayoutChangeEvent } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { Home, Repeat, BarChart2, Settings, Plus } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { fonts } from '@theme/fonts';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const accent = require('@theme/accent');

const TAB_ICONS: Record<string, typeof Home> = {
  index: Home,
  transactions: Repeat,
  analytics: BarChart2,
  settings: Settings,
};

function TabIcon({ route, focused }: { route: string; focused: boolean }) {
  const IconComp = TAB_ICONS[route] ?? Home;
  const color = focused ? accent[200] : accent.tabInactive;
  return <IconComp size={focused ? 23 : 20} color={color} strokeWidth={focused ? 2.4 : 1.5} />;
}

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const bottomPad = insets.bottom > 0 ? insets.bottom : 16;

  const tabCount = state.routes.length;
  const [pillWidth, setPillWidth] = useState(0);
  const rawTabWidth = pillWidth > 0 ? (pillWidth - 12) / tabCount : 0;
  const tabWidth = rawTabWidth + 4;
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (tabWidth > 0) {
      translateX.value = withTiming(state.index * rawTabWidth - 2, { duration: 250 });
    }
  }, [state.index, tabWidth]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    width: tabWidth,
  }));

  const onPillLayout = (e: LayoutChangeEvent) => {
    setPillWidth(e.nativeEvent.layout.width);
  };

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingBottom: bottomPad,
        paddingLeft: 16,
        paddingRight: 20,
        overflow: 'visible',
      }}
    >
      {/* Floating pill */}
      <View
        onLayout={onPillLayout}
        style={{
          flex: 1,
          flexDirection: 'row',
          backgroundColor: accent.tabBarBg,
          borderRadius: 32,
          paddingVertical: 6,
          paddingHorizontal: 6,
          alignItems: 'center',
          height: 62,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 16,
          elevation: 12,
        }}
      >
        {/* Sliding indicator */}
        {tabWidth > 0 && (
          <Animated.View
            style={[
              indicatorStyle,
              {
                position: 'absolute',
                top: 4,
                left: 6,
                height: 54,
                borderRadius: 28,
                backgroundColor: accent.tabActiveBg,
              },
            ]}
          />
        )}

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.title ?? route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <View
              key={route.key}
              style={{
                flex: 1,
                height: 50,
              }}
            >
              <Pressable
                onPress={onPress}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TabIcon route={route.name} focused={isFocused} />
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: isFocused ? fonts.heading : fonts.semibold,
                    color: isFocused ? accent[200] : accent.tabInactive,
                    marginTop: 2,
                  }}
                >
                  {label}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </View>

      {/* Plus button */}
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: accent[200],
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 12,
          marginBottom: 3,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Pressable
          onPress={() => router.push('/transaction/add')}
          style={({ pressed }) => ({
            width: 56,
            height: 56,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <Plus size={26} color={accent[900]} strokeWidth={2.5} />
        </Pressable>
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="transactions" options={{ title: 'Transactions' }} />
      <Tabs.Screen name="analytics" options={{ title: 'Insights' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
