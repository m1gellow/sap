// components/SectionWrapper.tsx
import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import cn from 'classnames';

interface SectionWrapperProps {
  title?: string;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
  containerClassName?: string;
  innerContainerClassName?: string;
  layout?: 'default' | 'grid-2-1' | 'info-cards';
}

export const SectionWrapper = ({
  title,
  children,
  className = '',
  titleClassName = '',
  containerClassName = 'container mx-auto px-4 lg:px-16',
  innerContainerClassName = '',
  layout = 'default'
}: SectionWrapperProps) => {
  return (
    <section 
      className={cn(
        'w-full mt-[100px] md:py-8',
        className
      )}
    >
      <div className={containerClassName}>
        <h2 className={cn(
          'text-3xl md:text-4xl font-bold text-gray-800 mb-8 md:mb-10',
          'text-center md:text-left',
          titleClassName
        )}>
          {title}
        </h2>

        <div className={cn(
          layout === 'grid-2-1' ? 'grid md:grid-cols-2 grid-cols-1 gap-[40px]' : '',
          layout === 'info-cards' ? 'grid md:grid-cols-2 grid-cols-1 gap-5 sm:gap-6 md:gap-8' : '',
          innerContainerClassName
        )}>
          {children}
        </div>
      </div>
    </section>
  );
};