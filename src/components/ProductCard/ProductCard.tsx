// import React, { useState } from 'react';
// import { Button } from '../ui/button';
// import { Card, CardContent } from '../ui/card';
// import { Product } from '../../lib/types';
// import { useCart } from '../../lib/context/CartContext';
// import { useFavorites } from '../../lib/context/FavoritesContext';
// import { ProductImage } from './ProductImage';
// import { QuantitySelector } from './QuantitySelector';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ShoppingCart, Heart, Info, Star } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import { AddedToCartModal } from './AddedToCartModal';

// interface ProductCardProps {
//   product: Product;
// }

// export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
//   const { addToCart } = useCart();
//   const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
//   const [quantity, setQuantity] = useState(1);
//   const [showAddedToCart, setShowAddedToCart] = useState(false);

//   const handleAddToCart = () => {
//     addToCart(product, quantity);
//     setShowAddedToCart(true);
//   };

//   const handleDecreaseQuantity = () => {
//     if (quantity > 1) setQuantity(quantity - 1);
//   };

//   const handleIncreaseQuantity = () => {
//     setQuantity(quantity + 1);
//   };

//   const toggleFavorite = () => {
//     if (isFavorite(product.id)) {
//       removeFromFavorites(product.id);
//     } else {
//       addToFavorites(product);
//     }
//   };

//   // Форматирование цены с пробелами между тысячами
//   const formatPrice = (price: string) => {
//     return price.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
//   };

//   return (
//     <>
//       <motion.div
//         whileHover={{ y: -5 }}
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.3 }}
//         className="w-full"
//       >
//         <Card className="w-full max-w-[320px] h-full bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col">
//           <CardContent className="p-0 flex flex-col h-full">
//             {/* Изображение товара с кнопкой избранного */}
//             <div className="relative aspect-square">
//               <Link to={`/product/${product.id}`} className="block h-full">
//                 <ProductImage 
//                   src={product.image} 
//                   alt={product.name}
//                   className="w-full h-full object-cover hover:opacity-90 transition-opacity"
//                 />
//               </Link>
              
             
//             </div>

//             {/* Информация о товаре */}
//             <div className="p-4 flex flex-col flex-grow">
//               {/* Бренд и название */}
//               <div className="mb-2">
//                 <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
//                   {product.brand}
//                 </h3>
//                 <Link to={`/product/${product.id}`}>
//                   <h2 className="text-lg font-semibold text-gray-900 mt-1 hover:text-primary line-clamp-2">
//                     {product.name}
//                   </h2>
//                 </Link>
//               </div>

//               {/* Рейтинг */}
//               <div className="flex items-center mb-3">
//                 <div className="flex mr-2">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <Star 
//                       key={star} 
//                       className={`w-4 h-4 ${star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
//                     />
//                   ))}
//                 </div>
//                 <span className="text-sm text-gray-500">(24)</span>
//               </div>

//               {/* Цена и количество */}
//               <div className="mt-auto">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="text-2xl font-bold text-gray-900">
//                     {formatPrice(product.price)} ₽
//                   </div>
//                   <QuantitySelector
//                     quantity={quantity}
//                     onDecrease={handleDecreaseQuantity}
//                     onIncrease={handleIncreaseQuantity}
//                     className="border-gray-200"
//                   />
//                 </div>

//                 {/* Кнопки действий */}
//                 <div className="flex gap-3">
//                   <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
//                     <Button
//                       onClick={handleAddToCart}
//                       className="w-full h-12 rounded-lg bg-primary hover:bg-primary/90 shadow-sm transition-colors"
//                     >
//                       <ShoppingCart className="w-5 h-5 mr-2" />
//                       <span>В корзину</span>
//                     </Button>
//                   </motion.div>
                  
//                   <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
//                     <Link to={`/product/${product.id}`} className="block w-full">
//                       <Button
//                         variant="outline"
//                         className="w-full h-12 rounded-lg border-gray-300 hover:bg-gray-50 transition-colors"
//                       >
//                         <Info className="w-5 h-5 mr-2" />
//                         <span>Подробнее</span>
//                       </Button>
//                     </Link>
//                   </motion.div>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>

//       {/* Модальное окно добавления в корзину */}
//       <AnimatePresence>
//         {showAddedToCart && (
//           <AddedToCartModal 
//             product={product} 
//             isOpen={showAddedToCart} 
//             onClose={() => setShowAddedToCart(false)} 
//           />
//         )}
//       </AnimatePresence>
//     </>
//   );
// };