/*
  # Создание системы управления контентом

  1. Новые таблицы
    - Обновление таблицы `content` с правильными типами данных
    
  2. Безопасность
    - Обновление политик RLS для управления контентом
    
  3. Начальные данные
    - Добавление примеров контента для демонстрации
*/

-- Обновляем таблицу content, если нужно
DO $$
BEGIN
  -- Проверяем, существует ли таблица content
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'content') THEN
    CREATE TABLE content (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      content_json JSONB,
      page TEXT NOT NULL,
      last_updated TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    
    -- Включаем RLS
    ALTER TABLE content ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Обновляем политики для таблицы content
DROP POLICY IF EXISTS "Все могут просматривать контент" ON content;
DROP POLICY IF EXISTS "Только администраторы могут изменять контент" ON content;

-- Новые политики для контента
CREATE POLICY "Все могут просматривать контент" 
  ON content FOR SELECT 
  TO public
  USING (true);

CREATE POLICY "Администраторы могут управлять контентом" 
  ON content FOR ALL 
  TO authenticated
  USING (
    auth.uid() IN (SELECT id FROM admins WHERE role = 'admin')
  )
  WITH CHECK (
    auth.uid() IN (SELECT id FROM admins WHERE role = 'admin')
  );

-- Добавляем примеры контента для демонстрации
INSERT INTO content (type, title, description, content_json, page) VALUES
  (
    'info_card',
    'На природу с комфортом и драйвом!',
    'SUP-доски для озёр, рек и моря — выбери свою!',
    '{"image": "/items/Sup.png", "size": "normal"}',
    'home'
  ),
  (
    'info_card',
    'Закажи SUP с доставкой',
    'Быстрая доставка по всей России',
    '{"image": "/items/Sup2.png", "size": "small"}',
    'home'
  ),
  (
    'info_card',
    'Уже есть SUP? Не забудьте про комплектующие!',
    'Весла, насосы, чехлы и многое другое',
    '{"image": "/items/jacket.png", "size": "small"}',
    'home'
  ),
  (
    'info_card',
    '-15% на одежду для туризма',
    'Специальное предложение на всю коллекцию',
    '{"image": "/JacketSale.png", "size": "normal", "badgeDate": "до 26 июня"}',
    'home'
  ),
  (
    'info_card',
    'Подпишитесь на наш Телеграмм',
    'Получайте актуальные новости и скидки',
    '{"image": "/items/jacket.png", "size": "small", "button": true}',
    'home'
  ),
  (
    'section',
    'Новинки',
    'Последние поступления товаров',
    '{"section": "new-items", "visible": true}',
    'home'
  ),
  (
    'section',
    'Подборки',
    'Категории товаров',
    '{"section": "categories", "visible": true}',
    'home'
  ),
  (
    'section',
    'Акции',
    'Специальные предложения',
    '{"section": "stocks", "visible": true}',
    'home'
  ),
  (
    'navigation',
    'Главная навигация',
    'Основное меню сайта',
    '{"logo": "/Logo.png", "phone": "+7 961 775 7144", "menuItems": [{"name": "Главная", "path": "/"}, {"name": "Контакты", "path": "/contacts"}, {"name": "Корзина", "path": "/cart"}]}',
    'global'
  ),
  (
    'footer',
    'Футер сайта',
    'Информация в подвале сайта',
    '{"companyName": "SUP Store", "address": "г. Екатеринбург, ул. Академика Бардина, 32/1", "phone": "+7 961 775 7144", "email": "volnyigory@mail.ru", "inn": "667104649446"}',
    'global'
  )
ON CONFLICT DO NOTHING;