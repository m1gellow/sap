import { motion } from 'framer-motion';
import { Product } from '../../lib/types';

export const Pagination = ({ filteredProducts }: { filteredProducts: Product[] }) => {
  return (
    <>
      {filteredProducts.length > 0 && (
        <div className="flex justify-center mt-6 mb-12 space-x-2">
          <motion.button
            className="w-10 h-10 rounded-full bg-blue text-white flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            1
          </motion.button>
          <motion.button
            className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center hover:bg-gray-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            2
          </motion.button>
          <motion.button
            className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center hover:bg-gray-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            3
          </motion.button>
        </div>
      )}
    </>
  );
};