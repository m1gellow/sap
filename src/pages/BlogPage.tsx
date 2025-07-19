
import { useQuery } from '@tanstack/react-query';
import { getArticles } from '../lib/api/articles';
import { SectionWrapper } from '../components/ui/SectionWrapper';
import { Breadcrumbs } from '../lib/utils/BreadCrumbs';
import { ArticleCard, ArticleCardSkeleton } from '../components/Article/ArticleCard';


export const BlogPage = () => {
  const { data: articles, isLoading, isError } = useQuery({
    queryKey: ['articles'],
    queryFn: getArticles,
  });

  return (
    <SectionWrapper title="Статьи и обзоры на sup доски">
      <Breadcrumbs />
      <div className="max-w-6xl mx-auto mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
          {isLoading ? (
            // Показываем скелетоны во время загрузки
            Array.from({ length: 6 }).map((_, i) => <ArticleCardSkeleton key={i} />)
          ) : isError ? (
            <p className="col-span-full text-center text-red-500">Не удалось загрузить статьи.</p>
          ) : (
            // Показываем реальные данные
            articles?.map(article => <ArticleCard key={article.slug} article={article} />)
          )}
        </div>
      </div>
    </SectionWrapper>
  );
};