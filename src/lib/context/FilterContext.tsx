import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrandFilter, FilterState, PriceRange } from '../types';
import { supabase } from '../supabase';

interface FilterContextType {
  filters: FilterState;
  toggleBrandFilter: (brandName: string) => void;
  setPriceRange: (range: PriceRange) => void;
  toggleFiltersVisibility: () => void;
  setActiveCategory: (category: string) => void;
  resetFilters: () => void;
  getFilteredPrice: (min: boolean) => string;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<FilterState>({
    brands: [],
    priceRange: [1200, 40000],
    categories: [],
    showFilters: false,
    activeCategory: '',
  });

  // Загружаем бренды и категории из базы данных при инициализации
  useEffect(() => {
    const loadFiltersData = async () => {
      try {
        // Загружаем категории
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('name')
          .eq('active', true)
          .order('name');

        if (categoriesError) throw categoriesError;

        // Получаем уникальные бренды из таблицы товаров
        const { data: brandsData, error: brandsError } = await supabase.from('products').select('brand').order('brand');

        if (brandsError) throw brandsError;

        // Извлекаем уникальные значения брендов
        const uniqueBrands = Array.from(new Set(brandsData.map((item) => item.brand)));

        // Обновляем состояние фильтров
        setFilters((prev) => {
          const categories = categoriesData.map((category) => category.name);
          return {
            ...prev,
            categories,
            brands: uniqueBrands.map((brand) => ({
              name: brand,
              checked: true, // По умолчанию все бренды выбраны
            })),
            activeCategory: categories.length > 0 ? categories[0] : '',
          };
        });
      } catch (error) {
        console.error('Ошибка при загрузке данных фильтров:', error);
        // В случае ошибки используем дефолтные значения
        setFilters((prev) => ({
          ...prev,
          categories: ['Sup доски для йоги', 'Универсальные', 'Надувные', 'Sup с веслом', 'Sup для двоих'],
          brands: [
            { name: 'GQ', checked: true },
            { name: 'Aztron', checked: true },
            { name: 'Jobe', checked: true },
            { name: 'Mystic', checked: true },
            { name: 'Starboard', checked: true },
          ],
          activeCategory: 'Sup доски для йоги',
        }));
      }
    };

    loadFiltersData();
  }, []);

  // Переключение фильтра бренда
  const toggleBrandFilter = (brandName: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      brands: prevFilters.brands.map((brand) =>
        brand.name === brandName ? { ...brand, checked: !brand.checked } : brand,
      ),
    }));
  };

  // Установка диапазона цен
  const setPriceRange = (range: PriceRange) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      priceRange: range,
    }));
  };

  // Переключение видимости фильтров
  const toggleFiltersVisibility = () => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      showFilters: !prevFilters.showFilters,
    }));
  };

  // Установка активной категории
  const setActiveCategory = (category: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      activeCategory: category,
    }));
  };

  // Сброс всех фильтров
  const resetFilters = () => {
    setFilters((prev) => ({
      ...prev,
      brands: prev.brands.map((brand) => ({ ...brand, checked: true })),
      priceRange: [1200, 40000],
      activeCategory: prev.categories[0] || '',
    }));
  };

  // Форматирование цены с пробелами
  const getFilteredPrice = (min: boolean) => {
    const price = min ? filters.priceRange[0] : filters.priceRange[1];
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  return (
    <FilterContext.Provider
      value={{
        filters,
        toggleBrandFilter,
        setPriceRange,
        toggleFiltersVisibility,
        setActiveCategory,
        resetFilters,
        getFilteredPrice,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

// Хук для использования контекста фильтров
export const useFilters = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};
