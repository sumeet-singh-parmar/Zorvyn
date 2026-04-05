import React from 'react';
import {
  ShoppingBag, ShoppingCart, Coffee, Clipboard,
  Navigation, Truck, Home, Zap,
  Heart, Book, Film, Music,
  Gift, Briefcase, Code, TrendingUp,
  PlusCircle, MoreHorizontal, DollarSign, CreditCard,
  Smartphone, Wifi, Globe, MapPin,
  Scissors, Wrench, Umbrella, Sun,
  Star, Award, Target, Flag,
  Utensils, Car, Circle, Search,
  X, ChevronLeft, ChevronRight, ChevronDown,
  Plus, Settings, BarChart2, Repeat,
  TrendingDown, PieChart, Trash2, AlertCircle,
  FileText, Calendar, Edit3, Download,
  Database, Package, Moon, Check,
  ArrowUpRight, ArrowDownRight, ArrowDownLeft, Inbox, Eye,
  CircleCheck, Wallet, ArrowLeft,
  type LucideProps,
} from 'lucide-react-native';

// Map string icon names to Lucide components
const iconComponents: Record<string, React.FC<LucideProps>> = {
  'shopping-bag': ShoppingBag,
  'shopping-cart': ShoppingCart,
  'coffee': Coffee,
  'clipboard': Clipboard,
  'navigation': Navigation,
  'truck': Truck,
  'home': Home,
  'zap': Zap,
  'heart': Heart,
  'book': Book,
  'film': Film,
  'music': Music,
  'gift': Gift,
  'briefcase': Briefcase,
  'code': Code,
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
  'plus-circle': PlusCircle,
  'more-horizontal': MoreHorizontal,
  'dollar-sign': DollarSign,
  'credit-card': CreditCard,
  'smartphone': Smartphone,
  'wifi': Wifi,
  'globe': Globe,
  'map-pin': MapPin,
  'scissors': Scissors,
  'tool': Wrench,
  'wrench': Wrench,
  'umbrella': Umbrella,
  'sun': Sun,
  'star': Star,
  'award': Award,
  'target': Target,
  'flag': Flag,
  'utensils': Utensils,
  'car': Car,
  'circle': Circle,
  'search': Search,
  'x': X,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-down': ChevronDown,
  'plus': Plus,
  'settings': Settings,
  'bar-chart-2': BarChart2,
  'repeat': Repeat,
  'pie-chart': PieChart,
  'trash-2': Trash2,
  'alert-circle': AlertCircle,
  'file-text': FileText,
  'calendar': Calendar,
  'edit-3': Edit3,
  'download': Download,
  'database': Database,
  'package': Package,
  'moon': Moon,
  'check': Check,
  'arrow-up-right': ArrowUpRight,
  'arrow-down-right': ArrowDownRight,
  'arrow-down-left': ArrowDownLeft,
  'inbox': Inbox,
  'eye': Eye,
  'check-circle': CircleCheck,
  'wallet': Wallet,
  'arrow-left': ArrowLeft,
};

export function getIconComponent(name: string): React.FC<LucideProps> {
  return iconComponents[name] ?? Circle;
}

/**
 * Render an icon by string name. Drop-in replacement for <Feather name="..." />.
 */
export function Icon({
  name,
  size = 24,
  color = '#000',
  strokeWidth = 2,
}: {
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  const IconComponent = getIconComponent(name);
  return <IconComponent size={size} color={color} strokeWidth={strokeWidth} />;
}
