import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../supabase';
import { useAuth } from './AuthContext';
import { MoySkladProduct } from '../../types/types';

interface FavoritesContextType {
  favorites: MoySkladProduct[];
  addToFavorites: (product: MoySkladProduct) => Promise<void>;
  removeFromFavorites: (productId: string) => Promise<void>; // Изменено: productId теперь string
  isFavorite: (productId: string) => boolean; // Изменено: productId теперь string
  totalFavorites: number;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_STORAGE_KEY = 'favorites_items';

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<MoySkladProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Загружаем избранное при изменении состояния пользователя
  useEffect(() => {
    if (user) {
      loadFavoritesFromDatabase();
    } else {
      // Если пользователь не аутентифицирован, загружаем из localStorage
      const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (savedFavorites) {
        try {
          const parsedFavorites: MoySkladProduct[] = JSON.parse(savedFavorites);
          setFavorites(parsedFavorites);
        } catch (error) {
          console.error('Ошибка при загрузке избранного из localStorage:', error);
          localStorage.removeItem(FAVORITES_STORAGE_KEY);
        }
      } else {
        setFavorites([]); // Очищаем избранное, если в localStorage ничего нет
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
      // 1. Получаем ID товаров, которые пользователь добавил в избранное
      const { data: favoritesData, error: favoritesError } = await supabase
        .from('favorites')
        .select('product_id')
        .eq('user_id', user.id);

      if (favoritesError) throw favoritesError;

      if (favoritesData && favoritesData.length > 0) {
        const productIds = favoritesData.map((fav) => fav.product_id);

        // 2. Получаем полные данные о товарах по их ID
        //    Предполагается, что таблица в Supabase называется 'products'
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*') // Загружаем все поля, чтобы они соответствовали типу MoySkladProduct
          .in('id', productIds);

        if (productsError) throw productsError;

        if (productsData) {
          // 3. Устанавливаем полученные данные в состояние
          //    Мы приводим тип, предполагая, что структура таблицы 'products' в Supabase
          //    соответствует нашему типу MoySkladProduct в TypeScript.
          setFavorites(productsData as MoySkladProduct[]);
        }
      } else {
        setFavorites([]); // Если у пользователя нет избранных товаров в БД
      }
    } catch (error) {
      console.error('Ошибка при загрузке избранного из БД:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Добавление товара в избранное
  const addToFavorites = async (product: MoySkladProduct) => {
    if (isFavorite(product.id)) {
      console.warn('Товар уже в избранном');
      return;
    }
    
    // Обновляем состояние немедленно для лучшего UX
    setFavorites((prev) => [...prev, product]);

    if (user) {
      // Если пользователь аутентифицирован, сохраняем в базе данных
      try {
        const { error } = await supabase.from('favorites').insert([{ user_id: user.id, product_id: product.id }]);
        if (error) {
           console.error('Ошибка при добавлении в избранное в БД:', error);
           // Если произошла ошибка, откатываем изменение состояния
           setFavorites((prev) => prev.filter((fav) => fav.id !== product.id));
        }
      } catch (error) {
        console.error('Критическая ошибка при добавлении в избранное:', error);
      }
    } 
    // Если пользователь не авторизован, useEffect выше сохранит данные в localStorage
  };

  // Удаление товара из избранного
  const removeFromFavorites = async (productId: string) => { // Изменено: productId теперь string
    // Обновляем состояние немедленно
    setFavorites((prev) => prev.filter((fav) => fav.id !== productId));
    
    if (user) {
      // Если пользователь аутентифицирован, удаляем из базы данных
      try {
        const { error } = await supabase.from('favorites').delete().match({ user_id: user.id, product_id: productId });

        if (error) {
            console.error('Ошибка при удалении из избранного из БД:', error);
            // Тут можно реализовать логику отката, если это необходимо
        }
      } catch (error) {
        console.error('Критическая ошибка при удалении из избранного:', error);
      }
    }
    // Если пользователь не авторизован, useEffect выше сохранит данные в localStorage
  };

  // Проверка, находится ли товар в избранном
  const isFavorite = (productId: string): boolean => { // Изменено: productId теперь string
    return favorites.some((fav) => fav.id === productId);
  };

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