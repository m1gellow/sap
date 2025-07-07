// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import {
//   FilePlus,
//   Edit,
//   Trash2,
//   Save,
//   X,
//   ChevronDown,
//   ChevronUp,
//   FileText,
//   Layout,
//   Image as ImageIcon,
//   Home,
// } from 'lucide-react';
// import { Button } from '../../components/ui/button';
// import { Input } from '../../components/ui/input';

// // Имитация данных о контенте сайта
// const initialContentData = [
//   {
//     id: 1,
//     type: 'slider',
//     title: 'Слайдер на главной странице',
//     description: 'Баннеры для главного слайдера',
//     items: [
//       { id: 1, url: '/1--1--3.png', title: 'Баннер 1', priority: 1 },
//       { id: 2, url: '/1-201-11.png', title: 'Баннер 2', priority: 2 },
//       { id: 3, url: '/1--1--2.png', title: 'Баннер 3', priority: 3 },
//     ],
//     page: 'home',
//     lastUpdated: '2025-01-15T10:00:00',
//   },
//   {
//     id: 2,
//     type: 'text',
//     title: 'О компании',
//     description: 'Текст о компании на главной странице',
//     content:
//       'Компания "Волны&Горы" - лидер продаж и аренды SUP-досок в Екатеринбурге. Мы предлагаем широкий ассортимент качественного оборудования для активного отдыха на воде.',
//     page: 'home',
//     lastUpdated: '2025-01-10T14:30:00',
//   },
//   {
//     id: 3,
//     type: 'text',
//     title: 'Доставка и оплата',
//     description: 'Информация о доставке и оплате',
//     content:
//       'Мы осуществляем доставку по всей России. Доставка по Москве и Санкт-Петербургу - бесплатно. Доставка в другие регионы осуществляется транспортными компаниями СДЭК, DPD и Почтой России.',
//     page: 'delivery',
//     lastUpdated: '2025-01-12T09:15:00',
//   },
//   {
//     id: 4,
//     type: 'contact',
//     title: 'Контактная информация',
//     description: 'Контактные данные компании',
//     content: {
//       address: 'г. Москва, р. Академический, ул.Евгения Савкова д.6',
//       phone: '+7 (343) 236-63-11',
//       email: 'volnyigory@mail.ru',
//       workHours: 'Пн-Пт: 10:00-19:00, Сб: 11:00-16:00',
//     },
//     page: 'contacts',
//     lastUpdated: '2025-01-14T16:45:00',
//   },
// ];

// export const AdminContent = () => {
//   const [contentData, setContentData] = useState(initialContentData);
//   const [selectedContent, setSelectedContent] = useState<any>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
//   const [expandedContentIds, setExpandedContentIds] = useState<number[]>([]);
//   const [activeTab, setActiveTab] = useState('all');

//   // Фильтрация контента по вкладкам
//   const filteredContent = activeTab === 'all' ? contentData : contentData.filter((item) => item.page === activeTab);

//   // Создание нового контента
//   const handleCreateContent = (type: string) => {
//     const newContent = {
//       id: Math.max(0, ...contentData.map((c) => c.id)) + 1,
//       type,
//       title: '',
//       description: '',
//       content: type === 'slider' ? [] : type === 'contact' ? {} : '',
//       items: type === 'slider' ? [] : undefined,
//       page: 'home',
//       lastUpdated: new Date().toISOString(),
//     };

//     setSelectedContent(newContent);
//     setIsModalOpen(true);
//   };

//   // Редактирование контента
//   const handleEditContent = (content: any) => {
//     setSelectedContent({ ...content });
//     setIsModalOpen(true);
//   };

//   // Удаление контента
//   const handleDeleteContent = (id: number) => {
//     // Для демонстрации просто удаляем запись
//     setContentData(contentData.filter((item) => item.id !== id));
//   };

