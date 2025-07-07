import { ChangeEvent, useState } from "react";
import { Product } from "../../../../lib/types";
import { supabase } from "../../../../lib/supabase";
import { motion } from 'framer-motion';
import { Check, ImageIcon, Loader2, X } from "lucide-react";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";

interface ProductFormModalProps {
  product: Product;
  categories: any[];
  onClose: () => void;
  onSave: (formData: Product) => void;
  isLoading: boolean;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({ product, categories, onClose, onSave, isLoading }) => {
  const [formData, setFormData] = useState<Product>(product);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Проверка типа файла
      const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
      if (!ALLOWED_TYPES.includes(selectedFile.type)) {
        setErrors({ ...errors, image: 'Допустимые форматы: JPG, PNG, WEBP' });
        return;
      }

      // Проверка размера файла (макс. 5MB)
      const MAX_FILE_SIZE = 5 * 1024 * 1024;
      if (selectedFile.size > MAX_FILE_SIZE) {
        setErrors({ ...errors, image: 'Максимальный размер файла 5MB' });
        return;
      }

      setFile(selectedFile);
      setErrors({ ...errors, image: '' });

      // Превью изображения
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    setIsUploading(true);

    try {
      const { error: uploadError } = await supabase.storage.from('item-image').upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('item-image').getPublicUrl(filePath);

      return publicUrl;
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'price') {
      // Удаляем все символы кроме цифр и точки
      const numericValue = value.replace(/[^\d.]/g, '');
      const priceValue = parseFloat(numericValue) || 0;

      setFormData({
        ...formData,
        price: `${priceValue} ₽`, // Всегда отображаем в рублях
        priceValue: priceValue,
      });
    } else if (name === 'inStock') {
      setFormData({
        ...formData,
        [name]: (e as React.ChangeEvent<HTMLInputElement>).target.checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Название товара обязательно';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Название должно содержать минимум 3 символа';
    }

    if (!formData.brand.trim()) {
      newErrors.brand = 'Бренд обязателен';
    }

    if (formData.priceValue <= 0) {
      newErrors.price = 'Цена должна быть больше нуля';
    }

    if (!formData.category) {
      newErrors.category = 'Категория обязательна';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      let imageUrl = formData.image;

      // Если выбрано новое изображение, загружаем его
      if (file) {
        try {
          imageUrl = await uploadImage(file);
        } catch (error) {
          console.error('Ошибка загрузки изображения:', error);
          setErrors({ ...errors, image: 'Не удалось загрузить изображение' });
          return;
        }
      }

      // Сохраняем товар с обновленным URL изображения
      const productToSave = {
        ...formData,
        image: imageUrl,
      };

      onSave(productToSave);
    } catch (error) {
      console.error('Ошибка при сохранении товара:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25 }}
      >
        <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {product.id ? 'Редактирование товара' : 'Добавление нового товара'}
          </h2>
          <button
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
            onClick={onClose}
            disabled={isLoading || isUploading}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Изображение товара
                <span className="text-rose-500">*</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="relative h-48 w-48 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                    {imagePreview || formData.image ? (
                      <img
                        src={imagePreview || formData.image}
                        alt="Превью товара"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <ImageIcon size={32} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-xs text-gray-500">Изображение товара</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="product-image"
                        className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer ${
                          isUploading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <input
                          type="file"
                          id="product-image"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="sr-only"
                          disabled={isUploading}
                        />
                        Выбрать файл
                      </label>
                      <p className="mt-1 text-xs text-gray-500">JPG, PNG или WEBP. Макс. размер 5MB.</p>
                      {errors.image && <p className="mt-1 text-xs text-rose-500">{errors.image}</p>}
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <h4 className="text-xs font-medium  mb-2">Рекомендации по изображению</h4>
                      <ul className="text-xs text-blue space-y-1 list-disc list-inside">
                        <li>Используйте качественные изображения</li>
                        <li>Оптимальный размер 800x800 пикселей</li>
                        <li>Фон должен быть нейтральным</li>
                        <li>Избегайте водяных знаков</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название товара
                <span className="text-rose-500">*</span>
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Например: Смартфон iPhone 13 Pro"
                className={errors.name ? 'border-rose-300 focus:ring-rose-300' : ''}
              />
              {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Бренд
                <span className="text-rose-500">*</span>
              </label>
              <Input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Например: Apple"
                className={errors.brand ? 'border-rose-300 focus:ring-rose-300' : ''}
              />
              {errors.brand && <p className="mt-1 text-xs text-rose-500">{errors.brand}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Цена в рублях
                <span className="text-rose-500">*</span>
              </label>
              <Input
                type="text"
                name="price"
                value={formData.priceValue.toString()}
                onChange={handleChange}
                placeholder="Например: 89990"
                className={errors.price ? 'border-rose-300 focus:ring-rose-300' : ''}
              />
              <p className="mt-1 text-xs text-gray-500">
                Цена всегда указывается в рублях. При смене валюты в настройках цены будут автоматически конвертированы.
              </p>
              {errors.price && <p className="mt-1 text-xs text-rose-500">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Категория
                <span className="text-rose-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full rounded-lg border ${
                  errors.category ? 'border-rose-300 focus:ring-rose-300' : 'border-gray-300 focus:ring-blue-500'
                } py-2 px-3 shadow-sm focus:outline-none focus:border-transparent`}
              >
                <option value="">Выберите категорию</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-xs text-rose-500">{errors.category}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue rounded border-gray-300 focus:ring-blue"
                />
                <span className="text-sm text-gray-700">Товар в наличии</span>
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Описание товара</label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-lg border border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Подробное описание товара, характеристики, особенности..."
              ></textarea>
              <p className="mt-1 text-xs text-gray-500">
                Необязательное поле, но рекомендуется для лучшего описания товара
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              disabled={isLoading || isUploading}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              className=" bg-skyblue hover:bg-blue-700 text-white flex items-center gap-2"
              disabled={isLoading || isUploading}
            >
              {isLoading || isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{isUploading ? 'Загрузка изображения...' : 'Сохранение...'}</span>
                </>
              ) : (
                <>
                  <Check size={16} className="text-blue"/>
                  <span className="text-blue">Сохранить товар</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};