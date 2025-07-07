/*
  # Добавление нового администратора
  
  1. Изменения
    - Добавление записи в таблице admins для пользователя с id 80514b1f-0b7d-419d-9ef6-eb3e975e8ed9
    - Создание профиля пользователя если он отсутствует
*/

-- Убедимся, что у пользователя есть профиль
INSERT INTO user_profiles (id, name, email)
VALUES 
  ('80514b1f-0b7d-419d-9ef6-eb3e975e8ed9', 'Администратор сайта', 'yugoslaviagrill96@gmail.com')
ON CONFLICT (id) DO UPDATE
SET 
  name = EXCLUDED.name,
  email = EXCLUDED.email;

-- Добавление записи в таблицу администраторов
INSERT INTO admins (id, username, name, role, last_login)
VALUES (
  '80514b1f-0b7d-419d-9ef6-eb3e975e8ed9',
  'admin_user',
  'Администратор сайта',
  'admin',
  CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO UPDATE
SET 
  username = EXCLUDED.username,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  last_login = EXCLUDED.last_login;

-- Обновим JWT claims пользователя, добавив роль admin
UPDATE auth.users
SET raw_app_meta_data = jsonb_set(
  COALESCE(raw_app_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE id = '80514b1f-0b7d-419d-9ef6-eb3e975e8ed9';