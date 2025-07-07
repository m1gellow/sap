import React from 'react';
import { motion } from 'framer-motion';
import { Eye, CheckCircle } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { formatDate, getStatusBadgeClass, getStatusIcon } from '../utils/formatters';
import { Order } from '../../../../lib/types';

interface OrdersTableProps {
  orders: Order[];
  currentPage: number;
  totalPages: number;
  sortBy: { field: string; direction: string };
  onViewOrder: (order: Order) => void;
  onEditStatus: (order: Order) => void;
  onSortChange: (field: string) => void;
  onPageChange: (page: number) => void;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  currentPage,
  totalPages,
  sortBy,
  onViewOrder,
  onEditStatus,
  onSortChange,
  onPageChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSortChange('id')}
            >
              <div className="flex items-center space-x-1">
                <span>Заказ №</span>
                {sortBy.field === 'id' && <span>{sortBy.direction === 'asc' ? '↑' : '↓'}</span>}
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSortChange('customer')}
            >
              <div className="flex items-center space-x-1">
                <span>Клиент</span>
                {sortBy.field === 'customer' && <span>{sortBy.direction === 'asc' ? '↑' : '↓'}</span>}
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSortChange('date')}
            >
              <div className="flex items-center space-x-1">
                <span>Дата</span>
                {sortBy.field === 'date' && <span>{sortBy.direction === 'asc' ? '↑' : '↓'}</span>}
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSortChange('status')}
            >
              <div className="flex items-center space-x-1">
                <span>Статус</span>
                {sortBy.field === 'status' && <span>{sortBy.direction === 'asc' ? '↑' : '↓'}</span>}
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSortChange('amount')}
            >
              <div className="flex items-center space-x-1">
                <span>Сумма</span>
                {sortBy.field === 'amount' && <span>{sortBy.direction === 'asc' ? '↑' : '↓'}</span>}
              </div>
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Действия
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.length > 0 ? (
            orders.map((order) => (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue">{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.customer}</div>
                  <div className="text-xs text-gray-500">{order.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.date)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusBadgeClass(order.status)}`}
                  >
                    <div className="flex items-center">
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.amount.toLocaleString()} ₽
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      className="p-1 text-blue  transition-colors rounded-full "
                      onClick={() => onViewOrder(order)}
                      title="Просмотр заказа"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="p-1 text-green-800 hover:text-green-700 transition-colors rounded-full hover:bg-green-50"
                      onClick={() => onEditStatus(order)}
                      title="Изменить статус"
                    >
                      <CheckCircle size={16} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                Заказы не найдены. Измените критерии поиска.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Пагинация */}
      {orders.length > 0 && (
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Пред.
            </Button>
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              След.
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Показано <span className="font-medium">{orders.length}</span> из{' '}
                <span className="font-medium">{orders.length}</span> заказов
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Предыдущая</span>
                  &laquo;
                </button>

                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => onPageChange(index + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border ${
                      currentPage === index + 1
                        ? 'z-10 bg-blue-4 text-white border-blue-4 hover:bg-blue-500'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    } text-sm font-medium`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Следующая</span>
                  &raquo;
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
