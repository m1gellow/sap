import React from 'react';

interface InfoBlockProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

export const InfoBlock = ({ icon, title, children }: InfoBlockProps) => {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1 flex-shrink-0 text-blue">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <div className="mt-2 text-gray-600 text-sm leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};