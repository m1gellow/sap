import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAllSettings, updateSettings, updateAllSettings, SettingsData } from '../api/settings';
import { GeneralSettings, DeliverySettings, PaymentSettings, NotificationSettings } from '../../types/types';

interface SettingsContextType {
  settings: SettingsData | null;
  isLoading: boolean;
  error: string | null;
  updateGeneralSettings: (settings: GeneralSettings) => Promise<void>;
  updateDeliverySettings: (settings: DeliverySettings) => Promise<void>;
  updatePaymentSettings: (settings: PaymentSettings) => Promise<void>;
  updateNotificationSettings: (settings: NotificationSettings) => Promise<void>;
  updateAllSettingsData: (settings: SettingsData) => Promise<void>;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка настроек при инициализации
  const loadSettings = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const settingsData = await getAllSettings();
      setSettings(settingsData);
    } catch (err) {
      console.error('Ошибка при загрузке настроек:', err);
      setError('Не удалось загрузить настройки');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  // Обновление общих настроек
  const updateGeneralSettings = async (generalSettings: GeneralSettings) => {
    try {
      await updateSettings('general', generalSettings);
      setSettings((prev) => (prev ? { ...prev, general: generalSettings } : null));
    } catch (err) {
      console.error('Ошибка при обновлении общих настроек:', err);
      throw err;
    }
  };

  // Обновление настроек доставки
  const updateDeliverySettings = async (deliverySettings: DeliverySettings) => {
    try {
      await updateSettings('delivery', deliverySettings);
      setSettings((prev) => (prev ? { ...prev, delivery: deliverySettings } : null));
    } catch (err) {
      console.error('Ошибка при обновлении настроек доставки:', err);
      throw err;
    }
  };

  // Обновление настроек оплаты
  const updatePaymentSettings = async (paymentSettings: PaymentSettings) => {
    try {
      await updateSettings('payment', paymentSettings);
      setSettings((prev) => (prev ? { ...prev, payment: paymentSettings } : null));
    } catch (err) {
      console.error('Ошибка при обновлении настроек оплаты:', err);
      throw err;
    }
  };

  // Обновление настроек уведомлений
  const updateNotificationSettings = async (notificationSettings: NotificationSettings) => {
    try {
      await updateSettings('notifications', notificationSettings);
      setSettings((prev) => (prev ? { ...prev, notifications: notificationSettings } : null));
    } catch (err) {
      console.error('Ошибка при обновлении настроек уведомлений:', err);
      throw err;
    }
  };

  // Обновление всех настроек
  const updateAllSettingsData = async (allSettings: SettingsData) => {
    try {
      await updateAllSettings(allSettings);
      setSettings(allSettings);
    } catch (err) {
      console.error('Ошибка при обновлении всех настроек:', err);
      throw err;
    }
  };

  // Обновление настроек
  const refreshSettings = async () => {
    await loadSettings();
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isLoading,
        error,
        updateGeneralSettings,
        updateDeliverySettings,
        updatePaymentSettings,
        updateNotificationSettings,
        updateAllSettingsData,
        refreshSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
