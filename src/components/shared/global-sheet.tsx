import React, { createContext, useCallback, useContext, useRef, useState, useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { X } from 'lucide-react-native';
import { useTheme } from '@theme/use-theme';
import { useThemeStore } from '@stores/theme-store';
import { hslToRgba } from '@theme/hsl';
import { fonts } from '@theme/fonts';

interface SheetConfig {
  title: string;
  content: React.ReactNode;
  snapPoints?: (string | number)[];
}

interface GlobalSheetContextType {
  openSheet: (config: SheetConfig) => void;
  closeSheet: () => void;
}

const GlobalSheetContext = createContext<GlobalSheetContextType>({
  openSheet: () => {},
  closeSheet: () => {},
});

export const useGlobalSheet = () => useContext(GlobalSheetContext);

const BottomSheetContext = createContext(false);
export const useIsInBottomSheet = () => useContext(BottomSheetContext);

export function GlobalSheetProvider({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const { hue, saturation } = useThemeStore();
  const sheetRef = useRef<BottomSheetModal>(null);
  const [config, setConfig] = useState<SheetConfig | null>(null);
  const pendingRef = useRef(false);

  const openSheet = useCallback((cfg: SheetConfig) => {
    pendingRef.current = true;
    setConfig(cfg);
    // If already presented, just update content (no dismiss/present cycle)
    // If not presented, present after a tick
    setTimeout(() => {
      sheetRef.current?.present();
      pendingRef.current = false;
    }, 50);
  }, []);

  const closeSheet = useCallback(() => {
    sheetRef.current?.dismiss();
  }, []);

  const handleDismiss = useCallback(() => {
    // Only clear config if no new sheet is pending
    if (!pendingRef.current) {
      setConfig(null);
    }
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  const handleColor = hslToRgba(hue, saturation * 0.3, 50, 0.4);

  return (
    <GlobalSheetContext.Provider value={{ openSheet, closeSheet }}>
      {children}
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={config?.snapPoints ?? ['50%', '90%']}
        onDismiss={handleDismiss}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        enableDynamicSizing={false}
        backgroundStyle={{
          backgroundColor: theme.cardBg,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
        }}
        handleIndicatorStyle={{
          backgroundColor: handleColor,
          width: 40,
          height: 4,
          borderRadius: 2,
          marginBottom: 10,
        }}
      >
        <BottomSheetScrollView
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {/* Header */}
          {config?.title && (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16 }}>
              <Text style={{ fontFamily: fonts.heading, fontSize: 20, color: theme.textPrimary }}>
                {config.title}
              </Text>
              <Pressable onPress={closeSheet} style={{ padding: 4 }}>
                <X size={22} color={theme.textMuted} />
              </Pressable>
            </View>
          )}
          {/* Content */}
          <BottomSheetContext.Provider value={true}>
            {config?.content}
          </BottomSheetContext.Provider>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </GlobalSheetContext.Provider>
  );
}
