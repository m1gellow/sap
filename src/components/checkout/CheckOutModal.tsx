import React, { useState } from 'react';
import { User, Package, Clock, X, ChevronDown, ArrowLeft, ArrowRight } from 'lucide-react';

// Вы можете управлять видимостью модального окна из родительского компонента,
// передавая проп `isOpen` и функцию `onClose`.
interface PickupPointModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PickupPointModal: React.FC<PickupPointModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    // Оверлей (фон) для модального окна
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      {/* Контейнер модального окна */}
      <div
        className="relative flex h-full max-h-[535px] w-full max-w-[960px] flex-col rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()} // Предотвращает закрытие при клике внутри окна
      >
        {/* === Заголовок и кнопка закрытия === */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Выбор пункта выдачи</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
            aria-label="Закрыть"
          >
            <X size={20} />
          </button>
        </div>

        {/* === Основное содержимое === */}
        <div className="flex flex-1 gap-6 overflow-hidden">
          {/* Левая колонка: информация и управление */}
          <div className="flex w-2/5 flex-col">
            {/* Сортировка */}
            <div className="mb-6">
              <label htmlFor="sort" className="text-sm text-gray-500">
                Сортировать по:
              </label>
              <div className="relative mt-1">
                <select
                  id="sort"
                  className="w-full appearance-none rounded border border-gray-300 bg-white px-3 py-2 pr-8 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option>Ближайшие</option>
                  <option>Популярные</option>
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
              </div>
            </div>

            {/* Карточка с деталями ПВЗ */}
            <div className="flex-1 space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <User size={18} className="text-gray-500" />
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Адрес:</span> г. Екатеринбург, ул. Тиссовая
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Package size={18} className="text-gray-500" />
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Пункт выдачи:</span> Яндекс.Маркет
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-gray-500" />
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Время доставки:</span> 9:00-2:00
                </p>
              </div>
            </div>
            
            {/* Подвал с кнопками */}
            <div className="mt-auto flex items-center justify-between pt-4">
              <button className="flex items-center gap-2 rounded-md px-4 py-2 text-gray-600 hover:bg-gray-100">
                <ArrowLeft size={16} />
                Назад
              </button>
              <button className="flex items-center gap-2 rounded-md bg-gray-800 px-4 py-2 text-white hover:bg-gray-700">
                Далее
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Правая колонка: карта (заглушка) */}
          <div className="w-3/5 rounded-lg bg-gray-200">
            {/* Здесь будет компонент карты, например, Яндекс.Карты или Google Maps */}
          </div>
        </div>
      </div>
    </div>
  );
};


// Пример использования компонента
export const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-10">
      <button 
        onClick={() => setIsModalOpen(true)}
        className="rounded-md bg-blue-600 px-4 py-2 text-white"
      >
        Открыть модальное окно
      </button>

      <PickupPointModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};


export default PickupPointModal;