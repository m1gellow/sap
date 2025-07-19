import { ContactFormValues } from '../validation/contactSchema';

export const sendFeedback = async (data: ContactFormValues) => {
  console.log('Отправка данных на сервер:', data);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return { success: true, message: 'Сообщение успешно отправлено!' };
};
