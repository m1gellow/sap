import React from 'react';
import { useFavorites } from '../lib/context/FavoritesContext';
import { useCart } from '../lib/context/CartContext';
import { SectionWrapper } from '../components/ui/SectionWrapper';
import { ChevronRight, SlidersHorizontal, Heart, ShoppingCart, ArrowLeft, Frown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Product } from '../lib/types';

export const FavoritesPage: React.FC = () => {
  const { favorites, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();

  if (favorites.length === 0) {
    return (
      <SectionWrapper title="Избранное" className="px-4 lg:px-8">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Heart className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ваш список избранного пуст</h2>
          <p className="text-gray-600 mb-8 max-w-md">
            Добавляйте понравившиеся товары в избранное, чтобы не потерять их
          </p>
          <Link to="/catalog">
            <Button className="bg-blue text-white flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Вернуться в каталог
            </Button>
          </Link>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper title="Избранное" className="px-4 lg:px-8">
      {/* Хлебные крошки */}
      <nav className="flex items-center text-sm text-gray-500 mb-8">
        <Link to="/" className="transition-colors">
          Главная
        </Link>
        <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
        <span className="text-gray-700 font-medium">Избранное</span>
      </nav>

      {/* Основное содержимое */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favorites.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-4">
              <div className="relative h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="max-h-full max-w-full object-contain p-4"
                />
                <button
                  onClick={() => removeFromFavorites(product.id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                >
                  <Heart className="w-5 h-5 text-red-500" fill="currentColor" />
                </button>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
              <p className="text-lg font-bold text-gray-800 mb-4">{product.price}</p>

              <Button
                className="w-full bg-blue text-white flex items-center justify-center gap-2"
                onClick={() => addToCart(product)}
              >
                <ShoppingCart className="w-4 h-4" />
                В корзину
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Link to="/catalog">
          <Button
            variant="outline"
            className="border-blue flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Вернуться в каталог
          </Button>
        </Link>
      </div>
    </SectionWrapper>
  );
};