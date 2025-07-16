import { CreditCard, Server, Truck } from 'lucide-react';
import { ReactNode } from 'react';

export interface IStatsCardItem {
  title: string;
  value: string | number;
  icon: ReactNode;
  change: number;
  bgColor: string;
  borderColor?: string;
}

export interface IStatsData {
  newOrdersToday: number;
  revenueToday: number;
  visitors: number;
  lowStockItems: any[];
  recentOrders: any[];
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  price: string;
  priceValue: number;
  image: string;
  category: string;
  inStock: boolean;
  description: string;
}

export type MoySkladProduct = {

  id: string;

  name: string;

  description: string | null;

  archived: boolean;

  path_name: string | null;

  sale_price: number | null;

  article: string | null;

  weight: number | null;

  image_url: string | null;

  stock: number;
  reserve: number;
  in_transit: number;
  created_at?: string;
};

export interface Category {
  id: number;
  name: string;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  currency: string;
}

export interface DeliveryMethod {
  id: string;
  name: string;
  enabled: boolean;
  price: number;
}

export interface DeliverySettings {
  enableFreeDelivery: boolean;
  freeDeliveryThreshold: number;
  deliveryMethods: DeliveryMethod[];
}

export interface PaymentMethod {
  id: string;
  name: string;
  enabled: boolean;
}

export interface PaymentSettings {
  paymentMethods: PaymentMethod[];
}

export interface NotificationSettings {
  enableOrderNotifications: boolean;
  enableLowStockNotifications: boolean;
  notificationEmail: string;
  enableCustomerNotifications: boolean;
}

export const CURRENCY_OPTIONS = [
  { value: 'RUB', label: 'Российский рубль (₽)' },
  { value: 'USD', label: 'Доллар США ($)' },
  { value: 'EUR', label: 'Евро (€)' },
];

export const TAB_ITEMS = [
  { id: 'general', icon: Server, label: 'Общие' },
  { id: 'delivery', icon: Truck, label: 'Доставка' },
  { id: 'payment', icon: CreditCard, label: 'Оплата' },
];

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'customer';
  status: 'active' | 'inactive';
  lastLogin?: string;
  password?: string;
  confirmPassword?: string;
}

export interface UserFormData extends Omit<User, 'lastLogin'> {
  confirmPassword?: string;
}

export const ROLE_OPTIONS = [
  { value: 'customer', label: 'Клиент' },
  { value: 'manager', label: 'Менеджер' },
  { value: 'admin', label: 'Администратор' },
];

export const STATUS_OPTIONS = [
  { value: 'active', label: 'Активен' },
  { value: 'inactive', label: 'Неактивен' },
];