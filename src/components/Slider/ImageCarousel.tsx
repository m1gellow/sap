import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

interface ImageCarouselProps {
  images: string[];
  autoPlay?: boolean;
  interval?: number;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, autoPlay = true, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  useEffect(() => {
    if (isPlaying && !isPaused && images.length > 1) {
      timerRef.current = setInterval(() => {
        setDirection(1);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, interval);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isPaused, images.length, interval]);

  const goToPrevious = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlaying(false);
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlaying(false);
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToSlide = (index: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlaying(false);
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const actionButtons = [
    { id: 1, text: 'Купить Sup', delay: 0.4, href: '/catalog' },
    { id: 2, text: 'Аренда', delay: 0.5, href: '/catalog' },
    { id: 3, text: 'Аксессуары', delay: 0.6, href: '/catalog' },
  ];

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Левая кнопка навигации */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-50">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="pointer-events-auto">
          <SliderButton onClick={goToPrevious} type="prev" />
        </motion.div>
      </div>

      {/* Правая кнопка навигации */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-50">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="pointer-events-auto">
          <SliderButton onClick={goToNext} type="next" />
        </motion.div>
      </div>

      {/* Слайдер с изображениями */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.3 },
          }}
          className="w-full h-full absolute inset-0"
        >
          <div className="relative w-full h-full flex items-center justify-center text-center md:text-start md:mx-[10rem]">
            {/* Контент с z-40 и pointer-events-auto */}
            <div className="container absolute transform flex w-full flex-col z-40 px-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold italic text-gray-1 tracking-tight leading-tight font-['Nunito_Sans',Helvetica] mb-4">
                Волны&amp;Горы
              </h1>

              <h2 className="text-white font-bold text-xl sm:text-2xl lg:text-3xl mb-6 md:mb-10">
                Продажа и аренда SUP в Екатеринбурге
              </h2>

              <div className="relative z-40">
                <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-4">
                  {actionButtons.map((button) => (
                    <div key={button.id} className="relative z-40">
                      <Link to={button.href} className="block" onClick={(e) => e.stopPropagation()}>
                        <Button className="w-[120px] sm:w-[177px] h-[40px] sm:h-[53px] bg-gray-1 rounded-[53px] shadow-lg font-['Nunito_Sans',Helvetica] font-semibold text-base sm:text-xl relative z-40">
                          {button.text}
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Изображение с pointer-events-none */}
            <img
              src={images[currentIndex]}
              alt={`Slide ${currentIndex + 1}`}
              className="w-full h-full object-cover pointer-events-none"
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Индикаторы слайдов */}
      {images.length > 1 && (
        <div className="absolute bottom-8 inset-x-0 flex justify-center space-x-3 z-40">
          {images.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full border ${
                index === currentIndex ? 'bg-white border-white' : 'bg-transparent border-white'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`Перейти к слайду ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface SliderButtonProps {
  onClick: () => void;
  type: 'next' | 'prev';
}

const SliderButton: React.FC<SliderButtonProps> = ({ onClick, type }) => {
  return (
    <Button
      variant="outline"
      size="icon"
      className="w-12 h-12 bg-white/5 bg-opacity-20 backdrop-blur-sm rounded-full border border-white shadow-md"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={type === 'next' ? 'Следующий слайд' : 'Предыдущий слайд'}
    >
      {type === 'next' ? (
        <ChevronRightIcon className="h-6 w-6 text-white" />
      ) : (
        <ChevronLeftIcon className="h-6 w-6 text-white" />
      )}
    </Button>
  );
};
