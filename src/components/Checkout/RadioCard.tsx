import React from 'react';
import cn from 'classnames';

interface RadioCardProps {
  id: string;
  label: React.ReactNode;
  value: string;
  isSelected: boolean;
  registerProps: any;
}

export const RadioCard = ({ id, label, value, isSelected, registerProps }: RadioCardProps) => (
  <label htmlFor={id} className={cn(
    "flex items-center p-3 border rounded-lg cursor-pointer transition-all",
    { "border-blue-500 bg-white ring-2 ring-blue-200": isSelected },
    { "border-gray-200 bg-white hover:border-blue-300": !isSelected }
  )}>
    <input
      type="radio"
      id={id}
      value={value}
      {...registerProps}
      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
    />
    <span className="ml-3 text-sm font-medium text-gray-700">{label}</span>
  </label>
);