import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { supabase } from '../supabase';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
  favorites: Product[];
  addToFavorites: (product: Product) => Promise<void>;
  removeFromFavorites: (productId: number) => Promise<void>;
  isFavorite: (productId: number) => boolean;
  totalFavorites: number;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_STORAGE_KEY = 'favorites_items';

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Загружаем избранное при аутентификации пользователя
  useEffect(() => {
    if (user) {
      loadFavoritesFromDatabase();
    } else {
      // Если пользователь не аутентифицирован, загрузим из localStorage
      const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (savedFavorites) {
        try {
          setFavorites(JSON.parse(savedFavorites));
        } catch (error) {
          console.error('Ошибка при загрузке избранного из localStorage:', error);
          localStorage.removeItem(FAVORITES_STORAGE_KEY);
        }
      }
    }
  }, [user]);

  // Сохраняем избранное в localStorage для неаутентифицированных пользователей
  useEffect(() => {
    if (!user) {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    }
  }, [favorites, user]);

  // Загрузка избранного из базы данных
  const loadFavoritesFromDatabase = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Получаем ID товаров, которые пользователь добавил в избранное
      const { data: favoritesData, error: favoritesError } = await supabase
        .from('favorites')
        .select('product_id')
        .eq('user_id', user.id);

      if (favoritesError) throw favoritesError;

      if (favoritesData && favoritesData.length > 0) {
        const productIds = favoritesData.map((fav) => fav.product_id);

        // Получаем данные о товарах из таблицы products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*, categories(name)')
          .in('id', productIds);

        if (productsError) throw productsError;

        if (productsData) {
          // Преобразуем данные в формат, необходимый для отображения
          const formattedProducts: Product[] = productsData.map((product) => ({
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: `${product.price} P.`,
            priceValue: product.price,
            image: product.image,
            favoriteIcon: '/group-213.png', // заглушка, можно удалить это поле или заменить на реальное
            category: product.categories.name,
            inStock: product.in_stock,
          }));

          setFavorites(formattedProducts);
        }
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error('Ошибка при загрузке избранного:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Добавление товара в избранное
  const addToFavorites = async (product: Product) => {
    // Проверяем, есть ли уже этот товар в избранном
    if (isFavorite(product.id)) {
      return;
    }

    // Если пользователь аутентифицирован, сохраняем в базе данных
    if (user) {
      try {
        const { error } = await supabase.from('favorites').insert([{ user_id: user.id, product_id: product.id }]);

        if (error) throw error;

        // Обновляем локальное состояние
        setFavorites((prev) => [...prev, product]);
      } catch (error) {
        console.error('Ошибка при добавлении в избранное:', error);
      }
    } else {
      // Иначе сохраняем только в локальном состоянии
      setFavorites((prev) => [...prev, product]);
    }
  };

  // Удаление товара из избранного
  const removeFromFavorites = async (productId: number) => {
    // Если пользователь аутентифицирован, удаляем из базы данных
    if (user) {
      try {
        const { error } = await supabase.from('favorites').delete().eq('user_id', user.id).eq('product_id', productId);

        if (error) throw error;

        // Обновляем локальное состояние
        setFavorites((prev) => prev.filter((fav) => fav.id !== productId));
      } catch (error) {
        console.error('Ошибка при удалении из избранного:', error);
      }
    } else {
      // Иначе удаляем только из локального состояния
      setFavorites((prev) => prev.filter((fav) => fav.id !== productId));
    }
  };

  // Проверка, находится ли товар в избранном
  const isFavorite = (productId: number): boolean => {
    return favorites.some((fav) => fav.id === productId);
  };

  // Общее количество избранных товаров
  const totalFavorites = favorites.length;

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        totalFavorites,
        isLoading,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

// Хук для использования контекста избранного
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
