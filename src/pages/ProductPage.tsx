import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { HeartIcon, Star, BarChartIcon, TruckIcon, InfoIcon, XIcon, PlusIcon, MinusIcon, Loader2, ChevronRight, Check } from 'lucide-react';
import { useCart } from '../lib/context/CartContext';
import { useSettings } from '../lib/context/SettingsContext';
import { useFavorites } from '../lib/context/FavoritesContext';
import { Link, useParams } from 'react-router-dom';
import { Separator } from '../components/ui/separator';
import { AddedToCartModal } from '../components/ProductCard/AddedToCartModal';
import { RecommendedProducts } from '../components/ProductCard/RecommendedProducts';
import { getProductById } from '../lib/api/products';
import { getRecommendedProducts } from '../lib/data/products';

import { formatPrice } from '../lib/utils/currency';
import { cn } from '../lib/utils';
import { MoySkladProduct } from '../types/types';

export const ProductPage: React.FC = () => {
  const { addToCart } = useCart();
  const { addToFavorites, isFavorite, removeFromFavorites } = useFavorites();
  const { settings } = useSettings();
  const [activeTab, setActiveTab] = useState('parameters');
  const [quantity, setQuantity] = useState(1);
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const { id } = useParams();
  const [product, setProduct] = useState<MoySkladProduct | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<MoySkladProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const productId = parseInt(id || '1');

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const productData = await getProductById(productId);
        if (!productData) throw new Error('Товар не найден');
        setProduct(productData);
        const recommendedData = await getRecommendedProducts(productId, 4);
        setRecommendedProducts(recommendedData);
      } catch (error) {
        console.error(`Ошибка при загрузке товара:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 text-blue animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center min-h-[50vh]">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Товар не найден</h2>
        <p className="text-gray-600 mb-6">Извините, запрашиваемый товар не существует или был удален.</p>
        <Link to="/catalog">
          <Button className="bg-blue text-white px-6 py-3 rounded-lg">
            Вернуться в каталог
          </Button>
        </Link>
      </div>
    );
  }

  const productSpecs = {
    length: '335 см',
    width: '85 см',
    thickness: '15 см',
    warranty: '12 мес',
    maxPressure: '25 psi',
    equipment: 'Весло, Насос, Плавник, Ремкомплект, Сиденье, Сумка для хранения',
    recommendedCapacity: '1 чел.',
    maxCapacity: '2 чел.',
    volume: '315 л',
    boxSize: '28×30×89 см',
    boardWeight: '12 кг',
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setShowAddedToCart(true);
  };

  const toggleFavorite = () => {
    isFavorite(product.id) ? removeFromFavorites(product.id) : addToFavorites(product);
  };

  // Получаем валюту из настроек
  const currency = settings?.general?.currency || 'RUB';
  const formattedPrice = formatPrice(product.priceValue, currency);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Хлебные крошки */}
      <nav className="flex items-center text-sm text-gray-500 mb-8">
        <Link to="/" className=" transition-colors">
          Главная
        </Link>
        <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
        <Link to="/catalog" className="transition-colors">
          Каталог
        </Link>
        <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
        <span className="text-gray-700 font-medium">{product.name}</span>
      </nav>

      {/* Основная информация */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
        {/* Галерея - только одно изображение */}
        <div className="bg-gray-50 rounded-xl p-6 flex items-center justify-center h-[400px]">
          <img 
            src={product.image} 
            alt={product.name} 
            className="max-h-full max-w-full object-contain transition-opacity duration-300"
          />
        </div>

        {/* Информация */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-gray-500">32 отзыва</span>
            </div>
          </div>

          {/* Основные характеристики */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Длина", value: productSpecs.length },
              { label: "Ширина", value: productSpecs.width },
              { label: "Толщина", value: productSpecs.thickness },
              { label: "Вес", value: productSpecs.boardWeight },
              { label: "Объем", value: productSpecs.volume },
              { label: "Грузоподъемность", value: "150 кг" },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="font-medium">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Цена и количество */}
          <div className="pt-4">
            <div className="flex items-center justify-between mb-6">
              <span className="text-3xl font-bold text-gray-900">{formattedPrice}</span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <MinusIcon className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={handleAddToCart}
                className="flex-1 h-12 bg-blue hover:bg-blue text-white rounded-lg font-medium text-base"
              >
                Добавить в корзину
              </Button>
              <button
                onClick={toggleFavorite}
                className={cn(
                  "w-12 h-12 flex items-center justify-center rounded-lg border transition-colors",
                  isFavorite(product.id) 
                    ? "bg-red-50 border-red-200 text-red-500 hover:bg-red-100"
                    : "border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-600"
                )}
              >
                <HeartIcon className={cn("w-5 h-5", isFavorite(product.id) && "fill-current")} />
              </button>
            </div>
          </div>

          {/* Доставка и гарантия */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start space-x-3">
              <TruckIcon className="w-5 h-5 text-blue mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Бесплатная доставка</p>
                <p className="text-sm text-gray-500">По всей России от 2 дней</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Гарантия 12 месяцев</p>
                <p className="text-sm text-gray-500">Официальная гарантия производителя</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Детали товара */}
      <div className="mb-16">
        <div className="flex overflow-x-auto border-b border-gray-200 scrollbar-hide mb-6">
          {['parameters', 'description', 'delivery'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-5 py-3 font-medium text-sm whitespace-nowrap relative",
                activeTab === tab 
                  ? "text-blue"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {tab === 'parameters' && 'Характеристики'}
              {tab === 'description' && 'Описание'}
              {tab === 'delivery' && 'Доставка и оплата'}
              {activeTab === tab && (
                <motion.div 
                  layoutId="tabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'parameters' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(productSpecs).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="font-medium text-gray-900 text-right">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {product.description || `${product.name} — это универсальная надувная SUP-доска для новичков и продвинутых пользователей. Идеально подходит как для спокойного отдыха на воде, так и для активных тренировок.`}
                </p>
                <ul className="mt-4 space-y-2 text-gray-700">
                  {[
                    "Высококачественный ПВХ-материал повышенной прочности",
                    "Усиленная конструкция с дополнительными слоями защиты",
                    "Антискользящее покрытие EVA для комфортного использования",
                    "Комплектация включает все необходимое для начала катания"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'delivery' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Доставка</h3>
                  <div className="space-y-4">
                    {[
                      { title: "Курьером", desc: "По Москве и СПб — бесплатно, 1-2 дня", price: "Бесплатно" },
                      { title: "Самовывоз", desc: "Из наших магазинов в Москве и СПб", price: "Бесплатно" },
                      { title: "Почта России", desc: "Доставка в любой регион страны", price: "От 500 ₽" },
                      { title: "ТК СДЭК", desc: "Быстрая доставка по всей России", price: "От 800 ₽" },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-start p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-gray-500">{item.desc}</p>
                        </div>
                        <span className="font-medium">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="text-lg font-semibold mb-3">Оплата</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Банковской картой онлайн",
                      "Наличными при получении",
                      "Рассрочка без переплат",
                      "Безналичный расчет для юрлиц"
                    ].map((item, i) => (
                      <div key={i} className="flex items-center p-4 bg-gray rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-blue  text-blue flex items-center justify-center mr-3">
                          {i + 1}
                        </div>
                        <span className="font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Рекомендуемые товары */}
      {recommendedProducts.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">С этим товаром покупают</h2>
          <RecommendedProducts products={recommendedProducts} />
        </div>
      )}

      <AnimatePresence>
        {showAddedToCart && (
          <AddedToCartModal 
            product={product} 
            isOpen={showAddedToCart} 
            onClose={() => setShowAddedToCart(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};