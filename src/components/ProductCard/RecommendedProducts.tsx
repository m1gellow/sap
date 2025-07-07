import React, { useCallback, useRef, memo, useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../../lib/context/CartContext';
import { useFavorites } from '../../lib/context/FavoritesContext';
import {  ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../../lib/types';
import { AddedToCartModal } from './AddedToCartModal';
import { NewProductCard } from './NewProductCard';

interface RecommendedProductsProps {
  title?: string;
  products: Product[];
  showControls?: boolean;
}

export const RecommendedProducts: React.FC<RecommendedProductsProps> = memo(
  ({ title = 'Рекомендуемые товары', products, showControls = true }) => {
    const { addToCart } = useCart();
    const containerRef = useRef<HTMLDivElement>(null);
    const [modalProduct, setModalProduct] = useState<Product | null>(null);
    const [showModal, setShowModal] = useState(false);

    const nextSlide = useCallback(() => {
      if (containerRef.current) {
        containerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
      }
    }, []);

    const prevSlide = useCallback(() => {
      if (containerRef.current) {
        containerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
      }
    }, []);

    if (!products || products.length === 0) {
      return null;
    }

    return (
      <div className="mt-8 mb-12 relative">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-800">{title}</h3>

          {showControls && products.length > 3 && (
            <div className="flex space-x-2">
              <motion.button
                className="w-8 h-8 md:w-10 md:h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 shadow-sm"
                onClick={prevSlide}
                whileHover={{ scale: 1.05, backgroundColor: '#f9fafb' }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
              </motion.button>

              <motion.button
                className="w-8 h-8 md:w-10 md:h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 shadow-sm"
                onClick={nextSlide}
                whileHover={{ scale: 1.05, backgroundColor: '#f9fafb' }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              </motion.button>
            </div>
          )}
        </div>

        <div
          ref={containerRef}
          className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide snap-x"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {products.map((product) => (
           <NewProductCard
           key={product.id}
            product={product}
            isLarge={false}
           />
          ))}
        </div>

        {/* Модальное окно добавления в корзину */}
        {showModal && modalProduct && (
          <AddedToCartModal
            product={modalProduct}
            isOpen={showModal}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    );
  },
);

RecommendedProducts.displayName = 'RecommendedProducts';