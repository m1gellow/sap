import React from 'react';
import { motion } from 'framer-motion';

interface ContactInfoCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

export const ContactInfoCard = ({ icon, title, children }: ContactInfoCardProps) => {
  return (
    <motion.div 
      className="flex items-start gap-5 p-4 rounded-lg transition-colors hover:bg-sky-50"
      whileHover={{ x: 4 }}
    >
      <div className="flex-shrink-0 w-12 h-12 bg-sky-100 text-blue rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-slate-800">{title}</h3>
        <div className="mt-1 text-sm text-slate-600 space-y-1">
          {children}
        </div>
      </div>
    </motion.div>
  );
};