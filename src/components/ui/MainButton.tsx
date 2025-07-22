import cn from 'classnames';
import { MouseEventHandler, ReactNode } from 'react';

interface MainButtonProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'icon' | 'action' | "outline";
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  hasIcon?: boolean; // Новый проп для указания наличия иконки
}

const MainButton = ({
  className,
  size = 'md',
  variant = 'primary',
  children,
  onClick,
  hasIcon = false, // По умолчанию false
}: MainButtonProps) => {
  const mainButtonClassName = cn(
    'flex items-center justify-center transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 ',
    {
      // Размеры
      'h-8 text-sm px-3': size === 'sm',
      'h-10 text-base px-4': size === 'md',
      'h-12 text-lg px-6': size === 'lg',
      
      // Варианты
      'bg-blue text-white rounded-full shadow-sm': variant === 'primary',
      'bg-blue rounded-lg font-medium text-white': variant === 'secondary',
      'bg-green-500 hover:bg-green-600 text-white rounded-md shadow-md': variant === 'action',
      'p-2 rounded-full': variant === 'icon',
      "bg-white border-blue border-[2px] rounded-md font-semibold": variant === "outline",
      
      // Отступы если есть иконка
      'gap-3': hasIcon,
    },
    className
  );

  return (
    <button className={mainButtonClassName} onClick={onClick}>
      {children}
    </button>
  );
};

export default MainButton;