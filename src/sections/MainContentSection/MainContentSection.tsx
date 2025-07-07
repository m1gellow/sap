import { items } from '../../assets/items';
import { InfoCard } from '../../components/ui/InfoCard';
import { SectionWrapper } from '../../components/ui/SectionWrapper';

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
        img={items.Sup}
      />
      <div className="flex flex-col gap-5 sm:gap-6 md:gap-8">
        <InfoCard size="small" title="Закажи SUP с доставкой"  img={items.Sup2} />
        <InfoCard size="small" title="Уже есть SUP? Не забудьте про комплектующие!"  img={items.jacket} />
      </div>
    </SectionWrapper>
  );
};
