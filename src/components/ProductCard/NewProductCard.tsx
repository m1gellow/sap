// /src/components/NewProductCard.tsx (пример пути)

import { useState } from 'react';
import { useCart } from '../../lib/context/CartContext';
import { useSettings } from '../../lib/context/SettingsContext';
import { AddedToCartModal } from './AddedToCartModal';
import { Info, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFavorites } from '../../lib/context/FavoritesContext';
import { formatPrice } from '../../lib/utils/currency';
import { MoySkladProduct } from '../../types/types';

// УЛУЧШЕНИЕ: Добавим URL для картинки-заглушки на случай, если у товара нет изображения
const PLACEHOLDER_IMAGE_URL = 'https://via.placeholder.com/260x260.png?text=No+Image';

interface NewProductCardProps {
  product?: MoySkladProduct;
  isLarge?: boolean;
  className?: string;
}

export const NewProductCard = ({ product, isLarge = false, className = '' }: NewProductCardProps) => {
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { settings } = useSettings();

  // ========================================================================
  // ИСПРАВЛЕНО: Теперь мы передаем в `addToCart` оригинальный объект `product`.
  // Наш CartContext сам знает, как с ним работать.
  // Мы больше не создаем неверную структуру объекта.
  // ========================================================================
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, 1); // Передаем сам продукт и количество
      setShowAddedToCart(true);
    }
  };

  const toggleFavorite = () => {
    if (product) {
      if (isFavorite(product.id)) {
        removeFromFavorites(product.id);
      } else {
        // ИСПРАВЛЕНО: Точно так же, как и с корзиной, передаем оригинальный продукт
        addToFavorites(product);
      }
    }
  };

  const currency = settings?.general?.currency || 'RUB';
  const formattedPrice = formatPrice(product?.sale_price ?? 0, currency);
  
  // УЛУЧШЕНИЕ: Определяем, есть ли товар в наличии, на основе реальных данных
  const isInStock = product && product.stock > 0 && !product.archived;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`group relative flex flex-col ${isLarge ? 'w-full h-full' : 'w-full max-w-[260px]'} ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`relative ${isLarge ? 'h-[400px] flex-grow' : 'h-64'} overflow-hidden rounded-lg bg-gray-100`}>
          <Link to={`/product/${product?.id}`} className="block h-full">
            <motion.img
              // ИСПОЛЬЗУЕМ ЗАГЛУШКУ, если image_url отсутствует
              src={product?.image_url || PLACEHOLDER_IMAGE_URL}
              alt={product?.name || 'Название товара отсутствует'}
              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
              whileHover={{ scale: 1.05 }}
            />
          </Link>

          {/* УЛУЧШЕНИЕ: Логика отображения наличия теперь использует isInStock */}
          {isInStock ? (
            <span className="absolute top-2 left-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              В наличии
            </span>
          ) : (
             <span className="absolute top-2 left-2 bg-red-400 text-white text-xs px-2 py-1 rounded-full">
              Нет в наличии
            </span>
          )}

          <button
            onClick={toggleFavorite}
            className="absolute top-2 right-2 p-2 z-50 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
            aria-label="Добавить в избранное"
          >
            <Heart
              className="w-5 h-5 text-gray-400"
              fill={product && isFavorite(product.id) ? 'red' : 'none'}
              stroke={product && isFavorite(product.id) ? 'red' : 'currentColor'}
            />
          </button>

          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center bg-black/20"
            >
              <Link
                to={`/product/${product?.id}`}
                className="inline-flex items-center justify-center px-4 py-2 bg-white text-blue font-bold rounded-full text-sm shadow-lg border-2 border-blue transition-colors"
              >
                <Info className="mr-2" size={16} />
                Подробнее
              </Link>
            </motion.div>
          )}
        </div>

        <div className={`flex flex-col ${isLarge ? 'mt-4 h-auto px-4 pb-4' : 'mt-4 flex-grow'}`}>
          <div className="mb-2">
            <Link to={`/product/${product?.id}`}>
              <h2
                className={`mt-1 font-semibold text-gray-900 hover:text-primary transition-colors ${isLarge ? 'text-xl' : 'text-md'} line-clamp-2`}
              >
                {product?.name}
              </h2>
            </Link>
          </div>

          <div className={`${isLarge ? 'mt-6' : 'mt-auto'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`font-bold ${isLarge ? 'text-2xl' : 'text-lg'}`}>{formattedPrice}</div>
            </div>

            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleAddToCart}
                // УЛУЧШЕНИЕ: Кнопка неактивна, если товара нет в наличии
                disabled={!isInStock}
                className={`w-full ${isLarge ? 'h-14 text-lg' : 'h-10 text-sm'} bg-blue hover:bg-blue-700 text-white shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed`}
              >
                <ShoppingCart className={`${isLarge ? 'w-6 h-6 mr-3' : 'w-4 h-4 mr-1'}`} />
                {isInStock ? 'В корзину' : 'Нет в наличии'}
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ИСПРАВЛЕНО: Передаем в модальное окно оригинальный продукт */}
      {showAddedToCart && product && (
        <AddedToCartModal 
          product={product} 
          isOpen={showAddedToCart} 
          onClose={() => setShowAddedToCart(false)} 
        />
      )}
    </>
  );
};