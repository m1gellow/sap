import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../../../components/ui/button';
import { getStatusBadgeClass, getStatusIcon, getAvailableStatuses } from '../utils/formatters';
import { Check } from 'lucide-react';
import { Order } from '../../../../lib/types';

interface StatusChangeModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onSave: (status: string) => void;
}

export const StatusChangeModal: React.FC<StatusChangeModalProps> = ({ order, isOpen, onClose, onSave }) => {
  if (!isOpen || !order) return null;

  const statuses = getAvailableStatuses();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-white rounded-lg max-w-md w-full"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Изменить статус заказа {order.id}</h3>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-gray-600 mb-4">
            Текущий статус:
            <span
              className={`ml-2 px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusBadgeClass(order.status)}`}
            >
              {order.status}
            </span>
          </p>

          <div className="space-y-3">
            {statuses.map((status) => (
              <button
                key={status}
                className={`w-full flex items-center justify-between p-3 rounded-md border ${
                  order.status === status
                    ? 'border-blue-4 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-4 hover:bg-blue-50'
                }`}
                onClick={() => onSave(status)}
              >
                <div className="flex items-center">
                  {getStatusIcon(status)}
                  <span className="ml-2">{status}</span>
                </div>
                {order.status === status && <Check size={18} className="text-blue" />}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
