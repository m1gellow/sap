import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  X,
  User,
  ChevronRight,
  Loader2,
  Home
} from 'lucide-react';
import { useAdmin } from '../../lib/context/AdminContext';
import { Link, Outlet, useLocation } from 'react-router-dom';

export const AdminLayout = () => {
  const { adminUser, adminLogout, isLoading } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, title: 'Дашборд', path: '/admin' },
    { icon: <Package size={20} />, title: 'Товары', path: '/admin/products' },
    { icon: <ShoppingCart size={20} />, title: 'Заказы', path: '/admin/orders' },
    { icon: <Users size={20} />, title: 'Пользователи', path: '/admin/users' },
    { icon: <Settings size={20} />, title: 'Настройки', path: '/admin/settings' },
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const isActive = (path: string) => {
    return path === '/admin' 
      ? location.pathname === '/admin'
      : location.pathname.startsWith(path);
  };

  // Показываем индикатор загрузки, пока проверяются права администратора
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center space-y-4"
        >
          <div className="relative">
            <Loader2 className="h-12 w-12 text-blue animate-spin" />
            <div className="absolute inset-0 h-12 w-12 border-2 border-blue/20 rounded-full"></div>
          </div>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              Загрузка панели управления
            </h2>
            <p className="text-sm text-gray-500">
              Проверяем права доступа...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <motion.aside
        className="hidden md:flex flex-col bg-white border-r border-gray-200"
        initial={{ width: 250 }}
        animate={{ width: sidebarOpen ? 250 : 80 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 h-16">
          {sidebarOpen ? (
            <motion.div 
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              className="font-bold text-lg text-blue whitespace-nowrap"
            >
              Волны&Горы Админ
            </motion.div>
          ) : (
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
              <Package className="text-white" size={16} />
            </div>
          )}
          <button 
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700"
          >
            <ChevronLeft className={`transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center px-3 py-3 rounded-lg mx-2 transition-colors ${
                    isActive(item.path) 
                      ? 'bg-skyblue text-blue font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div className={`p-1.5 rounded-md ${
                    isActive(item.path) ? 'bg-skyblue text-blue' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {item.icon}
                  </div>
                  <motion.span
                    initial={{ opacity: 1 }}
                    animate={{ opacity: sidebarOpen ? 1 : 0 }}
                    className={`ml-3 whitespace-nowrap ${sidebarOpen ? 'block' : 'hidden'}`}
                  >
                    {item.title}
                  </motion.span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className={`flex items-center px-2 py-3 rounded-lg ${sidebarOpen ? 'bg-gray-50' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="text-blue" size={16} />
            </div>
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: sidebarOpen ? 1 : 0 }}
              className={`ml-3 overflow-hidden ${sidebarOpen ? 'block' : 'hidden'}`}
            >
              <div className="text-sm font-medium text-gray-900 truncate">{adminUser?.name}</div>
              <div className="text-xs text-gray-500">Администратор</div>
            </motion.div>
          </div>

          {/* Кнопка возврата на главную */}
          <Link
            to="/"
            className={`flex items-center w-full mt-2 px-2 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors ${
              sidebarOpen ? 'justify-start' : 'justify-center'
            }`}
          >
            <Home className="text-gray-500" size={20} />
            <motion.span
              initial={{ opacity: 1 }}
              animate={{ opacity: sidebarOpen ? 1 : 0 }}
              className={`ml-3 ${sidebarOpen ? 'block' : 'hidden'}`}
            >
              На главную
            </motion.span>
          </Link>

          {/* Кнопка выхода из аккаунта */}
          <button
            onClick={adminLogout}
            className={`flex items-center w-full mt-2 px-2 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors ${
              sidebarOpen ? 'justify-start' : 'justify-center'
            }`}
          >
            <LogOut className="text-red-500" size={20} />
            <motion.span
              initial={{ opacity: 1 }}
              animate={{ opacity: sidebarOpen ? 1 : 0 }}
              className={`ml-3 ${sidebarOpen ? 'block' : 'hidden'}`}
            >
              Выйти из аккаунта
            </motion.span>
          </button>
        </div>
      </motion.aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 shadow-sm h-16 flex items-center px-4">
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          className="p-1 rounded-md hover:bg-gray-100 mr-4"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="font-bold text-lg text-blue">Волны&Горы</div>
        
        {/* Кнопка выхода в мобильной версии */}
        <button
          onClick={adminLogout}
          className="ml-auto p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Выйти из аккаунта"
        >
          <LogOut size={20} />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="md:hidden fixed inset-0 z-20 bg-black bg-opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
            />
            
            <motion.div
              className="md:hidden fixed top-16 left-0 bottom-0 z-30 w-64 bg-white shadow-lg"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto py-4">
                  <ul className="space-y-1 px-2">
                    {menuItems.map((item, index) => (
                      <li key={index}>
                        <Link
                          to={item.path}
                          className={`flex items-center px-3 py-3 rounded-lg mx-2 transition-colors ${
                            isActive(item.path)
                              ? 'bg-blue text-blue font-medium'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                          onClick={closeMobileMenu}
                        >
                          <div className={`p-1.5 rounded-md ${
                            isActive(item.path) ? 'bg-blue text-blue' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {item.icon}
                          </div>
                          <span className="ml-3">{item.title}</span>
                          {isActive(item.path) && <ChevronRight className="ml-auto text-blue" size={16} />}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center px-2 py-3 rounded-lg bg-gray-50">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="text-blue" size={16} />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{adminUser?.name}</div>
                      <div className="text-xs text-gray-500">Администратор</div>
                    </div>
                  </div>

                  {/* Кнопка возврата на главную в мобильном меню */}
                  <Link
                    to="/"
                    className="flex items-center w-full mt-2 px-2 py-3 rounded-lg text-gray-600 hover:bg-gray-100"
                    onClick={closeMobileMenu}
                  >
                    <Home className="text-gray-500" size={20} />
                    <span className="ml-3">На главную</span>
                  </Link>

                  {/* Кнопка выхода в мобильном меню */}
                  <button
                    onClick={adminLogout}
                    className="flex items-center w-full mt-2 px-2 py-3 rounded-lg text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="text-red-500" size={20} />
                    <span className="ml-3">Выйти из аккаунта</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden pt-16 md:pt-0">
        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-between bg-white shadow-sm border-b border-gray-200 h-16 px-6">
          <h1 className="text-xl font-semibold text-gray-800">
            {menuItems.find(item => isActive(item.path))?.title || 'Панель управления'}
          </h1>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{adminUser?.name}</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-gray-50 p-4 md:p-6">
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};