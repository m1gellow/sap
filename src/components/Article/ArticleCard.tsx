import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Article } from '../../lib/api/articles';
import cn from 'classnames';

interface ArticleCardProps {
  article: Article;
}

const categoryColors: { [key: string]: string } = {
  'Полезно знать': 'bg-blue text-skyblue',
  Советы: 'bg-teal-100 text-teal-800',
};

export const ArticleCard = ({ article }: ArticleCardProps) => {
  return (
    <Link
      to={`/info/${article.slug}`}
      className="group flex gap-4 p-4 rounded-lg hover:bg-gray-100/70 transition-colors"
    >
      <div className="w-[100px] h-[100px] bg-skyblue rounded-md flex-shrink-0 overflow-hidden">
        {/* В будущем здесь будет <img src={article.imageUrl} ... /> */}
      </div>
      <div className="flex flex-col gap-[20px]">
        <span
          className={cn(
            'text-xs font-bold px-2 py-1 rounded self-start',
            categoryColors[article.category] || 'bg-gray-200 text-gray-800',
          )}
        >
          {article.category}
        </span>
        <div className='flex flex-col gap-[8px]'>
          <h3 className="mt-2 font-bold text-blue leading-tight">{article.title}</h3>
          <div className="mt-auto flex items-center text-sm text-blue font-bold group-hover:underline">
            Читать статью
            <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
};

// Скелетон для карточки статьи
export const ArticleCardSkeleton = () => (
  <div className="flex gap-4 p-4 animate-pulse">
    <div className="w-24 h-24 bg-gray-300 rounded-md flex-shrink-0" />
    <div className="flex flex-col flex-grow space-y-3">
      <div className="w-1/3 h-5 bg-gray-300 rounded" />
      <div className="w-full h-4 bg-gray-200 rounded" />
      <div className="w-3/4 h-4 bg-gray-200 rounded" />
      <div className="mt-auto w-1/2 h-5 bg-gray-300 rounded" />
    </div>
  </div>
);
