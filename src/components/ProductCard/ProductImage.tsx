import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductImageProps {
  src: string;
  alt: string;
  onClick?: () => void;
}

export const ProductImage: React.FC<ProductImageProps> = ({ src, alt, onClick }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoaded(true);
  }, [src]);

  const handleImageClick = () => {
    if (onClick) {
      onClick();
    } else {
      setIsZoomed(!isZoomed);
    }
  };

  return (
    <div className="relative w-full pt-5 px-5 flex justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: isLoaded ? 1 : 0,
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.05 }}
        className="w-full max-w-[259px] relative"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <img
          className="w-full max-w-[259px] h-auto object-contain cursor-pointer transition-all duration-300"
          alt={alt}
          src={src}
          onClick={handleImageClick}
          onLoad={() => setIsLoaded(true)}
        />

        {/* Эффект подсветки при наведении */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-blue-4 rounded-lg"
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Модальное окно для увеличенного изображения */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomed(false)}
          >
            <motion.div
              className="relative max-w-[90vw] max-h-[90vh]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <img src={src} alt={alt} className="max-w-full max-h-[85vh] object-contain" />
              <motion.button
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-black text-2xl shadow-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomed(false);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
