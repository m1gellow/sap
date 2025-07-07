/*
  # Исправление удаления товаров с проверкой статуса заказов

  1. Новые политики
    - Добавление политики для администраторов на удаление order_items
    - Разрешение удаления позиций заказов только для завершенных/отмененных заказов

  2. Безопасность
    - Администраторы могут удалять позиции заказов только если заказ завершен или отменен
    - Это позволит корректно удалять товары, которые есть только в завершенных заказах
*/

-- Добавляем политику для администраторов на удаление order_items
CREATE POLICY "admins_can_delete_order_items_from_completed_orders" 
  ON order_items FOR DELETE 
  TO authenticated
  USING (
    auth.uid() IN (SELECT id FROM admins WHERE role = 'admin') AND
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.status IN ('Завершен', 'Отменен')
    )
  );