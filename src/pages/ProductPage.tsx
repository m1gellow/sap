import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { SectionWrapper } from '../components/ui/SectionWrapper';
import { Breadcrumbs } from '../lib/utils/BreadCrumbs';
import { getProductById } from '../lib/api/products';
import { MoySkladProduct } from '../types/types';
import { useCart } from '../lib/context/CartContext';
import { useFavorites } from '../lib/context/FavoritesContext';
import { Image, Info, ShoppingCart, Loader2, Heart as HeartIcon, BarChart3 as StatsIcon } from 'lucide-react';
import MainButton from '../components/ui/MainButton';
import { AddedToCartModal } from '../components/ProductCard/AddedToCartModal';
import { formatPrice } from '../lib/utils/currency';
import { useSettings } from '../lib/context/SettingsContext';

export const ProductPage: React.FC = () => {
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { settings } = useSettings();
  const [product, setProduct] = useState<MoySkladProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);
  const [isParametersOpen, setIsParametersOpen] = useState(true);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const productData = await getProductById(id);
        setProduct(productData);
      } catch (error) {
        console.error('Ошибка при загрузке товара:', error);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, 1);
      setIsCartModalOpen(true);
    }
  };

  const toggleFavorite = () => {
    if (product) {
      if (isFavorite(product.id)) {
        removeFromFavorites(product.id);
      } else {
        addToFavorites(product);
      }
    }
  };

  const currency = settings?.general?.currency || 'RUB';
  const priceInMainUnit = (product?.sale_price ?? 0) / 100;
  const formattedPrice = formatPrice(priceInMainUnit, currency);

  // Функция для извлечения данных из описания
  const extractFromDescription = (pattern: RegExp, fallback: string) => {
    return product?.description?.match(pattern)?.[1] || fallback;
  };

  if (isLoading) {
    return (
      <div className="container flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 text-blue animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container text-center py-20 min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Товар не найден</h2>
        <p className="text-gray-600 mb-6">Запрашиваемый товар не существует или был удален.</p>
        <Link to="/catalog">
          <MainButton>Вернуться в каталог</MainButton>
        </Link>
      </div>
    );
  }

  const isProductFavorite = isFavorite(product.id);

  return (
    <>
      <div className="container">
        <SectionWrapper title={product.name}>
          <Breadcrumbs />
          <div className="flex flex-col lg:flex-row gap-[40px]">
            {/* Image Gallery */}
            <div className="flex flex-col-reverse md:flex-row items-start gap-[20px] md:gap-[40px]">
              <div className="flex flex-row md:flex-col gap-[20px] md:gap-[40px]">
                <div className="w-[100px] h-[100px] md:w-[160px] md:h-[160px] border-2 border-blue rounded-[8px] p-1 flex-shrink-0">
                  <img
                    src={product.image_url}
                    alt="product thumbnail"
                    className="rounded-[8px] w-full h-full object-contain"
                  />
                </div>
                <div className="w-[100px] h-[100px] md:w-[160px] md:h-[160px] bg-skyblue flex items-center justify-center border-2 rounded-[8px] flex-shrink-0">
                  <Image className="text-gray-300" size={48} />
                </div>
                <div className="w-[100px] h-[100px] md:w-[160px] md:h-[160px] bg-skyblue flex items-center justify-center border-2 rounded-[8px] flex-shrink-0">
                  <Image className="text-gray-300" size={48} />
                </div>
              </div>
              <div className="w-full md:w-[460px] h-auto md:h-[560px] border-2 rounded-[8px] p-4 flex items-center justify-center">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="rounded-[8px] max-w-full max-h-full object-contain"
                />
              </div>
            </div>

            {/* Info Panel */}
            <div className="flex flex-col flex-1 justify-between">
              {/* Characteristics */}
              <div>
                <h2 className="text-gray-700 font-bold text-[18px]">Основные характеристики:</h2>
                <div className="mt-4 flex flex-col gap-3 text-sm">
                  <div className="flex items-center gap-4">
                    <span className="w-[180px] text-[#9F9F9F] text-[16px] font-bold">Размеры:</span>
                    <div className="border border-gray-300 text-gray-800 font-normal px-5 py-1 rounded-md">
                      {extractFromDescription(/Paзмеpы: (\d+\*\d+\*\d+ см)/, '335*84*15 см')}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="w-[180px] text-[#9F9F9F] text-[16px] font-bold">Длина в футах:</span>
                    <div className="border border-gray-300 text-gray-800 font-normal px-5 py-1 rounded-md">
                      {extractFromDescription(/Длина в футах \(ft\): (.*)/, "10'6\"")}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="w-[180px] text-[#9F9F9F] text-[16px] font-bold">Грузоподъемность:</span>
                    <div className="border border-gray-300 text-gray-800 font-normal px-5 py-1 rounded-md">
                      {extractFromDescription(/Гpузoподъёмнocть: (.*)/, 'до 160 кг')}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="w-[180px] text-[#9F9F9F] text-[16px] font-bold">Материал:</span>
                    <div className="border border-gray-300 text-gray-800 font-normal px-5 py-1 rounded-md">
                      {extractFromDescription(/Материал: (.*)/, '2 слоя, пвх')}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="w-[180px] text-[#9F9F9F] text-[16px] font-bold">Максимальное давление:</span>
                    <div className="bg-blue text-white font-normal px-5 py-1 rounded-md">
                      {extractFromDescription(/Макcимальнoе давлeниe: (.*)/, '15 psi')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Price and Actions */}
              <div className="mt-6 pt-6 bg-white shadow-lg rounded-md p-[20px]">
                <h3 className="text-gray font-bold text-[20px]">Стоимость:</h3>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-3xl font-bold text-gray-800">{formattedPrice}</p>
                </div>
                <div className="flex items-center gap-3 mt-6">
                  <MainButton className="w-full !py-3" variant="secondary" onClick={handleAddToCart}>
                    <ShoppingCart size={20} className="mr-2" />
                    Добавить в корзину
                  </MainButton>
                  <button
                    className="p-3 border border-gray-300 rounded-[8px] hover:bg-gray-100 transition-colors"
                    onClick={toggleFavorite}
                    aria-label={isProductFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
                  >
                    <HeartIcon
                      className={`transition-all ${isProductFavorite ? 'text-red-500' : 'text-gray-500'}`}
                      fill={isProductFavorite ? 'currentColor' : 'none'}
                    />
                  </button>
                  <button className="p-3 border border-gray-300 rounded-md hover:bg-gray-100">
                    <StatsIcon className="text-gray-500" />
                  </button>
                </div>
                <div className="mt-6">
                  <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                    <Info size={20} className="text-gray-400" />
                    <span>Информация о доставке</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Description and Parameters */}
          <div className="mt-12 flex flex-col gap-6">
            {/* Description */}
            <div className="border border-gray-200 rounded-lg bg-skyblue">
              <div
                className="p-4 flex justify-between items-center cursor-pointer"
                onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
              >
                <h3 className="text-lg font-semibold text-gray-800">Описание</h3>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`transition-transform duration-300 ${isDescriptionOpen ? '' : '-rotate-90'}`}
                >
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="#4B5563"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              {isDescriptionOpen && (
                <div className="p-4 pt-0 text-gray-700 leading-relaxed text-sm">
                  {product.description || 'Описание для этого товара отсутствует.'}
                </div>
              )}
            </div>

            {/* Parameters */}
            <div className="border bg-skyblue border-gray-200 rounded-lg">
              <div
                className="p-4 flex justify-between items-center cursor-pointer"
                onClick={() => setIsParametersOpen(!isParametersOpen)}
              >
                <h3 className="text-lg font-semibold text-gray-800">Параметры</h3>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`transition-transform duration-300 ${isParametersOpen ? '' : '-rotate-90'}`}
                >
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="#4B5563"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              {isParametersOpen && (
                <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 text-gray-700 text-sm">
                  {/* Дополнительные параметры можно добавить здесь */}
                </div>
              )}
            </div>
          </div>
        </SectionWrapper>
      </div>
      
      <AnimatePresence>
        {isCartModalOpen && (
          <AddedToCartModal 
            quant={1} 
            product={product} 
            isOpen={isCartModalOpen} 
            onClose={() => setIsCartModalOpen(false)} 
          />
        )}
      </AnimatePresence>
    </>
  );
};