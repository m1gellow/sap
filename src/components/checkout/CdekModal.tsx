// src/components/checkout/CdekModal.jsx

import { useState, useEffect } from 'react';
import {
  X,
  ArrowLeft,
  MapPin,
  Calendar,
  Package,
  Clock2,
  ChevronDown,
  Car,
  Truck,
} from 'lucide-react';
import { useSettings } from '../../lib/context/SettingsContext';
import { formatPrice } from '../../lib/utils/currency';

// Types for better type safety (optional if using TypeScript)
type PickupPoint = {
  id: number;
  name: string;
  address: string;
  issuer: string;
  deliveryTime: string;
  phone: string;
  workHours: {
    weekdays: string;
    weekend: string;
  };
  maxWeight: number;
  directions: string;
};

type CdekModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (point: PickupPoint) => void;
  totalPrice: number;
  deliveryPrice: number;
  productCount: number;
};

// Dummy data for pickup points
const dummyPickupPoints: PickupPoint[] = [
  {
    id: 1,
    name: 'На Тысячелетия',
    address: 'г. Екатеринбург, ул. Тысячелетия',
    issuer: 'Яндекс.Маркет',
    deliveryTime: '8:00-9:00',
    phone: '+7 (999) 999-99-99',
    workHours: {
      weekdays: 'пн-пт 9:00-18:00',
      weekend: 'сб-вс 10:00-17:00',
    },
    maxWeight: 50,
    directions: "Lorem ipsum is simply dummy text of the printing and typesetting industry.",
  },
  {
    id: 2,
    name: 'На Ленина',
    address: 'г. Екатеринбург, пр. Ленина, 50',
    issuer: 'СДЭК',
    deliveryTime: '10:00-11:00',
    phone: '+7 (888) 888-88-88',
    workHours: {
      weekdays: 'пн-пт 10:00-20:00',
      weekend: 'сб-вс 11:00-18:00',
    },
    maxWeight: 30,
    directions: 'Located in the city center, easily accessible by public transport.',
  },
];

// Reusable modal components
const ModalHeader = ({ title, onClose }: { title: string; onClose: () => void }) => (
  <div className="flex items-center justify-between">
    <h2 className="text-xl font-bold text-gray">{title}</h2>
    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
      <X size={24} />
    </button>
  </div>
);

const ModalFooter = ({ 
  onBack, 
  onNext, 
  nextLabel, 
  isFirstStep,
  isNextDisabled = false 
}: { 
  onBack: () => void; 
  onNext: () => void; 
  nextLabel: string; 
  isFirstStep: boolean;
  isNextDisabled?: boolean;
}) => (
  <div className="flex items-center justify-between pt-4 mt-6">
    <button
      onClick={onBack}
      className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-skyblue rounded-md hover:bg-gray-200"
    >
      <ArrowLeft size={16} />
      <span>{isFirstStep ? 'Отмена' : 'Назад'}</span>
    </button>
    <button 
      onClick={onNext} 
      className={`px-6 py-2 text-white rounded-md ${isNextDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue hover:bg-blue-dark'}`}
      disabled={isNextDisabled}
    >
      {nextLabel} →
    </button>
  </div>
);

