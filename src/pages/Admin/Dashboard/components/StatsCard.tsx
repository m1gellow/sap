import { motion } from 'framer-motion';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { IStatsCardItem } from '../../../types';



export const StatsCard = ({stat, index}: {stat: IStatsCardItem, index: number}) => {
  return (
    <div>
           <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`${stat.bgColor} p-5 rounded-xl shadow-sm border border-gray-100`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <div className="flex items-center">
                  <div
                    className={`flex items-center px-2 py-1 rounded-md ${
                      stat.change > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {stat.change > 0 ? (
                      <ArrowUp size={14} className="mr-1" />
                    ) : (
                      <ArrowDown size={14} className="mr-1" />
                    )}
                    <span className="text-xs font-medium">{Math.abs(stat.change)}%</span>
                  </div>
                  <span className="text-xs text-gray-500 ml-2">за неделю</span>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-white shadow-xs">{stat.icon}</div>
            </div>
          </motion.div>
    </div>
  )
}
