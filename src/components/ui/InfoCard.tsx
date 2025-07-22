import cn from 'classnames';
import { CardBgBig, CardBgSm } from '../../assets/patterns';
import MainButton from './MainButton';

type InfoCardType = 'small' | 'normal';

interface InfoCardProps {
  size?: InfoCardType;
  title: string;
  img?: string;
  description?: string;
  badgeDate?: string;
  button?: boolean;
}

export const InfoCard = ({ size = 'normal', button, title, img, description, badgeDate }: InfoCardProps) => {
  const backgroundImage = size === 'small' ? CardBgSm : CardBgBig;

  return (
    <div
      className={cn(
        'relative bg-skyblue rounded-xl overflow-hidden',
        'flex flex-col',
        size === 'small' ? 'min-h-[260px]' : 'min-h-[400px]',
        {
          'md:flex-row md:h-full': img, // Горизонтальное расположение только если есть изображение
        },
      )}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Текстовый контент - теперь может занимать всю ширину */}
      <div
        className={cn(
          'relative z-10 p-5 md:p-8 flex flex-col justify-between',
          {
            'md:w-1/2': img, // Половина ширины только если есть изображение
            'w-full': !img, // Полная ширина если нет изображения
          },
          size === 'small' ? 'md:min-h-[260px]' : 'md:min-h-[560px]',
        )}
      >
        <div className="flex flex-col gap-[20px]">
          {badgeDate && (
            <button className="bg-blue font-bold text-white w-max gap-[10px] p-[5px] rounded-[4px]">{badgeDate}</button>
          )}

          <h1 className="font-bold text-blue text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-3 md:mb-4">{title}</h1>
          {description && <p className="font-medium text-gray-800 text-[20px] sm:text-lg md:text-xl">{description}</p>}
          {button && <MainButton size="lg">Подписаться</MainButton>}
        </div>
      </div>

      {/* Блок изображения - рендерим только если есть img */}
      {img && (
        <div
          className={cn(
            'relative flex-1',
            'min-h-[200px] md:min-h-0',
            'flex items-center justify-center',
            'bg-gray-100 bg-opacity-50',
          )}
        >
          <img
            loading="lazy"
            decoding="async"
            src={img}
            alt={title}
            className={cn(
              'w-full h-full object-contain',
              'md:absolute md:inset-0',
              'transition-transform duration-300 hover:scale-105',
              size === 'small' ? 'md:object-left' : 'md:object-center',
            )}
          />
        </div>
      )}
    </div>
  );
};
