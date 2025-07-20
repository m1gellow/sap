import React from 'react';
import { ChevronDown } from 'lucide-react';
import cn from 'classnames';

// --- Универсальный Input ---
interface InputProps extends React.ComponentProps<'input'> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300",
        className
      )}
      {...props}
    />
  )
);

// --- Универсальный Select ---
interface SelectProps extends React.ComponentProps<'select'> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => (
    <div className="relative w-full">
      <select
        ref={ref}
        className={cn(
          "w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  )
);

// --- Универсальный Textarea ---
interface TextareaProps extends React.ComponentProps<'textarea'> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      rows={4}
      className={cn(
        "w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300",
        className
      )}
      {...props}
    />
  )
);

// --- Универсальный Checkbox ---
interface CheckboxProps extends React.ComponentProps<'input'> {
  label: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ id, label, className, ...props }, ref) => (
    <label htmlFor={id} className="flex items-center cursor-pointer">
      <input
        id={id}
        ref={ref}
        type="checkbox"
        className={cn("h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500", className)}
        {...props}
      />
      <span className="ml-2 text-sm text-gray-700">{label}</span>
    </label>
  )
);