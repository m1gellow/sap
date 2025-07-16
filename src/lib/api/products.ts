import { supabase } from '../supabase';
import { Product } from '../types';

// Получение всех товаров
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          name
        )
      `)
      .order('id', { ascending: true });

    if (error) throw error;

    return data.map((product) => ({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: `${product.price} ₽`,
      priceValue: product.price,
      image: product.image,
      category: product.categories?.name || 'Без категории',
      inStock: product.in_stock,
      description: product.description || '',
    }));
  } catch (error) {
    console.error('Ошибка при загрузке товаров:', error);
    throw error;
  }
};

// Получение товара по ID
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          name
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      brand: data.brand,
      price: `${data.price} ₽`,
      priceValue: data.price,
      image: data.image,
      category: data.categories?.name || 'Без категории',
      inStock: data.in_stock,
      description: data.description || '',
    };
  } catch (error) {
    console.error('Ошибка при загрузке товара:', error);
    throw error;
  }
};

// Получение товаров по категории
export const getProductsByCategory = async (categoryName: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories!inner (
          name
        )
      `)
      .eq('categories.name', categoryName)
      .order('id', { ascending: true });

    if (error) throw error;

    return data.map((product) => ({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: `${product.price} ₽`,
      priceValue: product.price,
      image: product.image,
      category: product.categories?.name || 'Без категории',
      inStock: product.in_stock,
      description: product.description || '',
    }));
  } catch (error) {
    console.error('Ошибка при загрузке товаров по категории:', error);
    throw error;
  }
};

// Получение всех категорий
export const getAllCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('active', true)
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Ошибка при загрузке категорий:', error);
    throw error;
  }
};

// Создание нового товара
export const createProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
  try {
    // Сначала получаем ID категории по имени
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('name', productData.category)
      .single();

    if (categoryError) throw categoryError;
    if (!categoryData) throw new Error('Категория не найдена');

    // Создаем товар
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: productData.name,
        brand: productData.brand,
        price: productData.priceValue,
        image: productData.image,
        category_id: categoryData.id,
        in_stock: productData.inStock,
        description: productData.description,
      })
      .select(`
        *,
        categories (
          name
        )
      `)
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      brand: data.brand,
      price: `${data.price} ₽`,
      priceValue: data.price,
      image: data.image,
      category: data.categories?.name || 'Без категории',
      inStock: data.in_stock,
      description: data.description || '',
    };
  } catch (error) {
    console.error('Ошибка при создании товара:', error);
    throw error;
  }
};

// Обновление товара
export const updateProduct = async (id: number, productData: Partial<Product>): Promise<Product> => {
  try {
    let categoryId: number | undefined;

    // Если изменяется категория, получаем её ID
    if (productData.category) {
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('name', productData.category)
        .single();

      if (categoryError) throw categoryError;
      if (!categoryData) throw new Error('Категория не найдена');
      categoryId = categoryData.id;
    }

    // Подготавливаем данные для обновления
    const updateData: any = {};
    if (productData.name !== undefined) updateData.name = productData.name;
    if (productData.brand !== undefined) updateData.brand = productData.brand;
    if (productData.priceValue !== undefined) updateData.price = productData.priceValue;
    if (productData.image !== undefined) updateData.image = productData.image;
    if (categoryId !== undefined) updateData.category_id = categoryId;
    if (productData.inStock !== undefined) updateData.in_stock = productData.inStock;
    if (productData.description !== undefined) updateData.description = productData.description;

    // Обновляем товар
    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        categories (
          name
        )
      `)
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      brand: data.brand,
      price: `${data.price} ₽`,
      priceValue: data.price,
      image: data.image,
      category: data.categories?.name || 'Без категории',
      inStock: data.in_stock,
      description: data.description || '',
    };
  } catch (error) {
    console.error('Ошибка при обновлении товара:', error);
    throw error;
  }
};

// Удаление товара
export const deleteProduct = async (id: number): Promise<void> => {
  try {
    // 1. Проверяем связанные позиции заказов
    const { data: orderItems, error: orderItemsError } = await supabase
      .from('order_items')
      .select('order_id')
      .eq('product_id', id);

    if (orderItemsError) throw orderItemsError;

    if (orderItems && orderItems.length > 0) {
      const orderIds = orderItems.map(item => item.order_id);

      // 2. Получаем статусы связанных заказов
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id, status')
        .in('id', orderIds);

      if (ordersError) throw ordersError;

      // 3. Проверяем наличие активных заказов
      const activeOrders = orders?.filter(order => 
        order.status !== 'Завершен' && order.status !== 'Отменен'
      ) || [];

      if (activeOrders.length > 0) {
        throw new Error(
          `Невозможно удалить товар: он включен в ${activeOrders.length} активных заказов. ` +
          `Дождитесь завершения или отмены этих заказов.`
        );
      }

      // 4. Удаляем связанные позиции заказов (только для завершенных/отмененных заказов)
      const { error: deleteOrderItemsError } = await supabase
        .from('order_items')
        .delete()
        .eq('product_id', id);

      if (deleteOrderItemsError) {
        throw new Error(`Ошибка при удалении связанных позиций заказов: ${deleteOrderItemsError.message}`);
      }
    }

    // 5. Удаляем товар
    const { error: deleteProductError } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (deleteProductError) {
      throw new Error(`Ошибка при удалении товара: ${deleteProductError.message}`);
    }

  } catch (error) {
    console.error('Ошибка при удалении товара:', error);
    throw error;
  }
};