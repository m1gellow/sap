
import { createContext, useContext, useEffect, useState } from 'react';
import { MoySkladProduct } from '../../types/types'; // Убедитесь, что путь к вашим типам верный

// ========================================================================
// ИЗМЕНЕНИЕ 1: Определяем новый тип для элемента корзины.
// Это ключевое изменение. Корзина хранит не просто товары, а объекты,
// которые содержат товар и его количество.
// ========================================================================
export interface CartItem {
  product: MoySkladProduct;
  quantity: number;
}

// ========================================================================
// ИЗМЕНЕНИЕ 2: Обновляем интерфейс контекста.
// - cartItems теперь массив CartItem[]
// - ID в функциях теперь string
// ========================================================================
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: MoySkladProduct, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number; 
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'moy_sklad_cart_items'; 

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsedCart: CartItem[] = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error('Ошибка при загрузке корзины из localStorage:', error);
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
  }, []);

  // Сохраняем корзину в localStorage при каждом ее изменении
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));

    // Обновляем общее количество и цену
    const itemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    // ========================================================================
    // ИЗМЕНЕНИЕ 4: Правильный расчет цены с использованием `sale_price`
    // Используем `?? 0` на случай, если у товара нет цены (sale_price is null)
    // ========================================================================
    const priceInRubles = cartItems.reduce((sum, item) => {
      const price = item.product.sale_price ?? 0;
      return sum + price * item.quantity;
    }, 0);

    setTotalItems(itemsCount);
    setTotalPrice(priceInRubles);
  }, [cartItems]);

  // Добавление товара в корзину
  const addToCart = (product: MoySkladProduct, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id);

      if (existingItem) {
        // Если товар уже есть, обновляем его количество
        return prevItems.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        );
      } else {
        // Если товара нет, добавляем его как новый элемент корзины
        return [...prevItems, { product, quantity }];
      }
    });
  };

  // ========================================================================
  // ИЗМЕНЕНИЕ 5: ID теперь string
  // ========================================================================
  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    // Если количество 0 или меньше, удаляем товар
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => (item.product.id === productId ? { ...item, quantity } : item)),
    );
  };

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

// Хук для удобного использования контекста в компонентах
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart должен использоваться внутри CartProvider');
  }
  return context;
};