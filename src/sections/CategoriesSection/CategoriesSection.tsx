import { useState } from 'react';
import cn from 'classnames';
import { SectionWrapper } from '../../components/ui/SectionWrapper';
import { useNavigate } from 'react-router-dom';
import { Jacket, Sup, Sup2 } from '../../assets/items';

const categories = [
  { name: 'SUP', id: 1, image: Sup },
  { name: 'Комплектующие', id: 2, image: Sup2 },
  { name: 'Насосы', id: 3, image: Jacket },
  { name: 'Гермомешки и сумки', id: 4, image: Sup},
  { name: 'Спасательные жилеты', id: 5, image: Jacket },
  { name: 'Одежда', id: 6, image: Sup2 },
];

const CategoryCard = ({
  name,
  active,
  setActive,
  id,
  image,
}: {
  name: string;
  id: number;
  active: number;
  setActive: (id: number) => void;
  image: string;
}) => {

  const navigate = useNavigate()

  return (
    <div
      onClick={() => {navigate('/catalog'), setActive(id)}}
      className={cn(
        'bg-skyblue rounded-lg overflow-hidden',
        'h-[180px] w-[160px] sm:w-[180px] flex-shrink-0',
        'flex flex-col cursor-pointer transition-all duration-200',
        active === id 
          ? 'border-[2px] border-blue' 
          : 'border border-gray-200'
      )}
    >
      <div className="p-3 flex-1 flex flex-col h-full">
        <h2 className="text-gray-800 font-bold text-sm md:text-base text-center mb-2 line-clamp-2">
          {name}
        </h2>
        <div className="flex-1 relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center p-2">
            <img
              src={image}
              alt={name}
              className={cn(
                'object-contain w-full h-full max-w-[120px] max-h-[120px]',
                'transition-transform duration-300',
                active === id ? 'scale-110' : 'scale-100'
              )}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/default-category.jpg';
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const SupRentalSection = () => {
  const [active, setActive] = useState(1);

  return (
    <SectionWrapper title="Подборки" className="px-4 lg:px-8">
      <div className="relative">
        <div className="flex overflow-x-auto pb-6 gap-4 md:gap-6 scrollbar-hide px-2 snap-x snap-mandatory">
          {categories.map((category) => (
            <div key={category.id} className="snap-center">
              <CategoryCard
                name={category.name}
                id={category.id}
                active={active}
                setActive={setActive}
                image={category.image}
              />
            </div>
          ))}
        </div>
        
        {/* Градиенты по краям для индикации прокрутки */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent" />
      </div>
    </SectionWrapper>
  );
};