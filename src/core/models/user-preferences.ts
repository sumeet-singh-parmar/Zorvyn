import { BaseModel } from './base';

export type ThemeMode = 'light' | 'dark' | 'system';
export type DateFormat = 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';

export interface UserPreferences extends BaseModel {
  display_name: string | null;
  default_currency: string;
  date_format: DateFormat;
  first_day_of_week: number;
  theme: ThemeMode;
  biometric_enabled: number;
  onboarding_completed: number;
}
