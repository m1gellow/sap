
import React, { useState, useEffect } from 'react';
import { useFilters } from '../lib/context/FilterContext';
// import { getProductsByCategory } from '../lib/api/products';
import { FilterSideBar } from '../components/FilterSideBar/FilterSideBar';
import { SectionWrapper } from '../components/ui/SectionWrapper';
import { SlidersHorizontal, Search, X, Frown } from 'lucide-react';
import { NewProductCard } from '../components/ProductCard/NewProductCard';
import { supabase } from '../lib/supabase';
import { Breadcrumbs } from '../lib/utils/BreadCrumbs';

import { CategoriesList } from '../components/Categories/CategoriesList';
import { MoySkladProduct } from '../types/types';
import { EmptyCategoryMessage } from '../components/ui/EmptyCategoryMessage';


export const CatalogPage: React.FC = () => {
  const { filters, toggleBrandFilter, setActiveCategory, setPriceRange, resetFilters } = useFilters();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'default'>('default');
  const [showFilter, setShowFilter] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<MoySkladProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allProducts, setAllProducts] = useState<MoySkladProduct[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<MoySkladProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const { data: products, error } = await supabase
          .from('moysklad_products' as never)
          .select('*')
          .limit(10)
          .order('updated', { ascending: false });

        if (error) throw error;

        console.log('Products from Supabase:', products);
        setAllProducts(products || []);
        setIsLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Фильтрация товаров по категориям (если нужно)
  useEffect(() => {
    if (filters.activeCategory) {
      const filtered = allProducts.filter(product => 
        product.path_name?.includes(filters.activeCategory || '')
      );
      setCategoryProducts(filtered);
    } else {
      setCategoryProducts(allProducts);
    }
  }, [filters.activeCategory, allProducts]);

  // Фильтрация по поисковому запросу
  useEffect(() => {
    if (searchQuery) {
      const filtered = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.article && product.article.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, allProducts]);

  // Сортировка товаров
  const sortedProducts = React.useMemo(() => {
    if (sortOrder === 'default') return categoryProducts;
    
    return [...categoryProducts].sort((a, b) => {
      const priceA = a.sale_price || 0;
      const priceB = b.sale_price || 0;
      return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
    });
  }, [categoryProducts, sortOrder]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => {
      if (prev === 'default') return 'asc';
      if (prev === 'asc') return 'desc';
      return 'default';
    });
  };

  const resetAllFilters = () => {
    resetFilters();
    setSearchQuery('');
    setSortOrder('default');
  };

  const renderProductsSection = (title: string, products: MoySkladProduct[]) => (
    <section className="mt-8 mb-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>
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
    </section>
  );

  const renderRecommendedProducts = () => (
    <RenderProducts products={allProducts.slice(0, 20)} />
  );

  return (
    <SectionWrapper title="Каталог" className="px-4 lg:px-8">
      <Breadcrumbs />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button
            className="flex items-center font-semibold gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            onClick={() => setShowFilter(!showFilter)}
          >
            <SlidersHorizontal size={18} color="#003153" />
            Фильтры
          </button>

          <div className="relative flex-grow md:flex-grow-0 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Поиск товаров..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <button
            onClick={toggleSortOrder}
            className="px-4 py-2 bg-gray-100 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-200 transition-colors"
          >
            {sortOrder === 'asc' && 'По возрастанию цены'}
            {sortOrder === 'desc' && 'По убыванию цены'}
            {sortOrder === 'default' && 'Сортировка'}
          </button>

          {(filters.activeCategory ||
            searchQuery ||
            sortOrder !== 'default' ||
            filters.brands.some((b) => !b.checked)) && (
            <button
              onClick={resetAllFilters}
              className="px-4 py-2 text-blue font-medium hover:bg-skyblue rounded-lg transition-colors"
            >
              Сбросить все
            </button>
          )}
        </div>
      </div>

      <CategoriesList filters={filters} setActiveCategory={setActiveCategory}/>

      <div className="flex flex-col lg:flex-row gap-8">
        {showFilter && (
          <div className="lg:sticky lg:top-4 lg:self-start lg:z-0 z-50">
            <FilterSideBar
              filters={filters}
              toggleBrandFilter={toggleBrandFilter}
              setPriceRange={setPriceRange}
              resetFilters={resetFilters}
              getFilteredPrice={(isMin) =>
                isMin ? filters.priceRange[0].toString() : filters.priceRange[1].toString()
              }
              toggleShowFilter={setShowFilter}
            />
          </div>
        )}

        <div className="flex-1">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue"></div>
            </div>
          ) : (
            <div className="space-y-12">
              {filters.activeCategory &&
                !searchQuery &&
                (sortedProducts.length > 0 ? (
                  renderProductsSection(filters.activeCategory, sortedProducts)
                ) : (
                  <>
                    <EmptyCategoryMessage resetAllFilters={resetAllFilters}/>
                    {renderRecommendedProducts()}
                  </>
                ))}

              {searchQuery &&
                (filteredProducts.length > 0 ? (
                  renderProductsSection('Результаты поиска', filteredProducts)
                ) : (
                  <>
                    <div className="py-12 text-center bg-gray-50 rounded-lg">
                      <div className="flex justify-center mb-4">
                        <Frown size={48} className="text-gray-400" />
                      </div>
                      <h3 className="text-xl font-medium text-gray-600 mb-2">По вашему запросу ничего не найдено</h3>
                      <p className="text-gray-500 mb-6">Попробуйте изменить параметры поиска или сбросить фильтры</p>
                      <button
                        onClick={resetAllFilters}
                        className="px-6 py-2 bg-blue text-white rounded-lg transition-colors"
                      >
                        Сбросить фильтры
                      </button>
                    </div>
                    {renderRecommendedProducts()}
                  </>
                ))}
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
};

const RenderProducts = ({products}: {products: MoySkladProduct[]}) => {
  return (
    <section className="mt-8 mb-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Рекомендуемые товары</h2>
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
    </section>
  );
};