
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { ShoppingCart, Home, Search } from 'lucide-react';
import { SectionWrapper } from '../components/ui/SectionWrapper';
import { Button } from '../components/ui/button';

export const NotFoundPage = () => {
  return (
    <SectionWrapper
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      innerContainerClassName="max-w-7xl mx-auto text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center"
      >
        {/* Анимированное число 404 */}
        <motion.div 
          className="text-9xl font-bold text-gray-800 mb-6"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          404
        </motion.div>

        {/* Заголовок */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Упс! Страница не найдена
        </h1>

        {/* Описание */}
        <p className="text-xl text-gray-600 max-w-2xl mb-8">
          Похоже, мы не можем найти то, что вы ищете. Возможно, страница была перемещена или удалена.
        </p>

        {/* Кнопки действий */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Button
            asChild
            className="bg-blue  px-6 py-3 text-lg shadow-md"
          >
            <Link to="/" className="flex items-center text-skyblue">
              <Home className="mr-2 h-5 w-5" />
              На главную
            </Link>
          </Button>

          <Button
            variant="outline"
            className="border-blue-600  px-6 py-3 text-lg shadow-sm"
            asChild
          >
            <Link to="/catalog" className="flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5" />
              В каталог
            </Link>
          </Button>

         
        </div>

        {/* Дополнительная информация */}
        <div className="text-gray-500 text-sm">
          <p>Если вы считаете, что это ошибка, пожалуйста, свяжитесь с нашей поддержкой</p>
        </div>

        {/* Декоративный элемент */}
        <motion.div
          className="mt-12 w-32 h-1 bg-blue-600 rounded-full"
          animate={{ width: ['0%', '100%', '0%'] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </motion.div>
    </SectionWrapper>
  );
};