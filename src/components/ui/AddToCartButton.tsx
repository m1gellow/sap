import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '../ui/button';

import { MoySkladProduct } from '../../types/types';
import cn from 'classnames';
import { useProductInteractions } from '../../lib/hooks/useProductInteractions';
import { AddedToCartModal } from '../ProductCard/AddedToCartModal';

interface AddToCartButtonProps {
  product?: MoySkladProduct;
  isLarge?: boolean;
}

export const AddToCartButton = ({ product, isLarge = false }: AddToCartButtonProps) => {
  const { isInStock, handleAddToCart } = useProductInteractions(product);
  const [showModal, setShowModal] = useState(false);

  const onAddToCart = () => {
    if (isInStock) {
      handleAddToCart();
      setShowModal(true);
    }
  };

  return (
    <>
      <Button
        onClick={onAddToCart}
        disabled={!isInStock}
        className={cn(
          "w-full bg-blue hover:bg-blue-700 text-white shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed",
          {
            "h-14 text-lg": isLarge,
            "h-10 text-sm": !isLarge,
          }
        )}
      >
        <ShoppingCart 
          className={cn("mr-2", { "w-6 h-6": isLarge, "w-4 h-4": !isLarge })} 
        />
        {isInStock ? 'В корзину' : 'Нет в наличии'}
      </Button>
      {/* Модальное окно показывается по локальному состоянию этой кнопки */}
      {showModal && product && (
        <AddedToCartModal 
          product={product} 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </>
  );
};