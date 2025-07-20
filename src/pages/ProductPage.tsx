import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { HeartIcon, PlusIcon, MinusIcon, Loader2, BarChart3 as CompareIcon } from 'lucide-react';
import { useSettings } from '../lib/context/SettingsContext';
import { useCart } from '../lib/context/CartContext';
import { useFavorites } from '../lib/context/FavoritesContext';
import { Link, useParams } from 'react-router-dom';
import { AddedToCartModal } from '../components/ProductCard/AddedToCartModal';
import { getProductById } from '../lib/api/products';
import { MoySkladProduct } from '../types/types';
import { Breadcrumbs } from '../lib/utils/BreadCrumbs';

interface SpecDetailRowProps {
  label: string;
  value: string;
}

interface SpecBadgeProps {
  text: string;
  active?: boolean;
}

interface ParsedDescription {
  equipment: string[];
  specifications: Record<string, string>;
  warnings: string[];
}

const SpecBadge: React.FC<SpecBadgeProps> = ({ text, active = false }) => (
  <button
    className={`border rounded-full px-3 py-1 text-sm font-medium transition-colors ${
      active ? 'bg-gray text-white border-gray' : 'border-gray text-gray hover:bg-gray'
    }`}
  >
    {text}
  </button>
);

const SpecDetailRow: React.FC<SpecDetailRowProps> = ({ label, value }) => (
  <div className="flex justify-between items-baseline pt-3 pb-3 border-b borde-gray">
    <span className="text-gray">{label}</span>
    <span className="font-semibold text-gray text-right">{value}</span>
  </div>
);

const parseProductDescription = (description: string): ParsedDescription => {
  const result: ParsedDescription = {
    equipment: [],
    specifications: {},
    warnings: []
  };

  if (!description) {
    result.warnings.push('Описание товара отсутствует');
    return result;
  }

  try {
    const normalizedDesc = description
      .replace(/[‘’]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/\r\n/g, '\n')
      .trim();

    const sections = normalizedDesc.split(/\n\n+/);
    
    if (sections[0] && sections[0].includes('Комплектация:')) {
      result.equipment = sections[0]
        .split('\n')
        .slice(1)
        .map(item => item.replace(/^[•-]\s*/, '').trim())
        .filter(item => item.length > 0);
    } else {
      result.warnings.push('Не найдена секция комплектации');
    }
    
    if (sections[1]) {
      sections[1].split('\n').forEach(line => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return;

        const separatorIndex = trimmedLine.indexOf(':');
        if (separatorIndex > -1) {
          const key = trimmedLine.slice(0, separatorIndex).trim();
          const value = trimmedLine.slice(separatorIndex + 1).trim();
          
          if (key && value) {
            result.specifications[key] = value;
          } else {
            result.warnings.push(`Не удалось распознать характеристику: "${line}"`);
          }
        } else {
          result.warnings.push(`Строка не содержит разделитель ":": "${line}"`);
        }
      });
    }
  } catch (error) {
    console.error('Ошибка парсинга описания:', error);
    result.warnings.push('Произошла ошибка при обработке описания');
  }

  return result;
};

