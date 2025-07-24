import { Link } from 'react-router-dom';
import { useCart } from '../../lib/context/CartContext';
import { useSettings } from '../../lib/context/SettingsContext';
import { useState } from 'react';
import cn from 'classnames';

export const FooterSection = (): JSX.Element => {
  const { totalPrice } = useCart();
  const { settings } = useSettings();
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Получаем настройки или используем значения по умолчанию
  const siteName = settings?.general?.siteName || 'SUP Store';
  const contactPhone = settings?.general?.contactPhone || '+7 961 775 7144';
  const address = settings?.general?.address || 'г. Екатеринбург, ул. Академика Бардина, 32/1';

  const listItemClass = cn(
    'text-gray-800 font-medium',
    'hover:text-blue transition-colors duration-200',
    'text-sm sm:text-base', // Адаптивный размер текста
  );

  return (
    <footer className="mx-4 sm:mx-6 lg:mx-8 my-6 sm:my-8 lg:my-10 ">
      <div className="bg-skyblue border-2 border-blue rounded-t-lg overflow-hidden">
        <div className="container mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Logo Section */}
            <div className="flex items-center sm:col-span-2 lg:col-span-1">
              <Link to="/" className="inline-flex items-center hover:opacity-90 transition-opacity">
                <img alt="Логотип компании" src="/Logo.png" className="w-12 sm:w-14 md:w-16 h-auto object-contain" />
                <span className="ml-3 text-lg sm:text-xl font-bold text-blue hidden sm:block">{siteName}</span>
              </Link>
            </div>

            {/* Products Section */}
            <section className="animate-fade-in">
              <h2 className="font-bold text-sm sm:text-base text-blue uppercase mb-3 sm:mb-4">Товары</h2>
              <nav>
                <ul className="space-y-1 sm:space-y-2">
                  {['SUP', 'Комплектующие', 'Товары для туризма', 'Аренда'].map((item) => (
                    <li key={item}>
                      <Link to="/catalog" className={cn(listItemClass, 'flex items-center py-1 group')}>
                        <span className="group-hover:translate-x-1 transition-transform">{item}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </section>

            {/* Help Section */}
            <section className="animate-fade-in">
              <h2 className="font-bold text-sm sm:text-base text-blue uppercase mb-3 sm:mb-4">Помощь</h2>
              <nav>
                <ul className="space-y-1 sm:space-y-2">
                  {[
                    { text: 'Доставка и оплата', path: '/delivery' },
                    { text: 'Покупателю', path: '/buyer-info' },
                    { text: 'FAQ', path: '/faq' },
                    { text: 'Возврат', path: '/returns' },
                  ].map((item) => (
                    <li key={item.text}>
                      <Link to={item.path} className={cn(listItemClass, 'flex items-center py-1 group')}>
                        <span className="group-hover:translate-x-1 transition-transform">{item.text}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </section>

            {/* Contacts Section */}
            <section className="sm:col-span-2 lg:col-span-1 animate-fade-in">
              <h2 className="font-bold text-sm sm:text-base text-blue uppercase mb-3 sm:mb-4">Контакты</h2>
              <address className="not-italic">
                <ul className="space-y-1 sm:space-y-2">
                  <li>
                    <Link to="/contacts" className={cn(listItemClass, 'flex items-center py-1 group')}>
                      <span className="group-hover:translate-x-1 transition-transform">WhatsApp / Telegram</span>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => copyToClipboard(contactPhone)}
                      className={cn(listItemClass, 'flex items-center py-1 group w-full text-left')}
                    >
                      <span className="group-hover:translate-x-1 transition-transform">{contactPhone}</span>
                      {isCopied && (
                        <span className="ml-2 text-xs bg-blue text-white px-2 py-1 rounded-full animate-bounce">
                          Скопировано!
                        </span>
                      )}
                    </button>
                  </li>
                  <li>
                    <Link
                      to={`https://yandex.ru/maps/?text=${encodeURIComponent('г. Екатеринбург, ул. Академика Бардина, 32/1')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(listItemClass, 'flex items-center py-1 group')}
                    >
                      <span className="group-hover:translate-x-1 transition-transform">{address}</span>
                    </Link>
                  </li>
                </ul>
              </address>
            </section>
          </div>
        </div>
      </div>

      {/* Legal Section */}
      <div className="bg-blue py-3 sm:py-4 rounded-b-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex flex-col sm:flex-row text-white flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm font-semibold uppercase">
            <li className=" transition-colors">ИП Разов А.Д</li>
            <li className=" transition-colors">ИНН 667104649446</li>
            <li>
              <Link to="/privacy" className=" transition-colors hover:underline">
                Политика конфиденциальности
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-sky-200 transition-colors hover:underline">
                Пользовательское соглашение
              </Link>
            </li>
            <li className="text-xs opacity-80 mt-2 sm:mt-0 sm:ml-auto">
              © {new Date().getFullYear()} {siteName}. Все права защищены.
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};
