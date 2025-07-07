/*
  # Создание схемы базы данных для интернет-магазина Волны&Горы

  1. Новые Таблицы
    - `categories` - категории товаров
    - `products` - товары
    - `orders` - заказы
    - `order_items` - позиции заказов
    - `user_profiles` - профили пользователей
    - `favorites` - избранные товары
    - `admins` - администраторы
    - `content` - контент сайта
    - `settings` - настройки сайта

  2. Security
    - Включен RLS для всех таблиц
    - Настроены политики доступа для разных ролей пользователей
*/

-- Создание таблицы категорий
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  name TEXT NOT NULL,
  active BOOLEAN DEFAULT true NOT NULL
);

-- Создание таблицы товаров
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  price DECIMAL NOT NULL,
  image TEXT NOT NULL,
  category_id INTEGER NOT NULL REFERENCES categories(id),
  in_stock BOOLEAN DEFAULT true NOT NULL,
  description TEXT
);

-- Создание таблицы заказов
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  total_amount DECIMAL NOT NULL,
  status TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  notes TEXT
);

-- Создание таблицы позиций заказа
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL NOT NULL
);

-- Создание таблицы профилей пользователей
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  avatar_url TEXT
);

-- Создание таблицы избранных товаров
CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE(user_id, product_id)
);

-- Создание таблицы администраторов
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  username TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  last_login TIMESTAMPTZ
);

-- Создание таблицы контента сайта
CREATE TABLE IF NOT EXISTS content (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content_json JSONB,
  page TEXT NOT NULL,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Создание таблицы настроек сайта
CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT
);

-- Включение Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Политики для таблицы категорий
CREATE POLICY "Все могут просматривать категории" 
  ON categories FOR SELECT 
  USING (true);

CREATE POLICY "Только администраторы могут изменять категории" 
  ON categories FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id = auth.uid()
    )
  );

-- Политики для таблицы товаров
CREATE POLICY "Все могут просматривать товары" 
  ON products FOR SELECT 
  USING (true);

CREATE POLICY "Только администраторы могут изменять товары" 
  ON products FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id = auth.uid()
    )
  );

-- Политики для таблицы заказов
CREATE POLICY "Пользователи могут просматривать свои заказы" 
  ON orders FOR SELECT 
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Пользователи могут создавать свои заказы" 
  ON orders FOR INSERT 
  WITH CHECK (
    auth.uid() = user_id OR 
    user_id IS NULL
  );

CREATE POLICY "Только администраторы могут изменять заказы" 
  ON orders FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id = auth.uid()
    )
  );

-- Политики для таблицы позиций заказа
CREATE POLICY "Пользователи могут просматривать позиции своих заказов" 
  ON order_items FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.user_id = auth.uid() OR EXISTS (
        SELECT 1 FROM admins 
        WHERE id = auth.uid()
      ))
    )
  );

CREATE POLICY "Пользователи могут создавать позиции своих заказов" 
  ON order_items FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.user_id = auth.uid() OR EXISTS (
        SELECT 1 FROM admins 
        WHERE id = auth.uid()
      ))
    )
  );

-- Политики для таблицы профилей пользователей
CREATE POLICY "Пользователи могут просматривать свои профили" 
  ON user_profiles FOR SELECT 
  USING (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Пользователи могут изменять свои профили" 
  ON user_profiles FOR UPDATE 
  USING (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Пользователи могут создавать свои профили" 
  ON user_profiles FOR INSERT 
  WITH CHECK (
    auth.uid() = id
  );

-- Политики для таблицы избранного
CREATE POLICY "Пользователи могут просматривать свои избранные товары" 
  ON favorites FOR SELECT 
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Пользователи могут добавлять товары в избранное" 
  ON favorites FOR INSERT 
  WITH CHECK (
    auth.uid() = user_id
  );

CREATE POLICY "Пользователи могут удалять свои избранные товары" 
  ON favorites FOR DELETE 
  USING (
    auth.uid() = user_id
  );

-- Политики для таблицы администраторов
CREATE POLICY "Только администраторы могут просматривать таблицу администраторов" 
  ON admins FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Только суперадмины могут изменять таблицу администраторов" 
  ON admins FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Политики для таблицы контента
CREATE POLICY "Все могут просматривать контент" 
  ON content FOR SELECT 
  USING (true);

CREATE POLICY "Только администраторы могут изменять контент" 
  ON content FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id = auth.uid()
    )
  );

-- Политики для таблицы настроек
CREATE POLICY "Все могут просматривать настройки" 
  ON settings FOR SELECT 
  USING (true);

CREATE POLICY "Только администраторы могут изменять настройки" 
  ON settings FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id = auth.uid()
    )
  );