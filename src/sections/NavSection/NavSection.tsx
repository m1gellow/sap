import { Link } from 'react-router-dom';
import { useSettings } from '../../lib/context/SettingsContext';
import { Grid2x2Plus, Heart, Menu, X, Shield, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import cn from 'classnames';
import { CartInfo } from '../../components/ui/CartInfo';
import { ProfileActions } from '../../components/Profile/ProfileActions';
import { useCopyToClipboard } from '../../lib/hooks/useCopyToClipboard';
import MainButton from '../../components/ui/MainButton';

const mainNavLinks = [
  { href: '/', label: 'Главная' },
  { href: '/info', label: 'Покупателю' },
  { href: '/sales', label: 'Акции' },
  { href: '/delivery-info', label: 'Доставка и оплата' },
  { href: '/contacts', label: 'Контакты' },
];

const categoryLinks = [
  { href: '/catalog?category=sup', label: 'SUP' },
  { href: '/catalog?category=accessories', label: 'Комплектующие' },
  { href: '/catalog?category=rent', label: 'Аренда' },
  { href: '/catalog?category=tourism', label: 'Товары для туризма и отдыха' },
];

export const NavSection = (): JSX.Element => {
  const { settings } = useSettings();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCopied, copy] = useCopyToClipboard();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const contactPhone = settings?.general?.contactPhone || '+7 961 775 7144';
  const siteName = settings?.general?.siteName || 'Волны и Горы';

  return (
    <header className="mx-[1rem] my-[1.5rem] relative text-text-primary">
      {/* Верхняя часть навигации */}
      <div className="bg-skyblue border-[2px] border-blue rounded-t-[0.375rem]">
        <div className="container mx-auto flex justify-between items-center h-[5rem]">
          {/* Логотип и кнопка каталога */}
          <div className="flex items-center gap-[2.5rem]">
            <Link to="/" className="flex items-center" title={siteName}>
              <img alt="Logo" src={'/Logo.png'} className="h-[4rem] w-auto" />
            </Link>
            <Link to="/catalog" className="hidden lg:block">
              <MainButton size='md' variant='secondary' className='flex items-center justify-center gap-[20px] text-[1rem]'>
                <Grid2x2Plus className="w-[1.25em] h-[1.25em]" />
                Каталог
              </MainButton>
            </Link>
          </div>

          {/* Основное меню (десктоп) */}
          <nav className="hidden md:flex">
            <ul className="flex items-center gap-[1.75rem] font-semibold text-[1rem]">
              {mainNavLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="hover:text-blue transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="hidden xl:block">
                <button
                  className={cn('hover:text-blue transition-colors', {
                    'text-blue font-bold': isCopied,
                  })}
                  onClick={() => copy(contactPhone)}
                >
                  {isCopied ? 'Скопировано!' : contactPhone}
                </button>
              </li>
            </ul>
          </nav>

          {/* Иконки действий */}
          <div className="hidden md:flex items-center gap-[0.5rem]">
            <Link
              to="/favorites"
              className="p-[0.5rem] rounded-[0.375rem] hover:bg-gray-100 transition-colors"
              title="Избранное"
            >
              <Heart className="text-text-primary w-[1.25em] h-[1.25em]" />
            </Link>
            <CartInfo />
            <ProfileActions />
          </div>

          {/* Кнопка мобильного меню */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-[0.5rem]"
            aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
          >
            {isMenuOpen ? <X className="w-[1.75em] h-[1.75em]" /> : <Menu className="w-[1.75em] h-[1.75em]" />}
          </button>
        </div>
      </div>

      {/* Мобильное меню */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white z-50 shadow-lg rounded-b-[0.375rem] border-x-[2px] border-b-[2px] border-blue">
          <nav className="py-[1rem] px-[1.5rem] space-y-[1rem] font-bold">
            {mainNavLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={toggleMenu}
                className="block hover:text-blue text-[1.125rem]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/favorites"
              onClick={toggleMenu}
              className="flex items-center gap-[0.5rem] hover:text-blue text-[1.125rem]"
            >
              <Heart className="w-[1em] h-[1em]" /> Избранное
            </Link>
            <Link
              to="/cart"
              onClick={toggleMenu}
              className="flex items-center gap-[0.5rem] hover:text-blue text-[1.125rem]"
            >
              <ShoppingBag className="w-[1em] h-[1em]" /> Корзина
            </Link>
            <hr className="border-t-[1px] border-gray-200" />
            <button
              onClick={() => copy(contactPhone)}
              className={cn('hover:text-blue text-[1.125rem]', {
                'text-blue': isCopied,
              })}
            >
              {isCopied ? 'Скопировано!' : contactPhone}
            </button>
            <hr className="border-t-[1px] border-gray-200" />
            <ProfileActions />
            <Link
              to="/admin/login"
              onClick={toggleMenu}
              className="flex items-center gap-[0.5rem] text-blue font-bold text-[1.125rem]"
            >
              <Shield className="w-[1em] h-[1em]" />
              Вход в админку
            </Link>
          </nav>
        </div>
      )}

      {/* Меню категорий */}
      <div className="bg-blue py-[1rem] rounded-b-[0.375rem]">
        <nav>
          <ul className="text-white font-semibold uppercase flex flex-wrap items-center justify-center gap-x-[2rem] gap-y-[0.5rem] px-[1rem]">
            {categoryLinks.map((link) => (
              <li key={link.href}>
                <Link to={link.href} className="hover:opacity-80 transition-opacity duration-200 text-[0.875rem]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};
