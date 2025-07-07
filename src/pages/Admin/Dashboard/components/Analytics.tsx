import { Eye, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion';

export const Analytics = () => {
  return (
    <div>
           <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 sm:mb-0">Аналитика продаж</h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg text-xs font-medium">
              За неделю
            </button>
            <button className="px-3 py-1.5 text-sm bg-white text-gray-600 border border-gray-200 rounded-lg text-xs font-medium hover:bg-gray-50">
              За месяц
            </button>
            <button className="px-3 py-1.5 text-sm bg-white text-gray-600 border border-gray-200 rounded-lg text-xs font-medium hover:bg-gray-50">
              За год
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <div className="text-center p-4">
            <TrendingUp className="h-10 w-10 mx-auto mb-3 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-500 mb-1">Аналитика продаж</h3>
            <p className="text-sm text-gray-400 max-w-md">
              Графики и детальная аналитика будут доступны в следующем обновлении панели управления
            </p>
            <button className="mt-4 text-sm text-blue font-medium flex items-center justify-center mx-auto">
              <Eye className="w-4 h-4 mr-2" /> Предпросмотр
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
