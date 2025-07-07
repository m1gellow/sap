import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from './AuthContext';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar?: string;
}

interface ProfileContextType {
  profile: UserProfile | null;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  signup: (data: { name: string; email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  showProfileModal: boolean;
  setShowProfileModal: (show: boolean) => void;
  isLoading: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, signIn, signUp, signOut, updateUserProfile, getUserProfile } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Загрузка профиля при изменении пользователя
  useEffect(() => {
    if (user) {
      fetchUserProfile();
    } else {
      setProfile(null);
      setIsAuthenticated(false);
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await getUserProfile();

      if (error) {
        throw error;
      }

      // Проверяем, что data существует и не null
      if (data) {
        setProfile({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          avatar: data.avatar_url || undefined,
        });
        setIsAuthenticated(true);
      } else {
        // Профиль не найден, но ошибки нет - это нормальная ситуация для новых пользователей
        setProfile({
          name: user?.user_metadata?.name || '',
          email: user?.email || '',
          phone: '',
          address: '',
          avatar: undefined,
        });
        setIsAuthenticated(true);

        // Можно автоматически создать профиль для пользователя
        if (user) {
          try {
            await supabase.from('user_profiles').insert({
              id: user.id,
              email: user.email,
              name: user.user_metadata?.name || '',
            });
          } catch (createError) {
            console.error('Ошибка при создании профиля:', createError);
          }
        }
      }
    } catch (error) {
      console.error('Ошибка при загрузке профиля:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Вход в систему
  const login = async (credentials: { email: string; password: string }) => {
    try {
      setIsLoading(true);
      const { error } = await signIn(credentials.email, credentials.password);

      if (error) {
        console.error('Ошибка при входе:', error.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Ошибка при входе в систему:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Регистрация
  const signup = async (data: { name: string; email: string; password: string }) => {
    try {
      setIsLoading(true);
      const { error, user } = await signUp(data.email, data.password, {
        name: data.name,
      });

      if (error) {
        console.error('Ошибка при регистрации:', error.message);
        return false;
      }

      return !!user;
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Выход из системы
  const logout = async () => {
    try {
      setIsLoading(true);
      await signOut();
      setProfile(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Ошибка при выходе из системы:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Обновление профиля пользователя
  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      const { error } = await updateUserProfile(data);

      if (error) {
        throw error;
      }

      setProfile((prev) => (prev ? { ...prev, ...data } : null));
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        isAuthenticated,
        login,
        signup,
        logout,
        updateProfile,
        showProfileModal,
        setShowProfileModal,
        isLoading,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

// Хук для использования контекста профиля
export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
