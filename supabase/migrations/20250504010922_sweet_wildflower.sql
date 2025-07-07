/*
  # Исправление политик доступа для таблицы admins

  1. Изменения
    - Удаление проблемных политик, вызывающих бесконечную рекурсию
    - Создание новых политик доступа с корректным синтаксисом проверки JWT
  
  2. Политики
    - Новая политика для SELECT: разрешает пользователю просматривать только свою запись
    - Новая политика для ALL: разрешает действия только администраторам
*/

-- Сначала удаляем проблемные политики
DROP POLICY IF EXISTS "Только администраторы могут просм" ON public.admins;
DROP POLICY IF EXISTS "Только суперадмины могут изменять" ON public.admins;

-- Создаем новую политику для выбора данных (SELECT), используя auth.uid() напрямую
CREATE POLICY "admins_select_policy" 
ON public.admins 
FOR SELECT 
TO public 
USING (id = auth.uid());

-- Создаем новую политику для изменения данных (ALL), используя правильный синтаксис для JWT
CREATE POLICY "admins_all_policy" 
ON public.admins 
FOR ALL 
TO public 
USING (
  id = auth.uid() AND 
  auth.jwt() ->> 'role' = 'admin'
);