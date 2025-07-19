import { MoySkladProduct } from '../../types/types';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

export const useProductInteractions = (product?: MoySkladProduct) => {
  // Получаем нужные функции из глобальных контекстов
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const productId = product?.id;

  // Вычисляемые состояния
  const isInFavorites = productId ? isFavorite(productId) : false;
  const isInStock = product ? product.stock > 0 && !product.archived : false;

  // Обработчики действий
  const handleAddToCart = () => {
    if (product && isInStock) {
      addToCart(product, 1);
    }
  };

  const handleToggleFavorite = () => {
    if (!product) return;

    if (isInFavorites) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  // Возвращаем удобный интерфейс для использования в компонентах
  return {
    isInFavorites,
    isInStock,
    handleAddToCart,
    handleToggleFavorite,
  };
};
