import React, { useState, useCallback, memo } from 'react';
import { XIcon, PlusIcon, MinusIcon, ShoppingCart } from 'lucide-react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { useCart } from '../../lib/context/CartContext';
import { useSettings } from '../../lib/context/SettingsContext';
// import { getRecommendedProducts } from '../../lib/data/products';
import { formatPrice } from '../../lib/utils/currency';
import { MoySkladProduct } from '../../types/types';
import MainButton from '../ui/MainButton';

interface AddedToCartModalProps {
  product: MoySkladProduct;
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
        className="bg-skyblue border-blue border-[2px] rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
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
              <img src={product.image_url} alt={product.name} className="max-w-full max-h-full object-contain" />
            </div>

            <div className="flex-1">
              <h4 className="font-medium text-gray-800">{product.name}</h4>
              <p className="text-gray-600 text-sm">{product.brand}</p>
              <p className="font-semibold text-gray-900 mt-1">{product.sale_price}</p>
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
    
            <MainButton  onClick={onClose}>
               Продолжить покупки
            </MainButton>

            <Link to="/cart" className="w-full sm:w-auto">
                <MainButton variant='secondary' className='flex items-center gap-2'  onClick={onClose}>
                  <ShoppingCart/>
               Перейти в корзину
            </MainButton>
            </Link>
          </div>

   
        </div>
      </div>
    </div>
  );
});

AddedToCartModal.displayName = 'AddedToCartModal';