//   // Сохранение контента
//   const handleSaveContent = (formData: any) => {
//     if (contentData.find((c) => c.id === formData.id)) {
//       // Обновляем существующий контент
//       setContentData(contentData.map((c) => (c.id === formData.id ? formData : c)));
//     } else {
//       // Добавляем новый контент
//       setContentData([...contentData, formData]);
//     }
//     setIsModalOpen(false);
//   };

//   // Функция для форматирования даты
//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleString('ru-RU', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   // Управление отображением деталей контента
//   const toggleExpandContent = (id: number) => {
//     setExpandedContentIds((prevIds) =>
//       prevIds.includes(id) ? prevIds.filter((prevId) => prevId !== id) : [...prevIds, id],
//     );
//   };

//   // Иконка типа контента
//   const getContentTypeIcon = (type: string) => {
//     switch (type) {
//       case 'slider':
//         return <ImageIcon size={16} className="mr-1" />;
//       case 'text':
//         return <FileText size={16} className="mr-1" />;
//       case 'contact':
//         return <Layout size={16} className="mr-1" />;
//       default:
//         return <FileText size={16} className="mr-1" />;
//     }
//   };

//   // Название страницы
//   const getPageName = (page: string) => {
//     switch (page) {
//       case 'home':
//         return 'Главная';
//       case 'catalog':
//         return 'Каталог';
//       case 'delivery':
//         return 'Доставка';
//       case 'contacts':
//         return 'Контакты';
//       default:
//         return page;
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
//         <h1 className="text-2xl font-bold text-gray-800">Управление контентом</h1>
//         <div className="flex gap-2">
//           <Button
//             className="bg-blue hover:bg-blue text-white rounded-full flex items-center gap-2"
//             onClick={() => handleCreateContent('text')}
//           >
//             <FilePlus size={16} />
//             Добавить текст
//           </Button>
//           <Button
//             className="bg-blue hover:bg-blue text-white rounded-full flex items-center gap-2"
//             onClick={() => handleCreateContent('slider')}
//           >
//             <ImageIcon size={16} />
//             Добавить слайдер
//           </Button>
//         </div>
//       </div>

//       {/* Вкладки по страницам */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
//         <div className="flex border-b border-gray-200 overflow-x-auto">
//           {['all', 'home', 'catalog', 'delivery', 'contacts'].map((tab) => (
//             <button
//               key={tab}
//               className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
//                 activeTab === tab ? 'text-blue border-b-2 border-blue' : 'text-gray-600 hover:text'
//               }`}
//               onClick={() => setActiveTab(tab)}
//             >
//               {tab === 'all' ? 'Все страницы' : getPageName(tab)}
//             </button>
//           ))}
//         </div>

//         {/* Список контента */}
//         <div className="p-6">
//           {filteredContent.length === 0 ? (
//             <div className="text-center py-8 text-gray-500">Контент не найден. Добавьте новый контент.</div>
//           ) : (
//             <div className="space-y-4">
//               {filteredContent.map((content) => (
//                 <motion.div
//                   key={content.id}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.3 }}
//                   className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200"
//                 >
//                   {/* Заголовок контента */}
//                   <div
//                     className="flex items-center justify-between p-4 cursor-pointer"
//                     onClick={() => toggleExpandContent(content.id)}
//                   >
//                     <div className="flex items-center space-x-3">
//                       <div
//                         className={`p-2 rounded-full ${
//                           content.type === 'slider'
//                             ? 'bg-blue-100 text-blue-600'
//                             : content.type === 'text'
//                               ? 'bg-green-100 text-green-600'
//                               : 'bg-purple-100 text-purple-600'
//                         }`}
//                       >
//                         {getContentTypeIcon(content.type)}
//                       </div>
//                       <div>
//                         <h3 className="font-medium text-gray-800">{content.title}</h3>
//                         <p className="text-xs text-gray-500 flex items-center">
//                           <span className="mr-2">
//                             {content.type === 'slider' ? 'Слайдер' : content.type === 'text' ? 'Текст' : 'Контакты'}
//                           </span>
//                           <span className="mx-2 text-gray-300">|</span>
//                           <Home size={12} className="mr-1" />
//                           {getPageName(content.page)}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center">
//                       <span className="text-xs text-gray-500 mr-4">Обновлено: {formatDate(content.lastUpdated)}</span>
//                       <button className="p-1 rounded-full hover:bg-gray-200">
//                         {expandedContentIds.includes(content.id) ? (
//                           <ChevronUp size={16} className="text-gray-500" />
//                         ) : (
//                           <ChevronDown size={16} className="text-gray-500" />
//                         )}
//                       </button>
//                     </div>
//                   </div>

