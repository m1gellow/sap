import React, { useState, useMemo } from 'react';
import { useFilters } from '../lib/context/FilterContext';
import { FilterSideBar } from '../components/FilterSideBar/FilterSideBar';
import { SectionWrapper } from '../components/ui/SectionWrapper';
import { SlidersHorizontal, Search, X } from 'lucide-react';

import { Breadcrumbs } from '../lib/utils/BreadCrumbs';
import { CategoriesList } from '../components/Categories/CategoriesList';
import { MoySkladProduct } from '../types/types';
import { EmptyCategoryMessage } from '../components/ui/EmptyCategoryMessage';
import { useQuery } from '@tanstack/react-query';
import { getAllProducts } from '../lib/api/products';
import { ProductCard } from '../components/ProductCard/ProductCard';
import { ProductGridSkeleton } from '../components/ProductCard/ProductGridSkeletonGrid';

const ProductGrid = ({ title, products }: { title: string; products: MoySkladProduct[] }) => (
  <section className="mt-8 mb-12">
    <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.id} className="flex justify-center">
          <ProductCard product={product} className="w-full hover:shadow-lg transition-shadow duration-200" />
        </div>
      ))}
    </div>
  </section>
);

export const CatalogPage: React.FC = () => {
  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['products'],
    queryFn: getAllProducts,
    staleTime: 1000 * 60 * 5,
  });
  const { filters, toggleBrandFilter, setActiveCategory, setPriceRange, resetFilters } = useFilters();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'default'>('default');
  const [showFilter, setShowFilter] = useState(false);

  const displayProducts = useMemo(() => {
    let filtered = [...products];

    if (filters.activeCategory) {
      filtered = filtered.filter((p) => p.path_name?.includes(filters.activeCategory));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (p) => p.name.toLowerCase().includes(query) || (p.article && p.article.toLowerCase().includes(query)),
      );
    }

    const checkedBrands = filters.brands.filter((b) => b.checked).map((b) => b.name);
    if (checkedBrands.length > 0) {
      filtered = filtered.filter((p) => checkedBrands.includes(p.brand));
    }

    filtered = filtered.filter(
      (p) => (p.sale_price ?? 0) >= filters.priceRange[0] && (p.sale_price ?? 0) <= filters.priceRange[1],
    );

    if (sortOrder !== 'default') {
      filtered.sort((a, b) => {
        const priceA = a.sale_price || 0;
        const priceB = b.sale_price || 0;
        return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
      });
    }
    return filtered;
  }, [products, filters, searchQuery, sortOrder]);

  // 4. ОБРАБОТЧИКИ СОБЫТИЙ
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value);
  const clearSearch = () => setSearchQuery('');
  const toggleSortOrder = () =>
    setSortOrder((prev) => (prev === 'default' ? 'asc' : prev === 'asc' ? 'desc' : 'default'));
  const resetAllFilters = () => {
    resetFilters();
    setSearchQuery('');
    setSortOrder('default');
  };

  const isAnyFilterActive =
    filters.activeCategory || searchQuery || sortOrder !== 'default' || filters.brands.some((b) => b.checked);

  if (isError) {
    return (
      <div className="text-center text-red-500 py-10">Ошибка при загрузке товаров. Пожалуйста, попробуйте позже.</div>
    );
  }

  const showNoResults = displayProducts.length === 0;

  return (
    <SectionWrapper title="Каталог" className="px-4 lg:px-8">
      <Breadcrumbs />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        {/* Блок управления фильтрами и поиском */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button className="..." onClick={() => setShowFilter(!showFilter)}>
            <SlidersHorizontal size={18} color="#003153" /> Фильтры
          </button>
          <div className="relative flex-grow ...">
            <Search className="absolute ..." size={18} />
            <input type="text" value={searchQuery} onChange={handleSearch} className="w-full ..." />
            {searchQuery && (
              <button onClick={clearSearch} className="absolute ...">
                <X size={18} />
              </button>
            )}
          </div>
        </div>
        {/* Блок управления сортировкой и сбросом */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button onClick={toggleSortOrder} className="...">
            {sortOrder === 'asc' && 'По возрастанию цены'}
            {sortOrder === 'desc' && 'По убыванию цены'}
            {sortOrder === 'default' && 'Сортировка'}
          </button>
          {isAnyFilterActive && (
            <button onClick={resetAllFilters} className="...">
              Сбросить все
            </button>
          )}
        </div>
      </div>

      <CategoriesList filters={filters} setActiveCategory={setActiveCategory} />

      <div className="flex flex-col lg:flex-row gap-8 mt-4">
        {showFilter && (
          <div className="lg:sticky lg:top-4 lg:self-start z-10">
            <FilterSideBar
              {...{
                filters,
                toggleBrandFilter,
                setPriceRange,
                resetFilters,
                getFilteredPrice: (isMin) =>
                  isMin ? filters.priceRange[0].toString() : filters.priceRange[1].toString(),
                toggleShowFilter: setShowFilter,
              }}
            />
          </div>
        )}

        <div className="flex-1">
          {isLoading ? (
            <ProductGridSkeleton />
          ) : showNoResults ? (
            <>
              <EmptyCategoryMessage resetAllFilters={resetAllFilters} />
              <ProductGrid title="Возможно, вас заинтересует" products={products.slice(0, 8)} />
            </>
          ) : (
            <ProductGrid title="Результаты" products={displayProducts} />
          )}
        </div>
      </div>
    </SectionWrapper>
  );
};
