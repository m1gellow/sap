import { z } from 'zod';

export const checkoutSchema = z.object({
  deliveryMethod: z.string('Выберите способ доставки'),
  paymentMethod: z.string('Выберите способ оплаты'),

  city: z.string().min(1, 'Город обязателен'),
  region: z.string().min(1, 'Область/край обязательны'),
  address: z.string().min(5, 'Адрес слишком короткий'),

  useProfileData: z.boolean().default(true),
  lastName: z.string().min(2, 'Фамилия обязательна'),
  firstName: z.string().min(2, 'Имя обязательно'),
  middleName: z.string().optional(),
  phone: z.string().min(11, 'Некорректный номер телефона'),
  email: z.string().email('Некорректный email'),
  additionalInfo: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
