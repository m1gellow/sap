import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { IStatsData } from '../../../types';
import { Link } from 'react-router-dom';


export const LastOrders = ({stats}: {stats: IStatsData}) => {
  return (
    <div>
<motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 lg:col-span-2"
        >
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Последние заказы</h2>
            <Link to={'/admin/orders'}>
             <button className="text-sm text-blue font-medium flex items-center">
              Все заказы <ChevronRight className="w-4 h-4 ml-1" />
            </button>
            </Link>
           
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase">
                <tr>
                  <th className="px-5 py-3 text-left rounded-tl-lg">Номер</th>
                  <th className="px-5 py-3 text-left">Клиент</th>
                  <th className="px-5 py-3 text-left">Дата</th>
                  <th className="px-5 py-3 text-left">Статус</th>
                  <th className="px-5 py-3 text-right rounded-tr-lg">Сумма</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((order, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-blue">{order.id}</td>
                      <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-800">{order.customer}</td>
                      <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                      <td className="px-5 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            order.status === 'Оплачен'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'Ожидает оплаты'
                                ? 'bg-yellow-100 text-yellow-800'
                                : order.status === 'Доставляется'
                                  ? 'bg-blue-100 text-blue'
                                  : order.status === 'Завершен'
                                    ? 'bg-gray-100 text-gray-800'
                                    : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-800 text-right font-medium">
                        {order.amount}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-gray-500">
                      Нет заказов для отображения
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
    </div>
  )
}
