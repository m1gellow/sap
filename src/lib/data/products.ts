import { Product } from '../types';
import { getAllProducts } from '../api/products';

// Временные данные на случай проблем с подключением к базе данных
const productData: Product[] = [
  {
    id: 1,
    name: 'AQUATONE Wave All-round SUP',
    brand: 'GQ',
    price: '14 000 P.',
    priceValue: 14000,
    image: '/1-201-11.png',
    favoriteIcon: '/group-213.png',
    category: 'Sup доски для йоги',
    inStock: true,
  },
  {
    id: 2,
    name: 'AQUATONE Wave All-round SUP',
    brand: 'GQ',
    price: '14 000 P.',
    priceValue: 14000,
    image: '/1-201-11.png',
    favoriteIcon: '/group-213-1.png',
    category: 'Универсальные',
    inStock: true,
  },
  {
    id: 3,
    name: 'AQUATONE Wave All-round SUP',
    brand: 'Aztron',
    price: '15 500 P.',
    priceValue: 15500,
    image: '/1-201-11.png',
    favoriteIcon: '/group-213-2.png',
    category: 'Надувные',
    inStock: true,
  },
  {
    id: 4,
    name: 'AQUATONE Wave All-round SUP',
    brand: 'Starboard',
    price: '18 000 P.',
    priceValue: 18000,
    image: '/1-201-11.png',
    favoriteIcon: '/group-213-3.png',
    category: 'Sup с веслом',
    inStock: true,
  },
  {
    id: 5,
    name: 'MYSTIC All-around SUP Board',
    brand: 'Mystic',
    price: '22 500 P.',
    priceValue: 22500,
    image: '/1-201-11.png',
    favoriteIcon: '/group-213-4.png',
    category: 'Sup для двоих',
    inStock: true,
  },
];

// Функция для получения рекомендуемых товаров из базы данных
export const getRecommendedProducts = async (currentProductId?: number, limit: number = 4): Promise<Product[]> => {
  try {
    // Получаем все продукты из базы данных
    const products = await getAllProducts();

    // Если указан ID текущего товара, исключаем его из рекомендаций
    let filteredProducts = currentProductId ? products.filter((p) => p.id !== currentProductId) : [...products];

    // Перемешиваем массив для случайных рекомендаций
    for (let i = filteredProducts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [filteredProducts[i], filteredProducts[j]] = [filteredProducts[j], filteredProducts[i]];
    }

    // Возвращаем указанное количество товаров
    return filteredProducts.slice(0, limit);
  } catch (error) {
    console.error('Ошибка при получении рекомендуемых товаров:', error);

    // В случае ошибки возвращаем товары из моковых данных
    const mockProducts = currentProductId ? productData.filter((p) => p.id !== currentProductId) : [...productData];

    return mockProducts.slice(0, limit);
  }
};

// Функция для получения товаров из указанной категории
const getProductsByCategory = async (category: string, limit: number = 4): Promise<Product[]> => {
  try {
    // Получаем все продукты из базы данных
    const products = await getAllProducts();

    // Фильтруем по категории
    const categoryProducts = products.filter((p) => p.category === category);

    // Если товаров в категории меньше, чем нужно, дополняем случайными товарами
    if (categoryProducts.length < limit) {
      const otherProducts = products.filter((p) => p.category !== category).slice(0, limit - categoryProducts.length);

      return [...categoryProducts, ...otherProducts];
    }

    return categoryProducts.slice(0, limit);
  } catch (error) {
    console.error(`Ошибка при получении товаров по категории ${category}:`, error);

    // В случае ошибки возвращаем товары из моковых данных
    const mockCategoryProducts = productData.filter((p) => p.category === category);
    if (mockCategoryProducts.length < limit) {
      const otherProducts = productData
        .filter((p) => p.category !== category)
        .slice(0, limit - mockCategoryProducts.length);

      return [...mockCategoryProducts, ...otherProducts];
    }

    return mockCategoryProducts.slice(0, limit);
  }
};

// Функция для поиска товара по ID
const getProductById = async (id: number): Promise<Product | undefined> => {
  try {
    // Получаем товар по ID из базы данных с помощью API
    const product = await import('../api/products').then((module) => module.getProductById(id));
    return product || undefined;
  } catch (error) {
    console.error(`Ошибка при получении товара с ID ${id}:`, error);

    // В случае ошибки возвращаем товар из моковых данных
    return productData.find((p) => p.id === id);
  }
};
