import { useQuery } from '@tanstack/react-query';
import { ProductsGridLayout } from '../../components/ui/ProductsGridLayout';
import { SectionWrapper } from '../../components/ui/SectionWrapper';
import { getNewProducts } from '../../lib/api/products';


export const NewItemsSection = () => {
    const { data: newProducts, isLoading, isError } = useQuery({
        queryKey: ['newProducts'],
        queryFn: getNewProducts,
        staleTime: 1000 * 60 * 10,
    });
  

  return (
    <SectionWrapper title="Новинки" aria-label="Секция новинок">
        <ProductsGridLayout products={newProducts} isLoading={isLoading}/>
    </SectionWrapper>
  );
};
