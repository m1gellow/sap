import { motion } from 'framer-motion';
import { Edit, Trash2, Image as ImageIcon, Search } from 'lucide-react';
import { Product } from '../../../../lib/types';
import { formatPriceNumber, getCurrencySymbol } from '../../../../lib/utils/currency';

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export const ProductsTable = ({ products, onEdit, onDelete }: ProductsTableProps) => {
  if (products.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
          <Search size={40} className="text-gray-300" />
          <p className="text-lg font-medium">Товары не найдены</p>
          <p className="text-sm max-w-md">
            Попробуйте изменить параметры поиска или фильтрации, или добавьте новый товар
          </p>
        </div>
      </div>
    );
  }

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {['ID', 'Изображение', 'Название', 'Бренд', 'Цена (₽)', 'Категория', 'Статус', 'Действия'].map((header, idx) => (
            <th
              key={idx}
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {products.map((product) => (
          <motion.tr
            key={product.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="hover:bg-gray-50/80 transition-colors"
          >
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue">
                #{product.id}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="h-10 w-10 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40';
                    }}
                  />
                ) : (
                  <ImageIcon size={20} className="text-gray-400" />
                )}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-gray-900">{product.name}</div>
              {product.description && (
                <div className="text-xs text-gray-500 truncate max-w-xs">{product.description}</div>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.brand}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              <span className="text-blue">{formatPriceNumber(product.priceValue, 'RUB')} ₽</span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {product.category}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  product.inStock ? 'bg-green-100 text-green-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                {product.inStock ? 'В наличии' : 'Нет в наличии'}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div className="flex justify-end space-x-2">
                <button
                  className="p-2 text-blue transition-colors rounded-lg hover:bg-skyblue"
                  onClick={() => onEdit(product)}
                  title="Редактировать"
                >
                  <Edit size={18} className="stroke-[2]" />
                </button>
                <button
                  className="p-2 text-rose-500 hover:text-rose-700 transition-colors rounded-lg hover:bg-rose-50"
                  onClick={() => onDelete(product)}
                  title="Удалить"
                >
                  <Trash2 size={18} className="stroke-[2]" />
                </button>
              </div>
            </td>
          </motion.tr>
        ))}
      </tbody>
    </table>
  );
};