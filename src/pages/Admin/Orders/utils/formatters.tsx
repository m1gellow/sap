import { Order } from '../../../../lib/types';
import { Check, Truck, Clock, X, ShoppingBag } from 'lucide-react';

// Форматирование даты
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Получение класса стиля для статуса заказа
export const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'Оплачен':
      return 'bg-blue-100 text-blue';
    case 'Доставляется':
      return 'bg-yellow-100 text-yellow-800';
    case 'Завершен':
      return 'bg-green-100 text-green-800';
    case 'Ожидает оплаты':
      return 'bg-gray-100 text-gray-800';
    case 'Отменен':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Получение иконки статуса
export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Оплачен':
      return <Check size={16} className="mr-1 text-blue" />;
    case 'Доставляется':
      return <Truck size={16} className="mr-1 text-yellow-600" />;
    case 'Завершен':
      return <Check size={16} className="mr-1 text-green-600" />;
    case 'Ожидает оплаты':
      return <Clock size={16} className="mr-1 text-gray-600" />;
    case 'Отменен':
      return <X size={16} className="mr-1 text-red-600" />;
    default:
      return <ShoppingBag size={16} className="mr-1 text-gray-600" />;
  }
};

// Получить список доступных статусов заказов
export const getAvailableStatuses = () => ['Ожидает оплаты', 'Оплачен', 'Доставляется', 'Завершен', 'Отменен'];

// Сортировка заказов
export const sortOrders = (orders: Order[], field: string, direction: 'asc' | 'desc') => {
  return [...orders].sort((a, b) => {
    if (field === 'date') {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return direction === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (field === 'amount') {
      return direction === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    } else {
      const fieldA = a[field].toString();
      const fieldB = b[field].toString();
      return direction === 'asc' ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
    }
  });
};
