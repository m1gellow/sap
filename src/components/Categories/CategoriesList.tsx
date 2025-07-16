import cn from 'classnames'

export const CategoriesList = ({filters, setActiveCategory}) => {
  return (
      <div className="flex flex-wrap gap-2 mb-8">
            {filters.categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium transition-colors',
                  category === filters.activeCategory
                    ? 'bg-blue text-white hover:bg-blue'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200',
                )}
              >
                {category}
              </button>
            ))}
          </div>
  )
}
