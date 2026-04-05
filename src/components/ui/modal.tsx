import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { useColorScheme } from 'nativewind';

const accent = require('@theme/accent');

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ visible, onClose, title, children }: ModalProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const translateY = useSharedValue(500);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 16, stiffness: 180, mass: 1 });
    } else {
      translateY.value = 500;
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <Pressable className="flex-1 bg-black/50" onPress={onClose} />
        <Animated.View
          className="rounded-t-3xl px-6 pt-4 pb-10 max-h-[90%]"
          style={[animatedStyle, { backgroundColor: isDark ? accent.cardDark : accent.cardLight }]}
        >
          <View className="w-12 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 self-center mb-5" />
          {title && (
            <Text className="text-xl font-bold text-gray-900 dark:text-gray-200 mb-5">
              {title}
            </Text>
          )}
          <ScrollView showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </RNModal>
  );
}
