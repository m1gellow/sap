import { useState } from 'react';
import { useSettings } from '../../lib/context/SettingsContext';
import { ChartColumnStacked, Heart, ShoppingCart, Info } from 'lucide-react';
import { formatPrice } from '../../lib/utils/currency';
import { MoySkladProduct } from '../../types/types';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import QuantitySelector from '../ui/QuantitySelector';
import { useFavorites } from '../../lib/context/FavoritesContext';
import { useCart } from '../../lib/context/CartContext';
import { AddedToCartModal } from './AddedToCartModal';

interface ProductCardProps {
  product?: MoySkladProduct;
  isLarge?: boolean;
  className?: string;
  onAddToCart?: (product: MoySkladProduct, quantity: number) => void;
}

export const ProductCard = ({
  product,
  isLarge = false,
  className = '',
}: ProductCardProps) => {
    const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const { settings } = useSettings();
  const [quantity, setQuantity] = useState(1);
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [isCartModalOpen, setIsCartModalOpen] = useState(false)

  if (!product) {
    return null; 
  }
  
  const currency = settings?.general?.currency || 'RUB';
  const priceInMainUnit = (product.sale_price ?? 0) / 100;
  const formattedPrice = formatPrice(priceInMainUnit, currency);
  const isInStock = product.stock > 0 && !product.archived;
  const isProductInFavorites = isFavorite(product.id);

  const getBrand = (pathname: string | null) => {
    if (!pathname) return '';
    return pathname.split('/').pop();
  };

  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(1, value);
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, 1);
      setIsCartModalOpen(true); // Открываем модальное окно
    }
  };

  const toggleFavorite = () => {
    if (isProductInFavorites) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  return (
    <div
      className={`${isLarge ? 'h-full w-full flex flex-col ' : 'max-w-[260px]  max-h-[484px] h-full w-full flex flex-col'} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative ${isLarge ? 'flex-grow' : 'aspect-square'} overflow-hidden rounded-lg group`}>
        <img
          src={product.image_url || '/placeholder-product.jpg'}
          alt={product.name || 'Изображение товара'}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          width={isLarge ? '100%' : 260}
          height={isLarge ? '100%' : 260}
        />

        {!isInStock && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Нет в наличии
          </span>
        )}

        {isHovered && (
          <div

            className="absolute inset-0 flex items-center justify-center bg-black/20"
          >
            <Link
              to={`/product/${product.id}`}
              className="inline-flex items-center justify-center px-4 py-2 bg-white text-blue font-bold rounded-full text-sm  border-2 border-blue transition-colors"
            >
              <Info className="mr-2" size={16} />
              Подробнее
            </Link>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-[20px]">
        <div className={`${isLarge ? 'mt-4' : 'mt-2'} flex gap-2`}>
          <button aria-label="Добавить в избранное" onClick={toggleFavorite}>
            <Heart color={isProductInFavorites ? '#ff0000' : '#003153'} size={20} fill={isProductInFavorites ? '#ff0000' : 'none'} />
          </button>
          <button aria-label="Добавить в корзину" onClick={handleAddToCart} >
            <ShoppingCart color={!isInStock ? '#003153' : '#9F9F9F'} size={20} />
          </button>
          <button aria-label="Сравнить товар">
            <ChartColumnStacked color="#003153" size={20} />
          </button>
        </div>
        <div className={`${isLarge ? 'mt-4' : ''} flex flex-col gap-[20px]`}>
          {product.path_name && (
            <span className="font-bold text-[#9F9F9F] text-sm">{getBrand(product.path_name)}</span>
          )}

          <h2 className={`${isLarge ? 'text-[30px] mb-4' : 'text-[16px]'} font-bold text-gray`}>
            {product.name || 'Название товара'}
          </h2>

          <div className={`${isLarge ? 'mt-auto' : ''} flex items-center justify-between`}>
            <span className="text-gray font-bold text-xl">{formattedPrice}</span>

            {!isInStock ? (
              <QuantitySelector quantity={quantity} handleQuantityChange={handleQuantityChange} />
            ) : (
              <div className="h-8 flex items-center">
                <span className="text-sm text-gray-500">Недоступно</span>
              </div>
            )}
          </div>
        </div>
      </div>
        {/* --- Модальное окно --- */}
      <AnimatePresence>
        {isCartModalOpen && (
          <AddedToCartModal quant={quantity} product={product} isOpen={isCartModalOpen} onClose={() => setIsCartModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};