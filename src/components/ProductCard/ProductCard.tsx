import { useState } from 'react';
import { useSettings } from '../../lib/context/SettingsContext';

import { Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatPrice } from '../../lib/utils/currency';
import { MoySkladProduct } from '../../types/types';
import { FavoriteToggleButton } from '../ui/FavoriteToggleButton';
import { AddToCartButton } from '../ui/AddToCartButton';
const PLACEHOLDER_IMAGE_URL = 'https://via.placeholder.com/260x260.png?text=No+Image';

interface NewProductCardProps {
  product?: MoySkladProduct;
  isLarge?: boolean;
  className?: string;
}

export const ProductCard = ({ product, isLarge = false, className = '' }: NewProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { settings } = useSettings();

  const currency = settings?.general?.currency || 'RUB';
  const formattedPrice = formatPrice(product?.sale_price ?? 0, currency);

  // УЛУЧШЕНИЕ: Определяем, есть ли товар в наличии, на основе реальных данных
  const isInStock = product && product.stock > 0 && !product.archived;

  return (
    <>
      <div
        className={`group border rounded-lg p-[20px] relative flex flex-col ${isLarge ? 'w-full h-full' : 'w-full max-w-[260px]'} ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`relative ${isLarge ? 'h-[400px] flex-grow' : 'h-64'} overflow-hidden rounded-lg `}>
          <Link to={`/product/${product?.id}`} className="block h-full">
            <motion.img
              // ИСПОЛЬЗУЕМ ЗАГЛУШКУ, если image_url отсутствует
              src={product?.image_url || PLACEHOLDER_IMAGE_URL}
              alt={product?.name || 'Название товара отсутствует'}
              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
              whileHover={{ scale: 1.05 }}
            />
          </Link>

          {isInStock ? (
            <span className="absolute top-2 left-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              В наличии
            </span>
          ) : (
            <span className="absolute top-2 left-2 bg-red-400 text-white text-xs px-2 py-1 rounded-full">
              Нет в наличии
            </span>
          )}

          <FavoriteToggleButton product={product} />

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

            <AddToCartButton product={product} isLarge={isLarge} />
          </div>
        </div>
      </div>
    </>
  );
};
