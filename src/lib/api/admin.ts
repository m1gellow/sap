import { MoySkladProduct } from '../../types/types';
import { supabase } from '../supabase';

// Получение статистики для админ-панели
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

    // Получаем товары с низким остатком
    const { data: lowStockItems, error: stockError } = await supabase
      .from('moysklad_products' as never)
      .select('id, name, stock')
      .lte('stock', 2)
      .eq('archived', false)
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
      amount: `${Number(order.total_amount).toLocaleString('ru-RU')} ₽`,
    })) || [];

    return {
      newOrdersToday,
      revenueToday,
      visitors: 3456,
      lowStockItems: lowStockItems?.map(item => ({ 
        name: item.name, 
        stock: item.stock 
      })) || [],
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

// Получение списка заказов
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
          moysklad_products (
            id,
            name,
            image_url
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
      date: new Date(order.created_at).toLocaleDateString('ru-RU'),
      status: order.status,
      amount: Number(order.total_amount),
      address: order.delivery_address,
      paymentMethod: order.payment_method,
      notes: order.notes,
      items: order.order_items?.map(item => ({
        id: item.id,
        name: item.moysklad_products?.name || 'Неизвестный товар',
        quantity: item.quantity,
        price: Number(item.price),
        image: item.moysklad_products?.image_url || null,
        productId: item.moysklad_products?.id || null
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

// Получение списка товаров
export const getAdminProducts = async (params?: {
  search?: string;
  archived?: boolean;
  minStock?: number;
}) => {
  try {
    let query = supabase
      .from('moysklad_products')
      .select('*')
      .order('created_at', { ascending: false });

    if (params?.search) {
      query = query.ilike('name', `%${params.search}%`);
    }

    if (params?.archived !== undefined) {
      query = query.eq('archived', params.archived);
    } else {
      query = query.eq('archived', false);
    }

    if (params?.minStock !== undefined) {
      query = query.gte('stock', params.minStock);
    }

    const { data, error } = await query;

    if (error) throw error;

    const formattedProducts: MoySkladProduct[] = data?.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      archived: product.archived,
      path_name: product.path_name,
      sale_price: product.sale_price ? Number(product.sale_price) : null,
      article: product.article,
      weight: product.weight ? Number(product.weight) : null,
      image_url: product.image_url,
      stock: product.stock,
      reserve: product.reserve,
      in_transit: product.in_transit,
      created_at: product.created_at
    })) || [];

    return { products: formattedProducts, error: null };
  } catch (error) {
    console.error('Ошибка при получении товаров:', error);
    return { products: [], error };
  }
};

// Обновление товара
export const updateAdminProduct = async (
  productId: string, 
  productData: Partial<MoySkladProduct>
) => {
  try {
    // Преобразуем числовые поля
    const updateData: any = {
      ...productData,
      sale_price: productData.sale_price !== undefined 
        ? productData.sale_price?.toString() 
        : undefined,
      weight: productData.weight !== undefined 
        ? productData.weight?.toString() 
        : undefined
    };

    const { error } = await supabase
      .from('moysklad_products')
      .update(updateData)
      .eq('id', productId);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error) {
    console.error('Ошибка при обновлении товара:', error);
    return { success: false, error };
  }
};

// Получение списка пользователей
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
      lastLogin: user.last_login_at || user.created_at,
    })) || [];

    return { users: formattedUsers, error: null };
  } catch (error) {
    console.error('Ошибка при получении пользователей:', error);
    return { users: [], error };
  }
};

// Создание пользователя
export const createAdminUser = async (userData: {
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
}) => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Не удалось создать пользователя');

    const { error: profileError } = await supabase.from('user_profiles').insert({
      id: authData.user.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      status: userData.status,
    });

    if (profileError) throw profileError;

    if (userData.role === 'admin' || userData.role === 'manager') {
      const { error: adminError } = await supabase.from('admins').insert({
        id: authData.user.id,
        username: userData.email.split('@')[0],
        name: userData.name,
        role: userData.role,
      });

      if (adminError) console.error('Ошибка при создании записи администратора:', adminError);
    }

    return { user: authData.user, error: null };
  } catch (error) {
    console.error('Ошибка при создании пользователя:', error);
    return { user: null, error };
  }
};

// Обновление пользователя
export const updateAdminUser = async (
  userId: string, 
  userData: {
    name?: string;
    email?: string;
    role?: string;
    status?: string;
  }
) => {
  try {
    const { data: currentUser, error: getCurrentError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (getCurrentError) throw getCurrentError;

    const { error: updateError } = await supabase
      .from('user_profiles')
      .update(userData)
      .eq('id', userId);

    if (updateError) throw updateError;

    if (userData.role) {
      const currentRole = currentUser?.role;
      const newRole = userData.role;

      // Логика управления таблицей admins
      if ((newRole === 'admin' || newRole === 'manager') && 
          (currentRole !== 'admin' && currentRole !== 'manager')) {
        await supabase.from('admins').upsert({
          id: userId,
          username: userData.email?.split('@')[0] || `user_${userId.slice(0, 8)}`,
          name: userData.name || 'Администратор',
          role: newRole,
        });
      } else if (newRole === 'customer' && 
                (currentRole === 'admin' || currentRole === 'manager')) {
        await supabase.from('admins').delete().eq('id', userId);
      } else if ((newRole === 'admin' || newRole === 'manager') && 
                (currentRole === 'admin' || currentRole === 'manager')) {
        await supabase
          .from('admins')
          .update({
            role: newRole,
            name: userData.name || 'Администратор',
          })
          .eq('id', userId);
      }
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Ошибка при обновлении пользователя:', error);
    return { success: false, error };
  }
};

// Деактивация пользователя
export const deactivateAdminUser = async (userId: string) => {
  try {
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        status: 'inactive',
        role: 'customer',
      })
      .eq('id', userId);

    if (updateError) throw updateError;

    await supabase.from('admins').delete().eq('id', userId);

    return { success: true, error: null };
  } catch (error) {
    console.error('Ошибка при деактивации пользователя:', error);
    return { success: false, error };
  }
};

// Получение данных одного товара
export const getAdminProduct = async (productId: string) => {
  try {
    const { data, error } = await supabase
      .from('moysklad_products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error) throw error;

    const product: MoySkladProduct = {
      id: data.id,
      name: data.name,
      description: data.description,
      archived: data.archived,
      path_name: data.path_name,
      sale_price: data.sale_price ? Number(data.sale_price) : null,
      article: data.article,
      weight: data.weight ? Number(data.weight) : null,
      image_url: data.image_url,
      stock: data.stock,
      reserve: data.reserve,
      in_transit: data.in_transit,
      created_at: data.created_at
    };

    return { product, error: null };
  } catch (error) {
    console.error('Ошибка при получении товара:', error);
    return { product: null, error };
  }
};