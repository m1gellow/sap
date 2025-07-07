/*
  # Создание системы настроек для интернет-магазина

  1. Изменения
    - Обновление таблицы settings с правильными типами данных
    - Добавление начальных настроек для магазина
    
  2. Безопасность
    - Обновление политик RLS для управления настройками
    
  3. Начальные данные
    - Добавление базовых настроек магазина
*/

-- Убеждаемся, что таблица settings существует
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'settings') THEN
    CREATE TABLE settings (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
      key TEXT NOT NULL UNIQUE,
      value JSONB NOT NULL,
      description TEXT
    );
    
    -- Включаем RLS
    ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Обновляем политики для таблицы settings
DROP POLICY IF EXISTS "Все могут просматривать настройки" ON settings;
DROP POLICY IF EXISTS "Администраторы могут управлять настройками" ON settings;

-- Новые политики для настроек
CREATE POLICY "Все могут просматривать настройки" 
  ON settings FOR SELECT 
  TO public
  USING (true);

CREATE POLICY "Администраторы могут управлять настройками" 
  ON settings FOR ALL 
  TO authenticated
  USING (
    auth.uid() IN (SELECT id FROM admins WHERE role = 'admin')
  )
  WITH CHECK (
    auth.uid() IN (SELECT id FROM admins WHERE role = 'admin')
  );

-- Добавляем базовые настройки магазина
INSERT INTO settings (key, value, description) VALUES
  (
    'general',
    '{
      "siteName": "Волны&Горы",
      "siteDescription": "Продажа и аренда SUP в Екатеринбурге",
      "contactEmail": "volnyigory@mail.ru",
      "contactPhone": "+7 (343) 236-63-11",
      "address": "г. Москва, р. Академический, ул.Евгения Савкова д.6",
      "currency": "RUB"
    }',
    'Общие настройки сайта'
  ),
  (
    'delivery',
    '{
      "enableFreeDelivery": true,
      "freeDeliveryThreshold": 10000,
      "deliveryMethods": [
        {"id": "cdek", "name": "СДЭК", "enabled": true, "price": 300},
        {"id": "russian_post", "name": "Почта России", "enabled": true, "price": 250},
        {"id": "yandex_taxi", "name": "Яндекс Такси", "enabled": true, "price": 400}
      ]
    }',
    'Настройки доставки'
  ),
  (
    'payment',
    '{
      "paymentMethods": [
        {"id": "card", "name": "Банковская карта", "enabled": true},
        {"id": "sbp", "name": "СБП", "enabled": true},
        {"id": "cash", "name": "Наличными при получении", "enabled": false}
      ]
    }',
    'Настройки оплаты'
  ),
  (
    'notifications',
    '{
      "enableOrderNotifications": true,
      "enableLowStockNotifications": true,
      "notificationEmail": "volnyigory@mail.ru",
      "enableCustomerNotifications": true
    }',
    'Настройки уведомлений'
  )
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description;