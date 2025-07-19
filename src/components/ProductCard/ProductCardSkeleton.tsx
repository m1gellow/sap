import React from 'react';
import cn from 'classnames';

interface ProductCardSkeletonProps {
  isLarge?: boolean;
  className?: string;
}

export const ProductCardSkeleton = ({ isLarge = false, className = '' }: ProductCardSkeletonProps) => {
  return (
    <div
      className={cn(
        // Повторяем размеры и базовую структуру из ProductCard
        'border rounded-lg p-[20px] flex flex-col',
        {
          'w-full h-full': isLarge,
          'w-full max-w-[260px]': !isLarge
        },
        className
      )}
    >
      {/* --- Блок для изображения --- */}
      <div className={cn(
        "relative bg-gray-200 rounded-lg animate-pulse", // Основной цвет фона и анимация
        { 'h-[400px] flex-grow': isLarge, 'h-64': !isLarge }
      )}>
        {/* Можно добавить иконку картинки в центр для наглядности */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
      
      {/* --- Блок для контента --- */}
      <div className={cn(
        "flex flex-col",
        { 'mt-4 h-auto px-4 pb-4': isLarge, 'mt-4 flex-grow': !isLarge }
      )}>
        {/* --- Название товара --- */}
        <div className="mb-2 mt-1 space-y-2">
          {/* Имитируем две строки текста разной длины */}
          <div className="h-4 bg-gray-300 rounded w-5/6 animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded w-4/6 animate-pulse"></div>
        </div>

        {/* --- Цена и кнопка --- */}
        <div className={cn(
          "space-y-3",
          { 'mt-6': isLarge, 'mt-auto': !isLarge }
        )}>
          {/* --- Цена --- */}
          <div className="flex items-center justify-between mb-3">
            <div className="h-6 bg-gray-300 rounded w-1/3 animate-pulse"></div>
          </div>
          {/* --- Кнопка --- */}
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};