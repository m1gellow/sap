import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabase';
import { useAuth } from './AuthContext';

interface AdminUser {
  username: string;
  name: string;
  role: 'admin' | 'manager';
}

interface AdminContextType {
  isAdminAuthenticated: boolean;
  adminUser: AdminUser | null;
  adminLogin: (credentials: { email: string; password: string }) => Promise<boolean>;
  adminLogout: () => void;
  isLoading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Используем состояние из AuthContext
  const { user, loading: authLoading } = useAuth();

  // Проверяем админские права при изменении пользователя
  useEffect(() => {
    const checkAdminRights = async () => {
      // Если AuthContext еще загружается, ждем
      if (authLoading) {
        setIsLoading(true);
        return;
      }

      setIsLoading(true);

      try {
        if (user) {
          // Проверяем, является ли пользователь администратором
          const { data: adminData, error: adminError } = await supabase
            .from('admins')
            .select('*')
            .eq('id', user.id)
            .single();

          if (adminError) {
            console.error('Ошибка при получении данных администратора:', adminError);
            setIsAdminAuthenticated(false);
            setAdminUser(null);
          } else if (adminData) {
            setAdminUser({
              username: adminData.username,
              name: adminData.name,
              role: adminData.role as 'admin' | 'manager',
            });
            setIsAdminAuthenticated(true);

            // Обновляем время последнего входа
            await supabase
              .from('admins')
              .update({ last_login: new Date().toISOString() })
              .eq('id', user.id);
          } else {
            setIsAdminAuthenticated(false);
            setAdminUser(null);
          }
        } else {
          // Пользователь не аутентифицирован
          setIsAdminAuthenticated(false);
          setAdminUser(null);
        }
      } catch (error) {
        console.error('Ошибка при проверке прав администратора:', error);
        setIsAdminAuthenticated(false);
        setAdminUser(null);
      } finally {
        setIsLoading(false);
        setHasCheckedAuth(true);
      }
    };

    checkAdminRights();
  }, [user, authLoading]);

  // Проверка доступа к административным страницам
  useEffect(() => {
    // Не перенаправляем, пока идет загрузка или пока не проверили аутентификацию
    if (isLoading || authLoading || !hasCheckedAuth) {
      return;
    }

    // Проверяем только если мы на админской странице (но не на странице входа)
    if (location.pathname.startsWith('/admin') && !location.pathname.includes('/admin/login')) {
      if (!isAdminAuthenticated) {
        navigate('/admin/login', { replace: true });
      }
    }
  }, [location.pathname, isAdminAuthenticated, navigate, isLoading, authLoading, hasCheckedAuth]);

  // Вход администратора
  const adminLogin = async (credentials: { email: string; password: string }): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Напрямую пытаемся войти с email и паролем
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (signInError) {
        console.error('Ошибка при входе:', signInError);
        return false;
      }

      // Проверяем, является ли пользователь администратором
      const userId = data.user?.id;
      if (!userId) {
        return false;
      }

      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('id', userId)
        .single();

      if (adminError || !adminData) {
        console.error('Администратор не найден:', adminError);
        // Выходим из системы, так как пользователь не является администратором
        await supabase.auth.signOut();
        return false;
      }

      // Устанавливаем данные администратора
      setAdminUser({
        username: adminData.username,
        name: adminData.name,
        role: adminData.role as 'admin' | 'manager',
      });
      setIsAdminAuthenticated(true);

      // Обновляем время последнего входа
      await supabase.from('admins').update({ last_login: new Date().toISOString() }).eq('id', userId);

      return true;
    } catch (error) {
      console.error('Ошибка при входе администратора:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Выход администратора
  const adminLogout = async () => {
    setIsLoading(true);

    try {
      await supabase.auth.signOut();
      setAdminUser(null);
      setIsAdminAuthenticated(false);
      setHasCheckedAuth(false);
      navigate('/admin/login');
    } catch (error) {
      console.error('Ошибка при выходе из системы:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        isAdminAuthenticated,
        adminUser,
        adminLogin,
        adminLogout,
        isLoading: isLoading || authLoading,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};