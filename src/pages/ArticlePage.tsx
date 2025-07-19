
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getArticleBySlug } from '../lib/api/articles';
import { SectionWrapper } from '../components/ui/SectionWrapper';
import { Breadcrumbs } from '../lib/utils/BreadCrumbs';

export const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: article, isLoading, isError } = useQuery({
    queryKey: ['article', slug],
    queryFn: () => getArticleBySlug(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <SectionWrapper>
        <div className="max-w-3xl mx-auto animate-pulse">
          <div className="h-8 w-3/4 bg-gray-300 rounded mb-8" />
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>
        </div>
      </SectionWrapper>
    );
  }

  if (isError || !article) {
    return <SectionWrapper title="Ошибка">Статья не найдена.</SectionWrapper>;
  }

  return (
    <SectionWrapper title={article.title}>
      <Breadcrumbs />
      <div className="max-w-3xl mx-auto mt-8 prose lg:prose-xl">
        {/* 
          Prose - это класс от плагина @tailwindcss/typography.
          Он автоматически стилизует HTML-контент. 
          Если у тебя его нет, просто используй обычные теги.
        */}
        <p>{article.content}</p>
        {/* Здесь будет рендериться полный текст статьи */}
      </div>
    </SectionWrapper>
  );
};