//                   {/* Развернутый контент */}
//                   {expandedContentIds.includes(content.id) && (
//                     <div className="p-4 border-t border-gray-200">
//                       <div className="mb-4">
//                         <h4 className="text-sm font-medium text-gray-700 mb-1">Описание</h4>
//                         <p className="text-sm text-gray-600">{content.description}</p>
//                       </div>

//                       {/* Контент слайдера */}
//                       {content.type === 'slider' && content.items && (
//                         <div className="mb-4">
//                           <h4 className="text-sm font-medium text-gray-700 mb-2">Слайды</h4>
//                           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                             {content.items.map((item, index) => (
//                               <div key={item.id} className="bg-white p-3 rounded-md border border-gray-200">
//                                 <div className="h-32 bg-gray-100 mb-2 rounded flex items-center justify-center overflow-hidden">
//                                   <img src={item.url} alt={item.title} className="max-h-full object-contain" />
//                                 </div>
//                                 <div className="flex items-center justify-between">
//                                   <div>
//                                     <p className="text-sm font-medium">{item.title}</p>
//                                     <p className="text-xs text-gray-500">Приоритет: {item.priority}</p>
//                                   </div>
//                                   <button
//                                     className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
//                                     onClick={() => setEditingItemIndex(index)}
//                                   >
//                                     <Edit size={14} />
//                                   </button>
//                                 </div>
//                               </div>
//                             ))}

//                             <div
//                               className="bg-gray-100 p-3 rounded-md border border-dashed border-gray-300 flex flex-col items-center justify-center h-40 cursor-pointer hover:bg-gray-200 transition-colors"
//                               onClick={() => handleEditContent(content)}
//                             >
//                               <FilePlus size={24} className="text-gray-400 mb-2" />
//                               <p className="text-sm text-gray-500">Добавить слайд</p>
//                             </div>
//                           </div>
//                         </div>
//                       )}

//                       {/* Текстовый контент */}
//                       {content.type === 'text' && (
//                         <div className="mb-4">
//                           <h4 className="text-sm font-medium text-gray-700 mb-2">Текст</h4>
//                           <div className="bg-white p-4 rounded-md border border-gray-200">
//                             <p className="text-gray-700">{content.content}</p>
//                           </div>
//                         </div>
//                       )}

//                       {/* Контактная информация */}
//                       {content.type === 'contact' && content.content && (
//                         <div className="mb-4">
//                           <h4 className="text-sm font-medium text-gray-700 mb-2">Контактная информация</h4>
//                           <div className="bg-white p-4 rounded-md border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                               <p className="text-sm text-gray-500">Адрес:</p>
//                               <p className="text-gray-700">{content.content.address}</p>
//                             </div>
//                             <div>
//                               <p className="text-sm text-gray-500">Телефон:</p>
//                               <p className="text-gray-700">{content.content.phone}</p>
//                             </div>
//                             <div>
//                               <p className="text-sm text-gray-500">Email:</p>
//                               <p className="text-gray-700">{content.content.email}</p>
//                             </div>
//                             <div>
//                               <p className="text-sm text-gray-500">Часы работы:</p>
//                               <p className="text-gray-700">{content.content.workHours}</p>
//                             </div>
//                           </div>
//                         </div>
//                       )}

