

import { InfoCard } from '../../components/ui/InfoCard';
import { SectionWrapper } from '../../components/ui/SectionWrapper';

import Sup from '../../assets/items/Sup.webp';
import Sup2 from '../../assets/items/Sup2.webp';
import Jacket from '../../assets/items/jacket.webp';

export const MainContentSection = () => {

  return (
    <SectionWrapper
      title=""
      layout="info-cards"
      className="mt-10 md:mt-16 px-4 sm:px-6"
      containerClassName="max-w-7xl mx-auto"
    >
      <InfoCard
        title="На природу с комфортом и драйвом!"
        description="SUP-доски для озёр, рек и моря — выбери свою!"
        img={Sup}
      />
      
      <div className="flex flex-col gap-5 sm:gap-6 md:gap-8">
        <InfoCard 
          size="small"
          title="Закажи SUP с доставкой" 
          img={Sup2}
        />
        <InfoCard 
          size="small"
          title="Уже есть SUP? Не забудьте про комплектующие!" 
          img={Jacket}
        />
      </div>
    </SectionWrapper>
  );
}; 