export interface SettingsSection {
  title: string;
  items: SettingsItem[];
}

export interface SettingsItem {
  id: string;
  label: string;
  icon: string;
  value?: string;
  onPress: () => void;
  type?: 'navigate' | 'toggle' | 'action';
}
