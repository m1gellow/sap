import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { useSettings } from './SettingsContext';
import { convertPrice } from '../utils/currency';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'cart_items';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const { settings } = useSettings();

  // Загружаем корзину из localStorage при инициализации
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Ошибка при загрузке корзины из localStorage:', error);
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
  }, []);

  // Сохраняем корзину в localStorage при изменении
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  // Обновление общего количества и цены при изменении корзины
  useEffect(() => {
    const itemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    // Рассчитываем общую стоимость в рублях (базовая валюта)
    const priceInRubles = cartItems.reduce((sum, item) => {
      const priceValue = item.product.priceValue || 0;
      return sum + priceValue * item.quantity;
    }, 0);

    setTotalItems(itemsCount);
    setTotalPrice(priceInRubles); // Всегда храним цену в рублях
  }, [cartItems]);

  // Добавление товара в корзину
  const addToCart = (product: Product, quantity = 1) => {
    setCartItems((prevItems) => {
      // Проверяем, есть ли уже этот товар в корзине
      const existingItem = prevItems.find((item) => item.product.id === product.id);

      if (existingItem) {
        // Если есть, увеличиваем количество
        return prevItems.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        );
      } else {
        // Если нет, добавляем новый товар
        return [...prevItems, { product, quantity }];
      }
    });
  };

  // Удаление товара из корзины
  const removeFromCart = (productId: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  // Обновление количества товара
  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => (item.product.id === productId ? { ...item, quantity } : item)),
    );
  };

  // Очистка корзины
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Хук для использования контекста корзины
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};