import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../components/ui/button';
import { SectionWrapper } from '../components/ui/SectionWrapper';

export const OrderSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <SectionWrapper title="Заказ оформлен" className="px-4 lg:px-8">
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center"
        >
          {/* Анимированная иконка успеха */}
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
              }}
              className="bg-green-50 p-5 rounded-full"
            >
              <CheckCircle className="h-16 w-16 text-green-600" strokeWidth={1.5} />
            </motion.div>
          </div>

          {/* Заголовок и описание */}
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Заказ успешно оформлен!</h1>
          <p className="text-gray-600 mb-6">
            Спасибо за ваш заказ. Мы свяжемся с Вами!
          </p>

          {/* Индикатор прогресса */}
          <div className="mb-8">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 4.5, ease: 'linear' }}
                className="h-full bg-green-500"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">Автоматический переход через 5 секунд...</p>
          </div>

          {/* Кнопки действий */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Вернуться назад
            </Button>
            <Button
              onClick={() => navigate('/')}
              className="gap-2 bg-blue text-skyblue"
            >
              <Home className="w-4 h-4" />
              На главную
            </Button>
          </div>
        </motion.div>

        {/* Дополнительная информация */}
        <div className="mt-8 text-center max-w-md">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Что дальше?</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>✓ Получите sms / email с деталями заказа</li>
            <li>✓ Менеджер подтвердит заказ в течение 30 минут</li>
          </ul>
        </div>
      </div>
    </SectionWrapper>
  );
};