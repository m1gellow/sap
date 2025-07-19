// Это наши "фальшивые" данные. В реальном проекте они будут в базе данных.
const mockArticles = [
  {
    slug: 'wet-vs-dry-wetsuit',
    category: 'Полезно знать',
    title: 'В чем разница между мокрым и сухим гидрокостюмом?',
    imageUrl: '/path/to/image1.jpg', // Укажи пути к реальным изображениям
  },
  {
    slug: 'river-sup-boarding',
    category: 'Советы',
    title: 'Сплав по реке на сапборде',
    imageUrl: '/path/to/image2.jpg',
  },
  {
    slug: 'another-river-sup',
    category: 'Советы',
    title: 'Сплав по реке на сапборде',
    imageUrl: '/path/to/image3.jpg',
  },
  {
    slug: 'how-to-choose-fin',
    category: 'Полезно знать',
    title: 'Как выбрать плавник для сап доски',
    imageUrl: '/path/to/image4.jpg',
  },
  {
    slug: 'what-is-poncho',
    category: 'Советы',
    title: 'Что такое пончо для серфинга и зачем оно нужно?',
    imageUrl: '/path/to/image5.jpg',
  },
  {
    slug: 'yet-another-river-sup',
    category: 'Советы',
    title: 'Сплав по реке на сапборде',
    imageUrl: '/path/to/image6.jpg',
  },
];

// Типизация для объекта статьи
export interface Article {
  slug: string;
  category: string;
  title: string;
  imageUrl: string;
  content?: string; // Полный контент для страницы одной статьи
}

// "Фальшивая" асинхронная функция для получения всех статей
export const getArticles = async (): Promise<Article[]> => {
  console.log('Fetching all articles...');
  // Имитируем задержку сети
  await new Promise(resolve => setTimeout(resolve, 500)); 
  return mockArticles;
};

// "Фальшивая" функция для получения одной статьи по ее slug
export const getArticleBySlug = async (slug: string): Promise<Article | undefined> => {
  console.log(`Fetching article with slug: ${slug}`);
  await new Promise(resolve => setTimeout(resolve, 500));
  const article = mockArticles.find(a => a.slug === slug);
  // В реальном проекте мы бы добавили сюда полный текст статьи
  if (article) {
    return {
      ...article,
      content: `Это полный текст статьи "${article.title}". Здесь будет много интересной информации... в будущем`
    }
  }
  return undefined;
};