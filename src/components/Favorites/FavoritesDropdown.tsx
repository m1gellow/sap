import React from 'react';
import { useFavorites } from '../../lib/context/FavoritesContext';
import { useCart } from '../../lib/context/CartContext';
import { useSettings } from '../../lib/context/SettingsContext';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../lib/utils/currency';
import clsx from 'clsx';

interface FavoritesDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const FavoritesDropdown: React.FC<FavoritesDropdownProps> = ({ isOpen, onClose, className }) => {
  const { favorites, removeFromFavorites, totalFavorites } = useFavorites();
  const { addToCart } = useCart();
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
          <h2 className="text-lg font-semibold">Избранное ({totalFavorites})</h2>
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

      {favorites.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <Heart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p>У вас нет избранных товаров</p>
        </div>
      ) : (
        <>
          <div className="max-h-[400px] overflow-y-auto">
            <AnimatePresence mode="wait">
              {favorites.map((product) => (
                <motion.div
                  key={product.id}
                  className="flex items-center justify-between p-4 border-b border-gray-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-md flex items-center justify-center p-1">
                      <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h3 className="font-normal text-[#333333] text-base">
                        <span>{product.name.split(' ')[0]} </span>
                        <span className="font-light">{product.name.split(' ').slice(1).join(' ')}</span>
                      </h3>
                      <p className="text-gray-1 font-semibold">{formatPrice(product.priceValue, currency)}</p>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        className="w-[100px] h-[30px] bg-blue-4 hover:bg-teal-600 rounded-[53px] text-white text-xs flex items-center gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                      >
                        <ShoppingCart className="w-3 h-3" />В корзину
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 text-xs w-full hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromFavorites(product.id);
                        }}
                      >
                        Удалить
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="p-4 border-t border-gray-200">
            <Link to="/favorites" className="w-full">
              <Button className="w-full bg-blue-4 hover:bg-teal-600 rounded-[53px] text-white" onClick={onClose}>
                Перейти в избранное
              </Button>
            </Link>
          </div>
        </>
      )}
    </motion.div>
  );
};