//                       {/* Кнопки управления */}
//                       <div className="flex space-x-2 justify-end">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           className="gap-1"
//                           onClick={() => handleEditContent(content)}
//                         >
//                           <Edit size={14} />
//                           Редактировать
//                         </Button>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           className="text-red-600 border-red-200 hover:bg-red-50 gap-1"
//                           onClick={() => handleDeleteContent(content.id)}
//                         >
//                           <Trash2 size={14} />
//                           Удалить
//                         </Button>
//                       </div>
//                     </div>
//                   )}
//                 </motion.div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Модальное окно редактирования контента */}
//       {isModalOpen && selectedContent && (
//         <ContentFormModal content={selectedContent} onClose={() => setIsModalOpen(false)} onSave={handleSaveContent} />
//       )}
//     </div>
//   );
// };

// // Компонент модального окна для формы редактирования контента
// interface ContentFormModalProps {
//   content: any;
//   onClose: () => void;
//   onSave: (formData: any) => void;
// }

// const ContentFormModal: React.FC<ContentFormModalProps> = ({ content, onClose, onSave }) => {
//   const [formData, setFormData] = useState({ ...content });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       content: {
//         ...formData.content,
//         [name]: value,
//       },
//     });
//   };

//   const handleSlideChange = (index: number, field: string, value: string) => {
//     const updatedItems = [...formData.items];
//     updatedItems[index] = {
//       ...updatedItems[index],
//       [field]: field === 'priority' ? parseInt(value, 10) : value,
//     };

//     setFormData({
//       ...formData,
//       items: updatedItems,
//     });
//   };

//   const addSlide = () => {
//     const newId =
//       formData.items && formData.items.length > 0 ? Math.max(...formData.items.map((item: any) => item.id)) + 1 : 1;

//     const newSlide = {
//       id: newId,
//       url: '',
//       title: `Слайд ${newId}`,
//       priority: formData.items ? formData.items.length + 1 : 1,
//     };

//     setFormData({
//       ...formData,
//       items: [...(formData.items || []), newSlide],
//     });
//   };

//   const removeSlide = (index: number) => {
//     setFormData({
//       ...formData,
//       items: formData.items.filter((_: any, i: number) => i !== index),
//     });
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     // Обновляем дату последнего изменения
//     const updatedFormData = {
//       ...formData,
//       lastUpdated: new Date().toISOString(),
//     };

//     onSave(updatedFormData);
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <motion.div
//         className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
//         initial={{ opacity: 0, scale: 0.95, y: 20 }}
//         animate={{ opacity: 1, scale: 1, y: 0 }}
//         transition={{ duration: 0.3 }}
//       >
//         <div className="flex justify-between items-center p-6 border-b border-gray-200">
//           <h2 className="text-xl font-semibold text-gray-800">
//             {formData.id ? 'Редактирование контента' : 'Создание контента'}
//           </h2>
//           <button className="p-1 rounded-full hover:bg-gray-100 text-gray-500" onClick={onClose}>
//             <X size={20} />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6">
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Заголовок</label>
//                 <Input type="text" name="title" value={formData.title} onChange={handleChange} required />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Страница</label>
//                 <select
//                   name="page"
//                   value={formData.page}
//                   onChange={handleChange}
//                   className="w-full h-10 pl-3 pr-10 rounded-md border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue"
//                   required
//                 >
//                   <option value="home">Главная</option>
//                   <option value="catalog">Каталог</option>
//                   <option value="delivery">Доставка</option>
//                   <option value="contacts">Контакты</option>
//                 </select>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 rows={2}
//                 className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent"
//               />
//             </div>

//             {/* Специфичные поля для разных типов контента */}
//             {formData.type === 'text' && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Текст</label>
//                 <textarea
//                   name="content"
//                   value={formData.content}
//                   onChange={handleChange}
//                   rows={6}
//                   className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent"
//                   required
//                 />
//               </div>
//             )}

