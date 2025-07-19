import { Heart } from 'lucide-react';

import { MoySkladProduct } from '../../types/types';
import { useProductInteractions } from '../../lib/hooks/useProductInteractions';

interface FavoriteToggleButtonProps {
  product?: MoySkladProduct;
}

export const FavoriteToggleButton = ({ product }: FavoriteToggleButtonProps) => {
  // Компонент использует наш хук и знает только о том, что ему нужно
  const { isInFavorites, handleToggleFavorite } = useProductInteractions(product);

  return (
    <button
      onClick={handleToggleFavorite}
      className="absolute top-3 right-3 p-2 z-10 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
      aria-label="Добавить в избранное"
    >
      <Heart
        className="w-5 h-5 text-gray-500 transition-all duration-200"
        fill={isInFavorites ? '#ef4444' : 'none'} // red-500
        stroke={isInFavorites ? '#ef4444' : 'currentColor'}
      />
    </button>
  );
};