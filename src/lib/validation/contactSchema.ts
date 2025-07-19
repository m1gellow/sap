import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'Имя слишком короткое'),
  phone: z.string().min(10, 'Некорректный номер телефона'),
  email: z.string().email('Некорректный email'),
  message: z.string().min(10, 'Сообщение слишком короткое'),
  consent: z.boolean().refine(val => val === true, {
    message: 'Необходимо согласие на обработку данных',
  }),
});

export type ContactFormValues = z.infer<typeof contactSchema>;