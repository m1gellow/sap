import React from 'react';
import { Separator } from '../ui/separator';
import { motion } from 'framer-motion';

interface QuantitySelectorProps {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  small?: boolean;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onDecrease,
  onIncrease,
  small = false,
}) => {
  // Размер селектора в зависимости от параметра small
  const sizeClasses = small ? 'w-[80px] h-6' : 'w-[100px] h-7';

  return (
    <div
      className={`${sizeClasses} rounded-[20px] border border-solid border-[#33333333] flex items-center justify-between px-2 overflow-hidden`}
    >
      <motion.button
        className="flex items-center justify-center"
        onClick={onDecrease}
        aria-label="Уменьшить количество"
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg width="11" height="1" viewBox="0 0 11 1" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="0.5" y1="0.5" x2="10.5" y2="0.5" stroke="#333333" strokeLinecap="round" />
        </svg>
      </motion.button>

      <Separator orientation="vertical" className="h-[26px]" />

      <motion.span
        className="font-medium text-gray-1 text-[15px]"
        initial={{ scale: 1 }}
        animate={quantity > 0 ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        {quantity}
      </motion.span>

      <Separator orientation="vertical" className="h-[26px]" />

      <motion.button
        className="flex items-center justify-center"
        onClick={onIncrease}
        aria-label="Увеличить количество"
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="5" y1="0.5" x2="5" y2="9.5" stroke="#333333" strokeLinecap="round" />
          <line x1="0.5" y1="5" x2="9.5" y2="5" stroke="#333333" strokeLinecap="round" />
        </svg>
      </motion.button>
    </div>
  );
};
