import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Send, Loader2 } from 'lucide-react';

import { useSettings } from '../lib/context/SettingsContext';
import { contactSchema, ContactFormValues } from '../lib/validation/contactSchema';

import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';

import { Breadcrumbs } from '../lib/utils/BreadCrumbs';
import { ContactInfoCard } from '../components/ui/ContactInfoCard';

export const ContactsPage: React.FC = () => {
  const { settings } = useSettings();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });


  const onSubmit = () => {
    console.log("Sending message...")
  }
  
  const contactEmail = settings?.general?.contactEmail || 'volnyigory@mail.ru';
  const contactPhone = settings?.general?.contactPhone || '+7 (343) 236-63-11';
  const address = settings?.general?.address || 'г. Екатеринбург, ул. Евгения Савкова, д. 6';
  const yandexMapLink = "https://yandex.ru/map-widget/v1/?ll=37.586761%2C55.687151&z=16";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <Breadcrumbs />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Свяжитесь с нами</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Мы всегда рады помочь вам с выбором и ответить на все ваши вопросы.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Левая колонка - Контакты */}
        <div className="lg:col-span-2 space-y-6">
          <ContactInfoCard icon={<MapPin size={24}/>} title="Адрес магазина">
            <p>{address}</p>
            <Link to={yandexMapLink} target="_blank" className="text-blue font-semibold hover:underline">
              Посмотреть на карте →
            </Link>
          </ContactInfoCard>
          <ContactInfoCard icon={<Phone size={24}/>} title="Телефоны">
            <a href={`tel:${contactPhone}`} className="hover:text-blue">{contactPhone}</a>
            <p className="text-xs text-slate-400">Ежедневно с 9:00 до 21:00</p>
          </ContactInfoCard>
          <ContactInfoCard icon={<Mail size={24}/>} title="Электронная почта">
            <a href={`mailto:${contactEmail}`} className="hover:text-blue">{contactEmail}</a>
            <p className="text-xs text-slate-400">Отвечаем в течение 24 часов</p>
          </ContactInfoCard>
        </div>

        {/* Правая колонка - Форма */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Напишите нам</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input label="Ваше имя" placeholder="Иван Иванов" error={errors.name?.message} {...register('name')} />
              <Input label="Телефон" placeholder="+7 (___) ___ __ __" error={errors.phone?.message} {...register('phone')} />
            </div>
            <Input label="Email" type="email" placeholder="example@mail.ru" error={errors.email?.message} {...register('email')} />
            <Textarea label="Сообщение" placeholder="Расскажите, чем мы можем вам помочь..." rows={5} error={errors.message?.message} {...register('message')} />
            
            <div className="flex items-start">
              <input id="consent" type="checkbox" className="h-4 w-4 mt-1 rounded border-gray-300 text-blue focus:ring-blue" {...register('consent')} />
              <label htmlFor="consent" className="ml-3 text-sm text-slate-600">Я согласен на обработку персональных данных</label>
            </div>
            {errors.consent && <p className="text-sm text-red-500 -mt-2 ml-7">{errors.consent.message}</p>}

            <Button type="submit" disabled={false} className="w-full h-12 bg-blue hover:bg-blue/90 text-white rounded-xl text-base font-semibold transition-colors">
               <><Send className="w-5 h-5 mr-2" /> Отправить сообщение</>

            </Button>
          </form>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="w-full h-[500px] rounded-2xl overflow-hidden shadow-lg mt-16"
      >
        <iframe src={yandexMapLink} width="100%" height="100%" loading="lazy" title="Карта" className="border-0" />
      </motion.div>
    </div>
  );
};