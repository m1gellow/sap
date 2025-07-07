import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { HeartIcon, XIcon } from 'lucide-react';
import { useCart } from '../lib/context/CartContext';
import { useFavorites } from '../lib/context/FavoritesContext';
import { Link } from 'react-router-dom';

// Временные данные для сравнения
const compareProducts = [
  {
    id: 101,
    name: 'AZTRON 9.0 Fiberglass Fin',
    brand: 'GQ',
    price: '14 000 P.',
    priceValue: 14000,
    image: '/1-201-11.png',
    specs: {
      manufacturer: 'GQ',
      length: '335 см',
      width: '85 см',
      thickness: '15 см',
      warranty: '12 мес',
      maxPressure: '25 psi',
      equipment: 'Весло, Насос, Плавник, Ремкомплект, Сиденье, Сумка для хранения',
      recommendedCapacity: '1 чел.',
      maxCapacity: '2 чел.',
      boxSize: '91*41*20',
    },
  },
  {
    id: 102,
    name: 'AZTRON 9.0 Fiberglass Fin',
    brand: 'GQ',
    price: '14 000 P.',
    priceValue: 14000,
    image: '/1-201-11.png',
    specs: {
      manufacturer: 'GQ',
      length: '335 см',
      width: '85 см',
      thickness: '15 см',
      warranty: '12 мес',
      maxPressure: '25 psi',
      equipment: 'Весло, Насос, Плавник, Ремкомплект, Сиденье, Сумка для хранения',
      recommendedCapacity: '1 чел.',
      maxCapacity: '2 чел.',
      boxSize: '91*41*20',
    },
  },
  {
    id: 103,
    name: 'AZTRON 9.0 Fiberglass Fin',
    brand: 'GQ',
    price: '14 000 P.',
    priceValue: 14000,
    image: '/1-201-11.png',
    specs: {
      manufacturer: 'GQ',
      length: '335 см',
      width: '85 см',
      thickness: '15 см',
      warranty: '12 мес',
      maxPressure: '25 psi',
      equipment: 'Весло, Насос, Плавник, Ремкомплект, Сиденье, Сумка для хранения',
      recommendedCapacity: '1 чел.',
      maxCapacity: '2 чел.',
      boxSize: '91*41*20',
    },
  },
  {
    id: 104,
    name: 'AZTRON 9.0 Fiberglass Fin',
    brand: 'GQ',
    price: '14 000 P.',
    priceValue: 14000,
    image: '/1-201-11.png',
    specs: {
      manufacturer: 'GQ',
      length: '335 см',
      width: '85 см',
      thickness: '15 см',
      warranty: '12 мес',
      maxPressure: '25 psi',
      equipment: 'Весло, Насос, Плавник, Ремкомплект, Сиденье, Сумка для хранения',
      recommendedCapacity: '1 чел.',
      maxCapacity: '2 чел.',
      boxSize: '91*41*20',
    },
  },
];

