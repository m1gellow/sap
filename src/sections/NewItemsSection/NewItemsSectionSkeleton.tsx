import { ProductsGridLayout } from '../../components/ui/ProductsGridLayout';
import { SectionWrapper } from '../../components/ui/SectionWrapper';

export const NewItemsSectionSkeleton = () => {
  return (
    <SectionWrapper title="Новинки" aria-label="Загрузка секции новинок">
      <ProductsGridLayout isLoading={true} />
    </SectionWrapper>
  );
};