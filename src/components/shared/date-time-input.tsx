import React, { useState } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Calendar, Clock, ChevronDown } from 'lucide-react-native';
import { useTheme, useIsDark } from '@theme/use-theme';
import { fonts } from '@theme/fonts';

interface DateTimeInputProps {
  value: Date;
  onChange: (date: Date) => void;
  mode?: 'date' | 'time' | 'datetime';
  label?: string;
  minimumDate?: Date;
  maximumDate?: Date;
}

function formatDisplay(date: Date, mode: 'date' | 'time' | 'datetime'): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('en', { month: 'short' });
  const year = date.getFullYear();
  const hours = date.getHours();
  const mins = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 || 12;

  if (mode === 'date') return `${day} ${month} ${year}`;
  if (mode === 'time') return `${h12}:${mins} ${ampm}`;
  return `${day} ${month} ${year}, ${h12}:${mins} ${ampm}`;
}

export function DateTimeInput({
  value,
  onChange,
  mode = 'datetime',
  label,
  minimumDate,
  maximumDate,
}: DateTimeInputProps) {
  const theme = useTheme();
  const isDark = useIsDark();
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');

  const handleChange = (_: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
      if (selected) {
        const merged = new Date(value);
        if (pickerMode === 'date') {
          merged.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
          onChange(merged);
          if (mode === 'datetime') {
            setTimeout(() => { setPickerMode('time'); setShowPicker(true); }, 300);
          }
        } else {
          merged.setHours(selected.getHours(), selected.getMinutes());
          onChange(merged);
        }
      }
      return;
    }
    // iOS — inline picker updates live
    if (selected) onChange(selected);
  };

  const handlePress = () => {
    if (showPicker && Platform.OS === 'ios') {
      setShowPicker(false);
      return;
    }
    setPickerMode(mode === 'time' ? 'time' : 'date');
    setShowPicker(true);
  };

  const IconComp = mode === 'time' ? Clock : Calendar;

  return (
    <View>
      {label && (
        <Text style={{ fontSize: 13, fontFamily: fonts.heading, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
          {label}
        </Text>
      )}

      {/* Tap target */}
      <Pressable onPress={handlePress} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: showPicker ? theme.tint : theme.surfaceBg,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: showPicker ? theme.buttonBg : theme.border,
          paddingHorizontal: 16,
          paddingVertical: 16,
        }}>
          <View style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            backgroundColor: showPicker ? theme.buttonBg + '25' : theme.elevatedBg,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <IconComp size={16} color={showPicker ? theme.buttonBg : theme.textMuted} />
          </View>
          <Text style={{ flex: 1, marginLeft: 12, fontSize: 15, fontFamily: fonts.semibold, color: showPicker ? theme.buttonBg : theme.textPrimary }}>
            {formatDisplay(value, mode)}
          </Text>
          <ChevronDown
            size={18}
            color={showPicker ? theme.buttonBg : theme.textMuted}
            style={{ transform: [{ rotate: showPicker ? '180deg' : '0deg' }] }}
          />
        </View>
      </Pressable>

      {/* Native picker — inline on iOS, dialog on Android */}
      {showPicker && Platform.OS === 'ios' && (
        <View style={{ marginTop: 8 }}>
          <DateTimePicker
            value={value}
            mode={mode === 'datetime' ? 'datetime' : mode}
            display="inline"
            onChange={handleChange}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            themeVariant={isDark ? 'dark' : 'light'}
            accentColor={theme.buttonBg}
          />
        </View>
      )}

      {/* Android picker */}
      {showPicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={value}
          mode={pickerMode}
          display="default"
          onChange={handleChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}
    </View>
  );
}
