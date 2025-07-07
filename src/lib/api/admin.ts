import { supabase } from '../supabase';

// Получение статистики для дашборда
export const getAdminDashboardStats = async () => {
  try {
    // Получаем заказы за сегодня
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data: ordersToday, error: ordersError } = await supabase
      .from('orders')
      .select('total_amount')
      .gte('created_at', today.toISOString())
      .lt('created_at', tomorrow.toISOString());

    if (ordersError) throw ordersError;

    const newOrdersToday = ordersToday?.length || 0;
    const revenueToday = ordersToday?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

    // Получаем товары с низким остатком (для примера, считаем что все товары в наличии)
    const { data: lowStockItems, error: stockError } = await supabase
      .from('products')
      .select('id, name')
      .eq('in_stock', false)
      .limit(5);

    if (stockError) throw stockError;

    // Получаем последние заказы
    const { data: recentOrders, error: recentOrdersError } = await supabase
      .from('orders')
      .select('id, customer_name, created_at, status, total_amount')
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentOrdersError) throw recentOrdersError;

    const formattedRecentOrders = recentOrders?.map(order => ({
      id: `#${order.id}`,
      customer: order.customer_name,
      date: new Date(order.created_at).toLocaleDateString('ru-RU'),
      status: order.status,
      amount: `${Number(order.total_amount).toLocaleString()} ₽`,
    })) || [];

    return {
      newOrdersToday,
      revenueToday,
      visitors: 3456, // Заглушка для посетителей
      lowStockItems: lowStockItems?.map(item => ({ name: item.name, stock: 0 })) || [],
      recentOrders: formattedRecentOrders,
      error: null,
    };
  } catch (error) {
    console.error('Ошибка при получении статистики:', error);
    return {
      newOrdersToday: 0,
      revenueToday: 0,
      visitors: 0,
      lowStockItems: [],
      recentOrders: [],
      error,
    };
  }
};

// Получение всех заказов для админ-панели
export const getAdminOrders = async () => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          price,
          products (
            id,
            name,
            image
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formattedOrders = data?.map(order => ({
      id: `#${order.id}`,
      customer: order.customer_name,
      email: order.customer_email,
      phone: order.customer_phone,
      date: order.created_at,
      status: order.status,
      amount: Number(order.total_amount),
      address: order.delivery_address,
      paymentMethod: order.payment_method,
      notes: order.notes,
      items: order.order_items?.map(item => ({
        name: item.products?.name || 'Неизвестный товар',
        quantity: item.quantity,
        price: Number(item.price),
        image: item.products?.image || null
      })) || [],
    })) || [];

    return { orders: formattedOrders, error: null };
  } catch (error) {
    console.error('Ошибка при получении заказов:', error);
    return { orders: [], error };
  }
};

// Обновление статуса заказа
export const updateOrderStatus = async (orderId: string, newStatus: string) => {
  try {
    const numericOrderId = parseInt(orderId.replace('#', ''));
    
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', numericOrderId);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error) {
    console.error('Ошибка при обновлении статуса заказа:', error);
    return { success: false, error };
  }
};

// Получение всех пользователей для админ-панели
export const getAdminUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formattedUsers = data?.map(user => ({
      id: user.id,
      name: user.name || 'Без имени',
      email: user.email,
      role: user.role || 'customer',
      status: user.status || 'active',
      lastLogin: user.created_at, // Используем дату создания как заглушку для последнего входа
    })) || [];

    return { users: formattedUsers, error: null };
  } catch (error) {
    console.error('Ошибка при получении пользователей:', error);
    return { users: [], error };
  }
};

// Создание нового пользователя (только для админов)
export const createAdminUser = async (userData: {
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
}) => {
  try {
    // Создаем пользователя через auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Не удалось создать пользователя');

    // Создаем профиль пользователя
    const { error: profileError } = await supabase.from('user_profiles').insert({
      id: authData.user.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      status: userData.status,
    });

    if (profileError) throw profileError;

    // Если роль администратор или менеджер, добавляем в таблицу admins
    if (userData.role === 'admin' || userData.role === 'manager') {
      const { error: adminError } = await supabase.from('admins').insert({
        id: authData.user.id,
        username: userData.email.split('@')[0],
        name: userData.name,
        role: userData.role,
      });

      if (adminError) {
        console.error('Ошибка при создании записи администратора:', adminError);
        // Не бросаем ошибку, так как основной профиль создан успешно
      }
    }

    return { user: authData.user, error: null };
  } catch (error) {
    console.error('Ошибка при создании пользователя:', error);
    return { user: null, error };
  }
};

// Обновление пользователя
export const updateAdminUser = async (userId: string, userData: {
  name?: string;
  email?: string;
  role?: string;
  status?: string;
}) => {
  try {
    // Получаем текущие данные пользователя
    const { data: currentUser, error: getCurrentError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (getCurrentError) throw getCurrentError;

    // Обновляем профиль пользователя
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update(userData)
      .eq('id', userId);

    if (updateError) throw updateError;

    // Управляем записью в таблице admins
    if (userData.role) {
      const currentRole = currentUser?.role;
      const newRole = userData.role;

      if ((newRole === 'admin' || newRole === 'manager') && (currentRole !== 'admin' && currentRole !== 'manager')) {
        // Добавляем в admins, если новая роль admin/manager, а старая была customer
        const { error: adminInsertError } = await supabase.from('admins').upsert({
          id: userId,
          username: userData.email?.split('@')[0] || `user_${userId.slice(0, 8)}`,
          name: userData.name || 'Администратор',
          role: newRole,
        });

        if (adminInsertError) {
          console.error('Ошибка при добавлении в admins:', adminInsertError);
        }
      } else if (newRole === 'customer' && (currentRole === 'admin' || currentRole === 'manager')) {
        // Удаляем из admins, если новая роль customer, а старая была admin/manager
        const { error: adminDeleteError } = await supabase
          .from('admins')
          .delete()
          .eq('id', userId);

        if (adminDeleteError) {
          console.error('Ошибка при удалении из admins:', adminDeleteError);
        }
      } else if ((newRole === 'admin' || newRole === 'manager') && (currentRole === 'admin' || currentRole === 'manager')) {
        // Обновляем роль в admins, если и старая, и новая роли admin/manager
        const { error: adminUpdateError } = await supabase
          .from('admins')
          .update({
            role: newRole,
            name: userData.name || 'Администратор',
          })
          .eq('id', userId);

        if (adminUpdateError) {
          console.error('Ошибка при обновлении роли в admins:', adminUpdateError);
        }
      }
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Ошибка при обновлении пользователя:', error);
    return { success: false, error };
  }
};

// "Мягкое" удаление пользователя (деактивация)
export const deactivateAdminUser = async (userId: string) => {
  try {
    // Обновляем статус пользователя на неактивный и роль на customer
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        status: 'inactive',
        role: 'customer',
      })
      .eq('id', userId);

    if (updateError) throw updateError;

    // Удаляем из таблицы admins, если пользователь там есть
    const { error: adminDeleteError } = await supabase
      .from('admins')
      .delete()
      .eq('id', userId);

    // Игнорируем ошибку, если записи в admins не было
    if (adminDeleteError && !adminDeleteError.message.includes('No rows found')) {
      console.error('Ошибка при удалении из admins:', adminDeleteError);
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Ошибка при деактивации пользователя:', error);
    return { success: false, error };
  }
};