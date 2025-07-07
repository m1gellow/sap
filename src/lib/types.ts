import { Product as ProductBase } from './types';

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string | null;
}

export interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  date: string;
  status: string;
  amount: number;
  address: string;
  paymentMethod: string;
  notes?: string;
  items?: OrderItem[];
}