export const ComparePage = () => {
  const { addToCart } = useCart();
  const { addToFavorites, isFavorite, removeFromFavorites } = useFavorites();
  const [products, setProducts] = useState(compareProducts);
  const [activeTab, setActiveTab] = useState('all');

  const handleRemoveProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const toggleFavorite = (product) => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  // Функция для подсветки различий между товарами
  const isDifferent = (key) => {
    if (products.length <= 1) return false;

    const firstValue = products[0].specs[key];
    return products.some((product) => product.specs[key] !== firstValue);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Хлебные крошки */}
      <div className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-blue">
          Главная
        </Link>
        <span className="mx-2">›</span>
        <Link to="/catalog" className="hover:text-blue">
          Каталог
        </Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">Сравнение товаров</span>
      </div>

      <h1 className="text-2xl font-semibold text-gray-800 mb-8">Сравнение товаров</h1>

      {/* Карточки товаров */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {products.map((product) => (
          <motion.div
            key={product.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <button
              className="absolute top-2 right-2 p-1 rounded-full bg-white shadow-sm"
              onClick={() => handleRemoveProduct(product.id)}
            >
              <XIcon className="h-4 w-4 text-gray-400" />
            </button>

            <div className="p-4 flex flex-col items-center">
              <div className="relative w-full flex justify-center mb-3">
                <img src={product.image} alt={product.name} className="h-40 object-contain" />
                <button
                  className="absolute top-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm"
                  onClick={() => toggleFavorite(product)}
                >
                  <HeartIcon
                    className={`h-5 w-5 ${isFavorite(product.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
                  />
                </button>
              </div>

              <h3 className="font-medium text-gray-800 text-center mb-2">{product.name}</h3>

              <p className="font-bold text-xl text-center mb-4">{product.price}</p>

              <div className="flex flex-col w-full gap-2">
                <Button className="bg-gray-800 text-white rounded-full py-2" onClick={() => handleAddToCart(product)}>
                  В корзину
                </Button>

                <Button
                  variant="outline"
                  className="border-gray-300 rounded-full py-2"
                  onClick={() => handleRemoveProduct(product.id)}
                >
                  Удалить
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Табы для параметров и различий */}
      <div className="mb-4">
        <div className="flex border-b">
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'all' ? 'text-blue border-b-2 border-blue' : 'text-gray-600 hover:text-blue'
            }`}
            onClick={() => setActiveTab('all')}
          >
            Все параметры
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'differences' ? 'text-blue border-b-2 border-blue' : 'text-gray-600 hover:text-blue'
            }`}
            onClick={() => setActiveTab('differences')}
          >
            Различия
          </button>
        </div>
      </div>

      {/* Таблица сравнения */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <tbody>
            {/* Производитель */}
            {(activeTab === 'all' || (activeTab === 'differences' && isDifferent('manufacturer'))) && (
              <tr className={`${isDifferent('manufacturer') ? 'bg-blue-50' : ''}`}>
                <td className="py-3 px-4 border-b border-gray-100 font-medium w-1/4">Производитель</td>
                {products.map((product) => (
                  <td key={product.id} className="py-3 px-4 border-b border-gray-100 text-center">
                    <span className={`${isDifferent('manufacturer') ? 'text-blue font-medium' : ''}`}>
                      {product.specs.manufacturer}
                    </span>
                  </td>
                ))}
              </tr>
            )}

            {/* Длина доски */}
            {(activeTab === 'all' || (activeTab === 'differences' && isDifferent('length'))) && (
              <tr className={`${isDifferent('length') ? 'bg-blue-50' : ''}`}>
                <td className="py-3 px-4 border-b border-gray-100 font-medium">Длина доски</td>
                {products.map((product) => (
                  <td key={product.id} className="py-3 px-4 border-b border-gray-100 text-center">
                    <span className={`${isDifferent('length') ? 'text-blue font-medium' : ''}`}>
                      {product.specs.length}
                    </span>
                  </td>
                ))}
              </tr>
            )}

            {/* Ширина доски */}
            {(activeTab === 'all' || (activeTab === 'differences' && isDifferent('width'))) && (
              <tr className={`${isDifferent('width') ? 'bg-blue-50' : ''}`}>
                <td className="py-3 px-4 border-b border-gray-100 font-medium">Ширина доски</td>
                {products.map((product) => (
                  <td key={product.id} className="py-3 px-4 border-b border-gray-100 text-center">
                    <span className={`${isDifferent('width') ? 'text-blue font-medium' : ''}`}>
                      {product.specs.width}
                    </span>
                  </td>
                ))}
              </tr>
            )}

            {/* Толщина доски */}
            {(activeTab === 'all' || (activeTab === 'differences' && isDifferent('thickness'))) && (
              <tr className={`${isDifferent('thickness') ? 'bg-blue-50' : ''}`}>
                <td className="py-3 px-4 border-b border-gray-100 font-medium">Толщина доски</td>
                {products.map((product) => (
                  <td key={product.id} className="py-3 px-4 border-b border-gray-100 text-center">
                    <span className={`${isDifferent('thickness') ? 'text-blue font-medium' : ''}`}>
                      {product.specs.thickness}
                    </span>
                  </td>
                ))}
              </tr>
            )}

            {/* Гарантия */}
            {(activeTab === 'all' || (activeTab === 'differences' && isDifferent('warranty'))) && (
              <tr className={`${isDifferent('warranty') ? 'bg-blue-50' : ''}`}>
                <td className="py-3 px-4 border-b border-gray-100 font-medium">Гарантия</td>
                {products.map((product) => (
                  <td key={product.id} className="py-3 px-4 border-b border-gray-100 text-center">
                    <span className={`${isDifferent('warranty') ? 'text-blue font-medium' : ''}`}>
                      {product.specs.warranty}
                    </span>
                  </td>
                ))}
              </tr>
            )}

            {/* Максимальное давление */}
            {(activeTab === 'all' || (activeTab === 'differences' && isDifferent('maxPressure'))) && (
              <tr className={`${isDifferent('maxPressure') ? 'bg-blue-50' : ''}`}>
                <td className="py-3 px-4 border-b border-gray-100 font-medium">Максимальное давление</td>
                {products.map((product) => (
                  <td key={product.id} className="py-3 px-4 border-b border-gray-100 text-center">
                    <span className={`${isDifferent('maxPressure') ? 'text-blue font-medium' : ''}`}>
                      {product.specs.maxPressure}
                    </span>
                  </td>
                ))}
              </tr>
            )}

            {/* Комплектация */}
            {(activeTab === 'all' || (activeTab === 'differences' && isDifferent('equipment'))) && (
              <tr className={`${isDifferent('equipment') ? 'bg-blue-50' : ''}`}>
                <td className="py-3 px-4 border-b border-gray-100 font-medium">Комплектация</td>
                {products.map((product) => (
                  <td key={product.id} className="py-3 px-4 border-b border-gray-100 text-center">
                    <span className={`${isDifferent('equipment') ? 'text-blue font-medium' : ''}`}>
                      {product.specs.equipment}
                    </span>
                  </td>
                ))}
              </tr>
            )}

            {/* Рекомендуемое кол-во пассажиров */}
            {(activeTab === 'all' || (activeTab === 'differences' && isDifferent('recommendedCapacity'))) && (
              <tr className={`${isDifferent('recommendedCapacity') ? 'bg-blue-50' : ''}`}>
                <td className="py-3 px-4 border-b border-gray-100 font-medium">Рекомендуемое кол-во пассажиров</td>
                {products.map((product) => (
                  <td key={product.id} className="py-3 px-4 border-b border-gray-100 text-center">
                    <span className={`${isDifferent('recommendedCapacity') ? 'text-blue font-medium' : ''}`}>
                      {product.specs.recommendedCapacity}
                    </span>
                  </td>
                ))}
              </tr>
            )}

            {/* Максимальное кол-во пассажиров */}
            {(activeTab === 'all' || (activeTab === 'differences' && isDifferent('maxCapacity'))) && (
              <tr className={`${isDifferent('maxCapacity') ? 'bg-blue' : ''}`}>
                <td className="py-3 px-4 border-b border-gray-100 font-medium">Максимальное кол-во пассажиров</td>
                {products.map((product) => (
                  <td key={product.id} className="py-3 px-4 border-b border-gray-100 text-center">
                    <span className={`${isDifferent('maxCapacity') ? 'text-blue font-medium' : ''}`}>
                      {product.specs.maxCapacity}
                    </span>
                  </td>
                ))}
              </tr>
            )}

            {/* Размер коробки */}
            {(activeTab === 'all' || (activeTab === 'differences' && isDifferent('boxSize'))) && (
              <tr className={`${isDifferent('boxSize') ? 'bg-blue-50' : ''}`}>
                <td className="py-3 px-4 border-b border-gray-100 font-medium">Размер коробки, см</td>
                {products.map((product) => (
                  <td key={product.id} className="py-3 px-4 border-b border-gray-100 text-center">
                    <span className={`${isDifferent('boxSize') ? 'text-blue font-medium' : ''}`}>
                      {product.specs.boxSize}
                    </span>
                  </td>
                ))}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
