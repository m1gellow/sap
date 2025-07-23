import { useMemo } from 'react';
import { ProductCard } from '../ProductCard/ProductCard';
import { ProductCardSkeleton } from '../ProductCard/ProductCardSkeleton';
import { MoySkladProduct } from '../../types/types';

interface ProductsGridLayoutProps {
  products?: MoySkladProduct[];
  className?: string;
  isLoading?: boolean;
}

export const ProductsGridLayout = ({ products = [], className = '', isLoading }: ProductsGridLayoutProps) => {
  const [firstFourProducts, fifthProduct] = useMemo(() => {
    return [products.slice(0, 4), products[4]];
  }, [products]);

  if (isLoading) {
    return (
      <div className={`px-4 lg:px-8 ${className}`}>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-6 md:gap-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-[40px] w-full">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="h-full flex justify-center">
                <ProductCardSkeleton />
              </div>
            ))}
          </div>
          <div className="h-full flex">
            <ProductCardSkeleton isLarge />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`px-4 lg:px-8 ${className}`}>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-6 md:gap-8 max-w-7xl mx-auto">
        {/* Первые 4 карточки */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 w-full">
          {firstFourProducts.map((product) => (
            <div key={product.id} className="h-full flex justify-center">
              <ProductCard product={product} className="h-full w-full max-w-[260px] sm:max-w-none" />
            </div>
          ))}
        </div>
        {/* Пятая карточка */}
        <div className="h-full flex">
          {fifthProduct && (
            <ProductCard product={fifthProduct} isLarge className="h-full w-full max-w-[320px] md:max-w-none" />
          )}
        </div>
      </div>
    </div>
  );
};