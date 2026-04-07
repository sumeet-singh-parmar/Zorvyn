import { Landmark, Banknote, Wallet, CreditCard } from 'lucide-react-native';

/**
 * Account type → Lucide icon mapping
 */
export const TYPE_ICONS: Record<string, typeof Landmark> = {
  bank: Landmark,
  cash: Banknote,
  wallet: Wallet,
  credit_card: CreditCard,
};

/**
 * Account type → human-readable label
 */
export const TYPE_LABELS: Record<string, string> = {
  bank: 'Bank Account',
  cash: 'Cash',
  wallet: 'Wallet',
  credit_card: 'Credit Card',
};

/**
 * Default account card colors keyed by type
 */
export const TYPE_COLORS: Record<string, string> = {
  bank: '#314972',
  cash: '#38512B',
  wallet: '#6B5A3D',
  credit_card: '#4A3560',
};

/**
 * Card color palette shown in the account form picker
 */
export const CARD_COLORS = [
  '#314972', '#38512B', '#6B5A3D', '#4A3560',
  '#8B2252', '#2F4F4F', '#4A4A6A', '#6B3A3A',
  '#2D5A4E', '#5C4033', '#3B3B6D', '#704214',
  '#1C3A5F', '#4B6043', '#5B3256', '#3D6B6B',
];

/**
 * Account type options for the create/edit form
 */
export const ACCOUNT_TYPE_OPTIONS = [
  { key: 'bank' as const, label: 'Card', icon: CreditCard },
  { key: 'cash' as const, label: 'Cash', icon: Banknote },
  { key: 'wallet' as const, label: 'Wallet', icon: Wallet },
];
