import React from 'react';
import { motion } from 'framer-motion';
import { Trash2Icon, PlusIcon, MinusIcon } from 'lucide-react';
import { CartItem as CartItemType } from '../../lib/types';
import { useCart } from '../../lib/context/CartContext';
import { useSettings } from '../../lib/context/SettingsContext';
import { formatPrice } from '../../lib/utils/currency';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { settings } = useSettings();
  const { product, quantity } = item;

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      removeFromCart(product.id);
    }
  };

  const handleIncreaseQuantity = () => {
    updateQuantity(product.id, quantity + 1);
  };

  const currency = settings?.general?.currency || 'RUB';
  
  // --- ИЗМЕНЕНИЕ ЗДЕСЬ ---
  // Делим цену на 100, чтобы перевести из копеек в рубли
  const priceInMainUnit = (product.sale_price ?? 0) / 100;
  const formattedPrice = formatPrice(priceInMainUnit, currency);
  // --- КОНЕЦ ИЗМЕНЕНИЯ ---

  return (
    <motion.div
      className="flex items-center p-5 hover:bg-gray-50 transition-colors"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50, height: 0 }}
      transition={{ duration: 0.2 }}
      layout
    >
      <div className="flex items-center flex-1 min-w-0">
        <motion.div
          className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.2 }}
        >
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </motion.div>
        
        <div className="ml-4 flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900 truncate">{product.name}</h3>
          <p className="text-gray-500 text-sm mt-1">{product.path_name || 'Категория не указана'}</p>
          <p className="text-blue-600 font-semibold mt-2">
            {formattedPrice}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4 ml-4">
        {/* === Встроенный селектор количества === */}
        <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
          <button
            onClick={handleDecreaseQuantity}
            className="w-8 h-8 flex items-center justify-center bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Уменьшить количество"
          >
            <MinusIcon className="h-4 w-4" />
          </button>

          <span className="w-10 text-center font-medium">{quantity}</span>

          <button
            onClick={handleIncreaseQuantity}
            className="w-8 h-8 flex items-center justify-center bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Увеличить количество"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
        {/* === КОНЕЦ === */}

        <motion.button
          className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
          onClick={() => removeFromCart(product.id)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Удалить товар"
        >
          <Trash2Icon className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
};