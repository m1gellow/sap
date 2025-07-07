import React, { useState, useEffect } from 'react';
import { useFilters } from '../lib/context/FilterContext';
import { getAllProducts, getProductsByCategory } from '../lib/api/products';
import { Product } from '../lib/types';
import { FilterSideBar } from '../components/FilterSideBar/FilterSideBar';
import { SectionWrapper } from '../components/ui/SectionWrapper';
import cn from 'classnames';
import { ChevronRight, SlidersHorizontal, Search, X, Frown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NewProductCard } from '../components/ProductCard/NewProductCard';

export const CatalogPage: React.FC = () => {
  const { filters, toggleBrandFilter, setActiveCategory, setPriceRange, resetFilters } = useFilters();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'default'>('default');
  const [showFilter, setShowFilter] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);

  // Загрузка всех товаров
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const products = await getAllProducts();
        // Фильтруем только товары в наличии
        const inStockProducts = products.filter(product => product.inStock);
        
        setAllProducts(inStockProducts);
        setPopularProducts(inStockProducts.slice(0, 6));
        setNewProducts(inStockProducts.slice(6, 10));
        setIsLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Загружаем товары для текущей категории
  useEffect(() => {
    if (filters.activeCategory) {
      const fetchCategoryProducts = async () => {
        setIsLoading(true);
        try {
          const products = await getProductsByCategory(filters.activeCategory);
          // Фильтруем только товары в наличии
          const inStockProducts = products.filter(product => product.inStock);
          setCategoryProducts(inStockProducts);
        } catch (error) {
          console.error(`Ошибка при загрузке товаров категории ${filters.activeCategory}:`, error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchCategoryProducts();
    } else {
      setCategoryProducts([]);
    }
  }, [filters.activeCategory]);

  // Фильтрация и сортировка товаров
  useEffect(() => {
    const applyFilters = () => {
      let filtered = filters.activeCategory ? [...categoryProducts] : [...allProducts];

      // Дополнительная проверка на случай, если товар не в наличии попал в список
      filtered = filtered.filter(product => product.inStock);

      // Фильтр по брендам
      if (filters.brands.some((b) => b.checked)) {
        filtered = filtered.filter((product) => filters.brands.find((b) => b.name === product.brand)?.checked);
      }

      // Фильтр по цене
      filtered = filtered.filter(
        (product) => product.priceValue >= filters.priceRange[0] && product.priceValue <= filters.priceRange[1],
      );

      // Поиск
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (product) =>
            product.name.toLowerCase().includes(query) ||
            product.brand.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query),
        );
      }

      // Сортировка
      if (sortOrder === 'asc') {
        filtered.sort((a, b) => a.priceValue - b.priceValue);
      } else if (sortOrder === 'desc') {
        filtered.sort((a, b) => b.priceValue - a.priceValue);
      }

      return filtered;
    };

    setFilteredProducts(applyFilters());
  }, [filters, searchQuery, sortOrder, allProducts, categoryProducts]);

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

  // Рендер секции товаров
  const renderProductsSection = (title: string, products: Product[]) => {
    if (products.length === 0) return null;

    return (
      <section className="mb-12">
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
  };

  // Рендер рекомендуемых товаров
  const renderRecommendedProducts = () => {
    if (allProducts.length === 0) return null;

    return (
      <section className="mt-8 mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Рекомендуемые товары</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allProducts.slice(0, 8).map((product) => (
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

  // Сообщение о пустой категории
  const renderEmptyCategoryMessage = () => {
    return (
      <div className="py-12 text-center bg-gray-50 rounded-lg">
        <div className="flex justify-center mb-4">
          <Frown size={48} className="text-gray-400" />
        </div>
        <h3 className="text-xl font-medium text-gray-600 mb-2">
          В этой категории пока нет товаров в наличии
        </h3>
        <p className="text-gray-500 mb-6">
          Попробуйте выбрать другую категорию или изменить параметры фильтров
        </p>
        <button
          onClick={resetAllFilters}
          className="px-6 py-2 bg-blue text-white rounded-lg hover:bg-blue transition-colors"
        >
          Сбросить фильтры
        </button>
      </div>
    );
  };

  return (
    <SectionWrapper title="Каталог" className="px-4 lg:px-8">
      {/* Хлебные крошки */}
      <nav className="flex items-center text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-blue transition-colors">
          Главная
        </Link>
        <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
        <span className="text-gray-700 font-medium">Каталог</span>
      </nav>

      {/* Панель управления */}
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

      {/* Категории */}
      <div className="flex flex-wrap gap-2 mb-8">
        {filters.categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={cn(
              'px-4 py-2 rounded-lg font-medium transition-colors',
              category === filters.activeCategory
                ? 'bg-blue text-white hover:bg-blue'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Основное содержимое */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Фильтры */}
        {showFilter && (
          <div className="lg:sticky lg:top-4 lg:self-start lg:z-0 z-50">
            <FilterSideBar
              filters={filters}
              toggleBrandFilter={toggleBrandFilter}
              setPriceRange={setPriceRange}
              resetFilters={resetFilters}
              getFilteredPrice={(isMin) => isMin ? filters.priceRange[0].toString() : filters.priceRange[1].toString()}
              toggleShowFilter={setShowFilter}
            />
          </div>
        )}

        {/* Товары */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue"></div>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Популярные товары */}
              {!filters.activeCategory && !searchQuery && renderProductsSection('Популярные товары', popularProducts)}

              {/* Товары категории */}
              {filters.activeCategory && !searchQuery && (
                categoryProducts.length > 0 ? (
                  renderProductsSection(filters.activeCategory, categoryProducts)
                ) : (
                  <>
                    {renderEmptyCategoryMessage()}
                    {renderRecommendedProducts()}
                  </>
                )
              )}

              {/* Результаты поиска */}
              {searchQuery && (
                filteredProducts.length > 0 ? (
                  renderProductsSection('Результаты поиска', filteredProducts)
                ) : (
                  <>
                    <div className="py-12 text-center bg-gray-50 rounded-lg">
                      <div className="flex justify-center mb-4">
                        <Frown size={48} className="text-gray-400" />
                      </div>
                      <h3 className="text-xl font-medium text-gray-600 mb-2">
                        По вашему запросу ничего не найдено
                      </h3>
                      <p className="text-gray-500 mb-6">
                        Попробуйте изменить параметры поиска или сбросить фильтры
                      </p>
                      <button
                        onClick={resetAllFilters}
                        className="px-6 py-2 bg-blue text-white rounded-lg transition-colors"
                      >
                        Сбросить фильтры
                      </button>
                    </div>
                    {renderRecommendedProducts()}
                  </>
                )
              )}

              {/* Новые поступления */}
              {!filters.activeCategory && !searchQuery && renderProductsSection('Новые поступления', newProducts)}
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
};