import { ProductCardSkeleton } from '../ProductCard/ProductCardSkeleton';

interface ProductGridSkeletonProps {
  count?: number; // Можем сделать количество скелетонов настраиваемым
}

export const ProductGridSkeleton = ({ count = 8 }: ProductGridSkeletonProps) => (
  <section className="mt-8 mb-12">

    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6 animate-pulse"></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex justify-center">
          <ProductCardSkeleton />
        </div>
      ))}
    </div>
  </section>
);