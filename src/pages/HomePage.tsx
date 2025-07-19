import { lazy, Suspense } from 'react';
import { SupRentalSection } from '../sections/CategoriesSection';
import { MainContentSection } from '../sections/MainContentSection/MainContentSection';

import { NewItemsSectionSkeleton } from '../sections/NewItemsSection/NewItemsSectionSkeleton';

const NewItemsSection = lazy(() =>
  import('../sections/NewItemsSection/NewItemsSection').then((m) => ({ default: m.NewItemsSection })),
);
const StockSection = lazy(() =>
  import('../sections/StocksSection/StockSection').then((m) => ({ default: m.StockSection })),
);

export const HomePage: React.FC = () => {
  return (
    <main>
      <div className="container mx-auto mt-[50px] px-4 lg:px-6 2xl:px-0">
        <MainContentSection />
        <SupRentalSection />
        <Suspense fallback={<NewItemsSectionSkeleton />}>
          <NewItemsSection />
        </Suspense>

        <Suspense fallback={<div>Загрузка акций...</div>}> {/* Для StockSection тоже лучше сделать свой скелетон */}
          <StockSection />
        </Suspense>
      </div>
    </main>
  );
};