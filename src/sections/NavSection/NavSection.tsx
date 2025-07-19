import { Link } from 'react-router-dom';
import { useSettings } from '../../lib/context/SettingsContext';
import { Grid2x2Plus, Heart, Menu, X, Shield, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import cn from 'classnames';

// import { useProfile } from '../../lib/context/ProfileContext';
import { CartInfo } from '../../components/ui/CartInfo';
import { ProfileActions } from '../../components/Profile/ProfileActions';
import { useCopyToClipboard } from '../../lib/hooks/useCopyToClipboard';

const mainNavLinks = [
  { href: '/', label: 'Главная' },
  { href: '/info', label: 'Покупателю' },
  { href: '/sales', label: 'Акции' },
  { href: '/delivery', label: 'Доставка и оплата' },
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
  // const { isAuthenticated } = useProfile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCopied, copy] = useCopyToClipboard();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const contactPhone = settings?.general?.contactPhone || '+7 961 775 7144';
  const siteName = settings?.general?.siteName || 'Волны и Горы';

  return (
    <header className="m-4  relative text-text-primary">
      <div className="bg-skyblue border-2  border-blue rounded-t-lg">
        <div className="container mx-auto flex justify-between items-center h-20">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center" title={siteName}>
              <img alt="Logo" src={'/Logo.png'} className="h-16 w-auto" />
            </Link>
            <Link to="/catalog" className="hidden lg:block">
              <button className="btn-catalog group">
                <Grid2x2Plus className="btn-catalog-icon" />
                <span className="pr-4">Каталог</span>
              </button>
            </Link>
          </div>

          <nav className="hidden lg:flex">
            <ul className="flex items-center gap-12 text-nav-link">
              {mainNavLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="hover:text-blue transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  className={cn('hover:text-blue transition-colors', { 'text-blue font-bold': isCopied })}
                  onClick={() => copy(contactPhone)}
                >
                  {isCopied ? 'Скопировано!' : contactPhone}
                </button>
              </li>
            </ul>
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <Link to={'/favorites'} className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Избранное">
              <Heart className="text-text-primary" />
            </Link>
            <CartInfo />
            <ProfileActions />
          </div>

          <button onClick={toggleMenu} className="md:hidden p-2">
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white z-50 shadow-lg rounded-b-lg border-x-2 border-b-2 border-blue">
          <nav className="py-4 px-6 space-y-4 font-bold">
            {mainNavLinks.map((link) => (
              <Link key={link.href} to={link.href} onClick={toggleMenu} className="block hover:text-blue">
                {link.label}
              </Link>
            ))}
            <Link to={'/favorites'} onClick={toggleMenu} className="flex items-center gap-2 hover:text-blue">
              <Heart size={18} /> Избранное
            </Link>
            <Link to={'/cart'} onClick={toggleMenu} className="flex items-center gap-2 hover:text-blue">
              <ShoppingBag size={18} /> Корзина
            </Link>
            <hr />
            <button onClick={() => copy(contactPhone)} className={cn('hover:text-blue', { 'text-blue': isCopied })}>
              {isCopied ? 'Скопировано!' : contactPhone}
            </button>
            <hr />
            <ProfileActions />
            <Link to="/admin/login" onClick={toggleMenu} className="flex items-center gap-2 text-blue font-bold">
              <Shield size={16} />
              Вход в админку
            </Link>
          </nav>
        </div>
      )}

      <div className="bg-blue py-4 rounded-b-lg">
        <nav>
          <ul className="text-white font-semibold uppercase flex flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4">
            {categoryLinks.map((link) => (
              <li key={link.href}>
                <Link to={link.href} className="hover:opacity-80 transition-opacity">
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
