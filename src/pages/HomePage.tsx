import React, { useState, useEffect } from 'react';
import { MainContentSection } from '../sections/MainContentSection/MainContentSection'
import { NewItemsSection } from '../sections/NewItemsSection/NewItemsSection';
import { SupRentalSection } from '../sections/CategoriesSection';
import { StockSection } from '../sections/StocksSection/StockSection';
import { supabase } from '../lib/supabase';
import { MoySkladProduct } from '../types/types';


export const HomePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [newProducts, setNewProducts] = useState<MoySkladProduct[]>([]);

  // Загрузка продуктов при монтировании компонента
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const {data: newProducts} = await supabase.from("moysklad_products").select("*").limit(5)

        setNewProducts(newProducts)

        setIsLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

 
  return (
    <main>
      <div className="container mx-auto mt-[50px] px-4 lg:px-6 2xl:px-0">
        <MainContentSection />
        <SupRentalSection />
        <NewItemsSection newProducts={newProducts} />
        <StockSection />
      </div>
    </main>
  );
};