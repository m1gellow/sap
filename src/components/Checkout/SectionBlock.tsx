import React from 'react';

interface SectionBlockProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const SectionBlock = ({ title, children, className }: SectionBlockProps) => (
  <div className={`bg-skyblue rounded-xl p-6 ${className}`}>
    <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
    {children}
  </div>
);