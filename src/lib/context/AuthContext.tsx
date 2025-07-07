import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (
    email: string,
    password: string,
    userData: { name: string; role?: string; status?: string },
  ) => Promise<{ error: any | null; user: User | null }>;
  signOut: () => Promise<void>;
  updateUserProfile: (userData: { name?: string; phone?: string; address?: string; role?: string; status?: string }) => Promise<{ error: any | null }>;
  getUserProfile: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Получение текущей сессии при загрузке
    const getSession = async () => {
      setLoading(true);
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error('Ошибка при получении сессии:', error);
      }

      setSession(session);
      setUser(session?.user || null);
      setLoading(false);
    };

    getSession();

    // Подписка на изменения в аутентификации
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Вход по email и паролю
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { error };
    } catch (error) {
      console.error('Ошибка при входе в систему:', error);
      return { error };
    }
  };

  // Регистрация по email и паролю
  const signUp = async (email: string, password: string, userData: { name: string; role?: string; status?: string }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return { error, user: null };
      }

      // Создаем профиль пользователя после регистрации
      if (data.user) {
        const { error: profileError } = await supabase.from('user_profiles').insert([
          {
            id: data.user.id,
            email: email,
            name: userData.name,
            role: userData.role || 'customer',
            status: userData.status || 'active',
          },
        ]);

        if (profileError) {
          console.error('Ошибка при создании профиля пользователя:', profileError);
          return { error: profileError, user: null };
        }

        // Если роль администратор или менеджер, добавляем в таблицу admins
        if (userData.role === 'admin' || userData.role === 'manager') {
          const { error: adminError } = await supabase.from('admins').upsert({
            id: data.user.id,
            username: email.split('@')[0],
            name: userData.name,
            role: userData.role,
          });

          if (adminError) {
            console.error('Ошибка при создании записи администратора:', adminError);
            // Не возвращаем ошибку, так как основной профиль создан успешно
          }
        }
      }

      return { error: null, user: data.user };
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      return { error, user: null };
    }
  };

  // Выход из системы
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Ошибка при выходе из системы:', error);
    }
  };

  // Обновление профиля пользователя
  const updateUserProfile = async (userData: { name?: string; phone?: string; address?: string; role?: string; status?: string }) => {
    if (!user) {
      return { error: new Error('Пользователь не аутентифицирован') };
    }

    try {
      const { error } = await supabase.from('user_profiles').update(userData).eq('id', user.id).select();

      return { error };
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
      return { error };
    }
  };

  // Получение данных профиля пользователя
  const getUserProfile = async () => {
    if (!user) {
      return { data: null, error: new Error('Пользователь не аутентифицирован') };
    }

    try {
      const { data, error } = await supabase.from('user_profiles').select('*').eq('id', user.id).single();

      return { data, error };
    } catch (error) {
      console.error('Ошибка при получении профиля пользователя:', error);
      return { data: null, error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        updateUserProfile,
        getUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};