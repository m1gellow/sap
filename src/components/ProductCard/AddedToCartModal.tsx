import React, { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, PlusIcon, MinusIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Product } from '../../lib/types';
import { Link } from 'react-router-dom';
import { useCart } from '../../lib/context/CartContext';
import { useSettings } from '../../lib/context/SettingsContext';
import { RecommendedProducts } from './RecommendedProducts';
import { getRecommendedProducts } from '../../lib/data/products';
import { formatPrice } from '../../lib/utils/currency';

interface AddedToCartModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const AddedToCartModal: React.FC<AddedToCartModalProps> = memo(({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const { updateQuantity } = useCart();
  const { settings } = useSettings();

  // Получаем валюту из настроек
  const currency = settings?.general?.currency || 'RUB';
  const formattedPrice = formatPrice(product.priceValue, currency);

  // Если модальное окно не открыто, ничего не рендерим
  if (!isOpen) return null;

  // Получаем рекомендуемые товары
  const recommendedProducts = getRecommendedProducts(product.id, 3);

  const handleDecreaseQuantity = useCallback(() => {
    if (quantity > 1) {
      setQuantity((prev) => {
        const newQuantity = prev - 1;
        updateQuantity(product.id, newQuantity);
        return newQuantity;
      });
    }
  }, [quantity, updateQuantity, product.id]);

  const handleIncreaseQuantity = useCallback(() => {
    setQuantity((prev) => {
      const newQuantity = prev + 1;
      updateQuantity(product.id, newQuantity);
      return newQuantity;
    });
  }, [updateQuantity, product.id]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Товар успешно добавлен в корзину</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100">
              <XIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center space-x-4 py-4 border-b border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded flex items-center justify-center p-2">
              <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain" />
            </div>

            <div className="flex-1">
              <h4 className="font-medium text-gray-800">{product.name}</h4>
              <p className="text-gray-600 text-sm">{product.brand}</p>
              <p className="font-semibold text-gray-900 mt-1">{formattedPrice}</p>
            </div>

            <div className="flex items-center border rounded-full overflow-hidden">
              <button
                onClick={handleDecreaseQuantity}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600"
                disabled={quantity <= 1}
              >
                <MinusIcon className="h-4 w-4" />
              </button>

              <span className="w-8 text-center">{quantity}</span>

              <button
                onClick={handleIncreaseQuantity}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>

            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 my-6">
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full px-6"
            >
              Продолжить покупки
            </Button>

            <Link to="/cart" className="w-full sm:w-auto">
              <Button className="w-full bg-blue text-white rounded-full px-6" onClick={onClose}>
                Перейти в корзину
              </Button>
            </Link>
          </div>

          {/* Рекомендуемые товары */}
          {recommendedProducts.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Так же рекомендуем</h3>
              <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide snap-x">
                {recommendedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex-shrink-0 w-[220px] snap-start bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100"
                  >
                    <Link to={`/product/${product.id}`} onClick={onClose}>
                      <div className="h-32 flex items-center justify-center p-2 bg-gray-50">
                        <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
                      </div>
                    </Link>

                    <div className="p-3">
                      <Link to={`/product/${product.id}`} onClick={onClose}>
                        <h4 className="font-medium text-gray-800 text-sm truncate">{product.name}</h4>
                      </Link>

                      <p className="font-semibold text-gray-900 mt-1">{formatPrice(product.priceValue, currency)}</p>

                      <div className="flex mt-2 space-x-2">
                        <Link to={`/product/${product.id}`} className="flex-1" onClick={onClose}>
                          <Button variant="outline" className="w-full h-8 text-xs border-gray-300">
                            Подробнее
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

AddedToCartModal.displayName = 'AddedToCartModal';