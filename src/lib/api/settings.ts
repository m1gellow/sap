import { supabase } from '../supabase';
import { GeneralSettings, DeliverySettings, PaymentSettings, NotificationSettings } from '../../types/types';

export interface SettingsData {
  general: GeneralSettings;
  delivery: DeliverySettings;
  payment: PaymentSettings;
  notifications: NotificationSettings;
}

// Получение всех настроек
export const getAllSettings = async (): Promise<SettingsData> => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('key, value')
      .in('key', ['general', 'delivery', 'payment', 'notifications']);

    if (error) throw error;

    // Создаем объект с настройками по умолчанию
    const defaultSettings: SettingsData = {
      general: {
        siteName: 'Волны&Горы',
        siteDescription: 'Продажа и аренда SUP в Екатеринбурге',
        contactEmail: 'volnyigory@mail.ru',
        contactPhone: '+7 (343) 236-63-11',
        address: 'г. Москва, р. Академический, ул.Евгения Савкова д.6',
        currency: 'RUB',
      },
      delivery: {
        enableFreeDelivery: true,
        freeDeliveryThreshold: 10000,
        deliveryMethods: [
          { id: 'cdek', name: 'СДЭК', enabled: true, price: 300 },
          { id: 'russian_post', name: 'Почта России', enabled: true, price: 250 },
          { id: 'yandex_taxi', name: 'Яндекс Такси', enabled: true, price: 400 },
        ],
      },
      payment: {
        paymentMethods: [
          { id: 'card', name: 'Банковская карта', enabled: true },
          { id: 'sbp', name: 'СБП', enabled: true },
          { id: 'cash', name: 'Наличными при получении', enabled: false },
        ],
      },
      notifications: {
        enableOrderNotifications: true,
        enableLowStockNotifications: true,
        notificationEmail: 'volnyigory@mail.ru',
        enableCustomerNotifications: true,
      },
    };

    // Объединяем настройки по умолчанию с данными из базы
    const settings = { ...defaultSettings };

    if (data) {
      data.forEach((setting) => {
        if (setting.key in settings) {
          settings[setting.key as keyof SettingsData] = {
            ...settings[setting.key as keyof SettingsData],
            ...setting.value,
          };
        }
      });
    }

    return settings;
  } catch (error) {
    console.error('Ошибка при загрузке настроек:', error);
    throw error;
  }
};

// Обновление настроек
export const updateSettings = async (key: keyof SettingsData, value: any): Promise<void> => {
  try {
    const { error } = await supabase.from('settings').upsert(
      {
        key,
        value,
        description: getSettingDescription(key),
      },
      {
        onConflict: 'key',
      },
    );

    if (error) throw error;
  } catch (error) {
    console.error(`Ошибка при обновлении настроек ${key}:`, error);
    throw error;
  }
};

// Обновление всех настроек
export const updateAllSettings = async (settings: SettingsData): Promise<void> => {
  try {
    const updates = Object.entries(settings).map(([key, value]) => ({
      key,
      value,
      description: getSettingDescription(key as keyof SettingsData),
    }));

    const { error } = await supabase.from('settings').upsert(updates, {
      onConflict: 'key',
    });

    if (error) throw error;
  } catch (error) {
    console.error('Ошибка при обновлении всех настроек:', error);
    throw error;
  }
};

// Получение описания настройки
const getSettingDescription = (key: keyof SettingsData): string => {
  const descriptions = {
    general: 'Общие настройки сайта',
    delivery: 'Настройки доставки',
    payment: 'Настройки оплаты',
    notifications: 'Настройки уведомлений',
  };
  return descriptions[key];
};

// Получение конкретной настройки
export const getSetting = async <T>(key: keyof SettingsData): Promise<T | null> => {
  try {
    const { data, error } = await supabase.from('settings').select('value').eq('key', key).single();

    if (error && error.code !== 'PGRST116') throw error;

    return data?.value || null;
  } catch (error) {
    console.error(`Ошибка при получении настройки ${key}:`, error);
    return null;
  }
};
