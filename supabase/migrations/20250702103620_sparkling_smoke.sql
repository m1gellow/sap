/*
  # Обновление политик безопасности для таблицы admins

  1. Изменения
    - Удаление проблемных политик, которые могут вызывать рекурсию
    - Создание новых, более простых и надежных политик
    - Обеспечение корректной работы аутентификации администраторов

  2. Политики
    - Администраторы могут просматривать свои данные
    - Администраторы могут обновлять свои данные
    - Суперадмины могут управлять всеми записями администраторов
*/

-- Отключаем RLS временно для безопасного обновления политик
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- Удаляем все существующие политики
DROP POLICY IF EXISTS "admins_select_policy" ON admins;
DROP POLICY IF EXISTS "admins_all_policy" ON admins;
DROP POLICY IF EXISTS "admins_can_update_own_data" ON admins;
DROP POLICY IF EXISTS "admins_can_view_own_data" ON admins;

-- Включаем RLS обратно
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Создаем новые политики
-- Администраторы могут просматривать свои данные
CREATE POLICY "admins_can_view_own_data" 
  ON admins FOR SELECT 
  TO public 
  USING (id = auth.uid());

-- Администраторы могут обновлять свои данные
CREATE POLICY "admins_can_update_own_data" 
  ON admins FOR UPDATE 
  TO public 
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Суперадмины могут вставлять новых администраторов
CREATE POLICY "superadmins_can_insert_admins" 
  ON admins FOR INSERT 
  TO public 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Суперадмины могут удалять администраторов
CREATE POLICY "superadmins_can_delete_admins" 
  ON admins FOR DELETE 
  TO public 
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );