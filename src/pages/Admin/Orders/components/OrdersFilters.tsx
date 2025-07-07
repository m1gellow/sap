import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '../../../../components/ui/input';
import { Button } from '../../../../components/ui/button';

interface OrdersFiltersProps {
  searchTerm: string;
  statusFilter: string;
  dateFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onDateChange: (value: string) => void;
}

export const OrdersFilters: React.FC<OrdersFiltersProps> = ({
  searchTerm,
  statusFilter,
  dateFilter,
  onSearchChange,
  onStatusChange,
  onDateChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <Input
            placeholder="Поиск заказов..."
            className="pl-10 w-full rounded-md"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <select
              className="h-10 pl-3 pr-10 rounded-md border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-4"
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
            >
              <option value="all">Все статусы</option>
              <option value="Оплачен">Оплачен</option>
              <option value="Доставляется">Доставляется</option>
              <option value="Завершен">Завершен</option>
              <option value="Ожидает оплаты">Ожидает оплаты</option>
              <option value="Отменен">Отменен</option>
            </select>
          
          </div>

          <div className="relative">
            <select
              className="h-10 pl-3 pr-10 rounded-md border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-4"
              value={dateFilter}
              onChange={(e) => onDateChange(e.target.value)}
            >
              <option value="all">Все даты</option>
              <option value="today">Сегодня</option>
              <option value="yesterday">Вчера</option>
              <option value="last7days">Последние 7 дней</option>
              <option value="last30days">Последние 30 дней</option>
            </select>
          
          </div>

          <Button variant="outline" className="h-10 px-4 border-gray-300 text-gray-700 gap-2">
            <Filter size={18} />
            <span className="hidden sm:inline">Фильтры</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
