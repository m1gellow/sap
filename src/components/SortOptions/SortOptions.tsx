import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const SortOptions = ({
  handleSortClick,
  sortOrder,
}: {
  handleSortClick(arg1: string): void;
  sortOrder: 'asc' | 'desc' | null;
}) => {
  return (
    <div>
      {/* Sort options */}
      <div className="flex justify-end mb-4">
        <div className="flex space-x-2 items-center">
          <span className="text-sm text-gray-600">Сортировка:</span>
          <motion.button
            className={`px-3 py-1 text-sm rounded-full flex items-center ${
              sortOrder === 'asc' ? 'bg-blue text-white' : 'bg-gray-100 text-gray-600'
            }`}
            onClick={() => handleSortClick('asc')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            По возрастанию цены
          </motion.button>
          <motion.button
            className={`px-3 py-1 text-sm rounded-full flex items-center ${
              sortOrder === 'desc' ? 'bg-blue text-white' : 'bg-gray-100 text-gray-600'
            }`}
            onClick={() => handleSortClick('desc')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            По убыванию цены
          </motion.button>
        </div>
      </div>
    </div>
  );
};