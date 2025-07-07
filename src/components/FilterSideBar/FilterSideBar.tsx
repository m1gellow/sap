import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, ChevronDownIcon, Check } from 'lucide-react';
import { Button } from '../ui/button';

interface FilterSideBarProps {
  filters: {
    brands: Array<{ name: string; checked: boolean; count?: number }>;
    priceRange: [number, number];
    activeCategory: string | null;
  };
  toggleBrandFilter: (brandName: string) => void;
  setPriceRange: (range: [number, number]) => void;
  resetFilters: () => void;
  getFilteredPrice: (isMin: boolean) => string;
  toggleShowFilter: (arg1: boolean) => void; 
}

const CheckboxItem = ({ label, count, checked, onChange }) => (
  <label className="flex items-center space-x-3 cursor-pointer ">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="sr-only peer"
    />
    <div className="w-5 h-5 rounded flex items-center justify-center border border-gray-300 peer-checked:bg-blue peer-checked:border-blue">
      <Check color='white'/>
    </div>
    <span className="text-gray-800">{label}</span>
    {count !== undefined && <span className="text-gray-400">({count})</span>}
  </label>
);

export const FilterSideBar: React.FC<FilterSideBarProps> = ({
  filters,
  toggleBrandFilter,
  setPriceRange,
  resetFilters,
  getFilteredPrice,
  toggleShowFilter
}) => {
  const [priceMin, setPriceMin] = useState(filters.priceRange[0]);
  const [priceMax, setPriceMax] = useState(filters.priceRange[1]);
  const [sliderMin, setSliderMin] = useState(filters.priceRange[0]);
  const [sliderMax, setSliderMax] = useState(filters.priceRange[1]);

  // Mock data for models and colors
  const [models, setModels] = useState([
    { name: 'Sup-доска Blue Paddle Green 11\'6"', count: 2, checked: true },
    { name: 'Sup-доска Blue Paddle Grey 11\'6"', count: 5, checked: false },
    { name: 'Sup-доска Blue Paddle Orange 11\'6"', count: 8, checked: false },
  ]);
  const [colors, setColors] = useState([
    { name: 'Синий', count: 2, checked: true },
    { name: 'Белый', count: 5, checked: false },
    { name: 'Зеленый', count: 8, checked: false },
  ]);

  useEffect(() => {
    setSliderMin(filters.priceRange[0]);
    setSliderMax(filters.priceRange[1]);
    setPriceMin(filters.priceRange[0]);
    setPriceMax(filters.priceRange[1]);
  }, [filters.priceRange]);

  const handlePriceRangeChange = () => {
    const min = Math.min(sliderMin, sliderMax);
    const max = Math.max(sliderMin, sliderMax);
    setPriceRange([min, max]);
    setPriceMin(min);
    setPriceMax(max);
  };

  const handleModelToggle = (index) => {
    const newModels = [...models];
    newModels[index].checked = !newModels[index].checked;
    setModels(newModels);
  };

  const handleColorToggle = (index) => {
    const newColors = [...colors];
    newColors[index].checked = !newColors[index].checked;
    setColors(newColors);
  };

  const formatNumber = (num) => new Intl.NumberFormat('ru-RU').format(num);

  // Slider track style calculation
  const minPercent = ((sliderMin - 0) / (50000 - 0)) * 100;
  const maxPercent = ((sliderMax - 0) / (50000 - 0)) * 100;
  const getTrackStyle = () => ({
    background: `linear-gradient(to right, #e5e7eb ${minPercent}%, var(--blue) ${minPercent}%, var(--blue) ${maxPercent}%, #e5e7eb ${maxPercent}%)`,
  });

  return (
    <AnimatePresence>
      <motion.div
        className="bg-white shadow-lg rounded-3xl w-full max-w-[460px]"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-10 flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-slate-800 text-[32px]">Фильтр</h2>
            <button className="text-blue hover:text-opacity-75" onClick={() =>  toggleShowFilter(false)}>
              <XIcon size={24} />
            </button>
          </div>

          {/* Price Section - Dual Input Version */}
          <div className="flex flex-col gap-4">
            <h3 className="uppercase text-blue text-[20px] font-bold">Цена</h3>
            <div className="grid grid-cols-2 gap-5">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 pointer-events-none">от</span>
                <input
                  type="text"
                  className="w-full bg-slate-100 rounded-md py-2 pl-9 pr-4 text-right text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue"
                  value={formatNumber(priceMin)}
                  onChange={(e) => {
                    const value = Number(e.target.value.replace(/\s/g, '')) || 0;
                    setPriceMin(value);
                    setSliderMin(value);
                  }}
                  onBlur={handlePriceRangeChange}
                />
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 pointer-events-none">до</span>
                <input
                  type="text"
                  className="w-full bg-slate-100 rounded-md py-2 pl-9 pr-4 text-right text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue"
                  value={formatNumber(priceMax)}
                  onChange={(e) => {
                    const value = Number(e.target.value.replace(/\s/g, '')) || 0;
                    setPriceMax(value);
                    setSliderMax(value);
                  }}
                  onBlur={handlePriceRangeChange}
                />
              </div>
            </div>

          

            <div className="flex justify-between text-xs text-gray-500">
              <span>0 ₽</span>
              <span>25 000 ₽</span>
              <span>50 000 ₽</span>
            </div>
          </div>

          {/* Brands Section */}
          <div className="flex flex-col gap-4">
            <h3 className="uppercase text-blue text-[20px] font-bold">Бренды</h3>
            <div className="flex flex-col gap-3">
              {filters.brands.map((brand, index) => (
                <CheckboxItem
                  key={brand.name}
                  label={brand.name}
                  count={brand.count}
                  checked={brand.checked}
                  onChange={() => toggleBrandFilter(brand.name)}
                />
              ))}
            </div>
            <motion.div
              className="flex items-center gap-[7px] cursor-pointer text-blue"
              whileHover={{ x: 3 }}
            >
              <ChevronDownIcon className="w-4 h-4" />
              <span className="font-light text-[13px] underline">еще</span>
            </motion.div>
          </div>

          {/* Model Section */}
          <div className="flex flex-col gap-4">
            <h3 className="uppercase text-blue text-[20px] font-bold">Модель</h3>
            <div className="flex flex-col gap-3">
              {models.map((model, index) => (
                <CheckboxItem
                  key={model.name}
                  label={model.name}
                  count={model.count}
                  checked={model.checked}
                  onChange={() => handleModelToggle(index)}
                />
              ))}
            </div>
          </div>

          {/* Color Section */}
          <div className="flex flex-col gap-4">
            <h3 className="uppercase text-blue text-[20px] font-bold">Цвет</h3>
            <div className="flex flex-col gap-3">
              {colors.map((color, index) => (
                <CheckboxItem
                  key={color.name}
                  label={color.name}
                  count={color.count}
                  checked={color.checked}
                  onChange={() => handleColorToggle(index)}
                />
              ))}
            </div>
          </div>

          {/* Filter buttons */}
          <div className="flex gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                className="px-5 h-[37px] bg-blue rounded-[53px] text-white text-[15px] font-semibold shadow-lg"
                onClick={handlePriceRangeChange}
              >
                Применить
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                className="px-5 h-[37px] rounded-[53px] text-gray-800 text-[15px] font-semibold border-gray-300"
                onClick={resetFilters}
              >
                Сбросить
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};