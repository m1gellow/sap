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
import { items } from '../../assets/items';
import { Product } from '../../types';

interface NewProductCardProps {
  product?: Product;
  isLarge?: boolean;
  className?: string;
}

export const NewProductCard = ({ 
  product, 
  isLarge = false, 
  className = '' 
}: NewProductCardProps) => {
  const [quantity] = useState(1);
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { settings } = useSettings();

  const defaultProduct: Product = {
    id: 50,
    name: 'AQUATONE Wave All-round SUP',
    brand: 'GQ',
    price: '14 000 ₽',
    priceValue: 14000,
    image: items.jacket,
    favoriteIcon: '/group-213.png',
    category: 'SUP доски',
    inStock: true,
  };

  const currentProduct = product || defaultProduct;

  const handleAddToCart = () => {
    addToCart(currentProduct, quantity);
    setShowAddedToCart(true);
  };

  const toggleFavorite = () => {
    if (isFavorite(currentProduct.id)) {
      removeFromFavorites(currentProduct.id);
    } else {
      addToFavorites(currentProduct);
    }
  };

  // Получаем валюту из настроек
  const currency = settings?.general?.currency || 'RUB';
  const formattedPrice = formatPrice(currentProduct.priceValue, currency);

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
        {/* Изображение товара */}
        <div className={`relative ${isLarge ? 'h-[400px] flex-grow' : 'h-64'} overflow-hidden rounded-lg bg-gray-100`}>
          <Link to={`/product/${currentProduct.id}`} className="block h-full">
            <motion.img
              src={currentProduct.image}
              alt={currentProduct.name}
              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
              whileHover={{ scale: 1.05 }}
            />
          </Link>

          {/* Бейдж "В наличии" */}
          {currentProduct.inStock && (
            <span className="absolute top-2 left-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              В наличии
            </span>
          )}

          {/* Кнопка "Избранное" */}
          <button
            onClick={toggleFavorite}
            className="absolute top-2 right-2 p-2 z-50 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
            aria-label="Добавить в избранное"
          >
            <Heart 
              className="w-5 h-5 text-gray-400" 
              fill={isFavorite(currentProduct.id) ? 'red' : 'none'} 
              stroke={isFavorite(currentProduct.id) ? 'red' : 'currentColor'}
            />
          </button>

          {/* Кнопка "Подробнее" появляется при наведении */}
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center bg-black/20"
            >
              <Link
                to={`/product/${currentProduct.id}`}
                className="inline-flex items-center justify-center px-4 py-2 bg-white text-blue font-bold rounded-full text-sm shadow-lg border-2 border-blue transition-colors"
              >
                <Info className="mr-2" size={16} />
                Подробнее
              </Link>
            </motion.div>
          )}
        </div>

        {/* Информация о товаре */}
        <div className={`flex flex-col ${isLarge ? 'mt-4 h-auto px-4 pb-4' : 'mt-4 flex-grow'}`}>
          <div className="mb-2">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {currentProduct.brand}
            </h3>
            <Link to={`/product/${currentProduct.id}`}>
              <h2 className={`mt-1 font-semibold text-gray-900 hover:text-primary transition-colors ${isLarge ? 'text-xl' : 'text-md'} line-clamp-2`}>
                {currentProduct.name}
              </h2>
            </Link>
          </div>

          <div className={`${isLarge ? 'mt-6' : 'mt-auto'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`font-bold ${isLarge ? 'text-2xl' : 'text-lg'}`}>
                {formattedPrice}
              </div>
            </div>

            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleAddToCart}
                className={`w-full ${isLarge ? 'h-14 text-lg' : 'h-10 text-sm'} bg-blue hover:bg-blue-700 text-white shadow-sm`}
              >
                <ShoppingCart className={`${isLarge ? 'w-6 h-6 mr-3' : 'w-4 h-4 mr-1'}`} />
                В корзину
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Модальное окно после добавления в корзину */}
      {showAddedToCart && (
        <AddedToCartModal 
          product={currentProduct} 
          isOpen={showAddedToCart} 
          onClose={() => setShowAddedToCart(false)} 
        />
      )}
    </>
  );
};