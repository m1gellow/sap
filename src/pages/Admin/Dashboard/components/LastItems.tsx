import { AlertCircle, ChevronRight, Package, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { IStatsData } from '../../../types';

export const LastItems = ({ stats }: { stats: IStatsData }) => {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100"
      >
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Заканчивающиеся товары</h2>
          <Link to={'/admin/products'}>
            <button className="text-sm text-blue font-medium flex items-center">
              Управление <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </Link>
        </div>
        <div className="p-4 space-y-4">
          {stats.lowStockItems.length > 0 ? (
            stats.lowStockItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white rounded-md shadow-xs">
                    <Package size={16} className="text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                    <div className="flex items-center mt-1">
                      <AlertCircle size={14} className="text-amber-500 mr-1" />
                      <p className="text-xs text-amber-600">Осталось: {item.stock} шт.</p>
                    </div>
                  </div>
                </div>
                <button className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                  <Plus size={14} className="mr-1" /> Пополнить
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <Package size={20} className="text-green-600" />
              </div>
              <p className="text-gray-500">Все товары в достаточном количестве</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
