import { Frown } from 'lucide-react'

export const EmptyCategoryMessage = ({resetAllFilters}: {resetAllFilters: () => void}) => {
  return (
      <div className="py-12 text-center bg-gray-50 rounded-lg">
        <div className="flex justify-center mb-4">
          <Frown size={48} className="text-gray-400" />
        </div>
        <h3 className="text-xl font-medium text-gray-600 mb-2">В этой категории пока нет товаров в наличии</h3>
        <p className="text-gray-500 mb-6">Попробуйте выбрать другую категорию или изменить параметры фильтров</p>
        <button
          onClick={resetAllFilters}
          className="px-6 py-2 bg-blue text-white rounded-lg hover:bg-blue transition-colors"
        >
          Сбросить фильтры
        </button>
      </div>
  )
}
