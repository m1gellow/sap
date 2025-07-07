/*
  # Обновление связи пользователя-администратора

  1. Изменения
    - Обновление поля username администратора, чтобы оно соответствовало email
    - Добавление политик безопасности для корректной работы аутентификации
  
  2. Безопасность
    - Улучшение политик безопасности для таблицы admins
*/

-- Обновляем username администратора, чтобы он соответствовал email
UPDATE admins
SET username = 'yugoslaviagrill96@gmail.com'
WHERE id = '80514b1f-0b7d-419d-9ef6-eb3e975e8ed9';

-- Обновление JWT-токена пользователя, добавление роли admin
UPDATE auth.users
SET raw_app_meta_data = jsonb_set(
  COALESCE(raw_app_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE id = '80514b1f-0b7d-419d-9ef6-eb3e975e8ed9';

-- Проверка и обновление политик доступа для администраторов
DROP POLICY IF EXISTS "admins_select_policy" ON public.admins;
DROP POLICY IF EXISTS "admins_all_policy" ON public.admins;

-- Политика для чтения своих данных
CREATE POLICY "admins_select_policy" 
ON public.admins 
FOR SELECT 
TO public 
USING (id = auth.uid());

-- Политика для всех операций, позволяющая админам редактировать свои данные
CREATE POLICY "admins_all_policy" 
ON public.admins 
FOR ALL 
TO public 
USING (id = auth.uid());