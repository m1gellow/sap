import { ProductsGridLayout } from '../../components/ui/ProductsGridLayout';
import { SectionWrapper } from '../../components/ui/SectionWrapper';
import { NewProductCard } from '../../components/ProductCard/NewProductCard';
import { Product } from '../../types';

interface NewItemsSectionProps {
  products?: Product[];
  className?: string;
}

export const NewItemsSection = ({ products = [], className = '' }: NewItemsSectionProps) => {
  return (
    <SectionWrapper
      title="Новинки"
      className={className}
      aria-label="Секция новинок"
    >
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="flex justify-center">
              <NewProductCard 
                product={product} 
                className="w-full hover:shadow-lg transition-shadow duration-200"
              />
            </div>
          ))}
        </div>
      ) : (
        <ProductsGridLayout products={[]} />
      )}
    </SectionWrapper>
  );
};