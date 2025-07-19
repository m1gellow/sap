import React from 'react';
import { Truck, CalendarDays, CircleDollarSign, Wallet } from 'lucide-react';
import { SectionWrapper } from '../components/ui/SectionWrapper';
import { Breadcrumbs } from '../lib/utils/BreadCrumbs'; // Предполагаю, у тебя есть этот компонент
import { InfoBlock } from '../components/ui/InfoBlock';

// --- ДАННЫЕ ДЛЯ СТРАНИЦЫ ---
// Выносим тексты в переменные, чтобы JSX был чище

const deliveryMethods = [
  { text: 'Курьерская доставка по городу Екатеринбург – от 1 дня, по договоренности' },
  { text: 'СДЭК / Яндекс/ Почта РФ – до пункта выдачи или курьером до двери' },
  { text: 'КИТ и другие ТК – для крупногабаритных грузов' },
  { text: '*Важно: отправка заказов осуществляется после 100% оплаты.', isHighlight: true },
];

const deliveryCosts = [
  { text: 'Стоимость курьерской доставки по Екатеринбургу – 500 ₽' },
  { text: 'Стоимость доставки по РФ – рассчитывается индивидуально по тарифам ТК' },
];

const deliveryTimes = [
  { text: 'В пределах города – от 1 дня' },
  { text: 'По России – от 3 до 10 рабочих дней в зависимости от региона' },
];

const paymentOptions = [
  { text: 'Наличные – для доставки по городу или самовывозе' },
  { text: 'QR -код, банковской картой онлайн – Visa, MasterCard, МИР' },
  { text: '+2% комиссия эквайринга', isHighlight: true },
];

const importantInfo = [
  {
    parts: [
      { text: 'Мы отправим ваш заказ в течение ' },
      { text: '1-2 рабочих дней', isHighlight: true },
      { text: ' после оплаты.' },
    ],
  },
  { parts: [{ text: 'После отправки вы получите трек-номер для отслеживания посылки.' }] },
  {
    parts: [
      { text: 'Если вы не уверены, как лучше оформить доставку, ' },
      { text: 'свяжитесь с нами', isHighlight: true, isLink: true },
      { text: ', и мы поможем выбрать оптимальный вариант' },
    ],
  },
];

export const DeliveryInfoPage = () => {
  return (
    <SectionWrapper title="Доставка и оплата">
      <Breadcrumbs />
      <div className="w-full mx-auto mt-8">
        <div className=" p-6 sm:p-10 rounded-xl border bg-skyblue border-gray-200/80">
          <h2 className="text-xl font-bold text-gray-900">Доставка по всей России</h2>
          <p className="mt-2 text-gray text-[16px] ">
            Мы доставляем заказы по всей территории России удобными транспортными компаниями.
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {/* Способы доставки */}
            <InfoBlock icon={<Truck size={24} />} title="Способы доставки:">
              <ul className="list-disc list-inside space-y-2">
                {deliveryMethods.map((item, index) => (
                  <li key={index} className={item.isHighlight ? 'text-red-600 font-medium text-[16px]' : 'text-[16px]'}>
                    {item.text}
                  </li>
                ))}
              </ul>
            </InfoBlock>

            {/* Сроки доставки */}
            <InfoBlock icon={<CalendarDays size={24} />} title="Сроки доставки:">
              <ul className="list-disc list-inside space-y-2">
                {deliveryTimes.map((item, index) => (
                  <li className='text-[16px]' key={index}>{item.text}</li>
                ))}
              </ul>
            </InfoBlock>

            {/* Стоимость доставки */}
            <InfoBlock icon={<CircleDollarSign size={24} />} title="Стоимость доставки:">
              <ul className="list-disc list-inside space-y-2">
                {deliveryCosts.map((item, index) => (
                  <li className='text-[16px]' key={index}>{item.text}</li>
                ))}
              </ul>
            </InfoBlock>

            {/* Оплата */}
            <InfoBlock icon={<Wallet size={24} />} title="Оплата:">
              <ul className="list-disc list-inside space-y-2">
                {paymentOptions.map((item, index) => (
                  <li  key={index} className={item.isHighlight ? 'text-red-600 font-medium text-[16px]' : 'text-[16px]'}>
                    {item.text}
                  </li>
                ))}
              </ul>
            </InfoBlock>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Важная информация</h2>
            <ul className="mt-4 list-disc list-inside space-y-2 text-gray-600">
              {importantInfo.map((item, index) => (
                <li key={index}>
                  {item.parts.map((part, partIndex) => {
                    const content = (
                      <span key={partIndex} className={part.isHighlight ? 'text-red-600 font-bold' : ''}>
                        {part.text}
                      </span>
                    );
                    return part.isLink ? (
                      <a href="/contacts" className="hover:underline">
                        {content}
                      </a>
                    ) : (
                      content
                    );
                  })}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};