//             {formData.type === 'contact' && (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Адрес</label>
//                   <Input
//                     type="text"
//                     name="address"
//                     value={formData.content?.address || ''}
//                     onChange={handleContactChange}
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
//                   <Input
//                     type="text"
//                     name="phone"
//                     value={formData.content?.phone || ''}
//                     onChange={handleContactChange}
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                   <Input
//                     type="email"
//                     name="email"
//                     value={formData.content?.email || ''}
//                     onChange={handleContactChange}
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Часы работы</label>
//                   <Input
//                     type="text"
//                     name="workHours"
//                     value={formData.content?.workHours || ''}
//                     onChange={handleContactChange}
//                     required
//                   />
//                 </div>
//               </div>
//             )}

//             {formData.type === 'slider' && (
//               <div>
//                 <div className="flex justify-between items-center mb-4">
//                   <label className="block text-sm font-medium text-gray-700">Слайды</label>
//                   <Button type="button" variant="outline" size="sm" onClick={addSlide} className="gap-1">
//                     <FilePlus size={14} />
//                     Добавить слайд
//                   </Button>
//                 </div>

//                 {formData.items && formData.items.length > 0 ? (
//                   <div className="space-y-4">
//                     {formData.items.map((slide: any, index: number) => (
//                       <div key={index} className="border border-gray-200 rounded-md p-4 bg-gray-50">
//                         <div className="flex justify-between items-center mb-3">
//                           <h4 className="font-medium text-gray-700">Слайд {index + 1}</h4>
//                           <button
//                             type="button"
//                             className="p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50"
//                             onClick={() => removeSlide(index)}
//                           >
//                             <Trash2 size={14} />
//                           </button>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                           <div className="md:col-span-2">
//                             <label className="block text-xs font-medium text-gray-700 mb-1">URL изображения</label>
//                             <Input
//                               type="text"
//                               value={slide.url}
//                               onChange={(e) => handleSlideChange(index, 'url', e.target.value)}
//                               placeholder="Ссылка на изображение"
//                               required
//                             />
//                           </div>

//                           <div>
//                             <label className="block text-xs font-medium text-gray-700 mb-1">Приоритет</label>
//                             <Input
//                               type="number"
//                               value={slide.priority}
//                               onChange={(e) => handleSlideChange(index, 'priority', e.target.value)}
//                               min="1"
//                               required
//                             />
//                           </div>

//                           <div className="md:col-span-3">
//                             <label className="block text-xs font-medium text-gray-700 mb-1">Заголовок слайда</label>
//                             <Input
//                               type="text"
//                               value={slide.title}
//                               onChange={(e) => handleSlideChange(index, 'title', e.target.value)}
//                               placeholder="Заголовок слайда"
//                               required
//                             />
//                           </div>

//                           {slide.url && (
//                             <div className="md:col-span-3">
//                               <label className="block text-xs font-medium text-gray-700 mb-1">Предпросмотр</label>
//                               <div className="h-40 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
//                                 <img src={slide.url} alt={slide.title} className="max-h-full object-contain" />
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-center py-8 border border-dashed border-gray-300 rounded-md bg-gray-50">
//                     <ImageIcon size={32} className="text-gray-400 mx-auto mb-2" />
//                     <p className="text-gray-500">Нет добавленных слайдов. Нажмите "Добавить слайд" выше.</p>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           <div className="mt-8 flex justify-end space-x-3">
//             <Button type="button" variant="outline" onClick={onClose} className="border-gray-300 text-gray-700">
//               Отмена
//             </Button>
//             <Button type="submit" className="bg-blue hover:bg-blue text-white gap-1">
//               <Save size={16} />
//               Сохранить
//             </Button>
//           </div>
//         </form>
//       </motion.div>
//     </div>
//   );
// };
