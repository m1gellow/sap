/*
  # Добавление колонок role и status в таблицу user_profiles

  1. Изменения
    - Добавление колонки `role` с значением по умолчанию 'customer'
    - Добавление колонки `status` с значением по умолчанию 'active'
    - Обновление существующих записей с дефолтными значениями

  2. Безопасность
    - Обновление политик RLS для работы с новыми колонками
*/

-- Добавляем колонку role, если её нет
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN role VARCHAR DEFAULT 'customer' NOT NULL;
  END IF;
END $$;

-- Добавляем колонку status, если её нет
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'status'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN status VARCHAR DEFAULT 'active' NOT NULL;
  END IF;
END $$;

-- Обновляем существующие записи, если у них нет значений role и status
UPDATE user_profiles 
SET 
  role = COALESCE(role, 'customer'),
  status = COALESCE(status, 'active')
WHERE role IS NULL OR status IS NULL;

-- Обновляем политики RLS для user_profiles
DROP POLICY IF EXISTS "users_can_insert_own_or_admin_can_insert_all" ON user_profiles;
DROP POLICY IF EXISTS "users_can_update_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "users_can_view_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "admins_can_view_all_profiles" ON user_profiles;
DROP POLICY IF EXISTS "admins_can_update_all_profiles" ON user_profiles;
DROP POLICY IF EXISTS "admins_can_delete_users" ON user_profiles;

-- Политики для пользователей
CREATE POLICY "users_can_view_own_profile" 
  ON user_profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "users_can_update_own_profile" 
  ON user_profiles FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "users_can_insert_own_or_admin_can_insert_all" 
  ON user_profiles FOR INSERT 
  WITH CHECK (
    auth.uid() = id OR 
    auth.uid() IN (SELECT id FROM admins WHERE role = 'admin')
  );

-- Политики для администраторов
CREATE POLICY "admins_can_view_all_profiles" 
  ON user_profiles FOR SELECT 
  USING (
    auth.uid() IN (SELECT id FROM admins WHERE role = 'admin')
  );

CREATE POLICY "admins_can_update_all_profiles" 
  ON user_profiles FOR UPDATE 
  USING (
    auth.uid() IN (SELECT id FROM admins WHERE role = 'admin')
  );

CREATE POLICY "admins_can_delete_users" 
  ON user_profiles FOR DELETE 
  USING (
    auth.uid() IN (SELECT id FROM admins WHERE role = 'admin')
  );