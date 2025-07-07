/*
  # Создание тестового администратора

  1. Изменения
    - Создание тестового пользователя в auth.users
    - Создание профиля пользователя в user_profiles
    - Добавление записи в таблицу admins
    - Установка правильной роли в метаданных пользователя

  2. Тестовые данные
    - Email: admin@example.com
    - Пароль: admin123
    - Роль: admin
*/

-- Создаем тестового администратора
-- Сначала проверяем, существует ли уже такой пользователь
DO $$
DECLARE
    admin_user_id UUID;
    admin_email TEXT := 'admin@example.com';
    admin_password TEXT := 'admin123';
    admin_name TEXT := 'Администратор';
BEGIN
    -- Проверяем, есть ли уже пользователь с таким email
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = admin_email;

    -- Если пользователя нет, создаем его
    IF admin_user_id IS NULL THEN
        -- Генерируем UUID для нового пользователя
        admin_user_id := gen_random_uuid();
        
        -- Вставляем пользователя в auth.users
        INSERT INTO auth.users (
            id,
            instance_id,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            raw_app_meta_data,
            raw_user_meta_data,
            is_super_admin,
            role
        ) VALUES (
            admin_user_id,
            '00000000-0000-0000-0000-000000000000',
            admin_email,
            crypt(admin_password, gen_salt('bf')),
            now(),
            now(),
            now(),
            '{"provider": "email", "providers": ["email"], "role": "admin"}',
            '{"name": "' || admin_name || '"}',
            false,
            'authenticated'
        );
    END IF;

    -- Создаем или обновляем профиль пользователя
    INSERT INTO user_profiles (id, name, email, role, status)
    VALUES (admin_user_id, admin_name, admin_email, 'admin', 'active')
    ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        role = EXCLUDED.role,
        status = EXCLUDED.status;

    -- Создаем или обновляем запись администратора
    INSERT INTO admins (id, username, name, role, last_login)
    VALUES (admin_user_id, 'admin', admin_name, 'admin', now())
    ON CONFLICT (id) DO UPDATE SET
        username = EXCLUDED.username,
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        last_login = EXCLUDED.last_login;

    -- Обновляем метаданные пользователя для корректной работы JWT
    UPDATE auth.users
    SET raw_app_meta_data = jsonb_set(
        COALESCE(raw_app_meta_data, '{}'::jsonb),
        '{role}',
        '"admin"'
    )
    WHERE id = admin_user_id;

    RAISE NOTICE 'Тестовый администратор создан/обновлен: email=%, id=%', admin_email, admin_user_id;
END $$;

-- Добавляем несколько категорий по умолчанию, если их нет
INSERT INTO categories (name, active) VALUES
    ('SUP доски', true),
    ('Комплектующие', true),
    ('Насосы', true),
    ('Гермомешки и сумки', true),
    ('Спасательные жилеты', true),
    ('Одежда', true)
ON CONFLICT (name) DO NOTHING;

-- Добавляем несколько тестовых товаров, если их нет
DO $$
DECLARE
    sup_category_id INTEGER;
    accessories_category_id INTEGER;
BEGIN
    -- Получаем ID категорий
    SELECT id INTO sup_category_id FROM categories WHERE name = 'SUP доски' LIMIT 1;
    SELECT id INTO accessories_category_id FROM categories WHERE name = 'Комплектующие' LIMIT 1;

    -- Добавляем тестовые товары
    IF sup_category_id IS NOT NULL THEN
        INSERT INTO products (name, brand, price, image, category_id, in_stock, description) VALUES
            ('AQUATONE Wave All-round SUP', 'AQUATONE', 14000, '/ProductCardItem.png', sup_category_id, true, 'Универсальная SUP-доска для начинающих и опытных пользователей'),
            ('AZTRON 9.0 Fiberglass Fin', 'AZTRON', 16500, '/ProductCardItem.png', sup_category_id, true, 'Профессиональная SUP-доска с фиберглассовым плавником'),
            ('Jobe Aero Venta 9.6', 'Jobe', 18900, '/ProductCardItem.png', sup_category_id, true, 'Надувная SUP-доска премиум класса')
        ON CONFLICT (name) DO NOTHING;
    END IF;

    IF accessories_category_id IS NOT NULL THEN
        INSERT INTO products (name, brand, price, image, category_id, in_stock, description) VALUES
            ('Весло алюминиевое', 'GQ', 2500, '/ProductCardItem.png', accessories_category_id, true, 'Легкое алюминиевое весло для SUP'),
            ('Насос высокого давления', 'AQUATONE', 3200, '/ProductCardItem.png', accessories_category_id, true, 'Двухходовой насос для быстрой накачки SUP-досок')
        ON CONFLICT (name) DO NOTHING;
    END IF;
END $$;