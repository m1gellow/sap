import { ProductsGridLayout } from '../../components/ui/ProductsGridLayout';
import { SectionWrapper } from '../../components/ui/SectionWrapper';
import { Product } from '../../types/types';

interface NewItemsSectionProps {
  newProducts?: Product[];
  className?: string;
}

export const NewItemsSection = ({ newProducts = [], className = '' }: NewItemsSectionProps) => {
  
  console.log(newProducts)
  return (
    <SectionWrapper title="Новинки" className={className} aria-label="Секция новинок">
        <ProductsGridLayout products={newProducts} />
    </SectionWrapper>
  );
};