const SelectPickupPoint = ({ onSelect }: { onSelect: (point: PickupPoint) => void }) => {
  const [selectedPointId, setSelectedPointId] = useState<number>(dummyPickupPoints[0].id);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sortBy, setSortBy] = useState('Ближайшие');

  useEffect(() => {
    const point = dummyPickupPoints.find(p => p.id === selectedPointId);
    if (point) onSelect(point);
  }, [selectedPointId, onSelect]);

  const selectedPoint = dummyPickupPoints.find(p => p.id === selectedPointId) || dummyPickupPoints[0];

  return (
    <div className="py-[20px] flex items-start gap-[20px]">
      {/* left part */}
      <div className="flex-1 flex flex-col gap-[40px]">
        <div>
          <h3 className="flex items-center justify-between">
            Сортировать по:{' '}
            <button 
              className="flex items-center font-bold text-gray"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {sortBy} <ChevronDown />
            </button>
          </h3>
          {isDropdownOpen && (
            <div className="absolute mt-2 ml-64 bg-white border border-gray-300 rounded-md shadow-lg z-10">
              {['Ближайшие', 'По рейтингу', 'По времени работы'].map((option) => (
                <div 
                  key={option}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSortBy(option);
                    setIsDropdownOpen(false);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-4">
          {dummyPickupPoints.map((point) => (
            <div 
              key={point.id}
              className={`p-4 border rounded-md cursor-pointer ${selectedPointId === point.id ? 'border-blue bg-blue-50' : 'border-gray-200'}`}
              onClick={() => setSelectedPointId(point.id)}
            >
              <h3 className="font-bold">{point.name}</h3>
              <div className="flex items-center gap-2 mt-2">
                <MapPin size={16} color="#003153" />
                <span>{point.address}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Package size={16} color="#003153" />
                <span>{point.issuer}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Clock2 size={16} color="#003153" />
                <span>{point.deliveryTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* right part - map placeholder */}
      <div className="flex-1">
        <div className="w-[540px] h-[440px] bg-slate-500 rounded-[8px] flex items-center justify-center text-white">
          Карта: {selectedPoint.name}
        </div>
      </div>
    </div>
  );
};

const PickupPointDetails = ({ point, onSelectDifferent }: { point: PickupPoint; onSelectDifferent: () => void }) => (
  <div>
    <button 
      onClick={onSelectDifferent}
      className="underline text-gray mt-[20px] hover:text-blue"
    >
      Выбрать другой пункт
    </button>
    
    <div className="grid lg:grid-cols-2 grid-cols-1 mt-[40px] gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <MapPin color="#003153" className="mt-1" />
          <div>
            <span className="font-bold text-gray">Адрес:</span> {point.address}
          </div>
        </div>
        
        <div className="flex items-start gap-4">
          <Package color="#003153" className="mt-1" />
          <div>
            <span className="font-bold text-gray">Телефон:</span> {point.phone}
          </div>
        </div>
        
        <div className="flex items-start gap-4">
          <Clock2 color="#003153" className="mt-1" />
          <div>
            <span className="font-bold text-gray">График работы:</span> 
            <div>{point.workHours.weekdays}</div>
            <div>{point.workHours.weekend}</div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <MapPin color="#003153" className="mt-1" />
          <div>
            <span className="font-bold text-gray">Максимальный вес заказа:</span> {point.maxWeight} кг
          </div>
        </div>
        
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Car color="#003153" />
            <span className="font-bold text-gray">Как добраться:</span>
          </div>
          <p className="text-gray-700">{point.directions}</p>
        </div>
      </div>
    </div>
  </div>
);

const DeliveryTime = ({ onSelectDifferent }: { onSelectDifferent: () => void }) => (
  <div>
    <button 
      onClick={onSelectDifferent}
      className="underline text-gray mt-[20px] hover:text-blue"
    >
      Выбрать другой пункт
    </button>
    
    <div className="mt-[40px] max-w-[440px]">
      <div className="flex flex-col gap-4"> 
        <div className="flex items-center gap-2">
          <Calendar color="#003153" />
          <span className="font-bold text-gray">Примерные сроки доставки:</span>
          <span>3-5 дней</span>
        </div>
        <p className="text-gray-500 text-sm">
          *Сроки доставки ориентировочные. Точная дата зависит от загруженности службы доставки
        </p>
      </div>
    </div>
  </div>
);

const DeliveryCost = ({ 
  totalPrice, 
  deliveryPrice,
  productCount 
}: { 
  totalPrice: number; 
  deliveryPrice: number;
  productCount: number;
}) => {
  const { settings } = useSettings();
  const currency = settings?.general?.currency || 'RUB';
  
  // Цена товаров в копейках, переводим в рубли делением на 100
  const productsPriceInRubles = totalPrice / 100;
  // Цена доставки уже в рублях, просто используем как есть
  const total = productsPriceInRubles + deliveryPrice;
  
  return (
    <div className="space-y-4">
      <p className="font-semibold text-lg">{productCount} {productCount === 1 ? 'товар' : productCount < 5 ? 'товара' : 'товаров'}</p>
      
      <div className="flex justify-between items-center text-gray-700">
        <div className="flex items-center gap-2">
          <Package className="text-blue" />
          <span>Цена товаров:</span>
        </div>
        <span>{formatPrice(productsPriceInRubles, currency)}</span>
      </div>
      
      <div className="flex justify-between items-center text-gray-700">
        <div className="flex items-center gap-2">
          <Truck className="text-blue" />
          <span>Стоимость доставки:</span>
        </div>
        <span>{deliveryPrice.toLocaleString('ru-RU')}₽</span>
      </div>
      
      <hr className="my-3 border-gray-200" />
      
      <div className="flex justify-between items-center font-bold text-xl">
        <span>Итого:</span>
        <span>{formatPrice(total, currency)}</span>
      </div>
    </div>
  );
};

// Main Modal Component
const CdekModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  totalPrice, 
  deliveryPrice,
  productCount 
}: CdekModalProps) => {
  const [step, setStep] = useState(1);
  const [selectedPoint, setSelectedPoint] = useState<PickupPoint | null>(null);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      if (selectedPoint) {
        onConfirm(selectedPoint);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onClose();
    }
  };

  const handleSelectDifferentPoint = () => {
    setStep(1);
  };

  const titles = [
    'Выбор пункта выдачи', 
    'Детали ПВЗ', 
    'Сроки доставки', 
    'Стоимость доставки'
  ];

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <SelectPickupPoint onSelect={setSelectedPoint} />;
      case 2:
        return selectedPoint ? 
          <PickupPointDetails point={selectedPoint} onSelectDifferent={handleSelectDifferentPoint} /> : 
          <div>Ошибка: пункт выдачи не выбран</div>;
      case 3:
        return <DeliveryTime onSelectDifferent={handleSelectDifferentPoint} />;
      case 4:
        return <DeliveryCost 
          totalPrice={totalPrice} 
          deliveryPrice={deliveryPrice} 
          productCount={productCount} 
        />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white border-[2px] border-blue p-6 rounded-lg w-full max-w-[1000px] shadow-xl animate-fade-in-down">
        <ModalHeader title={titles[step - 1]} onClose={onClose} />
        <div className="min-h-[400px] py-4">
          {renderStepContent()}
        </div>
        <ModalFooter
          onBack={handleBack}
          onNext={handleNext}
          nextLabel={step === 4 ? 'Оформить доставку' : 'Далее'}
          isFirstStep={step === 1}
          isNextDisabled={step === 1 && !selectedPoint}
        />
      </div>
    </div>
  );
};

export default CdekModal;