const DescriptionContent: React.FC<{ description: string }> = ({ description }) => {
  const parsedData = useMemo(() => parseProductDescription(description), [description]);

  return (
    <div className="space-y-6">
      {parsedData.warnings.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <h3 className="text-yellow-700 font-medium">Примечания:</h3>
          <ul className="list-disc pl-5 text-yellow-700">
            {parsedData.warnings.map((warning, i) => (
              <li key={i}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {parsedData.equipment.length > 0 && (
        <div className="equipment-section">
          <h3 className="text-lg font-semibold mb-3 border-b pb-2">Комплектация</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {parsedData.equipment.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="specifications-section">
        <h3 className="text-lg font-semibold mb-3 border-b pb-2">Характеристики</h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
          {Object.entries(parsedData.specifications).map(([key, value]) => (
            <div key={key} className="flex py-1">
              <dt className="text-gray-600 flex-1">{key}:</dt>
              <dd className="font-medium flex-1">{value || '—'}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

export const ProductPage: React.FC = () => {
  const { settings } = useSettings();
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<MoySkladProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('Параметры');
  const [showAddedToCart, setShowAddedToCart] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const productData = await getProductById(id);
        setProduct(productData);
      } catch (error) {
        console.error('Ошибка при загрузке товара:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      // console.log(product)
      addToCart(product, quantity);
      setShowAddedToCart(true);
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
    setShowAddedToCart(true);
  };

  const formatPrice = (price: number | null) => {
    if (price === null) return 'N/A';
    return `${price.toLocaleString('ru-RU')} Р.`;
  };

  const tabs = ['Параметры', 'Описание', 'Доставка и оплата'];
  const detailedSpecsLeft = [
    { label: 'Длина доски', value: '335 см' },
    { label: 'Ширина доски', value: '85 см' },
    { label: 'Толщина доски', value: '15 см' },
    { label: 'Гарантия', value: '12 мес' },
    { label: 'Максимальное давление', value: '25 psi' },
    { label: 'Комплектация', value: 'Весло, Насос, Плавник, Ремнабор, Сиденье, Сумка для хранения' },
    { label: 'Рекомендуемое кол-во пассажиров', value: '1 чел.' },
  ];
  
  const detailedSpecsRight = [
    { label: 'Максимальное кол-во пассажиров', value: '2 чел.' },
    { label: 'Общий вес', value: '15 кг.' },
    { label: 'Размер коробки', value: '28x39x89 см' },
    { label: 'Вес доски', value: product?.weight ? `${product.weight / 1000} кг.` : '12 кг.' },
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center min-h-[50vh]">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Товар не найден</h2>
        <p className="text-gray-600 mb-6">Извините, запрашиваемый товар не существует или был удален.</p>
        <Link to="/catalog">
          <Button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Вернуться в каталог
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      {id && <Breadcrumbs productId={id} />}

      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-4 lg:gap-[70px] mt-4 lg:mt-6">
        {/* Галерея изображений */}
        <div className="w-full lg:w-auto lg:flex-1 flex items-center justify-center">
          <div className="flex items-center justify-center rounded-xl p-4 w-full max-w-[500px] lg:max-w-none">
            {product.image_url && (
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="max-h-[300px] sm:max-h-[400px] lg:max-h-[500px] w-auto object-contain"
              />
            )}
          </div>
        </div>

        {/* Информация о товаре */}
        <div className="w-full lg:max-w-[550px] bg-white flex flex-col gap-3 sm:gap-5 shadow-lg rounded-2xl p-4 sm:p-6 lg:p-8 h-fit">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">{product.name}</h1>
          <h2 className="text-gray-500 font-medium text-sm sm:text-base">GQ</h2>

          <div className="space-y-2 sm:space-y-3 pt-1 sm:pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span className="font-semibold w-28 sm:w-40 text-gray-700 text-sm sm:text-base">Размер</span>
              <div className="flex gap-2">
                <SpecBadge text="10'0" active={true} />
                <SpecBadge text="10'6" />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span className="font-semibold w-28 sm:w-40 text-gray-700 text-sm sm:text-base">Вес доски</span>
              <SpecBadge text="8.9 кг" active={true} />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span className="font-semibold w-28 sm:w-40 text-gray-700 text-sm sm:text-base">Максимальное давление</span>
              <SpecBadge text="25 psi" active={true} />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span className="font-semibold w-28 sm:w-40 text-gray-700 text-sm sm:text-base">Грузоподъёмность</span>
              <SpecBadge text="150 кг" active={true} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-2 gap-4 sm:gap-0">
            <div className="flex items-baseline gap-3">
              <span className="font-bold text-2xl sm:text-3xl text-gray-900">
                {formatPrice(product.sale_price)}
              </span>
            </div>
            <div className="flex items-center w-full sm:w-auto">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="border border-r-0 border-gray-300 rounded-l-full p-2 sm:p-2.5 hover:bg-gray-100 transition-colors"
              >
                <MinusIcon className="w-4 h-4 text-gray-600" />
              </button>
              <span className="text-center font-medium border-t border-b border-gray-300 w-10 py-1.5">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="border border-l-0 border-gray-300 rounded-r-full p-2 sm:p-2.5 hover:bg-gray-100 transition-colors"
              >
                <PlusIcon className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 pt-2">
            <Button
              onClick={handleAddToCart}
              className="w-full sm:flex-grow bg-[#0D263D] text-white rounded-full px-6 py-5 sm:px-8 sm:py-7 text-base sm:text-lg font-semibold hover:bg-[#1a3a5a]"
            >
              В корзину
            </Button>
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                size="icon"
                className="bg-[#0D263D] text-white rounded-full w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 hover:bg-[#1a3a5a] hover:text-white"
                onClick={toggleFavorite}
              >
                <HeartIcon 
                  className="w-5 h-5 sm:w-6 sm:h-6" 
                  fill={product && isFavorite(product.id) ? 'red' : 'none'}
                  stroke={product && isFavorite(product.id) ? 'red' : 'currentColor'}
                />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="bg-[#0D263D] text-white rounded-full w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 hover:bg-[#1a3a5a] hover:text-white"
              >
                <CompareIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Секция табов */}
      <div className="mt-8 sm:mt-16">
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="-mb-px flex gap-4 sm:gap-8" aria-label="Tabs">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap py-3 sm:py-4 px-1 border-b-2 font-medium text-sm sm:text-base transition-colors ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="py-4 sm:py-8">
          <AnimatePresence mode="wait">
            {activeTab === 'Параметры' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 md:gap-x-24 gap-y-2">
                <div className="space-y-2">
                  {detailedSpecsLeft.map(spec => (
                    <SpecDetailRow key={spec.label} label={spec.label} value={spec.value} />
                  ))}
                </div>
                <div className="space-y-2">
                  {detailedSpecsRight.map(spec => (
                    <SpecDetailRow key={spec.label} label={spec.label} value={spec.value} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Описание' && (
              product.description ? (
                <DescriptionContent description={product.description} />
              ) : (
                <div className="prose max-w-none text-gray-600">
                  <p>Описание для этого товара отсутствует.</p>
                </div>
              )
            )}

            {activeTab === 'Доставка и оплата' && (
              <div className="text-gray-600">
                <p>Здесь будет подробная информация об условиях доставки и вариантах оплаты.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

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