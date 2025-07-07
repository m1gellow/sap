import { useEffect, useState } from 'react';
import { ShoppingBag, Users, CreditCard, Package, Loader2, ChevronRight, AlertCircle } from 'lucide-react';
import { getAdminDashboardStats } from '../../../lib/api/admin';
import { Link } from 'react-router-dom';
import { StatsCard } from './components/StatsCard';
import { LastOrders } from './components/LastOrders';
import { LastItems } from './components/LastItems';
import { Analytics } from './components/Analytics';

export const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    newOrdersToday: 0,
    revenueToday: 0,
    visitors: 3456,
    lowStockItems: [] as any[],
    recentOrders: [] as any[],
  });

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getAdminDashboardStats();
        if (result.error) throw result.error;

        setStats({
          newOrdersToday: result.newOrdersToday,
          revenueToday: result.revenueToday,
          visitors: result.visitors || 3456,
          lowStockItems: result.lowStockItems || [],
          recentOrders: result.recentOrders || [],
        });
      } catch (err) {
        console.error('Ошибка при загрузке статистики:', err);
        setError(err instanceof Error ? err.message : 'Не удалось загрузить статистику. Пожалуйста, попробуйте позже.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsCards = [
    {
      title: 'Новые заказы',
      value: stats.newOrdersToday,
      icon: <ShoppingBag size={20} className="text-blue" />,
      change: 17,
      bgColor: 'bg-blue-50/50',
      borderColor: 'border-blue-100',
    },
    {
      title: 'Выручка сегодня',
      value: `${stats.revenueToday.toLocaleString('ru-RU')} ₽`,
      icon: <CreditCard size={20} className="text-green-600" />,
      change: 24,
      bgColor: 'bg-green-50/50',
      borderColor: 'border-green-100',
    },
    {
      title: 'Посетители',
      value: stats.visitors.toLocaleString('ru-RU'),
      icon: <Users size={20} className="text-purple-600" />,
      change: -12,
      bgColor: 'bg-purple-50/50',
      borderColor: 'border-purple-100',
    },
    {
      title: 'Товаров на складе',
      value: 234 - stats.lowStockItems.length,
      icon: <Package size={20} className="text-amber-600" />,
      change: 4,
      bgColor: 'bg-amber-50/50',
      borderColor: 'border-amber-100',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-10 w-10 text-blue animate-spin" />
        <p className="text-gray-600">Загрузка данных...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50/80 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-red-800">Ошибка загрузки</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
      {/* Заголовок и навигация */}
      <div className="space-y-3">
        <nav className="flex items-center text-sm text-gray-500">
          <Link to="/" className="transition-colors duration-200">
            Главная
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
          <span className="text-gray-700 font-medium">Панель управления</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Обзор магазина</h1>
          <div className="text-sm text-gray-500">
            Обновлено:{' '}
            {new Date().toLocaleString('ru-RU', {
              day: 'numeric',
              month: 'long',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      </div>

      {/* Статистические карточки */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statsCards.map((stat, index) => (
          <StatsCard stat={stat} key={index} index={index} />
        ))}
      </div>

      {/* Основной контент */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Последние заказы */}
        <div className="lg:col-span-2 space-y-5">
          <LastOrders stats={stats} />
          <Analytics />
        </div>

        {/* Боковая панель */}
        <div className="space-y-5">
          <LastItems stats={stats} />

          {/* Быстрые действия */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="font-semibold text-lg text-gray-800 mb-4">Быстрые действия</h3>
            <div className="space-y-3">
              <Link
                to="/admin/products"
                className="flex items-center justify-between p-3 rounded-lg bg-blue-50/50 hover:bg-blue-100/50 transition-colors"
              >
                <span className="text-blue font-medium">Добавить товар</span>
                <ChevronRight className="w-5 h-5 text-blue" />
              </Link>
              <Link
                to="/admin/orders"
                className="flex items-center justify-between p-3 rounded-lg bg-green-50/50 hover:bg-green-100/50 transition-colors"
              >
                <span className="text-green font-medium">Просмотреть все заказы</span>
                <ChevronRight className="w-5 h-5 text-green-400" />
              </Link>
              <Link
                to="/admin/settings"
                className="flex items-center justify-between p-3 rounded-lg bg-purple-50/50 hover:bg-purple-100/50 transition-colors"
              >
                <span className="text-purple font-medium">Настройки магазина</span>
                <ChevronRight className="w-5 h-5 text-purple-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
