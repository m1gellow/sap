import React from 'react';
import { useFavorites } from '../lib/context/FavoritesContext';
import { SectionWrapper } from '../components/ui/SectionWrapper';
import { Heart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Breadcrumbs } from '../lib/utils/BreadCrumbs';
import { ProductCard } from '../components/ProductCard/ProductCard';


export const FavoritesPage: React.FC = () => {
  const { favorites } = useFavorites();

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
      <Breadcrumbs />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favorites.map((product) => (
          <ProductCard product={product} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Link to="/catalog">
          <Button variant="outline" className="border-blue flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Вернуться в каталог
          </Button>
        </Link>
      </div>
    </SectionWrapper>
  );
};
