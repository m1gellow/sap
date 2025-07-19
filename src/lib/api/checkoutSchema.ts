import { z } from 'zod';

export const checkoutSchema = z.object({
  // Способы получения и оплаты
  deliveryMethod: z.string('Пожалуйста, выберите способ доставки'),
  paymentMethod: z.string('Пожалуйста, выберите способ оплаты'),

  // Адрес доставки
  city: z.string().min(1, 'Город обязателен для заполнения'),
  region: z.string().min(1, 'Область или край обязательны'),
  address: z.string().min(5, 'Адрес слишком короткий'),
  
  // Данные получателя
  useProfileData: z.boolean().default(true),
  lastName: z.string().min(1, 'Фамилия обязательна'),
  firstName: z.string().min(1, 'Имя обязательно'),
  middleName: z.string().optional(),
  phone: z.string().min(10, 'Некорректный номер телефона'),
  email: z.string().email('Некорректный email'),
  additionalInfo: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;