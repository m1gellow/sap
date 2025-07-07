import React from 'react';
import { useCart } from '../../lib/context/CartContext';
import { useSettings } from '../../lib/context/SettingsContext';
import { CartItem } from './CartItem';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../lib/utils/currency';
import clsx from 'clsx';

interface CartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const CartDropdown: React.FC<CartDropdownProps> = ({ isOpen, onClose, className }) => {
  const { cartItems, totalItems, totalPrice, clearCart } = useCart();
  const { settings } = useSettings();

  // Получаем валюту из настроек
  const currency = settings?.general?.currency || 'RUB';

  if (!isOpen) return null;

  return (
    <motion.div
      className={clsx(
        'w-[320px] sm:w-[350px] bg-white shadow-lg rounded-lg z-50 max-h-[80vh] overflow-auto',
        className,
      )}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Корзина ({totalItems})</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="hover:bg-gray-100 rounded-full h-8 w-8 p-0"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p>Ваша корзина пуста</p>
        </div>
      ) : (
        <>
          <div className="max-h-[400px] overflow-y-auto">
            <AnimatePresence mode="wait">
              {cartItems.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </AnimatePresence>
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex justify-between mb-4">
              <span className="font-semibold">Итого:</span>
              <span className="font-bold">{formatPrice(totalPrice, currency)}</span>
            </div>

            <div className="flex space-x-2">
              <Link to="/cart" className="w-full">
                <Button className="w-full bg-blue hover:bg-blue rounded-[53px] text-white" onClick={onClose}>
                  Перейти в корзину
                </Button>
              </Link>
              <Button
                variant="outline"
                className="rounded-[53px] border-[#333333] hover:bg-gray-100 whitespace-nowrap"
                onClick={(e) => {
                  e.stopPropagation();
                  clearCart();
                }}
              >
                Очистить
              </Button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};