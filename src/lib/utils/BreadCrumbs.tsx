import { ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

type RouteConfig = {
  path: string;
  name: string;
};

const ROUTES: Record<string, RouteConfig> = {
  '/': { path: '/', name: 'Главная' },
  '/catalog': { path: '/catalog', name: 'Каталог' },
  '/delivery': { path: '/delivery', name: 'Доставка' },
  '/basket': { path: '/basket', name: 'Корзина' },
};

export const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean);

  return (
    <nav className="flex items-center text-sm text-gray-500 mb-8">
      <Link to="/" className="hover:text-blue-500 transition-colors">
        {ROUTES['/'].name}
      </Link>

      {pathnames.map((path, index) => {
        const routePath = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const routeConfig = ROUTES[routePath] || { path: routePath, name: path };

        return (
          <div key={routePath} className="flex items-center">
            <ChevronRight className="mx-2 h-4 w-4" />
            {isLast ? (
              <span className="text-gray-400">{routeConfig.name}</span>
            ) : (
              <Link to={routeConfig.path} className="hover:text-blue-500 transition-colors">
                {routeConfig.name}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};
