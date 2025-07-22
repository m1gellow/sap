import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { ShoppingCart, Home } from 'lucide-react';
import { SectionWrapper } from '../components/ui/SectionWrapper';
import { Button } from '../components/ui/button';
import MainButton from '../components/ui/MainButton';

export const NotFoundPage = () => {
  return (
    // SectionWrapper теперь имеет overflow-hidden, чтобы волны не вылезали за его пределы
    <SectionWrapper
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      innerContainerClassName="max-w-7xl mx-auto text-center"
    >
      {/* 
        Контейнер для всего контента. 
        z-10 ставит его выше фонового изображения.
      */}
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <motion.div
            className="text-9xl font-bold text-gray-800 mb-6 z-50"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            404
          </motion.div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">Упс! Кажется, вы сбились с курса</h1>

          <p className="text-xl text-gray-600 max-w-2xl mb-8">
            Страница, которую вы ищете, уплыла по течению. Но не волнуйтесь, мы поможем вам вернуться на берег!
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link to="/" className="flex items-center text-white">
              <MainButton variant="secondary">
                {' '}
                <Home className="mr-2 h-5 w-5" />
                На главную
              </MainButton>
            </Link>

            <Link to="/catalog" className="flex items-center">
              <MainButton variant="secondary">
                {' '}
                <ShoppingCart className="mr-2 h-5 w-5" /> В каталог
              </MainButton>
            </Link>
          </div>

          <div className="text-gray-500 text-sm">
            <p>Если вы считаете, что это ошибка, пожалуйста, свяжитесь с нашей поддержкой</p>
          </div>
        </motion.div>
      </div>
      <motion.div
        className="absolute bottom-0 left-0 right-0 w-full  " // z-0 ставит его на самый нижний слой
        initial={{ y: '100%' }} // Начинает за пределами экрана (снизу)
        animate={{ y: '20%' }} // Плавно "всплывает" до 20% от своей высоты
        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
      >
        <img
          src="/NotFoundBg.png" // Путь к изображению в папке public
          alt="Фоновые волны"
          className="w-full h-full object-cover z-50 opacity-50" // object-cover чтобы изображение заполнило контейнер
        />
        {/* Добавляем градиент сверху, чтобы сгладить переход */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/0 to-white"></div>
      </motion.div>
    </SectionWrapper>
  );
};
