import React from 'react';
import { motion } from 'framer-motion';
import { X, Edit, Truck, CreditCard, User, Package, ShoppingCart } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { formatDate, getStatusBadgeClass } from '../utils/formatters';
import { Order } from '../../../../lib/types';

interface ViewOrderModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onEditStatus: () => void;
}

export const ViewOrderModal: React.FC<ViewOrderModalProps> = ({ order, isOpen, onClose, onEditStatus }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 text-gray-400">
              <ShoppingCart size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Заказ #{order.id}</h2>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <span>{formatDate(order.date)}</span>
                <span>•</span>
                <span
                  className={`px-2 py-0.5 text-xs rounded-full ${getStatusBadgeClass(order.status)}`}
                >
                  {order.status}
                </span>
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 rounded-full"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Customer Info */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-md bg-blue-50 text-blue">
                  <User size={16} />
                </div>
                <h3 className="text-sm font-medium text-gray-700">Клиент</h3>
              </div>
              <div className="space-y-1.5">
                <p className="text-gray-900 font-medium">{order.customer}</p>
                <p className="text-gray-600 text-sm">{order.email}</p>
                <p className="text-gray-600 text-sm">{order.phone}</p>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-md bg-green-50 text-green-600">
                  <Truck size={16} />
                </div>
                <h3 className="text-sm font-medium text-gray-700">Доставка</h3>
              </div>
              <div className="space-y-1.5">
                <p className="text-gray-900">{order.address}</p>
                {order.notes && (
                  <div className="pt-2 mt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500 font-medium">Примечание:</p>
                    <p className="text-gray-600 text-sm">{order.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-md bg-purple-50 text-purple-600">
                  <CreditCard size={16} />
                </div>
                <h3 className="text-sm font-medium text-gray-700">Оплата</h3>
              </div>
              <div className="space-y-1.5">
                <p className="text-gray-900 font-medium">{order.paymentMethod}</p>
                <p className="text-gray-600 text-sm">Сумма: {order.amount.toLocaleString()} ₽</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Package size={16} className="text-gray-500" />
              Товары в заказе
            </h3>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                      Фото
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Товар
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Цена
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Кол-во
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Итого
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items &&
                    order.items.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4">
                          <div className="h-12 w-12 rounded-md border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                            {item.image ? (
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="h-full w-full object-contain"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48?text=Нет+фото';
                                }}
                              />
                            ) : (
                              <Package size={20} className="text-gray-400" />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-800 font-medium">{item.name}</td>
                        <td className="px-4 py-4 text-sm text-gray-600 text-center">
                          {item.price.toLocaleString()} ₽
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600 text-center">{item.quantity}</td>
                        <td className="px-4 py-4 text-sm text-gray-800 font-medium text-right">
                          {(item.price * item.quantity).toLocaleString()} ₽
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Summary */}
          <div className="flex justify-end">
            <div className="w-full max-w-xs bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Сумма заказа:</span>
                  <span>{order.amount.toLocaleString()} ₽</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Доставка:</span>
                  <span className="text-green-600">Бесплатно</span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between font-semibold text-gray-900">
                    <span>Итого:</span>
                    <span>{order.amount.toLocaleString()} ₽</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Закрыть
          </Button>
          <Button onClick={onEditStatus} className="flex items-center text-skyblue gap-2">
            <Edit size={16} />
            Изменить статус
          </Button>
        </div>
      </motion.div>
    </div>
  );
};